from pydantic import BaseModel
from typing import Optional
from sqlmodel import Field, SQLModel

class Auditing(SQLModel, table=True):
    id: str | None = Field(default=None, primary_key=True, index=True, description="Universal identifier")
    type: str | None = Field(default=None, description="Which method is called", nullable=True)
    classification: str | None = Field(default=None, description="FAKE or REAL", nullable=True)
    reason: str | None = Field(default=None, description="Classification reason", nullable=True)

    ext: str | None = Field(default=None, description="While file format", nullable=True)
    confidence: str | None = Field(default=None, description="Deep learning confidence", nullable=True)


class ImageResponse(BaseModel):
    prediction: str
    confidence: str
    prediction: str

class VideoResponse(BaseModel):
    prediction: str
    confidence: str
    prediction: str

class InformationRequest(BaseModel):
    text: str

class InformationResponse(BaseModel):
    classification: str
    reason: Optional[str]