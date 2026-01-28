import pytest
import asyncio
from analyzer import MomentAnalyzer
from datetime import datetime, timedelta

def test_moment_analyzer():
    analyzer = MomentAnalyzer()
    
    # Sample notes for testing
    sample_notes = [
        {
            'id': 1,
            'title': 'Started new job',
            'content': 'First day at the tech company. Nervous but excited.',
            'created_at': datetime.now() - timedelta(days=5)
        },
        {
            'id': 2,
            'title': 'Team lunch',
            'content': 'Had lunch with colleagues. Everyone is friendly.',
            'created_at': datetime.now() - timedelta(days=4)
        },
        {
            'id': 3,
            'title': 'Weekend hiking',
            'content': 'Went hiking to clear my head. Beautiful mountain views.',
            'created_at': datetime.now() - timedelta(days=2)
        }
    ]
    
    # Test clustering
    clusters = analyzer.cluster_notes(sample_notes)
    assert len(clusters) > 0
    
    # Test full analysis
    moments = analyzer.analyze_notes(sample_notes)
    assert len(moments) > 0
    
    for moment in moments:
        assert 'title' in moment
        assert 'summary' in moment
        assert 'emotional_tone' in moment
        assert 'keywords' in moment
        assert 'reflection_prompt' in moment
        assert moment['emotional_tone'] in ['Positive', 'Neutral', 'Negative']

def test_sentiment_analysis():
    analyzer = MomentAnalyzer()
    
    positive_texts = ["I'm so happy today!", "Great news everyone!"]
    negative_texts = ["I'm feeling sad", "This is terrible"]
    neutral_texts = ["I went to the store", "The weather is okay"]
    
    pos_tone, pos_score = analyzer.analyze_sentiment(positive_texts)
    neg_tone, neg_score = analyzer.analyze_sentiment(negative_texts)
    neu_tone, neu_score = analyzer.analyze_sentiment(neutral_texts)
    
    assert pos_tone == "Positive"
    assert neg_tone == "Negative"
    assert neu_tone == "Neutral"
    
    assert pos_score > 0
    assert neg_score < 0
    assert abs(neu_score) < 0.1

def test_keyword_extraction():
    analyzer = MomentAnalyzer()
    
    texts = [
        "I love working with Python and machine learning",
        "Python programming is fun and machine learning is exciting"
    ]
    
    keywords = analyzer.extract_keywords(texts, top_k=5)
    assert len(keywords) <= 5
    assert any('python' in kw.lower() for kw in keywords)

if __name__ == "__main__":
    test_moment_analyzer()
    test_sentiment_analysis()
    test_keyword_extraction()
    print("All tests passed!")