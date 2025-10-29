import z from "zod";

export const newsSchema = z.object({
  text: z.string().min(10, "News cannot be less than 10 characters"),
});

export const fileSchema = z.object({
  file: z
    .any()
    .refine((val) => val instanceof FileList && val.length > 0, {
      message: "File is required",
    })
    .refine((val) => val instanceof FileList && val[0] instanceof File, {
      message: "Invalid file",
    }),
});

const BASE_URL = "http://127.0.0.1:8000";

/**
 * Submit news text for fake news classification
 */
export async function news(values) {
    const result = newsSchema.safeParse(values);
    if (!result.success) {
        return {
            status: "error",
            message: result.error.errors[0].message,
        };
    }

    try {
        const payload = { text: values.text };
        const response = await fetch(`${BASE_URL}/predict-news`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return { status: "error", message: errorText || "Server error" };
        }

        const data = await response.json();
        return {
            classification: data.classification,
            reason: data.reason,
        };
    } catch (err) {
        return {
            status: "error",
            message: "Network error. Please try again.",
        };
    }
}

/**
 * Submit image for deepfake detection
 */
export async function imageSubmit(values) {
    const result = fileSchema.safeParse(values);
    if (!result.success) {
        return {
            status: "error",
            message: result.error.errors[0].message,
        };
    }

    const file = values.file[0];
    const allowedExtensions = ["jpg", "jpeg", "png", "webp"];
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!extension || !allowedExtensions.includes(extension)) {
        return {
            status: "uncompatible",
            message: "Only .jpg, .jpeg, .png, .webp files are allowed.",
        };
    }

    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${BASE_URL}/predict-image`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            return { status: "error", message: errorText || "Image analysis failed" };
        }

        const data = await response.json();
        return {
            prediction: data.prediction,
            confidence: data.confidence,
            probability_fake: data.probability_fake,
        };
    } catch (err) {
        return {
            status: "error",
            message: "Failed to upload image. Please try again.",
        };
    }
}

/**
 * Submit video for deepfake detection
 */
export async function videoSubmit(values) {
    const result = fileSchema.safeParse(values);
    if (!result.success) {
        return {
            status: "error",
            message: result.error.errors[0].message,
        };
    }

    const file = values.file[0];
    const allowedExtensions = ["mp4", "mov", "webm"];
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!extension || !allowedExtensions.includes(extension)) {
        return {
            status: "uncompatible",
            message: "Only .mp4, .mov, .webm videos are allowed.",
        };
    }

    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${BASE_URL}/predict-video`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            return { status: "error", message: errorText || "Video analysis failed" };
        }

        const data = await response.json();
        return {
            prediction: data.prediction,
            confidence: data.confidence,
            probability_fake: data.probability,
        };
    } catch (err) {
        return {
            status: "error",
            message: "Failed to upload video. Please try again.",
        };
    }
}