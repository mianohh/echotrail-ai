from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List
from enum import Enum

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: int
    email: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class NoteCreate(BaseModel):
    title: str
    content: str
    mood: Optional[str] = "😐"
    energy_level: Optional[int] = 3
    image_data: Optional[str] = None

class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    mood: Optional[str] = None
    energy_level: Optional[int] = None
    image_data: Optional[str] = None

class Note(BaseModel):
    id: int
    title: str
    content: str
    mood: str
    energy_level: int
    image_data: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class EmotionalTone(str, Enum):
    POSITIVE = "Positive"
    NEUTRAL = "Neutral"
    NEGATIVE = "Negative"

class Moment(BaseModel):
    id: int
    title: str
    summary: str
    emotional_tone: str
    emotional_score: float
    keywords: List[str]
    reflection_prompt: str
    start_date: datetime
    end_date: datetime
    note_count: int
    note_ids: List[int]
    created_at: datetime
    
    class Config:
        from_attributes = True

class AnalysisRequest(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    min_cluster_size: Optional[int] = 2

class AnalysisResponse(BaseModel):
    moments: List[Moment]
    total_notes_analyzed: int
    analysis_time: float