import re
from . import create_standard_response

def compute_lexical_diversity(text: str) -> dict:
    """
    Computes lexical diversity as the ratio of unique words to total words.
    Returns a standardized response with score, bucket, raw_emotions, confidence, and details.
    """
    # Remove punctuation and lowercase all words
    words = re.findall(r'\b\w+\b', text.lower())
    total_words = len(words)
    unique_words = len(set(words))

    diversity_ratio = round(unique_words / total_words, 4) if total_words else 0.0

    # Determine diversity bucket
    if diversity_ratio > 0.7:
        bucket = "high_diversity"
        score = diversity_ratio
    elif diversity_ratio > 0.5:
        bucket = "moderate_diversity"
        score = diversity_ratio
    else:
        bucket = "low_diversity"
        score = diversity_ratio

    # Calculate confidence based on text length
    confidence = min(1.0, total_words / 30)  # Higher confidence with more words
    
    # Create raw breakdown
    raw_data = {
        "unique_words": unique_words,
        "total_words": total_words,
        "diversity_ratio": diversity_ratio
    }
    
    # Create details with additional metrics
    details = {
        "lexical_diversity": diversity_ratio,
        "total_words": total_words,
        "unique_words": unique_words,
        "repetition_ratio": 1 - diversity_ratio,
        "vocabulary_richness": "rich" if diversity_ratio > 0.7 else "moderate" if diversity_ratio > 0.5 else "limited"
    }

    return create_standard_response(
        score=score,
        bucket=bucket,
        raw=raw_data,
        confidence=confidence,
        details=details
    )

