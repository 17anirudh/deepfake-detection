from __future__ import annotations
import cv2
import numpy as np
import torch
import torch.nn as nn
import torchvision.models as models
from pathlib import Path
from typing import Optional, Tuple
from ultralytics import YOLO


class Backbone(nn.Module):
    def __init__(self, pretrained: bool = True):
        super().__init__()
        self.model = models.efficientnet_v2_l(
            weights=models.EfficientNet_V2_L_Weights.DEFAULT
        )
        self.out_features = 1280
        self.model.classifier = nn.Identity()

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.model(x)


class Temporal(nn.Module):
    def __init__(self, input_dim: int = 1280):
        super().__init__()
        self.tcn = nn.Sequential(
            nn.Conv1d(input_dim, 512, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv1d(512, 256, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv1d(256, 128, kernel_size=3, padding=1),
            nn.ReLU(inplace=True),
            nn.AdaptiveAvgPool1d(1),
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = x.transpose(1, 2)
        x = self.tcn(x).squeeze(-1)          
        return x


class VideoClassifier(nn.Module):
    def __init__(self):
        super().__init__()
        self.backbone = Backbone(pretrained=True)
        self.temporal = Temporal(input_dim=self.backbone.out_features)
        self.fc = nn.Linear(128, 1)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        B, T, C, H, W = x.shape
        x = x.view(B * T, C, H, W)                # (B*T, C, H, W)
        feats = self.backbone(x)                 # (B*T, 1280)
        feats = feats.view(B, T, -1)              # (B, T, 1280)
        x = self.temporal(feats)                 # (B, 128)
        x = self.fc(x)                           # (B, 1)
        return x


class ImageClassifier(nn.Module):
    def __init__(self, dropout: float = 0.3):
        super().__init__()
        self.backbone = Backbone(pretrained=True)
        self.dropout = nn.Dropout(dropout)
        self.fc1 = nn.Linear(self.backbone.out_features, 512)
        self.fc2 = nn.Linear(512, 256)
        self.fc3 = nn.Linear(256, 1)
        self.relu = nn.ReLU()

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = self.backbone(x)
        x = self.dropout(x)
        x = self.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.relu(self.fc2(x))
        x = self.fc3(x)
        return x


def load_models(
    device: torch.device | str,
    video_path: str = "models/video_model.pt",
    image_path: str = "models/image_model.pt",
) -> Tuple[VideoClassifier, ImageClassifier]:
    """Load both models and put them in eval mode."""
    video_model = VideoClassifier().to(device)
    video_model.load_state_dict(torch.load(video_path, map_location=device))
    video_model.eval()

    image_model = ImageClassifier().to(device)
    image_model.load_state_dict(torch.load(image_path, map_location=device))
    image_model.eval()

    return video_model, image_model


def extract_face(
    frame_rgb: np.ndarray,
    img_size: int = 160,
    *,
    face_detector: YOLO,
) -> np.ndarray:
    """
    Returns a pre-processed face (float32, [-1, 1]) or a resized fallback.
    """
    results = face_detector(frame_rgb, verbose=False, conf=0.5)

    if results and results[0].boxes is not None:
        boxes = results[0].boxes.xyxy.cpu().numpy()
        if len(boxes) > 0:
            areas = (boxes[:, 2] - boxes[:, 0]) * (boxes[:, 3] - boxes[:, 1])
            x1, y1, x2, y2 = boxes[np.argmax(areas)].astype(int)
            # clamp to image bounds
            h, w = frame_rgb.shape[:2]
            x1, y1 = max(0, x1), max(0, y1)
            x2, y2 = min(w, x2), min(h, y2)

            face = frame_rgb[y1:y2, x1:x2]
            if face.size > 0:
                face = cv2.resize(face, (img_size, img_size))
                return (face.astype(np.float32) / 127.5) - 1.0

    fallback = cv2.resize(frame_rgb, (img_size, img_size))
    return (fallback.astype(np.float32) / 127.5) - 1.0


# --------------------------------------------------------------------------- #
#  Image inference
# --------------------------------------------------------------------------- #
def guess_image(
    *,
    model: ImageClassifier,
    image_path: str | Path,
    device: torch.device | str,
    face_detector: YOLO,
    img_size: int = 160,
) -> dict:
    """
    Returns:
        {
            "prediction": "REAL" | "FAKE",
            "confidence": "XX.XX%",
            "probability": "0.xxxx",
        }
    """
    model.eval()
    img = cv2.imread(str(image_path))
    if img is None:
        raise ValueError(f"Cannot read image: {image_path}")

    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    face = extract_face(rgb, img_size, face_detector=face_detector)

    tensor = (
        torch.from_numpy(face)
        .permute(2, 0, 1)
        .unsqueeze(0)
        .float()
        .to(device)
    )

    with torch.no_grad():
        logit = model(tensor)                     # (1, 1)
        prob_fake = torch.sigmoid(logit).item()

    prediction = "FAKE" if prob_fake >= 0.5 else "REAL"
    confidence = prob_fake if prediction == "FAKE" else (1 - prob_fake)

    return {
        "prediction": prediction,
        "confidence": f"{confidence:.2%}",
        "probability": f"{prob_fake:.4f}",
    }


# --------------------------------------------------------------------------- #
#  Video inference
# --------------------------------------------------------------------------- #
def guess_video(
    *,
    model: VideoClassifier,
    video_path: str | Path,
    device: torch.device | str,
    face_detector: YOLO,
    img_size: int = 160,
    num_frames: int = 20,
    max_seq_len: int = 400,
) -> dict:
    """
    Uniformly samples `num_frames` from the video, extracts faces,
    runs the temporal model and returns the same dict shape as image.
    """
    model.eval()
    cap = cv2.VideoCapture(str(video_path))
    if not cap.isOpened():
        raise ValueError(f"Cannot open video: {video_path}")

    try:
        total_frames = min(int(cap.get(cv2.CAP_PROP_FRAME_COUNT)), max_seq_len)
        if total_frames <= 0:
            return None

        # uniform indices
        indices = np.linspace(0, total_frames - 1, num_frames, dtype=int)

        faces: list[np.ndarray] = []
        for idx in indices:
            cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
            ok, frame = cap.read()
            if not ok:
                continue

            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            face = extract_face(rgb, img_size, face_detector=face_detector)
            faces.append(face)

        # pad with last face if we missed any
        while len(faces) < num_frames:
            faces.append(faces[-1])

        # stack → (T, H, W, C) → (1, T, C, H, W)
        arr = np.stack(faces[:num_frames])
        tensor = (
            torch.from_numpy(arr)
            .permute(0, 3, 1, 2)
            .unsqueeze(0)
            .float()
            .to(device)
        )

        with torch.no_grad():
            logit = model(tensor)                     # (1, 1)
            prob_fake = torch.sigmoid(logit).item()

        prediction = "FAKE" if prob_fake >= 0.5 else "REAL"
        confidence = prob_fake if prediction == "FAKE" else (1 - prob_fake)

        return {
            "prediction": prediction,
            "confidence": f"{confidence:.2%}",
            "probability_fake": f"{prob_fake:.4f}",
            "frames_processed": len(faces),
        }

    finally:
        cap.release()          # <-- **critical** for Windows file-lock