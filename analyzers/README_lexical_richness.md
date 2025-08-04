# Lexical Richness Analyzer

The Lexical Richness Analyzer measures vocabulary sophistication using word frequency scores (Zipf scale) to estimate how advanced or sophisticated a student's vocabulary is.

## Overview

This analyzer complements the existing lexical diversity analyzer by focusing on the **quality** of vocabulary rather than just diversity. It uses the `wordfreq` library to get Zipf frequency scores for each word, where lower scores indicate more sophisticated/rare vocabulary.

## Metrics

| Metric | Description | What It Tells You |
|--------|-------------|-------------------|
| `avg_zipf_score` | Average word frequency score | Lower = more sophisticated vocabulary |
| `percent_rare_words` | % of words below Zipf 4.5 | Higher = more advanced vocabulary |
| `num_advanced_words` | Count of rare words used | Raw count of sophisticated words |
| `total_tokens` | Vocabulary sample size | Confidence indicator |

## Classification Buckets

- **Sophisticated** (score: 0.9): Very low average Zipf (< 4.0) with >30% rare words
- **Advanced** (score: 0.7): Low average Zipf (< 5.0) with >15% rare words  
- **Moderate** (score: 0.5): Medium average Zipf (< 6.0) with >5% rare words
- **Basic** (score: 0.3): High average Zipf (≥ 6.0) or <5% rare words

## Usage

### Direct Function Call

```python
from analyzers.lexical_richness import analyze_lexical_richness

text = "The sophisticated lexicon demonstrates exceptional erudition."
result = analyze_lexical_richness(text)

print(f"Classification: {result['bucket']}")
print(f"Score: {result['score']}")
print(f"Average Zipf: {result['details']['avg_zipf_score']}")
print(f"Rare Words: {result['details']['percent_rare_words']:.1%}")
```

### API Endpoint

```bash
POST /analyze/lexical-richness
Content-Type: application/json

{
    "text": "Your text to analyze here"
}
```

## Example Output

```json
{
    "score": 0.9,
    "bucket": "sophisticated",
    "raw_emotions": [
        {"label": "avg_zipf_score", "score": 0.525},
        {"label": "percent_rare_words", "score": 0.875},
        {"label": "num_advanced_words", "score": 0.14}
    ],
    "confidence": 0.267,
    "details": {
        "avg_zipf_score": 3.8,
        "percent_rare_words": 0.875,
        "num_advanced_words": 7,
        "total_tokens": 8,
        "rare_threshold": 4.5,
        "vocabulary_sophistication": {
            "very_rare_words": 1,
            "rare_words": 6,
            "common_words": 1,
            "very_common_words": 0
        },
        "zipf_distribution": {
            "min_score": 2.39,
            "max_score": 4.71,
            "median_score": 4.05
        }
    }
}
```

## Zipf Score Interpretation

- **< 3.0**: Very rare words (academic, specialized vocabulary)
- **3.0 - 4.5**: Rare words (advanced vocabulary)
- **4.5 - 6.0**: Common words (everyday vocabulary)
- **> 6.0**: Very common words (basic vocabulary)

## Dependencies

- `spacy` - For tokenization and stop word removal
- `wordfreq` - For Zipf frequency scores
- `en_core_web_sm` - English language model for SpaCy

## Testing

Run the tests with:

```bash
python -m pytest tests/test_lexical_richness.py -v
```

## Demo

See `examples/lexical_richness_demo.py` for a comprehensive demonstration of the analyzer with different text types. 