"""
Lightweight grammar analyzer without spaCy dependency.
Uses NLTK and regex for basic grammar pattern detection.
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

def analyze_grammar(text: str) -> dict:
    """
    Analyzes grammar patterns using NLTK instead of spaCy.
    Returns a standardized response with score, bucket, raw, confidence, and details.
    """
    sentences = sent_tokenize(text)
    total_sentences = len(sentences)
    
    grammar_issues = []
    issue_count = 0
    
    for sentence in sentences:
        issues = detect_grammar_issues(sentence)
        if issues:
            grammar_issues.extend(issues)
            issue_count += len(issues)
    
    # Calculate grammar score (lower is better)
    grammar_score = max(0, 1 - (issue_count / max(total_sentences, 1)))
    
    # Determine bucket based on grammar score
    if grammar_score >= 0.9:
        bucket = "excellent"
    elif grammar_score >= 0.7:
        bucket = "good"
    elif grammar_score >= 0.5:
        bucket = "fair"
    else:
        bucket = "needs_improvement"
    
    # Calculate confidence based on text length
    confidence = min(1.0, total_sentences / 5)  # Higher confidence with more sentences
    
    # Create raw output
    raw = {
        "grammar_issues": grammar_issues,
        "issue_count": issue_count,
        "total_sentences": total_sentences,
        "grammar_score": grammar_score
    }
    
    # Create details
    details = {
        "grammar_analysis": {
            "total_sentences": total_sentences,
            "issues_found": issue_count,
            "grammar_score": round(grammar_score, 3),
            "issues_by_type": categorize_issues(grammar_issues)
        },
        "writing_quality": {
            "grammar_level": bucket,
            "recommendation": get_grammar_recommendation(grammar_score)
        }
    }
    
    return create_standard_response(
        score=grammar_score,
        bucket=bucket,
        raw=raw,
        confidence=confidence,
        details=details
    )

def detect_grammar_issues(sentence: str) -> list:
    """
    Detects common grammar issues in a sentence.
    """
    issues = []
    
    # Check for common issues
    if detect_double_negatives(sentence):
        issues.append({"type": "double_negative", "sentence": sentence.strip()})
    
    if detect_subject_verb_disagreement(sentence):
        issues.append({"type": "subject_verb_disagreement", "sentence": sentence.strip()})
    
    if detect_run_on_sentence(sentence):
        issues.append({"type": "run_on_sentence", "sentence": sentence.strip()})
    
    if detect_fragment(sentence):
        issues.append({"type": "sentence_fragment", "sentence": sentence.strip()})
    
    return issues

def detect_double_negatives(sentence: str) -> bool:
    """
    Detects double negatives in a sentence.
    """
    negative_words = ['not', 'no', 'never', 'none', 'nothing', 'nowhere', 'nobody', 'neither', 'nor']
    words = word_tokenize(sentence.lower())
    
    negative_count = sum(1 for word in words if word in negative_words)
    return negative_count > 1

def detect_subject_verb_disagreement(sentence: str) -> bool:
    """
    Detects basic subject-verb disagreement.
    """
    words = word_tokenize(sentence.lower())
    pos_tags = pos_tag(words)
    
    # Look for simple patterns like "they is" or "he are"
    for i, (word, pos) in enumerate(pos_tags):
        if word in ['they', 'we', 'you'] and i + 1 < len(pos_tags):
            next_word, next_pos = pos_tags[i + 1]
            if next_word == 'is':
                return True
        elif word in ['he', 'she', 'it'] and i + 1 < len(pos_tags):
            next_word, next_pos = pos_tags[i + 1]
            if next_word in ['are', 'were']:
                return True
    
    return False

def detect_run_on_sentence(sentence: str) -> bool:
    """
    Detects potential run-on sentences.
    """
    # Count coordinating conjunctions
    conjunctions = ['and', 'but', 'or', 'so', 'yet', 'for', 'nor']
    words = word_tokenize(sentence.lower())
    
    conjunction_count = sum(1 for word in words if word in conjunctions)
    
    # If there are more than 2 conjunctions in a sentence, it might be a run-on
    return conjunction_count > 2

def detect_fragment(sentence: str) -> bool:
    """
    Detects sentence fragments.
    """
    words = word_tokenize(sentence)
    pos_tags = pos_tag(words)
    
    # Check if sentence has a verb
    has_verb = any(pos in ['VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ'] for word, pos in pos_tags)
    
    # Check if sentence is too short to be complete
    is_too_short = len(words) < 3
    
    return is_too_short or not has_verb

def categorize_issues(issues: list) -> dict:
    """
    Categorizes grammar issues by type.
    """
    categories = {}
    for issue in issues:
        issue_type = issue['type']
        if issue_type not in categories:
            categories[issue_type] = 0
        categories[issue_type] += 1
    return categories

def get_grammar_recommendation(score: float) -> str:
    """
    Provides grammar improvement recommendations based on score.
    """
    if score >= 0.9:
        return "Excellent grammar! Keep up the good work."
    elif score >= 0.7:
        return "Good grammar overall. Minor improvements possible."
    elif score >= 0.5:
        return "Fair grammar. Consider reviewing sentence structure and agreement."
    else:
        return "Grammar needs improvement. Focus on basic sentence structure and agreement."
