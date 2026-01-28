"""
Judge Demo Mode - Deterministic demo data for hackathon evaluation
"""
from datetime import datetime, timedelta
import json

class JudgeDemoData:
    """Hardcoded demo dataset designed for compelling judge experience"""
    
    @staticmethod
    def get_demo_notes():
        """Returns 32 carefully crafted notes spanning 16 days with compelling narrative"""
        base_date = datetime.utcnow() - timedelta(days=16)
        
        notes = [
            # Day 1-2: Late night uncertainty period
            {
                "title": "Can't sleep again",
                "content": "Mind racing about the project deadline. Feel like I'm missing something important but can't put my finger on it.",
                "mood": "😐",
                "energy_level": 3,
                "created_at": base_date + timedelta(hours=2, minutes=15)
            },
            {
                "title": "2am thoughts",
                "content": "Maybe I'm overthinking this whole thing. Sometimes the best solutions come when you stop forcing them.",
                "mood": "😐",
                "energy_level": 2,
                "created_at": base_date + timedelta(hours=26, minutes=30)
            },
            
            # Day 3-4: Productive burst
            {
                "title": "Morning clarity",
                "content": "Woke up with a completely different perspective. The solution was simpler than I thought.",
                "mood": "🙂",
                "energy_level": 7,
                "created_at": base_date + timedelta(days=2, hours=8, minutes=45)
            },
            {
                "title": "Flow state",
                "content": "Been coding for 4 hours straight and it feels like 30 minutes. This is why I love what I do.",
                "mood": "🔥",
                "energy_level": 9,
                "created_at": base_date + timedelta(days=2, hours=14, minutes=20)
            },
            {
                "title": "Breakthrough moment",
                "content": "Finally cracked the algorithm. The key was thinking about it as a graph problem instead of a tree.",
                "mood": "🔥",
                "energy_level": 8,
                "created_at": base_date + timedelta(days=3, hours=16, minutes=10)
            },
            
            # Day 5-6: Social recharge
            {
                "title": "Coffee with Sarah",
                "content": "Good to catch up with old friends. She reminded me why I started this journey in the first place.",
                "mood": "🙂",
                "energy_level": 6,
                "created_at": base_date + timedelta(days=4, hours=11, minutes=30)
            },
            {
                "title": "Team dinner",
                "content": "Great energy with the team tonight. We're all aligned on the vision now.",
                "mood": "🙂",
                "energy_level": 7,
                "created_at": base_date + timedelta(days=5, hours=19, minutes=45)
            },
            
            # Day 7-9: Burnout signals
            {
                "title": "Feeling drained",
                "content": "Three weeks of intense work is catching up with me. Need to find better balance.",
                "mood": "😔",
                "energy_level": 3,
                "created_at": base_date + timedelta(days=6, hours=17, minutes=20)
            },
            {
                "title": "Skipped gym again",
                "content": "Keep telling myself I'll go tomorrow but tomorrow never comes. This pattern needs to change.",
                "mood": "😔",
                "energy_level": 2,
                "created_at": base_date + timedelta(days=7, hours=20, minutes=15)
            },
            {
                "title": "Weekend recovery",
                "content": "Slept 12 hours and feel human again. Sometimes rest is the most productive thing you can do.",
                "mood": "😴",
                "energy_level": 5,
                "created_at": base_date + timedelta(days=8, hours=12, minutes=30)
            },
            
            # Day 10-12: Transition period (THE STANDOUT MOMENT)
            {
                "title": "Questioning everything",
                "content": "Is this really what I want to be doing in 5 years? The work is good but something feels off.",
                "mood": "😐",
                "energy_level": 4,
                "created_at": base_date + timedelta(days=9, hours=23, minutes=45)
            },
            {
                "title": "Late night epiphany",
                "content": "Maybe it's not about the destination but who I become along the way. Growth happens in the uncomfortable spaces.",
                "mood": "😐",
                "energy_level": 4,
                "created_at": base_date + timedelta(days=10, hours=1, minutes=20)
            },
            {
                "title": "Mentor call",
                "content": "John said something that stuck: 'Uncertainty isn't the enemy of progress, it's the birthplace of possibility.'",
                "mood": "🙂",
                "energy_level": 6,
                "created_at": base_date + timedelta(days=10, hours=15, minutes=30)
            },
            {
                "title": "Shift in perspective",
                "content": "Starting to see challenges as puzzles rather than problems. Same situation, completely different energy.",
                "mood": "🙂",
                "energy_level": 7,
                "created_at": base_date + timedelta(days=11, hours=9, minutes=15)
            },
            {
                "title": "New direction",
                "content": "Decided to pivot the approach. Scary but exciting. Sometimes you have to trust the process.",
                "mood": "🙂",
                "energy_level": 6,
                "created_at": base_date + timedelta(days=12, hours=14, minutes=45)
            },
            
            # Day 13-14: Momentum builds
            {
                "title": "Early morning run",
                "content": "First run in weeks. Forgot how much clarity comes from moving your body.",
                "mood": "🙂",
                "energy_level": 7,
                "created_at": base_date + timedelta(days=12, hours=7, minutes=30)
            },
            {
                "title": "Productive day",
                "content": "Knocked out three major tasks before lunch. The new approach is working.",
                "mood": "🔥",
                "energy_level": 8,
                "created_at": base_date + timedelta(days=13, hours=13, minutes=20)
            },
            {
                "title": "Team sync",
                "content": "Everyone's excited about the new direction. Energy in the room was electric.",
                "mood": "🔥",
                "energy_level": 9,
                "created_at": base_date + timedelta(days=13, hours=16, minutes=45)
            },
            
            # Day 15-16: Recent reflections
            {
                "title": "Looking back",
                "content": "Crazy how much has changed in just two weeks. The person who wrote those late-night notes feels like a different version of me.",
                "mood": "🙂",
                "energy_level": 7,
                "created_at": base_date + timedelta(days=14, hours=20, minutes=30)
            },
            {
                "title": "Grateful",
                "content": "Thankful for the uncertainty period. It forced me to question assumptions and find a better path.",
                "mood": "🙂",
                "energy_level": 8,
                "created_at": base_date + timedelta(days=15, hours=10, minutes=15)
            },
            
            # Additional scattered notes for clustering variety
            {
                "title": "Quick thought",
                "content": "Innovation happens at the intersection of different ideas. Need to read more outside my field.",
                "mood": "🙂",
                "energy_level": 6,
                "created_at": base_date + timedelta(days=1, hours=12, minutes=30)
            },
            {
                "title": "Focus session",
                "content": "Two hours of deep work with no distractions. This is how real progress happens.",
                "mood": "🔥",
                "energy_level": 8,
                "created_at": base_date + timedelta(days=3, hours=10, minutes=45)
            },
            {
                "title": "Learning moment",
                "content": "Failed at the first attempt but learned something valuable. Failure is just feedback in disguise.",
                "mood": "😐",
                "energy_level": 5,
                "created_at": base_date + timedelta(days=4, hours=16, minutes=20)
            },
            {
                "title": "Weekend project",
                "content": "Built a small prototype just for fun. Sometimes the best ideas come from play, not pressure.",
                "mood": "🙂",
                "energy_level": 7,
                "created_at": base_date + timedelta(days=8, hours=15, minutes=30)
            },
            {
                "title": "Inspiration strike",
                "content": "Saw an amazing talk about resilience. The speaker's journey reminded me why persistence matters.",
                "mood": "🔥",
                "energy_level": 8,
                "created_at": base_date + timedelta(days=11, hours=18, minutes=45)
            },
            {
                "title": "Small win",
                "content": "Fixed a bug that's been bothering me for days. Sometimes the smallest victories feel the biggest.",
                "mood": "🙂",
                "energy_level": 6,
                "created_at": base_date + timedelta(days=14, hours=11, minutes=15)
            },
            {
                "title": "Night thoughts",
                "content": "The best ideas always seem to come right before sleep. Need to keep a notebook by the bed.",
                "mood": "😐",
                "energy_level": 4,
                "created_at": base_date + timedelta(days=6, hours=23, minutes=30)
            },
            {
                "title": "Morning pages",
                "content": "Writing first thing in the morning clears mental fog. Should make this a daily habit.",
                "mood": "🙂",
                "energy_level": 6,
                "created_at": base_date + timedelta(days=9, hours=7, minutes=45)
            },
            {
                "title": "Collaboration magic",
                "content": "Two minds really are better than one. The solution emerged from our conversation, not individual thinking.",
                "mood": "🔥",
                "energy_level": 8,
                "created_at": base_date + timedelta(days=12, hours=17, minutes=20)
            },
            {
                "title": "Energy dip",
                "content": "3pm crash hit hard today. Need to pay attention to these patterns and adjust accordingly.",
                "mood": "😴",
                "energy_level": 3,
                "created_at": base_date + timedelta(days=7, hours=15, minutes=15)
            },
            {
                "title": "Creative flow",
                "content": "When you're in the zone, time becomes irrelevant. This is what I live for.",
                "mood": "🔥",
                "energy_level": 9,
                "created_at": base_date + timedelta(days=15, hours=14, minutes=30)
            },
            {
                "title": "Reflection time",
                "content": "Taking a step back to see the bigger picture. Sometimes you need distance to gain perspective.",
                "mood": "😐",
                "energy_level": 5,
                "created_at": base_date + timedelta(days=5, hours=21, minutes=45)
            }
        ]
        
        return notes
    
    @staticmethod
    def get_precomputed_moments():
        """Returns deterministic moments that should be generated from the demo data"""
        base_date = datetime.utcnow() - timedelta(days=16)
        
        return [
            {
                "title": "A Period of Transition",
                "summary": "A transformative phase marked by late-night questioning, uncertainty, and ultimately finding a new perspective through mentorship and self-reflection.",
                "emotional_tone": "Mixed → Positive",
                "emotional_score": 0.3,
                "keywords": ["uncertainty", "growth", "perspective", "transition", "mentorship"],
                "reflection_prompt": "What shifted for you during this period, even if it wasn't obvious at the time?",
                "start_date": (base_date + timedelta(days=9)).isoformat(),
                "end_date": (base_date + timedelta(days=12)).isoformat(),
                "note_count": 5,
                "note_ids": [11, 12, 13, 14, 15]
            },
            {
                "title": "Late Night Focus Sessions",
                "summary": "Deep thinking and problem-solving during quiet hours, leading to breakthrough moments and creative solutions.",
                "emotional_tone": "Contemplative",
                "emotional_score": 0.1,
                "keywords": ["late night", "thinking", "breakthrough", "solutions", "clarity"],
                "reflection_prompt": "What insights emerge when you give yourself space to think deeply?",
                "start_date": base_date.isoformat(),
                "end_date": (base_date + timedelta(days=2)).isoformat(),
                "note_count": 3,
                "note_ids": [1, 2, 27]
            },
            {
                "title": "Creative Flow States",
                "summary": "Periods of intense productivity and creative energy where time seems to disappear and breakthrough work happens.",
                "emotional_tone": "Energized",
                "emotional_score": 0.8,
                "keywords": ["flow", "productivity", "coding", "breakthrough", "energy"],
                "reflection_prompt": "What conditions help you enter your most productive and creative states?",
                "start_date": (base_date + timedelta(days=2)).isoformat(),
                "end_date": (base_date + timedelta(days=15)).isoformat(),
                "note_count": 6,
                "note_ids": [3, 4, 5, 17, 18, 31]
            },
            {
                "title": "Burnout and Recovery",
                "summary": "Recognizing the signs of exhaustion and taking necessary steps to restore energy and perspective through rest and self-care.",
                "emotional_tone": "Tired → Restored",
                "emotional_score": -0.2,
                "keywords": ["burnout", "exhaustion", "recovery", "rest", "balance"],
                "reflection_prompt": "How do you recognize when you need to step back and recharge?",
                "start_date": (base_date + timedelta(days=6)).isoformat(),
                "end_date": (base_date + timedelta(days=8)).isoformat(),
                "note_count": 4,
                "note_ids": [8, 9, 10, 30]
            },
            {
                "title": "Social Connection and Support",
                "summary": "Meaningful interactions with friends, mentors, and team members that provide perspective, energy, and renewed motivation.",
                "emotional_tone": "Connected",
                "emotional_score": 0.6,
                "keywords": ["friendship", "team", "connection", "support", "collaboration"],
                "reflection_prompt": "How do the people in your life help you see yourself and your work more clearly?",
                "start_date": (base_date + timedelta(days=4)).isoformat(),
                "end_date": (base_date + timedelta(days=13)).isoformat(),
                "note_count": 4,
                "note_ids": [6, 7, 13, 29]
            },
            {
                "title": "Building Momentum",
                "summary": "A surge of energy and progress as new approaches take hold, creating a positive feedback loop of achievement and motivation.",
                "emotional_tone": "Energized",
                "emotional_score": 0.7,
                "keywords": ["momentum", "progress", "energy", "achievement", "direction"],
                "reflection_prompt": "What helps you maintain momentum when you're making good progress?",
                "start_date": (base_date + timedelta(days=12)).isoformat(),
                "end_date": (base_date + timedelta(days=15)).isoformat(),
                "note_count": 5,
                "note_ids": [16, 17, 18, 19, 20]
            }
        ]