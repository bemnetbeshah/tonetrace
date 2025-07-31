# Analyzer Function Tests

This directory contains comprehensive pytest tests for all analyzer functions in the tonetrace project.

## Test Files

The following test files are available:

- `test_passive_voice.py` - Tests for passive voice detection
- `test_sentiment.py` - Tests for sentiment analysis
- `test_hedging.py` - Tests for hedging phrase detection
- `test_lexical.py` - Tests for lexical diversity analysis
- `test_style_metrics.py` - Tests for formality and complexity analysis
- `test_tone_comprehensive.py` - Tests for tone classification and emotion mapping
- `test_standard_response.py` - Tests for the standardized response creation function

## Running Tests

### Prerequisites

Make sure you have the required dependencies installed:

```bash
pip install pytest spacy textblob transformers textstat
python -m spacy download en_core_web_sm
```

### Running All Tests

To run all tests:

```bash
cd tests/test_functions
python run_all_tests.py
```

### Running Individual Tests

To run a specific test file:

```bash
cd tests/test_functions
python run_all_tests.py run passive_voice
python run_all_tests.py run sentiment
python run_all_tests.py run hedging
python run_all_tests.py run lexical
python run_all_tests.py run style_metrics
python run_all_tests.py run tone_comprehensive
python run_all_tests.py run standard_response
```

### Using pytest directly

You can also run tests directly with pytest:

```bash
cd tests/test_functions
pytest test_passive_voice.py -v
pytest test_sentiment.py -v
pytest test_hedging.py -v
pytest test_lexical.py -v
pytest test_style_metrics.py -v
pytest test_tone_comprehensive.py -v
pytest test_standard_response.py -v
```

### Listing Available Tests

To see all available test files:

```bash
cd tests/test_functions
python run_all_tests.py list
```

## Test Coverage

Each test file includes comprehensive test cases covering:

### Passive Voice Tests (`test_passive_voice.py`)
- No passive voice detection
- Single passive sentence detection
- Multiple passive sentences
- Mixed active and passive sentences
- Empty text handling
- Complex passive constructions
- Modal verb passives
- Response structure validation
- Confidence calculation

### Sentiment Tests (`test_sentiment.py`)
- Positive sentiment detection
- Negative sentiment detection
- Neutral sentiment detection
- Mixed sentiment handling
- Subjectivity analysis
- Edge cases with punctuation and symbols
- Response structure validation
- Confidence calculation

### Hedging Tests (`test_hedging.py`)
- No hedging detection
- Single hedging phrase detection
- Multiple hedging phrases
- Various hedging word types (modals, opinions, etc.)
- Hedging density calculation
- Bucket classification
- Case insensitive detection
- Word boundary detection
- Hedging style classification

### Lexical Diversity Tests (`test_lexical.py`)
- High diversity text
- Moderate diversity text
- Low diversity (repetitive) text
- Punctuation handling
- Case insensitive processing
- Repetition ratio calculation
- Vocabulary richness classification
- Edge cases with numbers and symbols

### Style Metrics Tests (`test_style_metrics.py`)
- Word counting
- Average sentence length calculation
- Formality analysis (informal, neutral, formal)
- Complexity analysis (simple, moderate, complex)
- Readability metrics
- Lexical density calculation
- Education level classification
- Edge cases with punctuation and symbols

### Tone Classification Tests (`test_tone_comprehensive.py`)
- Emotion to tone mapping
- Various tone classifications (positive, angry, confident, etc.)
- Threshold parameter testing
- Score difference parameter testing
- Secondary tone detection
- Response structure validation
- Confidence calculation
- Edge cases and mixed emotions

### Standard Response Tests (`test_standard_response.py`)
- Basic response creation
- Full response with all parameters
- Score and confidence rounding
- Default value handling
- Data type validation
- Edge cases (zero, negative, high scores)
- Complex data structures
- Unicode character handling

## Test Structure

Each test file follows a consistent structure:

1. **Setup**: Import necessary modules and add project root to sys.path
2. **Test Classes**: Organized by functionality with descriptive class names
3. **Test Methods**: Individual test cases with clear, descriptive names
4. **Assertions**: Comprehensive validation of function outputs
5. **Edge Cases**: Testing boundary conditions and error cases
6. **Response Validation**: Ensuring standardized response format

## Expected Test Results

When running the tests, you should see output similar to:

```
Found 7 test files:
  - test_passive_voice.py
  - test_sentiment.py
  - test_hedging.py
  - test_lexical.py
  - test_style_metrics.py
  - test_tone_comprehensive.py
  - test_standard_response.py

Running tests in test_passive_voice.py...
Running tests in test_sentiment.py...
...

============================================================
TEST SUMMARY
============================================================
test_passive_voice.py              PASSED
test_sentiment.py                  PASSED
test_hedging.py                    PASSED
test_lexical.py                    PASSED
test_style_metrics.py              PASSED
test_tone_comprehensive.py         PASSED
test_standard_response.py          PASSED
------------------------------------------------------------
Total test files: 7
Passed: 7
Failed: 0
Success rate: 100.0%
```

## Troubleshooting

### Import Errors
If you encounter import errors, make sure:
1. You're running tests from the `tests/test_functions` directory
2. All required dependencies are installed
3. The spaCy English model is downloaded: `python -m spacy download en_core_web_sm`

### Model Loading Issues
Some tests require external models (spaCy, transformers). If these fail:
1. Check your internet connection
2. Ensure you have sufficient disk space for model downloads
3. Try running individual tests to isolate issues

### Performance
The tone classification tests use a transformer model and may take longer to run. This is normal behavior.

## Contributing

When adding new analyzer functions, please:
1. Create corresponding test files following the existing pattern
2. Include comprehensive test cases covering normal usage, edge cases, and error conditions
3. Validate the standardized response format
4. Update this README with information about new tests 