from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pathlib import Path
import uuid
import torch
from typing import Annotated
from sqlmodel import Session, SQLModel, create_engine
from ultralytics import YOLO

from pytorch import load_models, guess_image, guess_video
from rag import guess_news, init_mcp_resources, vectorstore
from structures import Auditing, InformationRequest, InformationResponse

#  Configuration
DB_URL          = "sqlite:///database/audit.db"
UPLOAD_DIR      = Path("private")
UPLOAD_DIR.mkdir(exist_ok=True)

connect_args = {"check_same_thread": False}
engine = create_engine(DB_URL, connect_args=connect_args, echo=False)
SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

@asynccontextmanager
async def lifespan(app: FastAPI):
    global image_model, video_model, device, face_detector

    device = "cuda" if torch.cuda.is_available() else "cpu"
    face_detector = YOLO("models/yolov8n-face.pt")
    video_model, image_model = load_models(device=device)
    init_mcp_resources(device=device) 

    yield

    try:
        del image_model, video_model, face_detector, device
        if vectorstore:
            vectorstore.persist()
    except:
        pass


app = FastAPI(
    lifespan=lifespan,
    swagger_ui_parameters={"syntaxHighlight": {"theme": "obsidian"}},
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["key", "filename"],
)

SessionDep = Annotated[Session, Depends(get_session)]

@app.get("/")
def index():
    return {"message": "Hello"}


@app.post("/predict-image")
async def predict_image(session: SessionDep, file: UploadFile = File(...)):
    uid = uuid.uuid4().hex
    ext = Path(file.filename).suffix
    filename = f"{uid}{ext}"
    image_path = UPLOAD_DIR / filename
    with open(image_path, "wb") as f:
        f.write(await file.read())

    try:
        result = guess_image(
            image_path=str(image_path),
            device=device,
            model=image_model,
            face_detector=face_detector,          # <-- correct name
        )
        audit = Auditing(
            id=uid,
            type="image",
            classification=result.get("prediction") or "NaN",
            ext=ext,
            confidence=result.get("confidence") or "NaN",
        )
        session.add(audit)
        session.commit()

        return {
            "prediction": result.get("prediction"),
            "confidence": result.get("confidence"),
            "probability": result.get("probability"),
        }

    except Exception as exc:
        raise HTTPException(status_code=501, detail=str(exc))
    finally:
        file.file.close()
        image_path.unlink(missing_ok=True)


@app.post("/predict-video")
async def predict_video(session: SessionDep, file: UploadFile = File(...)):
    uid = uuid.uuid4().hex
    ext = Path(file.filename).suffix
    filename = f"{uid}{ext}"
    video_path = UPLOAD_DIR / filename
    with open(video_path, mode="wb") as f:
        f.write(await file.read())

    try:
        result = guess_video(
            video_path=str(video_path),
            device=device,
            model=video_model,
            face_detector=face_detector,          # <-- correct name
        )
        audit = Auditing(
            id=uid,
            type="video",
            classification=result.get("prediction") or "NaN",
            ext=ext,
            confidence=result.get("confidence") or "NaN",
        )
        session.add(audit)
        session.commit()

        return {
            "prediction": result.get("prediction"),
            "confidence": result.get("confidence"),
            "probability_fake": result.get("probability_fake"),
        }

    except Exception as exc:
        raise HTTPException(status_code=501, detail=str(exc))
    finally:
        file.file.close()
        video_path.unlink(missing_ok=True)

@app.post("/predict-news")
async def predict_news(session: SessionDep, request: InformationRequest):
    uid = uuid.uuid4().hex
    result: InformationResponse = guess_news(request.text)
    audit = Auditing(
        id=uid,
        type="news",
        classification=result.classification,
        reason=result.reason,
    )
    session.add(audit)
    session.commit()
    return result