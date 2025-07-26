import re

def compute_lexical_diversity(text: str) -> dict:
    """
    Computes lexical diversity as the ratio of unique words to total words.
    Returns normalized output with score, bucket, and raw metrics.
    """
    # Remove punctuation and lowercase all words
    words = re.findall(r'\b\w+\b', text.lower())
    total_words = len(words)
    unique_words = len(set(words))

    diversity_ratio = round(unique_words / total_words, 4) if total_words else 0.0

    # Determine bucket based on diversity ratio
    if diversity_ratio < 0.4:
        bucket = "repetitive"
    elif diversity_ratio < 0.7:
        bucket = "moderate"
    else:
        bucket = "diverse"

    return {
        "score": diversity_ratio,
        "bucket": bucket,
        "raw_metrics": {
            "total_words": total_words,
            "unique_words": unique_words,
            "lexical_diversity": diversity_ratio
        }
    }
