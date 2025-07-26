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
    Returns normalized output with score, bucket, and raw metrics.

    Metrics:
    - Flesch-Kincaid Grade: Estimates US school grade level needed to understand the text.
    - Gunning Fog Index: Estimates years of formal education needed to understand the text on first reading.
    - Dale-Chall Readability Score: Uses a list of common words to determine text difficulty.
    """

    fk_grade = textstat.flesch_kincaid_grade(text)
    fog_index = textstat.gunning_fog(text)
    dale_score = textstat.dale_chall_readability_score(text)

    # Determine formality bucket based on Flesch-Kincaid grade
    if fk_grade < 6:
        bucket = "informal"
    elif fk_grade < 10:
        bucket = "neutral"
    else:
        bucket = "formal"

    # Normalize score to 0-1 range (cap at grade 20 for normalization)
    normalized_score = min(fk_grade / 20.0, 1.0)

    return {
        "score": round(normalized_score, 3),
        "bucket": bucket,
        "raw_metrics": {
            "flesch_kincaid_grade": round(fk_grade, 2),
            "gunning_fog_index": round(fog_index, 2),
            "dale_chall_score": round(dale_score, 2)
        }
    }

# Load the English NLP model
nlp = spacy.load("en_core_web_sm")

def compute_complexity(text: str) -> dict:
    """
    Computes writing complexity metrics.
    Returns normalized output with score, bucket, and raw metrics.
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

    # Determine complexity bucket based on sentence length and lexical density
    complexity_score = (min(avg_sentence_length / 25.0, 1.0) + lexical_density) / 2.0
    
    if complexity_score < 0.3:
        bucket = "simple"
    elif complexity_score < 0.7:
        bucket = "moderate"
    else:
        bucket = "complex"

    return {
        "score": round(complexity_score, 3),
        "bucket": bucket,
        "raw_metrics": {
            "average_sentence_length": avg_sentence_length,
            "lexical_density": lexical_density
        }
    }
