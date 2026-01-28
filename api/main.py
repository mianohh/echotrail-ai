from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import time
import json

from database import get_db, create_tables
import models
import schemas
from auth import get_password_hash, verify_password, create_access_token, get_current_user
from analyzer import MomentAnalyzer
from demo_data import DemoDataSeeder

app = FastAPI(title="EchoTrail AI API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app", "https://*.netlify.app", "https://ecotrailai.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
analyzer = MomentAnalyzer()
demo_seeder = DemoDataSeeder()
security = HTTPBearer()

# Create tables on startup
@app.on_event("startup")
def startup_event():
    create_tables()

# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Authentication endpoints
@app.post("/auth/register", response_model=schemas.Token)
def register(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    user = models.User(email=user_data.email, hashed_password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/login", response_model=schemas.Token)
def login(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/me", response_model=schemas.User)
def get_current_user_info(current_user: models.User = Depends(get_current_user)):
    return current_user

# Notes endpoints
@app.post("/notes", response_model=schemas.Note)
def create_note(
    note_data: schemas.NoteCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    note = models.Note(
        title=note_data.title,
        content=note_data.content,
        mood=note_data.mood,
        energy_level=note_data.energy_level,
        image_data=note_data.image_data,
        user_id=current_user.id
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

@app.get("/notes")
def get_notes(
    skip: int = 0,
    limit: int = 100,
    search: str = None,
    mood: str = None,
    start_date: datetime = None,
    end_date: datetime = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(models.Note).filter(models.Note.user_id == current_user.id)
    
    if search:
        query = query.filter(
            (models.Note.title.contains(search)) | (models.Note.content.contains(search))
        )
    
    if mood:
        query = query.filter(models.Note.mood == mood)
    
    if start_date:
        query = query.filter(models.Note.created_at >= start_date)
    
    if end_date:
        query = query.filter(models.Note.created_at <= end_date)
    
    notes = query.order_by(models.Note.created_at.desc()).offset(skip).limit(limit).all()
    return notes

@app.delete("/notes/{note_id}")
def delete_note(
    note_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    note = db.query(models.Note).filter(
        models.Note.id == note_id,
        models.Note.user_id == current_user.id
    ).first()
    
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    db.delete(note)
    db.commit()
    return {"message": "Note deleted successfully"}

# Analysis endpoints
@app.post("/analyze")
def analyze_moments(
    request: schemas.AnalysisRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    start_time = time.time()
    
    # Get notes for analysis
    query = db.query(models.Note).filter(models.Note.user_id == current_user.id)
    notes = query.order_by(models.Note.created_at).all()
    
    if not notes:
        return {
            "moments": [],
            "total_notes_analyzed": 0,
            "analysis_time": time.time() - start_time
        }
    
    # Convert to dict format for analyzer
    notes_data = []
    for note in notes:
        notes_data.append({
            'id': note.id,
            'title': note.title,
            'content': note.content,
            'mood': note.mood,
            'energy_level': note.energy_level,
            'created_at': note.created_at
        })
    
    # Run analysis
    moments_data = analyzer.analyze_notes(notes_data, min_cluster_size=2)
    
    # Save moments to database
    db.query(models.Moment).filter(models.Moment.user_id == current_user.id).delete()
    
    for moment_data in moments_data:
        moment = models.Moment(
            title=moment_data['title'],
            summary=moment_data['summary'],
            emotional_tone=moment_data['emotional_tone'],
            emotional_score=moment_data['emotional_score'],
            keywords=json.dumps(moment_data['keywords']),
            reflection_prompt=moment_data['reflection_prompt'],
            start_date=moment_data['start_date'],
            end_date=moment_data['end_date'],
            note_count=moment_data['note_count'],
            note_ids=json.dumps(moment_data['note_ids']),
            user_id=current_user.id
        )
        db.add(moment)
    
    db.commit()
    
    return {
        "moments": moments_data,
        "total_notes_analyzed": len(notes),
        "analysis_time": time.time() - start_time
    }

@app.get("/moments")
def get_moments(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    moments = db.query(models.Moment).filter(
        models.Moment.user_id == current_user.id
    ).order_by(models.Moment.start_date.desc()).all()
    
    # Convert to response format
    response_moments = []
    for moment in moments:
        response_moments.append({
            "id": moment.id,
            "title": moment.title,
            "summary": moment.summary,
            "emotional_tone": moment.emotional_tone,
            "emotional_score": moment.emotional_score,
            "keywords": json.loads(moment.keywords),
            "reflection_prompt": moment.reflection_prompt,
            "start_date": moment.start_date.isoformat(),
            "end_date": moment.end_date.isoformat(),
            "note_count": moment.note_count,
            "note_ids": json.loads(moment.note_ids),
            "created_at": moment.created_at.isoformat()
        })
    
    return response_moments

# Demo data endpoints
@app.post("/demo/seed")
def seed_demo_data(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Clear existing notes
    db.query(models.Note).filter(models.Note.user_id == current_user.id).delete()
    db.query(models.Moment).filter(models.Moment.user_id == current_user.id).delete()
    db.commit()
    
    # Generate demo notes
    demo_notes = demo_seeder.generate_demo_notes(current_user.id)
    
    # Save to database
    for note_data in demo_notes:
        note = models.Note(
            title=note_data["title"],
            content=note_data["content"],
            mood=note_data["mood"],
            energy_level=note_data["energy_level"],
            image_data=note_data["image_data"],
            created_at=note_data["created_at"],
            updated_at=note_data["updated_at"],
            user_id=current_user.id
        )
        db.add(note)
    
    db.commit()
    
    return {
        "message": "Demo data seeded successfully",
        "notes_created": len(demo_notes),
        "insights": demo_seeder.get_demo_insights()
    }

# Insights endpoints
@app.get("/insights/stats")
def get_insights_stats(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    notes = db.query(models.Note).filter(models.Note.user_id == current_user.id).all()
    moments = db.query(models.Moment).filter(models.Moment.user_id == current_user.id).all()
    
    if not notes:
        return {
            "total_notes": 0,
            "total_moments": 0,
            "mood_distribution": {},
            "energy_trends": [],
            "recent_activity": 0
        }
    
    # Mood distribution
    mood_counts = {}
    energy_by_date = {}
    
    for note in notes:
        mood_counts[note.mood] = mood_counts.get(note.mood, 0) + 1
        date_key = note.created_at.date().isoformat()
        if date_key not in energy_by_date:
            energy_by_date[date_key] = []
        energy_by_date[date_key].append(note.energy_level)
    
    # Energy trends (daily averages)
    energy_trends = []
    for date_str, energy_levels in sorted(energy_by_date.items()):
        avg_energy = sum(energy_levels) / len(energy_levels)
        energy_trends.append({
            "date": date_str,
            "average_energy": round(avg_energy, 1),
            "note_count": len(energy_levels)
        })
    
    # Recent activity (last 7 days)
    recent_cutoff = datetime.utcnow() - timedelta(days=7)
    recent_notes = [n for n in notes if n.created_at >= recent_cutoff]
    
    return {
        "total_notes": len(notes),
        "total_moments": len(moments),
        "mood_distribution": mood_counts,
        "energy_trends": energy_trends[-30:],  # Last 30 days
        "recent_activity": len(recent_notes),
        "date_range": {
            "start": min(n.created_at for n in notes).isoformat() if notes else None,
            "end": max(n.created_at for n in notes).isoformat() if notes else None
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)