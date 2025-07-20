from textblob import TextBlob


def analyze_sentiment(input_data: str):
    blob = TextBlob(input_data)
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity
    return {
        "polarity": polarity,
        "subjectivity": subjectivity,
    }
