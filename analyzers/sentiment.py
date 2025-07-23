from textblob import TextBlob


def analyze_sentiment(input_data: str):
    """
    Analyzes the sentiment of the input text using TextBlob.
    Returns a dictionary with polarity and subjectivity scores (rounded to 2 decimal places).
    Polarity ranges from -1 (negative) to 1 (positive).
    Subjectivity ranges from 0 (objective) to 1 (subjective).
    """
    blob = TextBlob(input_data)  # Create a TextBlob object for the input text
    polarity = round(blob.sentiment.polarity, 2)  # Sentiment polarity score
    subjectivity = round(blob.sentiment.subjectivity, 2)  # Sentiment subjectivity score
    return {
        "polarity": polarity,
        "subjectivity": subjectivity,
    }
