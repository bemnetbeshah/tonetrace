# analyzers/passive_voice.py

import spacy
from . import create_standard_response

nlp = spacy.load("en_core_web_sm")

def detect_passive_sentences(text: str) -> dict:
    """
    Detects passive voice sentences in the input text.
    Uses spaCy to parse the text and checks each sentence for passive constructions.
    Returns a standardized response with score, bucket, raw_emotions, confidence, and details.
    """
    doc = nlp(text)  # Process the text with spaCy
    passive_count = 0  # Counter for passive sentences
    total_sentences = 0  # Counter for total sentences

    for sent in doc.sents:
        total_sentences += 1
        # Check each token in the sentence for passive voice indicators
        for token in sent:
            # 'auxpass' is a passive auxiliary verb; 'VBN' is a past participle
            if (token.dep_ == "auxpass") or (
                token.tag_ == "VBN" and token.head.dep_ == "auxpass"
            ):
                passive_count += 1
                break  # Only count one passive detection per sentence

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
        "passive_sentence_ratio": round(passive_ratio, 3),
        "passive_count": passive_count,
        "total_sentences": total_sentences,
        "active_sentences": total_sentences - passive_count,
        "passive_style": "formal" if passive_ratio > 0.3 else "balanced" if passive_ratio > 0.1 else "active"
    }

    return create_standard_response(
        score=score,
        bucket=bucket,
        raw_emotions=raw_emotions,
        confidence=confidence,
        details=details
    )
