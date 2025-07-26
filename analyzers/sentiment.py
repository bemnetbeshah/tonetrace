from textblob import TextBlob


def analyze_sentiment(input_data: str):
    """
    Analyzes the sentiment of the input text using TextBlob.
    Returns normalized output with score, bucket, and raw metrics.
    """
    blob = TextBlob(input_data)  # Create a TextBlob object for the input text
    polarity = round(blob.sentiment.polarity, 2)  # Sentiment polarity score
    subjectivity = round(blob.sentiment.subjectivity, 2)  # Sentiment subjectivity score
    
    # Determine sentiment bucket based on polarity
    if polarity > 0.1:
        bucket = "positive"
    elif polarity < -0.1:
        bucket = "negative"
    else:
        bucket = "neutral"
    
    # Use absolute polarity as confidence score (0-1 range)
    score = round(abs(polarity), 3)
    
    return {
        "score": score,
        "bucket": bucket,
        "raw_metrics": {
            "polarity": polarity,
            "subjectivity": subjectivity
        }
    }
