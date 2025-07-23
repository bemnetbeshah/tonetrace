"""
This module provides functions to calculate style-related metrics for a given text.
"""

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
    Returns a bucket and 3 underlying scores.

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

    if fk_grade < 6:
        bucket = "informal"
    elif fk_grade < 10:
        bucket = "neutral"
    else:
        bucket = "formal"

    return {
        "bucket": bucket,
        "flesch_kincaid_grade": round(fk_grade, 2),
        "gunning_fog_index": round(fog_index, 2),
        "dale_chall_score": round(dale_score, 2)
    }

# Load the English NLP model
nlp = spacy.load("en_core_web_sm")

def compute_complexity(text: str) -> dict:
    """
    Computes writing complexity metrics:
    - Average sentence length (words per sentence)
    - Lexical density (content words / total words)
    """
    doc = nlp(text)

    total_words = 0
    content_words = 0

    for token in doc:
        if token.is_alpha:
            total_words += 1
            if token.pos_ in {"NOUN", "VERB", "ADJ", "ADV"}:
                content_words += 1

    lexical_density = round(content_words / total_words, 2) if total_words > 0 else 0

    sentence_count = textstat.sentence_count(text)
    word_count = textstat.lexicon_count(text, removepunct=True)
    avg_sentence_length = round(word_count / sentence_count, 2) if sentence_count > 0 else 0

    return {
        "average_sentence_length": avg_sentence_length,
        "lexical_density": lexical_density
    }
