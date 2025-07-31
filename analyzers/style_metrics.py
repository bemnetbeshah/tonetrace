"""
This module provides functions to calculate style-related metrics for a given text.
"""

from . import create_standard_response

def count_words(text: str) -> int:
    """
    Counts the number of words in the input text.
    """
    # Split the text by whitespace and count the resulting words
    return len(text.split())

def average_sentence_length(text: str) -> float:
    """
    Calculates the average sentence length in words for the input text.
    """
    # Split the text into sentences using period as a delimiter
    sentences = [s for s in text.split('.') if s.strip()]
    if not sentences:
        return 0.0
    # Calculate the average number of words per sentence
    return sum(len(sentence.split()) for sentence in sentences) / len(sentences)

import textstat
import spacy

def compute_formality(text: str) -> dict:
    """
    Analyze formality using multiple readability formulas.
    Returns a standardized response with score, bucket, raw_emotions, confidence, and details.

    Metrics:
    - Flesch-Kincaid Grade: Estimates US school grade level needed to understand the text.
    - Gunning Fog Index: Estimates years of formal education needed to understand the text on first reading.
    - Dale-Chall Readability Score: Uses a list of common words to determine text difficulty.

    Dale-Chall Score Reference:
        Score: 0 - 4.9   | Grade: K-4   | Beginner/Early elementary
        Score: 5.0 - 5.9 | Grade: 5     | Elementary
        Score: 6.0 - 6.9 | Grade: 6     | Elementary
        Score: 7.0 - 7.9 | Grade: 7     | Junior high/middle school
        Score: 8.0 - 8.9 | Grade: 8     | Junior high/middle school
        Score: 9.0 - 9.9 | Grade: 9     | High school
        Score: 10.0-10.9 | Grade: 10    | High school
        Score: 11.0-11.9 | Grade: 11    | High school
        Score: 12.0-12.9 | Grade: 12    | High school
        Score: 13.0+     | College+     | College/Advanced
    """

    fk_grade = textstat.flesch_kincaid_grade(text)
    fog_index = textstat.gunning_fog(text)
    dale_score = textstat.dale_chall_readability_score(text)

    # Determine formality bucket
    if fk_grade < 6:
        bucket = "informal"
        score = 0.3  # Low formality score
    elif fk_grade < 10:
        bucket = "neutral"
        score = 0.6  # Medium formality score
    else:
        bucket = "formal"
        score = 0.9  # High formality score

    # Calculate confidence based on consistency of metrics
    confidence = 0.8  # Base confidence for readability metrics
    
    # Create raw emotions breakdown (using readability scores as "emotions")
    raw_emotions = [
        {"label": "flesch_kincaid_grade", "score": round(fk_grade, 2)},
        {"label": "gunning_fog_index", "score": round(fog_index, 2)},
        {"label": "dale_chall_score", "score": round(dale_score, 2)}
    ]
    
    # Create details with additional metrics
    details = {
        "flesch_kincaid_grade": round(fk_grade, 2),
        "gunning_fog_index": round(fog_index, 2),
        "dale_chall_score": round(dale_score, 2),
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

# Load the English NLP model
nlp = spacy.load("en_core_web_sm")

def compute_complexity(text: str) -> dict:
    """
    Computes writing complexity metrics.
    Returns a standardized response with score, bucket, raw_emotions, confidence, and details.
    """
    doc = nlp(text)

    total_words = 0
    content_words = 0

    for token in doc:
        if token.is_alpha:
            total_words += 1
            if token.pos_ in {"NOUN", "VERB", "ADJ", "ADV"}:
                content_words += 1

    lexical_density = round(content_words / total_words, 3) if total_words > 0 else 0

    sentence_count = textstat.sentence_count(text)
    word_count = textstat.lexicon_count(text, removepunct=True)
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
    confidence = min(1.0, total_words / 50)  # Higher confidence with more text
    
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
        }
    }

    return create_standard_response(
        score=score,
        bucket=bucket,
        raw_emotions=raw_emotions,
        confidence=confidence,
        details=details
    )
