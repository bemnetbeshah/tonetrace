"""
Lightweight passive voice detector without spaCy dependency.
Uses NLTK for basic part-of-speech tagging.
"""

import nltk
import re
from . import create_standard_response

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

try:
    nltk.data.find('taggers/averaged_perceptron_tagger')
except LookupError:
    nltk.download('averaged_perceptron_tagger', quiet=True)

from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.tag import pos_tag

def detect_passive_sentences(text: str) -> dict:
    """
    Detects passive voice sentences using NLTK instead of spaCy.
    Returns a standardized response with score, bucket, raw, confidence, and details.
    """
    sentences = sent_tokenize(text)
    passive_sentences = []
    passive_count = 0
    
    for sentence in sentences:
        if is_passive_sentence(sentence):
            passive_sentences.append(sentence.strip())
            passive_count += 1
    
    total_sentences = len(sentences)
    passive_ratio = passive_count / total_sentences if total_sentences > 0 else 0
    
    # Determine bucket based on passive voice ratio
    if passive_ratio > 0.3:
        bucket = "high_passive"
        score = 0.9
    elif passive_ratio > 0.15:
        bucket = "moderate_passive"
        score = 0.6
    elif passive_ratio > 0.05:
        bucket = "low_passive"
        score = 0.3
    else:
        bucket = "minimal_passive"
        score = 0.1
    
    # Calculate confidence based on text length
    confidence = min(1.0, total_sentences / 10)  # Higher confidence with more sentences
    
    # Create raw output
    raw = {
        "passive_sentences": passive_sentences,
        "passive_count": passive_count,
        "total_sentences": total_sentences,
        "passive_ratio": passive_ratio
    }
    
    # Create details
    details = {
        "passive_voice_analysis": {
            "total_sentences": total_sentences,
            "passive_sentences": passive_count,
            "passive_ratio": round(passive_ratio, 3),
            "passive_sentences_list": passive_sentences
        },
        "writing_style": {
            "passive_voice_level": bucket,
            "recommendation": "Consider using more active voice" if passive_ratio > 0.2 else "Good balance of active and passive voice"
        }
    }
    
    return create_standard_response(
        score=passive_ratio,
        bucket=bucket,
        raw=raw,
        confidence=confidence,
        details=details
    )

def is_passive_sentence(sentence: str) -> bool:
    """
    Determines if a sentence is in passive voice using NLTK.
    """
    # Tokenize and tag the sentence
    words = word_tokenize(sentence.lower())
    pos_tags = pos_tag(words)
    
    # Look for passive voice patterns
    # Pattern 1: "be" + past participle
    for i, (word, pos) in enumerate(pos_tags):
        if word in ['is', 'are', 'was', 'were', 'be', 'been', 'being']:
            # Check if next word is a past participle (VBN)
            if i + 1 < len(pos_tags):
                next_word, next_pos = pos_tags[i + 1]
                if next_pos == 'VBN':  # Past participle
                    return True
    
    # Pattern 2: "get" + past participle (less common but still passive)
    for i, (word, pos) in enumerate(pos_tags):
        if word == 'get' and pos == 'VB':
            if i + 1 < len(pos_tags):
                next_word, next_pos = pos_tags[i + 1]
                if next_pos == 'VBN':  # Past participle
                    return True
    
    # Pattern 3: Look for "by" + noun phrase (passive agent)
    for i, (word, pos) in enumerate(pos_tags):
        if word == 'by' and pos == 'IN':
            # Check if there's a verb before "by"
            for j in range(i):
                if pos_tags[j][1] in ['VBN', 'VBD']:  # Past participle or past tense
                    return True
    
    return False
