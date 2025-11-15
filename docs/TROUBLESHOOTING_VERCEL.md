# Troubleshooting Vercel Deployment Issues

## Common Issues and Solutions

### 500 Internal Server Error on `/api/analyze`

If you're getting a 500 error on Vercel but it works locally, follow these steps:

#### 1. Check Vercel Function Logs

The most important step is to check the actual error in Vercel logs:

1. Go to your Vercel dashboard
2. Select your project
3. Click on the "Functions" tab
4. Find the deployment that's failing
5. Click on the function logs to see the actual error

The logs will show:
- Import errors
- Missing dependencies
- NLTK data issues
- Any Python exceptions

#### 2. Use the Debug Endpoint

After deploying, visit:
```
https://your-app.vercel.app/api/debug
```

This endpoint will show:
- Python version
- NLTK data paths and availability
- Analyzer import status
- System configuration

This helps identify what's missing or misconfigured.

#### 3. Common Causes

##### Missing NLTK Data
**Symptom**: Analyzers fail to import or tokenization fails

**Solution**: NLTK data is downloaded on-demand to `/tmp/nltk_data` in serverless environments. The first request may be slow as it downloads data. Subsequent requests should be faster.

If NLTK data download fails:
- Check Vercel logs for network errors
- Ensure `/tmp` directory is writable (it should be by default)
- The code has fallbacks, but some analyzers may not work without NLTK data

##### Missing Dependencies
**Symptom**: Import errors in logs

**Solution**: 
- Check that `api/requirements.txt` includes all necessary packages
- Verify the packages are compatible with Python 3.11 (as specified in `vercel.json`)
- Some packages may need to be pinned to specific versions

##### Import Path Issues
**Symptom**: "Module not found" errors

**Solution**: The `api/main.py` file sets up Python paths correctly, but if you see import errors:
- Verify the project structure matches what's expected
- Check that `backend/` directory exists and contains the necessary files
- Ensure relative imports are correct

##### Timeout Issues
**Symptom**: Request times out after 30 seconds

**Solution**: 
- The `maxDuration` is set to 30 seconds in `vercel.json`
- If analysis takes longer, consider:
  - Optimizing analyzer code
  - Using Vercel Pro for longer timeouts
  - Breaking analysis into smaller chunks

##### Memory Issues
**Symptom**: Function crashes or out-of-memory errors

**Solution**:
- NLTK and other NLP libraries can be memory-intensive
- Consider using lighter alternatives
- The code already uses "lightweight" versions of analyzers
- If issues persist, you may need Vercel Pro for more memory

#### 4. Testing Locally with Vercel CLI

You can test the serverless function locally:

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Run the function locally
vercel dev
```

This will simulate the Vercel environment and help catch issues before deployment.

#### 5. Environment Variables

Check that any required environment variables are set in Vercel:
- Go to Project Settings → Environment Variables
- Ensure all necessary variables are configured

#### 6. Python Version

The project uses Python 3.11 (specified in `vercel.json`). If you need a different version:
- Update `vercel.json` → `env.PYTHON_VERSION`
- Some packages may have compatibility issues with different Python versions

## Getting Help

If the issue persists:

1. **Check the debug endpoint** (`/api/debug`) for detailed system information
2. **Review Vercel function logs** for the actual error message
3. **Test locally** with `vercel dev` to reproduce the issue
4. **Compare local vs production** - what's different?

## Error Response Format

With the improved error handling, errors should now return JSON with:
- `detail`: Human-readable error message
- `error_type`: Type of exception
- `traceback`: Full stack trace (in development)
- `path`: The API path that failed

This makes debugging much easier than the generic "A server error occurred" message.

