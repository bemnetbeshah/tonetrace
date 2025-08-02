# ToneTrace

A comprehensive writing style analysis tool that provides detailed insights into text characteristics including tone, sentiment, formality, complexity, and more.

## Features

### Core Analysis
- **Tone Classification**: Advanced emotion-based tone detection using transformer models
- **Sentiment Analysis**: Polarity and subjectivity analysis using TextBlob
- **Formality Assessment**: Multiple readability metrics (Flesch-Kincaid, Gunning Fog, Dale-Chall)
- **Complexity Metrics**: Lexical density and sentence length analysis
- **Passive Voice Detection**: Identifies passive sentence constructions
- **Lexical Diversity**: Measures vocabulary richness and variety

### 🆕 Anomaly Detection
- **Style Deviation Detection**: Compares current writing style against baseline profiles
- **Multi-Metric Analysis**: Monitors changes in:
  - Sentence length (±15% threshold)
  - Lexical density (±15% threshold)
  - Formality score (±10% threshold)
  - Tone distribution (cosine similarity < 0.85)
  - Lexical diversity (±15% threshold)
  - Sentiment polarity (±20% threshold)
- **Detailed Reporting**: Provides specific reasons for detected anomalies
- **Profile Management**: Automatic baseline creation and profile updates

## API Endpoints

### POST /analyze
Analyzes text and returns comprehensive style metrics with anomaly detection.

**Request:**
```json
{
  "text": "Your text to analyze",
  "user_id": "optional_user_id"
}
```

**Response:**
```json
{
  "formality": {
    "score": 0.8,
    "bucket": "formal",
    "confidence": 0.85,
    "details": {
      "flesch_kincaid_grade": 12.5,
      "gunning_fog_index": 14.2,
      "dale_chall_score": 8.1
    }
  },
  "complexity": {
    "score": 0.7,
    "bucket": "moderate",
    "confidence": 0.9,
    "details": {
      "average_sentence_length": 18.5,
      "lexical_density": 0.65
    }
  },
  "tone": {
    "score": 0.85,
    "bucket": "neutral",
    "confidence": 0.82,
    "raw_emotions": [...]
  },
  "sentiment": {
    "score": 0.2,
    "bucket": "positive",
    "confidence": 0.75
  },
  "passive_voice": {
    "score": 0.15,
    "bucket": "low",
    "confidence": 0.8
  },
  "lexical_diversity": {
    "score": 0.75,
    "bucket": "high",
    "confidence": 0.9
  },
  "anomaly": true,
  "anomaly_reasons": [
    "Formality deviation: 25.0%",
    "Tone distribution shift: similarity 0.72"
  ],
  "anomaly_details": {
    "formality_diff": 0.25,
    "tone_similarity": 0.72,
    "sentence_length_diff": 0.12
  }
}
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tonetrace
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Download required models:
```bash
python -m spacy download en_core_web_sm
```

## Usage

### Running the API Server
```bash
uvicorn main:app --reload
```

### Using the Anomaly Detection Feature

The anomaly detection automatically works with the `/analyze` endpoint. It:

1. **Creates/Retrieves Baseline**: Automatically creates a baseline profile for new users or retrieves existing ones
2. **Analyzes Current Text**: Performs comprehensive style analysis on the input text
3. **Compares Styles**: Compares current analysis against the baseline profile
4. **Detects Deviations**: Identifies significant changes in writing style
5. **Updates Profile**: Saves the new analysis to update the user's style profile

### Example Usage

```python
import requests

# First analysis (creates baseline)
response1 = requests.post("http://localhost:8000/analyze", json={
    "text": "This is a formal academic text with complex sentence structures.",
    "user_id": "user123"
})

# Second analysis (compares against baseline)
response2 = requests.post("http://localhost:8000/analyze", json={
    "text": "Hey! This is super casual and informal writing, ya know?",
    "user_id": "user123"
})

# Check for anomalies
result = response2.json()
if result["anomaly"]:
    print("Style deviation detected!")
    for reason in result["anomaly_reasons"]:
        print(f"- {reason}")
```

## Testing

Run the test suite:
```bash
python -m pytest tests/
```

Run anomaly detection tests specifically:
```bash
python -m pytest tests/test_anomaly.py -v
```

## Architecture

### Core Components

- **Analyzers**: Individual analysis modules for different text characteristics
- **Style Profiles**: Data structures that track user writing patterns over time
- **Anomaly Detection**: Comparison engine that identifies style deviations
- **Database Layer**: Profile storage and retrieval (currently in-memory, planned Firestore integration)

### Anomaly Detection Algorithm

The anomaly detection system uses multiple thresholds to identify style changes:

1. **Percentage-based comparisons** for numerical metrics
2. **Cosine similarity** for tone distribution analysis
3. **Configurable thresholds** for different sensitivity levels
4. **Comprehensive reporting** with specific deviation reasons

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

[Add your license information here]
