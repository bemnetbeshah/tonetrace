import re

def compute_lexical_diversity(text: str) -> dict:
    """
    Computes lexical diversity as the ratio of unique words to total words.
    Returns the ratio and counts for diagnostics.
    """
    # Remove punctuation and lowercase all words
    words = re.findall(r'\b\w+\b', text.lower())
    total_words = len(words)
    unique_words = len(set(words))

    diversity_ratio = round(unique_words / total_words, 4) if total_words else 0.0

    return {
        "lexical_diversity": diversity_ratio,
        "total_words": total_words,
        "unique_words": unique_words
    }

