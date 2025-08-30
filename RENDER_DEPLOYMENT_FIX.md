# Render Deployment Fix for blis Build Error

## Problem
The deployment is failing due to `blis` package compilation issues on Render. The error shows:
```
ERROR: Failed building wheel for blis
error: command '/usr/bin/gcc' failed with exit code 1
```

## Solutions

### Solution 1: Use spaCy-Free Alternative Implementation (RECOMMENDED)
I've created a complete alternative implementation that eliminates spaCy entirely:

**Files Created:**
- `analyzers/passive_voice_alt.py` - NLTK-based passive voice detection
- `analyzers/style_metrics_alt.py` - NLTK-based style analysis
- `routes/analyze_alt.py` - Alternative API routes
- `app/main_alt.py` - Alternative main app
- `requirements-render.txt` - No-compilation requirements

**Deployment Steps:**
1. Use `requirements-render.txt` in Render build command
2. Update start command to: `uvicorn app.main_alt:app --host 0.0.0.0 --port $PORT`
3. This completely avoids the blis compilation issue

### Solution 2: Use Updated requirements.txt
The main `requirements.txt` has been updated to:
- Remove explicit `blis==0.7.9` version constraint
- Use spaCy 3.6.1 instead of 3.7.4 (more stable wheel support)
- Let pip find compatible pre-built wheels

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

### Option A: Use spaCy-Free Alternative (BEST FOR RENDER)
1. **Build Command:** `pip install -r requirements-render.txt`
2. **Start Command:** `uvicorn app.main_alt:app --host 0.0.0.0 --port $PORT`
3. **Benefits:** No compilation issues, faster deployment, lighter weight

### Option B: Use Updated requirements.txt
1. The main `requirements.txt` has been updated
2. Deploy normally with: `pip install -r requirements.txt`

### Option C: Use Render-Optimized Version
1. In Render settings, change build command to:
   ```bash
   pip install -r requirements-render.txt
   ```
2. Update your code to use alternative NLP libraries

## Code Changes Needed

### For spaCy-Free Implementation
The alternative implementation is ready to use. Just change your Render start command to:
```bash
uvicorn app.main_alt:app --host 0.0.0.0 --port $PORT
```

### For requirements-render.txt Only
If you choose to use the render-optimized version with existing code, you'll need to update these files:

#### analyzers/passive_voice.py
Replace spaCy with NLTK:
```python
# Instead of: import spacy
import nltk
from nltk.tokenize import sent_tokenize

# Use NLTK for sentence tokenization
nltk.download('punkt')
sentences = nltk.sent_tokenize(text)
```

#### analyzers/style_metrics.py
Replace spaCy with NLTK:
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
   python test_deployment.py
   ```

2. **Test Alternative Implementation:**
   ```bash
   pip install -r requirements-render.txt
   python -m uvicorn app.main_alt:app --reload
   ```

3. **Render Deployment:**
   - Update build command in Render settings
   - Deploy and monitor build logs
   - Check if blis error is resolved

## Fallback Options

If all else fails:

1. **Use spaCy-Free Alternative:** Switch to `main_alt.py` and `requirements-render.txt`
2. **Use Docker:** Create a Dockerfile with pre-built wheels
3. **Alternative Platform:** Consider Railway, Heroku, or DigitalOcean
4. **Simplified Dependencies:** Remove spaCy entirely and use lighter alternatives

## Monitoring

After deployment, monitor:
- Build success/failure
- Runtime performance
- Functionality of NLP features
- Memory usage

## Rollback Plan

If issues persist:
1. Use the spaCy-free alternative implementation
2. Revert to original `requirements.txt`
3. Use Docker deployment instead
4. Consider alternative NLP libraries

## Quick Fix Summary

**For immediate deployment success:**
1. Use `requirements-render.txt` in build command
2. Use `uvicorn app.main_alt:app --host 0.0.0.0 --port $PORT` in start command
3. This eliminates all compilation issues and provides a working API
