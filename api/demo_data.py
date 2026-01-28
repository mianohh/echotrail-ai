from datetime import datetime, timedelta
from typing import List, Dict, Any
import random

class DemoDataSeeder:
    def __init__(self):
        self.sample_notes = [
            # Week 1: Starting new job
            {
                "title": "First day at new job",
                "content": "Nervous but excited about starting at the tech company. The office is modern and the team seems friendly. Hope I can make a good impression.",
                "mood": "😊",
                "energy_level": 4,
                "days_ago": 21
            },
            {
                "title": "Learning the codebase",
                "content": "Spent the whole day trying to understand the architecture. It's more complex than I expected but fascinating. My mentor Sarah is really helpful.",
                "mood": "🤔",
                "energy_level": 3,
                "days_ago": 20
            },
            {
                "title": "Team lunch",
                "content": "Had lunch with the development team. Everyone is so welcoming and shared great stories about the company culture. Feeling more at home already.",
                "mood": "😄",
                "energy_level": 5,
                "days_ago": 19
            },
            
            # Week 2: Settling in
            {
                "title": "First code review",
                "content": "Submitted my first pull request today. Got some constructive feedback but overall positive response. Learning so much about best practices.",
                "mood": "😌",
                "energy_level": 4,
                "days_ago": 18
            },
            {
                "title": "Weekend hiking trip",
                "content": "Went hiking with college friends to clear my head. The mountain views were incredible and it felt good to disconnect from work stress.",
                "mood": "🌟",
                "energy_level": 5,
                "days_ago": 16
            },
            {
                "title": "Cooking experiment",
                "content": "Tried making Thai curry from scratch. It was a disaster but fun! Ended up ordering takeout but learned something new about patience.",
                "mood": "😅",
                "energy_level": 3,
                "days_ago": 15
            },
            
            # Week 3: Challenges
            {
                "title": "Difficult bug",
                "content": "Spent 6 hours on a single bug today. Frustrating but finally figured it out. The solution was simpler than I thought. Need to ask for help sooner.",
                "mood": "😤",
                "energy_level": 2,
                "days_ago": 14
            },
            {
                "title": "Imposter syndrome",
                "content": "Feeling like I don't belong here. Everyone seems so much smarter and experienced. Maybe I'm not cut out for this level of work.",
                "mood": "😟",
                "energy_level": 2,
                "days_ago": 13
            },
            {
                "title": "Mentor meeting",
                "content": "Had a great chat with Sarah about my concerns. She shared her own struggles when starting and gave me perspective. Everyone goes through this.",
                "mood": "😊",
                "energy_level": 4,
                "days_ago": 12
            },
            
            # Week 4: Growth
            {
                "title": "Successful presentation",
                "content": "Presented my first feature to the team. Got positive feedback and approval to move forward. Feeling more confident in my abilities.",
                "mood": "🎉",
                "energy_level": 5,
                "days_ago": 11
            },
            {
                "title": "New friendship",
                "content": "Alex from the design team and I grabbed coffee. We have so much in common and similar career goals. Nice to have a work friend.",
                "mood": "😊",
                "energy_level": 4,
                "days_ago": 10
            },
            {
                "title": "Family video call",
                "content": "Caught up with parents and siblings. Told them about the new job and they're so proud. Mom made me promise to eat more vegetables.",
                "mood": "🥰",
                "energy_level": 4,
                "days_ago": 9
            },
            
            # Week 5: Personal growth
            {
                "title": "Morning meditation",
                "content": "Started a daily meditation practice. Just 10 minutes but it's helping with work stress and focus. Why didn't I try this sooner?",
                "mood": "🧘",
                "energy_level": 4,
                "days_ago": 8
            },
            {
                "title": "Book club discussion",
                "content": "Finished 'Atomic Habits' and discussed it with friends. So many practical ideas for building better routines and breaking bad ones.",
                "mood": "📚",
                "energy_level": 4,
                "days_ago": 7
            },
            {
                "title": "Gym comeback",
                "content": "First workout in months. Body is sore but mind feels clear. Need to make this a regular habit again for my mental health.",
                "mood": "💪",
                "energy_level": 3,
                "days_ago": 6
            },
            
            # Week 6: Relationships
            {
                "title": "Date night",
                "content": "Went to that new Italian restaurant with Sam. Great food and conversation. We talked about future plans and dreams. Feeling grateful.",
                "mood": "❤️",
                "energy_level": 5,
                "days_ago": 5
            },
            {
                "title": "Argument with roommate",
                "content": "Had a tense conversation about chores and boundaries. It was uncomfortable but needed to happen. We worked it out and set clear expectations.",
                "mood": "😐",
                "energy_level": 3,
                "days_ago": 4
            },
            {
                "title": "Old friend visit",
                "content": "Jamie surprised me with a visit from out of town. We stayed up late catching up and laughing about college memories. Some friendships never change.",
                "mood": "😄",
                "energy_level": 4,
                "days_ago": 3
            },
            
            # Recent days
            {
                "title": "Project milestone",
                "content": "Hit a major milestone on the user authentication feature. The whole team celebrated and I felt like a real contributor. Hard work paying off.",
                "mood": "🎯",
                "energy_level": 5,
                "days_ago": 2
            },
            {
                "title": "Weekend plans",
                "content": "Planning a camping trip with work friends next month. It's amazing how quickly I've connected with this group. Looking forward to adventures.",
                "mood": "🏕️",
                "energy_level": 4,
                "days_ago": 1
            },
            {
                "title": "Reflection on growth",
                "content": "Looking back at these past few weeks, I've grown so much. New job, new friendships, better habits. Change is scary but exciting.",
                "mood": "🌱",
                "energy_level": 4,
                "days_ago": 0
            }
        ]
    
    def generate_demo_notes(self, user_id: int) -> List[Dict[str, Any]]:
        """Generate demo notes with realistic timestamps"""
        notes = []
        base_time = datetime.utcnow()
        
        for i, note_data in enumerate(self.sample_notes):
            created_at = base_time - timedelta(days=note_data["days_ago"])
            # Add some random minutes to make timestamps more realistic
            created_at += timedelta(minutes=random.randint(-120, 120))
            
            note = {
                "id": i + 1,  # Will be overridden by database
                "title": note_data["title"],
                "content": note_data["content"],
                "mood": note_data["mood"],
                "energy_level": note_data["energy_level"],
                "image_data": None,
                "created_at": created_at,
                "updated_at": created_at,
                "user_id": user_id
            }
            notes.append(note)
        
        return notes
    
    def get_demo_insights(self) -> Dict[str, Any]:
        """Get expected insights from demo data"""
        return {
            "total_notes": len(self.sample_notes),
            "date_range_days": 21,
            "expected_moments": 6,
            "mood_distribution": {
                "positive": 14,
                "neutral": 4,
                "negative": 3
            },
            "key_themes": [
                "work", "new job", "learning", "friendship", 
                "growth", "challenges", "relationships", "habits"
            ]
        }