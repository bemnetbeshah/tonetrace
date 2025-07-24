from transformers import pipeline
from constants import EMOTION_TO_TONE  # Import the centralized mapping

emotion_classifier = pipeline("text-classification", model="SamLowe/roberta-base-go_emotions", return_all_scores=True)

def map_emotion_to_tone(label: str) -> str:
    """
    Maps a fine-grained emotion label to a broader tone category using the EMOTION_TO_TONE mapping.
    """
    return EMOTION_TO_TONE.get(label, "neutral")  # Use the constant for mapping

def classify_tone_model(text: str, threshold: float = 0.4, score_diff: float = 0.05) -> dict:
    """
    Classifies the tone of the given text based on emotion scores.
    Includes support for the top two emotions if their scores are close.
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

    # Check if the second emotion is close in score to the top emotion
    if len(sorted_emotions) > 1:
        second_emotion = sorted_emotions[1]
        if abs(top_emotion["score"] - second_emotion["score"]) <= score_diff:
            second_label = second_emotion["label"]
            second_tone = map_emotion_to_tone(second_label)
            return {
                "tone": f"{mapped_tone} / {second_tone}",
                "emotions": emotions
            }

    # Return only the top tone if no close second emotion
    return {
        "tone": mapped_tone,
        "emotions": emotions
    }

