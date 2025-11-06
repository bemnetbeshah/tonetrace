"""
Lightweight style metrics analyzer without spaCy dependency.
Uses NLTK and regex for basic text analysis.
"""

import re
from textstat import flesch_kincaid_grade, gunning_fog
from . import create_standard_response
from .readability import analyze_readability
from .nltk_utils import safe_word_tokenize, safe_sent_tokenize, safe_pos_tag

# Handle dale_chall_score import compatibility
try:
    from textstat import dale_chall_readability_score as dale_chall_score
except ImportError:
    # Fallback for older textstat versions
    def dale_chall_score(text):
        return 0.0  # Return default value if not available

def average_sentence_length(text: str) -> float:
    """
    Calculates the average sentence length in words for the input text.
    """
    sentences = safe_sent_tokenize(text)
    if not sentences:
        return 0.0
    words = safe_word_tokenize(text)
    return len(words) / len(sentences) if sentences else 0.0

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
    
    # Create raw breakdown using readability scores
    raw_data = {
        "flesch_kincaid_grade": readability_scores.get("flesch_kincaid_grade", 0),
        "gunning_fog_index": readability_scores.get("gunning_fog", 0),
        "dale_chall_score": readability_scores.get("dale_chall_score", 0)
    }
    
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
        raw=raw_data,
        confidence=confidence,
        details=details
    )

def compute_complexity(text: str) -> dict:
    """
    Computes writing complexity metrics using NLTK instead of spaCy.
    Returns a standardized response with score, bucket, raw_emotions, confidence, and details.
    """
    # Tokenize and tag words (with safe fallbacks)
    words = safe_word_tokenize(text.lower())
    pos_tags = safe_pos_tag(words)
    
    # Count content words (nouns, verbs, adjectives, adverbs)
    # Handle case where POS tagging fails (tags will be 'UNKNOWN')
    content_words = 0
    valid_pos_tags = {'NN', 'NNS', 'NNP', 'NNPS',  # Nouns
                     'VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ',  # Verbs
                     'JJ', 'JJR', 'JJS',  # Adjectives
                     'RB', 'RBR', 'RBS'}  # Adverbs
    for word, pos in pos_tags:
        if pos in valid_pos_tags:
            content_words += 1
        # If POS tagging failed, use simple heuristic: count non-stopwords as content
        elif pos == 'UNKNOWN' and len(word) > 3:  # Heuristic: longer words likely content
            content_words += 0.5  # Partial credit when POS unavailable

    total_words = len(words)
    lexical_density = round(content_words / total_words, 3) if total_words > 0 else 0

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

    # Calculate confidence based on text length
    confidence = min(1.0, total_words / 30)  # Higher confidence with more text
    
    # Create raw breakdown
    raw_data = {
        "lexical_density": lexical_density,
        "avg_sentence_length": avg_sentence_length,
        "total_words": total_words,
        "content_words": content_words
    }
    
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
        }
    }

    return create_standard_response(
        score=score,
        bucket=bucket,
        raw=raw_data,
        confidence=confidence,
        details=details
    )
