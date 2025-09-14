import re
from . import create_standard_response

HEDGING_PHRASES = {
    "maybe", "perhaps", "sort of", "kind of", "possibly", "likely",
    "arguably", "could be", "might be", "seems", "I think", "in my opinion",
    "I feel", "suggests", "indicates", "appears to", "could", "should", "would"
}

def detect_hedging(text: str) -> dict:
    """
    Detects hedging phrases in the input text.
    Returns a standardized response with score, bucket, raw_emotions, confidence, and details.
    """
    text_lower = text.lower()
    count = 0
    found_phrases = []

    for phrase in HEDGING_PHRASES:
        if re.search(r'\b' + re.escape(phrase) + r'\b', text_lower):
            count += 1
            found_phrases.append(phrase)

    # Calculate hedging density (hedging phrases per word)
    word_count = len(text.split())
    hedging_density = count / word_count if word_count > 0 else 0.0
    
    # Determine hedging bucket
    if hedging_density > 0.05 or count > 3:
        bucket = "high_hedging"
        score = min(hedging_density * 10, 1.0)  # Scale density to 0-1 range
    elif hedging_density > 0.02 or count > 1:
        bucket = "moderate_hedging"
        score = min(hedging_density * 10, 1.0)
    else:
        bucket = "low_hedging"
        score = min(hedging_density * 10, 1.0)

    # Calculate confidence based on text length
    confidence = min(1.0, word_count / 50)  # Higher confidence with more words
    
    # Create raw breakdown
    raw_data = {
        "hedging_count": count,
        "hedging_density": hedging_density,
        "found_phrases": found_phrases,
        "word_count": word_count
    }
    
    # Create details with additional metrics
    details = {
        "hedging_count": count,
        "contains_hedging": count > 0,
        "hedging_density": round(hedging_density, 4),
        "word_count": word_count,
        "found_phrases": found_phrases,
        "hedging_style": "tentative" if count > 3 else "balanced" if count > 1 else "assertive"
    }

    return create_standard_response(
        score=score,
        bucket=bucket,
        raw=raw_data,
        confidence=confidence,
        details=details
    )
