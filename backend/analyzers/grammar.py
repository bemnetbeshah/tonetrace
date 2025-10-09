# analyzers/grammar.py

import spacy
from analyzers.grammar_rules import run_all_rules
from . import create_standard_response

nlp = spacy.load("en_core_web_sm")

def analyze_grammar(text: str) -> dict:
    """
    Analyzes grammar in the input text using spaCy and custom grammar rules.
    Returns a standardized response with score, bucket, raw, confidence, and details.
    """
    doc = nlp(text)
    errors = run_all_rules(doc)
    
    # Calculate grammar score (fewer errors = higher score)
    num_errors = len(errors)
    max_expected_errors = 10  # Threshold for "good" grammar
    grammar_score = max(0.0, 1.0 - (num_errors / max_expected_errors))
    
    # Determine grammar bucket
    if num_errors == 0:
        bucket = "excellent"
        score = 1.0
    elif num_errors <= 2:
        bucket = "good"
        score = 0.8
    elif num_errors <= 5:
        bucket = "fair"
        score = 0.6
    else:
        bucket = "needs_improvement"
        score = 0.3
    
    # Calculate confidence based on text length
    word_count = len([token for token in doc if token.is_alpha])
    confidence = min(1.0, word_count / 50)  # Higher confidence with more words
    
    # Create raw output with all analyzer details
    raw = {
        "num_errors": num_errors,
        "errors": errors,
        "word_count": word_count,
        "sentence_count": len(list(doc.sents))
    }
    
    # Create details with additional metrics
    details = {
        "error_types": list(set(error["type"] for error in errors)),
        "error_distribution": {
            "subject_verb_agreement": len([e for e in errors if e["type"] == "Subject-Verb Agreement"]),
            "sentence_fragments": len([e for e in errors if e["type"] == "Sentence Fragment"])
        },
        "grammar_quality": "excellent" if num_errors == 0 else "good" if num_errors <= 2 else "fair" if num_errors <= 5 else "poor"
    }
    
    return create_standard_response(
        score=score,
        bucket=bucket,
        raw=raw,
        confidence=confidence,
        details=details
    ) 