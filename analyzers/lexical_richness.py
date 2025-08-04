"""
This module provides functions to analyze lexical richness using word frequency scores.
"""

import spacy
from wordfreq import zipf_frequency
from . import create_standard_response

# Load the English NLP model
nlp = spacy.load("en_core_web_sm")

def analyze_lexical_richness(text: str) -> dict:
    """
    Analyzes lexical richness using word frequency scores (Zipf scale).
    
    Returns a standardized response with score, bucket, raw_emotions, confidence, and details.
    
    Metrics:
    - avg_zipf_score: Average word frequency; lower = more sophisticated vocabulary
    - percent_rare_words: % of words below a Zipf score (e.g. < 4.5 = rare)
    - num_advanced_words: How many rare words were used
    - total_tokens: Vocabulary sample size
    """
    doc = nlp(text)
    
    # Extract alpha tokens (words) and convert to lowercase, excluding stop words
    tokens = [token.text.lower() for token in doc if token.is_alpha and not token.is_stop]

    if not tokens:
        return create_standard_response(
            score=0.0,
            bucket="insufficient_data",
            raw_emotions=[],
            confidence=0.0,
            details={
                "avg_zipf_score": 0,
                "percent_rare_words": 0,
                "num_advanced_words": 0,
                "total_tokens": 0,
                "message": "No valid tokens found for analysis"
            }
        )

    # Get Zipf frequency scores for all tokens
    zipf_scores = [zipf_frequency(token, 'en') for token in tokens]
    
    # Calculate metrics
    avg_zipf_score = sum(zipf_scores) / len(zipf_scores)
    rare_threshold = 4.5  # Words with Zipf < 4.5 are considered rare/advanced
    rare_count = sum(1 for score in zipf_scores if score < rare_threshold)
    percent_rare_words = rare_count / len(zipf_scores)
    
    # Determine richness bucket based on average Zipf score and percentage of rare words
    if avg_zipf_score < 4.0 and percent_rare_words > 0.3:
        bucket = "sophisticated"
        score = 0.9
    elif avg_zipf_score < 5.0 and percent_rare_words > 0.15:
        bucket = "advanced"
        score = 0.7
    elif avg_zipf_score < 6.0 and percent_rare_words > 0.05:
        bucket = "moderate"
        score = 0.5
    else:
        bucket = "basic"
        score = 0.3

    # Calculate confidence based on text length
    confidence = min(1.0, len(tokens) / 30)  # Higher confidence with more tokens
    
    # Create raw emotions breakdown
    raw_emotions = [
        {"label": "avg_zipf_score", "score": max(0, 1 - (avg_zipf_score / 8))},  # Normalize to 0-1, lower is better
        {"label": "percent_rare_words", "score": percent_rare_words},
        {"label": "num_advanced_words", "score": min(rare_count / 50, 1.0)}  # Normalize to 0-1
    ]
    
    # Create details with additional metrics
    details = {
        "avg_zipf_score": round(avg_zipf_score, 2),
        "percent_rare_words": round(percent_rare_words, 3),
        "num_advanced_words": rare_count,
        "total_tokens": len(tokens),
        "rare_threshold": rare_threshold,
        "vocabulary_sophistication": {
            "very_rare_words": sum(1 for score in zipf_scores if score < 3.0),
            "rare_words": sum(1 for score in zipf_scores if 3.0 <= score < 4.5),
            "common_words": sum(1 for score in zipf_scores if 4.5 <= score < 6.0),
            "very_common_words": sum(1 for score in zipf_scores if score >= 6.0)
        },
        "zipf_distribution": {
            "min_score": round(min(zipf_scores), 2),
            "max_score": round(max(zipf_scores), 2),
            "median_score": round(sorted(zipf_scores)[len(zipf_scores)//2], 2)
        }
    }

    return create_standard_response(
        score=score,
        bucket=bucket,
        raw_emotions=raw_emotions,
        confidence=confidence,
        details=details
    )

def compute_lexical_richness(text: str) -> dict:
    """
    Alias for analyze_lexical_richness to maintain consistency with other analyzers.
    """
    return analyze_lexical_richness(text) 