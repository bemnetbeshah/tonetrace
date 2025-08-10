from textblob import TextBlob
from . import create_standard_response


def analyze_sentiment(input_data: str):
    """
    Analyzes the sentiment of the input text using TextBlob.
    Returns a standardized response with score, bucket, raw, confidence, and details.
    Polarity ranges from -1 (negative) to 1 (positive).
    Subjectivity ranges from 0 (objective) to 1 (subjective).
    """
    blob = TextBlob(input_data)  # Create a TextBlob object for the input text
    polarity = round(blob.sentiment.polarity, 3)  # Sentiment polarity score
    subjectivity = round(blob.sentiment.subjectivity, 3)  # Sentiment subjectivity score
    
    # Determine sentiment bucket based on polarity
    if polarity > 0.1:
        bucket = "positive"
    elif polarity < -0.1:
        bucket = "negative"
    else:
        bucket = "neutral"
    
    # Calculate confidence based on absolute polarity value
    confidence = abs(polarity)
    
    # Create raw output with all analyzer details
    raw = {
        "polarity": polarity,
        "subjectivity": subjectivity,
        "textblob_sentiment": {
            "polarity": blob.sentiment.polarity,
            "subjectivity": blob.sentiment.subjectivity
        }
    }
    
    # Create details with additional metrics
    details = {
        "polarity_range": "negative" if polarity < -0.1 else "positive" if polarity > 0.1 else "neutral",
        "subjectivity_level": "objective" if subjectivity < 0.3 else "subjective" if subjectivity > 0.7 else "balanced"
    }
    
    return create_standard_response(
        score=polarity,
        bucket=bucket,
        raw=raw,
        confidence=confidence,
        details=details
    )
