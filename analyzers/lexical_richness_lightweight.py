"""
Lightweight lexical richness analyzer without spaCy dependency.
Uses NLTK and wordfreq for vocabulary analysis.
"""

import nltk
from wordfreq import zipf_frequency
from . import create_standard_response

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)

from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

# Get English stopwords
stop_words = set(stopwords.words('english'))

def analyze_lexical_richness(text: str) -> dict:
    """
    Analyzes lexical richness using word frequency scores (Zipf scale) with NLTK.
    
    Returns a standardized response with score, bucket, raw_emotions, confidence, and details.
    
    Metrics:
    - avg_zipf_score: Average word frequency; lower = more sophisticated vocabulary
    - percent_rare_words: % of words below a Zipf score (e.g. < 4.5 = rare)
    - num_advanced_words: How many rare words were used
    - total_tokens: Vocabulary sample size
    """
    # Tokenize text and filter for alpha tokens, excluding stop words
    tokens = word_tokenize(text.lower())
    tokens = [token for token in tokens if token.isalpha() and token not in stop_words]

    if not tokens:
        return create_standard_response(
            score=0.0,
            bucket="insufficient_data",
            raw={},
            confidence=0.0,
            details={
                "avg_zipf_score": 0,
                "percent_rare_words": 0,
                "num_advanced_words": 0,
                "total_tokens": 0,
                "message": "No valid tokens found for analysis"
            }
        )

    # Get Zipf frequency scores for all tokens
    zipf_scores = []
    for token in tokens:
        try:
            score = zipf_frequency(token, 'en')
            zipf_scores.append(score)
        except:
            # If wordfreq fails for a token, skip it
            continue
    
    if not zipf_scores:
        return create_standard_response(
            score=0.0,
            bucket="insufficient_data",
            raw={},
            confidence=0.0,
            details={
                "avg_zipf_score": 0,
                "percent_rare_words": 0,
                "num_advanced_words": 0,
                "total_tokens": 0,
                "message": "No valid Zipf scores found"
            }
        )
    
    # Calculate metrics
    avg_zipf_score = sum(zipf_scores) / len(zipf_scores)
    rare_threshold = 4.5  # Words with Zipf < 4.5 are considered rare/advanced
    rare_count = sum(1 for score in zipf_scores if score < rare_threshold)
    percent_rare_words = rare_count / len(zipf_scores)
    
    # Determine richness bucket based on average Zipf score and percentage of rare words
    if avg_zipf_score < 4.0 and percent_rare_words > 0.3:
        bucket = "sophisticated"
        score = 0.9
    elif avg_zipf_score < 5.0 and percent_rare_words > 0.15:
        bucket = "advanced"
        score = 0.7
    elif avg_zipf_score < 6.0 and percent_rare_words > 0.05:
        bucket = "moderate"
        score = 0.5
    else:
        bucket = "basic"
        score = 0.3

    # Calculate confidence based on text length
    confidence = min(1.0, len(tokens) / 30)  # Higher confidence with more tokens
    
    # Create raw breakdown
    raw_data = {
        "avg_zipf_score": avg_zipf_score,
        "percent_rare_words": percent_rare_words,
        "num_advanced_words": rare_count,
        "total_tokens": len(tokens),
        "rare_threshold": rare_threshold
    }
    
    # Create details with additional metrics
    details = {
        "avg_zipf_score": round(avg_zipf_score, 2),
        "percent_rare_words": round(percent_rare_words, 3),
        "num_advanced_words": rare_count,
        "total_tokens": len(tokens),
        "rare_threshold": rare_threshold,
        "vocabulary_sophistication": {
            "very_rare_words": sum(1 for score in zipf_scores if score < 3.0),
            "rare_words": sum(1 for score in zipf_scores if 3.0 <= score < 4.5),
            "common_words": sum(1 for score in zipf_scores if 4.5 <= score < 6.0),
            "very_common_words": sum(1 for score in zipf_scores if score >= 6.0)
        },
        "zipf_distribution": {
            "min_score": round(min(zipf_scores), 2),
            "max_score": round(max(zipf_scores), 2),
            "median_score": round(sorted(zipf_scores)[len(zipf_scores)//2], 2)
        }
    }

    # Create raw output with all analyzer details
    raw = {
        "avg_zipf_score": round(avg_zipf_score, 2),
        "percent_rare_words": round(percent_rare_words, 3),
        "num_advanced_words": rare_count,
        "total_tokens": len(tokens),
        "rare_threshold": rare_threshold,
        "vocabulary_sophistication": {
            "very_rare_words": sum(1 for score in zipf_scores if score < 3.0),
            "rare_words": sum(1 for score in zipf_scores if 3.0 <= score < 4.5),
            "common_words": sum(1 for score in zipf_scores if 4.5 <= score < 6.0),
            "very_common_words": sum(1 for score in zipf_scores if score >= 6.0)
        },
        "zipf_distribution": {
            "min_score": round(min(zipf_scores), 2),
            "max_score": round(max(zipf_scores), 2),
            "median_score": round(sorted(zipf_scores)[len(zipf_scores)//2], 2)
        }
    }

    return create_standard_response(
        score=score,
        bucket=bucket,
        raw=raw,
        confidence=confidence,
        details=details
    )

def compute_lexical_richness(text: str) -> dict:
    """
    Alias for analyze_lexical_richness to maintain consistency with other analyzers.
    """
    return analyze_lexical_richness(text)
