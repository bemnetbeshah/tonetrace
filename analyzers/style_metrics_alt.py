# analyzers/style_metrics_alt.py
# Alternative implementation without spaCy dependency

import re
import nltk
from . import create_standard_response
from .readability import analyze_readability

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('tokenizers/word_tokenize')
except LookupError:
    nltk.download('punkt')

def compute_formality(text: str) -> dict:
    """
    Analyze formality using readability scores from the centralized readability module.
    Returns a standardized response with score, bucket, raw_emotions, confidence, and details.
    """
    # Get readability scores from the centralized readability module
    readability_scores = analyze_readability(text)
    
    # Extract Flesch-Kincaid grade for formality classification
    fk_grade = readability_scores.get("flesch_kincaid_grade", 0)

    # Determine formality bucket based on Flesch-Kincaid grade
    if fk_grade < 6:
        bucket = "informal"
        score = 0.3  # Low formality score
    elif fk_grade < 10:
        bucket = "neutral"
        score = 0.6  # Medium formality score
    else:
        bucket = "formal"
        score = 0.9  # High formality score

    # Calculate confidence based on text length
    confidence = 0.8  # Base confidence for readability metrics
    
    # Create raw emotions breakdown using readability scores
    raw_emotions = [
        {"label": "flesch_kincaid_grade", "score": readability_scores.get("flesch_kincaid_grade", 0)},
        {"label": "gunning_fog_index", "score": readability_scores.get("gunning_fog", 0)},
        {"label": "dale_chall_score", "score": readability_scores.get("dale_chall_score", 0)}
    ]
    
    # Create details with additional metrics
    details = {
        "flesch_kincaid_grade": readability_scores.get("flesch_kincaid_grade", 0),
        "gunning_fog_index": readability_scores.get("gunning_fog", 0),
        "dale_chall_score": readability_scores.get("dale_chall_score", 0),
        "grade_level": fk_grade,
        "education_level": "beginner" if fk_grade < 6 else "intermediate" if fk_grade < 10 else "advanced"
    }

    return create_standard_response(
        score=score,
        bucket=bucket,
        raw_emotions=raw_emotions,
        confidence=confidence,
        details=details
    )

def compute_complexity(text: str) -> dict:
    """
    Analyze text complexity using lexical density and sentence structure.
    Returns a standardized response with score, bucket, raw_emotions, confidence, and details.
    """
    # Tokenize text into words and sentences
    sentences = nltk.sent_tokenize(text)
    words = nltk.word_tokenize(text.lower())
    
    # Filter out punctuation and short words
    content_words = [word for word in words if len(word) > 2 and word.isalpha()]
    total_words = len(content_words)
    
    # Calculate lexical density (unique words / total words)
    unique_words = len(set(content_words))
    lexical_density = round(unique_words / total_words, 3) if total_words > 0 else 0

    # Get sentence and word counts from readability module
    readability_scores = analyze_readability(text)
    sentence_count = readability_scores.get("sentence_count", 0)
    word_count = readability_scores.get("word_count", 0)
    avg_sentence_length = round(word_count / sentence_count, 2) if sentence_count > 0 else 0

    # Determine complexity bucket based on lexical density and sentence length
    if lexical_density > 0.6 and avg_sentence_length > 20:
        bucket = "complex"
        score = 0.9
    elif lexical_density > 0.5 or avg_sentence_length > 15:
        bucket = "moderate"
        score = 0.6
    else:
        bucket = "simple"
        score = 0.3

    # Calculate confidence based on text length - use same threshold as lexical.py
    confidence = min(1.0, total_words / 30)  # Higher confidence with more text
    
    # Create raw emotions breakdown
    raw_emotions = [
        {"label": "lexical_density", "score": lexical_density},
        {"label": "avg_sentence_length", "score": avg_sentence_length / 30}  # Normalize to 0-1 range
    ]
    
    # Create details with additional metrics
    details = {
        "average_sentence_length": avg_sentence_length,
        "lexical_density": lexical_density,
        "total_words": total_words,
        "content_words": content_words,
        "sentence_count": sentence_count,
        "complexity_factors": {
            "high_lexical_density": lexical_density > 0.6,
            "long_sentences": avg_sentence_length > 20
        },
        "analysis_method": "NLTK + readability metrics"
    }

    return create_standard_response(
        score=score,
        bucket=bucket,
        raw_emotions=raw_emotions,
        confidence=confidence,
        details=details
    )
