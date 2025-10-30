# Mongoose
##### Deepfake Detection and Media Verification Platform
Mongoose is an advanced web application designed to combat the spread of misinformation by detecting Deepfakes in images and videos, and verifying the authenticity of text-based news articles. It leverages cutting-edge AI and machine learning models to provide fast, accurate, and insightful predictions.

## Screenshots
- Landing page
![Landing](/landing.png)
- Slow 4G performance
![performance](/4G_performance.png)

## Key Features
- Multi-Modal Detection: Upload and analyze three different types of media using distinct AI models:
    - News Verification: Analyze text input to detect unverified, speculative, or factually lacking claims using a RAG (Retrieval-Augmented Generation) system.
    - Image Deepfake Detector: Upload images for analysis, returning a clear FAKE or REAL prediction.
    - Video Deepfake Detector: Upload video files for deepfake analysis using temporal and spatial models.

- Confidence Scoring: Provides a Confidence Score for image predictions to indicate the model's certainty.
- Detailed Verification Report: For news, it gives a specific Reason for the unverification, citing gaps or inaccuracies in the claim.
- Intuitive User Interface: A clean, modern frontend built with Next.js for a seamless user experience.

## Installation
This project is a mono-repository divided into Frontend and Backend components.
Prerequisites:
- Python: Version 3.13+ (for Backend/ML).
- Node.js: Version 18+ (for Frontend).
- bun: The package manager used for the frontend (alternatively use npm or yarn).

Start by cloning the repository
```cmd
git clone https://github.com/17anirudh/deepfake-detection
```
Install backend dependencies (venv recommended)
```cmd
cd backend
pip install -r requirements.txt
```
Install frontend dependencies
```cmd
# Inside the main directory
cd frontend
bun install # Or use npm install / yarn install
```

## Running the application
- Start the backend first (because initially it loads the binary files)
```cmd
cd backend
uvicorn main:app --reload
```
- Next, start the frontend
```cmd
cd frontend
bun run dev # Or npm run dev / yarn dev
```

## Technology Used
- Core technology used
    - **NextJS**: Web interface and client-side logic
    - **SQLite**: Local relational database
    - **FastAPI**: High-performance API framework.
    - **Bun**: High-performance Javascript runtime, bundler and package manager.

- DL/GenAI models:
    - **EfficientNetv2**: Efficient CNN architectures offering a holistic solution that balances model complexity with computational efficiency.
    - **TCN**: Deep neural network architectures that are used in trajectory prediction tasks.
    - **YOLO**: Object detection for frame pre-analysis.
    - **Qwen3:0.6b**: Causal Language Models with 28 layers, 32,768 context length and can run easily in devices below the goldstandard RAM.
    - **nomic-embed-text**: A high-performing open embedding model with a large token context window.

- Databases:
    - **SQLite**: High performance serverless RDMS for auditting
    - **Chroma**: Open source vector database used for RAG search via Langchain
    - **SQLModel**: Type safe ORM for SQLite database operations build by FastAPI

- DL/GenAI libraries/frameworks and utilities:
    - **Pytorch**: Highly customizable deep learning framework.
    - **Langchain**:  Framework designed to simplify the creation of applications using large language models (LLMs).
    - **ultralytics**: Open-source libarry of a specific CNN/CV models 
    - **torchvision**: Pytorch's open-source library of pretrained CNN/CV architecture
    - **OpenCV**: Enables developers to process and analyze visual data such as images and videos with efficiency.
    - **Numpy**:  Core of a rich ecosystem of data science libraries used for seamless conversions and compatibility.
    - **Matplot**: Visualization library
    - **tqdm**: Notebook friendly graphucal progress bar animation library