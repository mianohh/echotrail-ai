from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    notes = relationship("Note", back_populates="owner")

class Note(Base):
    __tablename__ = "notes"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    mood = Column(String)  # emoji
    energy_level = Column(Integer, default=3)  # 1-5
    image_data = Column(Text, nullable=True)  # base64 encoded
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="notes")

class Moment(Base):
    __tablename__ = "moments"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    summary = Column(Text)
    emotional_tone = Column(String)  # Positive/Neutral/Negative
    emotional_score = Column(Float)  # -1 to 1
    keywords = Column(Text)  # JSON string
    reflection_prompt = Column(Text)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    note_count = Column(Integer)
    note_ids = Column(Text)  # JSON string of note IDs
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user_id = Column(Integer, ForeignKey("users.id"))

class AnalysisCache(Base):
    __tablename__ = "analysis_cache"
    
    id = Column(Integer, primary_key=True, index=True)
    notes_hash = Column(String, unique=True, index=True)
    result = Column(Text)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)