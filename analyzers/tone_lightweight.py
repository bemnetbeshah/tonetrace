"""
Lightweight tone analyzer without transformers dependency.
Uses TextBlob and rule-based analysis for tone classification.
"""

from textblob import TextBlob
from constants import EMOTION_TO_TONE
from . import create_standard_response

def classify_tone_model(text: str, threshold: float = 0.4, score_diff: float = 0.05) -> dict:
    """
    Classifies the tone of the given text using lightweight rule-based analysis.
    Returns a standardized response with score, bucket, raw, confidence, and details.
    """
    blob = TextBlob(text)
    
    # Analyze sentiment as a base for tone
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity
    
    # Define tone keywords and their weights
    tone_keywords = {
        "positive": ["good", "great", "excellent", "amazing", "wonderful", "fantastic", "love", "like", "enjoy", "happy", "excited", "proud", "confident", "optimistic"],
        "negative": ["bad", "terrible", "awful", "hate", "dislike", "angry", "frustrated", "disappointed", "worried", "sad", "confused", "difficult", "hard", "struggle"],
        "neutral": ["think", "believe", "consider", "analyze", "discuss", "examine", "explore", "investigate", "study", "research", "observe", "note", "find"],
        "formal": ["therefore", "however", "furthermore", "moreover", "consequently", "nevertheless", "accordingly", "subsequently", "hence", "thus", "indeed"],
        "informal": ["yeah", "ok", "cool", "awesome", "totally", "definitely", "sure", "maybe", "kinda", "sorta", "gonna", "wanna", "gotta"]
    }
    
    # Count keyword occurrences
    text_lower = text.lower()
    tone_scores = {}
    
    for tone, keywords in tone_keywords.items():
        score = sum(text_lower.count(keyword) for keyword in keywords)
        tone_scores[tone] = score
    
    # Normalize scores
    total_words = len(text.split())
    normalized_scores = {tone: score / max(total_words, 1) for tone, score in tone_scores.items()}
    
    # Determine primary tone
    primary_tone = max(normalized_scores, key=normalized_scores.get)
    primary_score = normalized_scores[primary_tone]
    
    # Check for secondary tone
    sorted_scores = sorted(normalized_scores.items(), key=lambda x: x[1], reverse=True)
    secondary_tone = None
    has_secondary_tone = False
    
    if len(sorted_scores) > 1:
        second_tone, second_score = sorted_scores[1]
        if abs(primary_score - second_score) <= score_diff and second_score > 0:
            has_secondary_tone = True
            secondary_tone = second_tone
    
    # Create final bucket
    if has_secondary_tone:
        bucket = f"{primary_tone} / {secondary_tone}"
    else:
        bucket = primary_tone
    
    # Calculate confidence based on score strength and text length
    confidence = min(primary_score * 2, 1.0)  # Scale confidence
    
    # Create raw output
    raw = {
        "tone_scores": normalized_scores,
        "sentiment_polarity": polarity,
        "sentiment_subjectivity": subjectivity,
        "threshold": threshold,
        "score_diff_threshold": score_diff,
        "text_length": total_words
    }
    
    # Create details
    details = {
        "primary_tone": primary_tone,
        "primary_score": primary_score,
        "has_secondary_tone": has_secondary_tone,
        "secondary_tone": secondary_tone,
        "sentiment_analysis": {
            "polarity": polarity,
            "subjectivity": subjectivity
        },
        "tone_distribution": normalized_scores
    }
    
    return create_standard_response(
        score=primary_score,
        bucket=bucket,
        raw=raw,
        confidence=confidence,
        details=details
    )

def map_emotion_to_tone(label: str) -> str:
    """
    Maps a fine-grained emotion label to a broader tone category using the EMOTION_TO_TONE mapping.
    """
    return EMOTION_TO_TONE.get(label, "neutral")
