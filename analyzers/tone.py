from transformers import pipeline
from constants import EMOTION_TO_TONE  # Import the centralized mapping
from . import create_standard_response

emotion_classifier = pipeline("text-classification", model="SamLowe/roberta-base-go_emotions", top_k=None)

def map_emotion_to_tone(label: str) -> str:
    """
    Maps a fine-grained emotion label to a broader tone category using the EMOTION_TO_TONE mapping.
    """
    return EMOTION_TO_TONE.get(label, "neutral")  # Use the constant for mapping

def classify_tone_model(text: str, threshold: float = 0.4, score_diff: float = 0.05) -> dict:
    """
    Classifies the tone of the given text based on emotion scores.
    Returns a standardized response with score, bucket, raw_emotions, confidence, and details.
    """
    raw_scores = emotion_classifier(text)[0]
    emotions = [
        {"label": e["label"], "score": round(e["score"], 3)}
        for e in raw_scores if e["score"] >= threshold
    ]

    # Sort emotions by score in descending order
    sorted_emotions = sorted(emotions, key=lambda x: x["score"], reverse=True)

    # Get the top emotion
    top_emotion = sorted_emotions[0]
    top_label = top_emotion["label"]
    mapped_tone = map_emotion_to_tone(top_label)
    
    # Calculate confidence based on top emotion score
    confidence = top_emotion["score"]
    
    # Determine if there's a close second emotion
    has_secondary_tone = False
    secondary_tone = None
    if len(sorted_emotions) > 1:
        second_emotion = sorted_emotions[1]
        if abs(top_emotion["score"] - second_emotion["score"]) <= score_diff:
            has_secondary_tone = True
            secondary_tone = map_emotion_to_tone(second_emotion["label"])
    
    # Create final bucket
    if has_secondary_tone:
        bucket = f"{mapped_tone} / {secondary_tone}"
    else:
        bucket = mapped_tone
    
    # Create details with additional information
    details = {
        "top_emotion": top_label,
        "top_emotion_score": top_emotion["score"],
        "has_secondary_tone": has_secondary_tone,
        "secondary_tone": secondary_tone,
        "threshold": threshold,
        "score_diff_threshold": score_diff
    }
    
    return create_standard_response(
        score=top_emotion["score"],
        bucket=bucket,
        raw_emotions=emotions,
        confidence=confidence,
        details=details
    )

