import sys
import os
import csv

# Add the project root to sys.path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from analyzers.tone import classify_tone_model

# Path to the updated CSV file
csv_path = os.path.join(os.path.dirname(__file__), "Tone_Classifier_Test_Inputs.csv")

# Read the CSV file
with open(csv_path, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    samples = list(reader)

# Iterate through the samples and test the tone classification
for idx, sample in enumerate(samples, 1):
    text = sample.get("text")
    expected_tone = sample.get("expected_tone")
    
    # Skip rows with missing or empty text
    if not text or not text.strip():
        print(f"Sample {idx} skipped: No text provided.")
        continue

    try:
        # Call the tone classification function
        result = classify_tone_model(text)
        print(f"Sample {idx}:")
        print(f"  Text: {text}")
        print(f"  Expected tone: {expected_tone}")
        print(f"  Detected tone: {result.get('tone')}")
        print(f"  Emotions: {result.get('emotions')}\n")
        
        # Assert that the detected tone matches the expected tone
        assert result.get('tone') == expected_tone, f"Tone mismatch: expected {expected_tone}, got {result.get('tone')}"
    except Exception as e:
        print(f"Sample {idx} classification failed:", str(e))