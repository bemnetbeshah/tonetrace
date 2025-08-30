# analyzers/passive_voice_alt.py
# Alternative implementation without spaCy dependency

import re
import nltk
from . import create_standard_response

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('taggers/averaged_perceptron_tagger')
except LookupError:
    nltk.download('averaged_perceptron_tagger')

def detect_passive_sentences(text: str) -> dict:
    """
    Detects passive voice sentences in the input text using NLTK and regex.
    Returns a standardized response with score, bucket, raw_emotions, confidence, and details.
    """
    # Tokenize into sentences
    sentences = nltk.sent_tokenize(text)
    passive_count = 0
    total_sentences = len(sentences)
    
    # Common passive voice patterns
    passive_patterns = [
        r'\b(am|is|are|was|were|be|been|being)\s+\w+ed\b',  # be + past participle
        r'\b(am|is|are|was|were|be|been|being)\s+\w+en\b',  # be + irregular past participle
        r'\b(get|gets|got|gotten)\s+\w+ed\b',  # get + past participle
        r'\b(get|gets|got|gotten)\s+\w+en\b',  # get + irregular past participle
        r'\b\w+ed\s+by\b',  # past participle + by
        r'\b\w+en\s+by\b',  # irregular past participle + by
    ]
    
    for sentence in sentences:
        sentence_lower = sentence.lower()
        
        # Check for passive patterns
        for pattern in passive_patterns:
            if re.search(pattern, sentence_lower):
                passive_count += 1
                break
        
        # Additional check for common passive constructions
        if any(phrase in sentence_lower for phrase in [
            'is being', 'are being', 'was being', 'were being',
            'has been', 'have been', 'had been',
            'will be', 'would be', 'could be', 'should be'
        ]):
            # Check if followed by past participle
            if re.search(r'\b(being|been|be)\s+\w+(ed|en)\b', sentence_lower):
                passive_count += 1
    
    # Calculate passive ratio
    passive_ratio = passive_count / total_sentences if total_sentences else 0.0
    
    # Determine passive voice bucket
    if passive_ratio > 0.3:
        bucket = "high_passive"
        score = passive_ratio
    elif passive_ratio > 0.1:
        bucket = "moderate_passive"
        score = passive_ratio
    else:
        bucket = "low_passive"
        score = passive_ratio

    # Calculate confidence based on number of sentences
    confidence = min(1.0, total_sentences / 10)  # Higher confidence with more sentences
    
    # Create raw emotions breakdown
    raw_emotions = [
        {"label": "passive_sentences", "score": passive_count / max(total_sentences, 1)},
        {"label": "total_sentences", "score": min(total_sentences / 20, 1.0)}  # Normalize to 0-1 range
    ]
    
    # Create details with additional metrics
    details = {
        "passive_sentences": passive_count,
        "total_sentences": total_sentences,
        "passive_ratio": round(passive_ratio, 3),
        "detection_method": "NLTK + regex patterns",
        "patterns_checked": len(passive_patterns)
    }

    return create_standard_response(
        score=score,
        bucket=bucket,
        raw_emotions=raw_emotions,
        confidence=confidence,
        details=details
    )
