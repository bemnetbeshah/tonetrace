# Render Deployment Fix for blis Build Error

## Problem
The deployment is failing due to `blis` package compilation issues on Render. The error shows:
```
ERROR: Failed building wheel for blis
error: command '/usr/bin/gcc' failed with exit code 1
```

## Solutions

### Solution 1: Use Updated requirements.txt (Recommended)
The main `requirements.txt` has been updated to:
- Remove explicit `blis==0.7.9` version constraint
- Use spaCy 3.6.1 instead of 3.7.4 (more stable wheel support)
- Let pip find compatible pre-built wheels

### Solution 2: Use Render-Optimized Requirements
Use `requirements-render.txt` which:
- Avoids problematic packages like `blis`
- Uses alternative NLP libraries (`pattern` instead of spaCy)
- Includes only stable, pre-built wheel packages

### Solution 3: Manual Build Configuration
If you need to stick with spaCy, add these to your Render build settings:

**Build Command:**
```bash
pip install --upgrade pip setuptools wheel && pip install -r requirements.txt
```

**Environment Variables:**
```
BLIS_ARCH=generic
SPACY_USE_GPU=0
```

## Implementation Steps

### Option A: Use Updated requirements.txt
1. The main `requirements.txt` has been updated
2. Deploy normally with: `pip install -r requirements.txt`

### Option B: Use Render-Optimized Version
1. In Render settings, change build command to:
   ```bash
   pip install -r requirements-render.txt
   ```
2. Update your code to use alternative NLP libraries

### Option C: Hybrid Approach
1. Use `requirements-render.txt` for deployment
2. Keep `requirements.txt` for local development
3. Add conditional imports in your code

## Code Changes Needed (if using requirements-render.txt)

If you choose to use the render-optimized version, you'll need to update these files:

### analyzers/passive_voice.py
Replace spaCy with pattern library:
```python
# Instead of: import spacy
import pattern.en as en

# Replace spaCy processing with pattern
def detect_passive_sentences(text: str) -> dict:
    # Use pattern.en for passive voice detection
    sentences = en.sentiment(text)
    # ... rest of implementation
```

### analyzers/style_metrics.py
Replace spaCy with alternative:
```python
# Instead of: import spacy
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize

# Use NLTK for basic NLP tasks
nltk.download('punkt')
```

## Testing the Fix

1. **Local Testing:**
   ```bash
   pip install -r requirements-render.txt
   python -m pytest tests/
   ```

2. **Render Deployment:**
   - Update build command in Render settings
   - Deploy and monitor build logs
   - Check if blis error is resolved

## Fallback Options

If all else fails:

1. **Use Docker:** Create a Dockerfile with pre-built wheels
2. **Alternative Platform:** Consider Railway, Heroku, or DigitalOcean
3. **Simplified Dependencies:** Remove spaCy entirely and use lighter alternatives

## Monitoring

After deployment, monitor:
- Build success/failure
- Runtime performance
- Functionality of NLP features
- Memory usage

## Rollback Plan

If issues persist:
1. Revert to original `requirements.txt`
2. Use Docker deployment instead
3. Consider alternative NLP libraries
