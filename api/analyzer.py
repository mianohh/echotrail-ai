import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import AgglomerativeClustering
from sklearn.metrics.pairwise import cosine_similarity
from textblob import TextBlob
from datetime import datetime, timedelta
from typing import List, Dict, Any
import json
import hashlib
import re

class MomentAnalyzer:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2),
            min_df=1
        )
    
    def preprocess_text(self, text: str) -> str:
        """Clean and preprocess text for analysis"""
        text = re.sub(r'[^\w\s]', ' ', text.lower())
        text = re.sub(r'\s+', ' ', text).strip()
        return text
    
    def extract_keywords(self, texts: List[str], top_k: int = 8) -> List[str]:
        """Extract key themes from clustered texts"""
        combined_text = ' '.join(texts)
        
        # Use TF-IDF to find important terms
        try:
            tfidf_matrix = self.vectorizer.fit_transform([combined_text])
            feature_names = self.vectorizer.get_feature_names_out()
            tfidf_scores = tfidf_matrix.toarray()[0]
            
            # Get top keywords
            top_indices = np.argsort(tfidf_scores)[-top_k:][::-1]
            keywords = [feature_names[i] for i in top_indices if tfidf_scores[i] > 0]
            
            return keywords[:top_k]
        except:
            # Fallback: simple word frequency
            words = combined_text.split()
            word_freq = {}
            for word in words:
                if len(word) > 3:
                    word_freq[word] = word_freq.get(word, 0) + 1
            
            return sorted(word_freq.keys(), key=word_freq.get, reverse=True)[:top_k]
    
    def analyze_sentiment(self, texts: List[str]) -> tuple:
        """Analyze emotional tone of texts"""
        sentiments = []
        for text in texts:
            blob = TextBlob(text)
            sentiments.append(blob.sentiment.polarity)
        
        avg_sentiment = np.mean(sentiments)
        
        if avg_sentiment > 0.1:
            tone = "Positive"
        elif avg_sentiment < -0.1:
            tone = "Negative"
        else:
            tone = "Neutral"
            
        return tone, float(avg_sentiment)
    
    def generate_reflection_prompt(self, keywords: List[str], tone: str) -> str:
        """Generate personalized reflection prompt"""
        prompts = {
            "Positive": [
                f"What made this period particularly meaningful, especially around {', '.join(keywords[:3])}?",
                f"How did experiences with {', '.join(keywords[:2])} contribute to your growth?",
                f"What patterns do you notice in your positive experiences with {keywords[0] if keywords else 'these themes'}?"
            ],
            "Negative": [
                f"What challenges around {', '.join(keywords[:3])} taught you the most?",
                f"How might you approach situations involving {', '.join(keywords[:2])} differently?",
                f"What support or resources could help you with {keywords[0] if keywords else 'these challenges'}?"
            ],
            "Neutral": [
                f"What insights emerge when you reflect on {', '.join(keywords[:3])}?",
                f"How do these experiences with {', '.join(keywords[:2])} fit into your larger story?",
                f"What would you like to explore more deeply about {keywords[0] if keywords else 'this period'}?"
            ]
        }
        
        import random
        return random.choice(prompts.get(tone, prompts["Neutral"]))
    
    def create_moment_title(self, keywords: List[str], dates: List[datetime]) -> str:
        """Generate descriptive title for moment"""
        if not keywords:
            return f"Reflections from {dates[0].strftime('%B %d')}"
        
        primary_theme = keywords[0].title()
        date_range = f"{dates[0].strftime('%b %d')}"
        if len(dates) > 1 and (dates[-1] - dates[0]).days > 0:
            date_range += f" - {dates[-1].strftime('%b %d')}"
        
        return f"{primary_theme} Journey ({date_range})"
    
    def cluster_notes(self, notes: List[Dict[str, Any]], min_cluster_size: int = 2) -> List[List[int]]:
        """Cluster notes using text similarity and temporal proximity"""
        if len(notes) < 2:
            return [[i] for i in range(len(notes))]
        
        # Prepare text data
        texts = []
        timestamps = []
        for note in notes:
            combined_text = f"{note['title']} {note['content']}"
            texts.append(self.preprocess_text(combined_text))
            timestamps.append(note['created_at'])
        
        # Create text embeddings
        try:
            tfidf_matrix = self.vectorizer.fit_transform(texts)
            text_similarity = cosine_similarity(tfidf_matrix)
        except:
            # Fallback if TF-IDF fails
            return [[i] for i in range(len(notes))]
        
        # Create temporal similarity matrix
        temporal_similarity = np.zeros((len(notes), len(notes)))
        for i in range(len(notes)):
            for j in range(len(notes)):
                if i != j:
                    time_diff = abs((timestamps[i] - timestamps[j]).total_seconds())
                    # Decay function: closer in time = higher similarity
                    temporal_sim = np.exp(-time_diff / (24 * 3600 * 7))  # 1 week decay
                    temporal_similarity[i][j] = temporal_sim
        
        # Combine similarities (70% text, 30% temporal)
        combined_similarity = 0.7 * text_similarity + 0.3 * temporal_similarity
        
        # Convert similarity to distance
        distance_matrix = 1 - combined_similarity
        
        # Simple clustering using Agglomerative
        try:
            n_clusters = max(1, len(notes) // 3)
            clusterer = AgglomerativeClustering(
                n_clusters=n_clusters,
                metric='precomputed',
                linkage='average'
            )
            cluster_labels = clusterer.fit_predict(distance_matrix)
        except:
            # Fallback: each note is its own cluster
            cluster_labels = list(range(len(notes)))
        
        # Group notes by cluster
        clusters = {}
        for i, label in enumerate(cluster_labels):
            if label not in clusters:
                clusters[label] = []
            clusters[label].append(i)
        
        # Filter small clusters
        valid_clusters = []
        for label, indices in clusters.items():
            if len(indices) >= min_cluster_size:
                valid_clusters.append(indices)
        
        # Add single-note clusters for unclustered notes
        clustered_indices = set()
        for cluster in valid_clusters:
            clustered_indices.update(cluster)
        
        for i in range(len(notes)):
            if i not in clustered_indices:
                valid_clusters.append([i])
        
        return valid_clusters
    
    def analyze_notes(self, notes: List[Dict[str, Any]], min_cluster_size: int = 2) -> List[Dict[str, Any]]:
        """Main analysis pipeline"""
        if not notes:
            return []
        
        # Sort notes by date
        notes_sorted = sorted(notes, key=lambda x: x['created_at'])
        
        # Cluster notes
        clusters = self.cluster_notes(notes_sorted, min_cluster_size)
        
        moments = []
        for cluster_indices in clusters:
            cluster_notes = [notes_sorted[i] for i in cluster_indices]
            
            # Extract text content
            texts = [f"{note['title']} {note['content']}" for note in cluster_notes]
            dates = [note['created_at'] for note in cluster_notes]
            
            # Analyze cluster
            keywords = self.extract_keywords(texts)
            tone, sentiment_score = self.analyze_sentiment(texts)
            title = self.create_moment_title(keywords, dates)
            reflection_prompt = self.generate_reflection_prompt(keywords, tone)
            
            # Create summary
            summary = f"A collection of {len(cluster_notes)} thoughts and experiences "
            if keywords:
                summary += f"centered around {', '.join(keywords[:3])}. "
            summary += f"This period shows a {tone.lower()} emotional tone with themes of personal reflection and growth."
            
            moment = {
                'title': title,
                'summary': summary,
                'emotional_tone': tone,
                'emotional_score': sentiment_score,
                'keywords': keywords,
                'reflection_prompt': reflection_prompt,
                'start_date': min(dates),
                'end_date': max(dates),
                'note_count': len(cluster_notes),
                'note_ids': [notes_sorted[i]['id'] for i in cluster_indices]
            }
            
            moments.append(moment)
        
        # Sort moments by start date
        moments.sort(key=lambda x: x['start_date'])
        
        return moments
    
    def hash_notes(self, notes: List[Dict[str, Any]]) -> str:
        """Create hash of notes for caching"""
        notes_str = json.dumps(notes, sort_keys=True, default=str)
        return hashlib.md5(notes_str.encode()).hexdigest()