"""
Vercel Serverless Function Wrapper for ToneTrace API

This file serves as a wrapper to expose the FastAPI application
from the backend directory as a Vercel serverless function.
"""

import sys
import os
import traceback

# Suppress NLTK download messages and handle errors gracefully
os.environ['NLTK_DATA'] = '/tmp/nltk_data' if os.path.exists('/tmp') else os.path.expanduser('~/nltk_data')

# Add the project root and backend directory to the Python path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
backend_dir = os.path.join(project_root, 'backend')

# Add both to sys.path so imports work correctly
if project_root not in sys.path:
    sys.path.insert(0, project_root)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Change to backend directory context for relative imports
try:
    os.chdir(backend_dir)
except Exception:
    pass  # If chdir fails, continue anyway

# Wrap all imports in try-except to prevent crashes
handler = None
init_error = None

try:
    # Import the FastAPI app from backend
    # Wrap in try-except to catch any import errors
    try:
        from main import app
    except Exception as import_error:
        # If import fails, create a minimal app
        import sys
        error_trace = traceback.format_exc()
        print(f"Failed to import backend/main.py: {import_error}", file=sys.stderr)
        print(error_trace, file=sys.stderr)
        sys.stderr.flush()
        
        # Create minimal FastAPI app
        from fastapi import FastAPI
        error_app = FastAPI()
        
        @error_app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
        async def import_error_handler(request):
            from fastapi.responses import JSONResponse
            return JSONResponse(
                status_code=500,
                content={"detail": f"Backend import failed: {str(import_error)}\n{error_trace}"}
            )
        app = error_app
    
    # Use Mangum to wrap FastAPI for Vercel (AWS Lambda/API Gateway compatible)
    try:
        from mangum import Mangum
        handler = Mangum(app, lifespan="off")
    except ImportError:
        # If Mangum is not available, use the app directly
        handler = app
        
except Exception as e:
    # Store the error for debugging
    init_error = f"Initialization error: {str(e)}\n{traceback.format_exc()}"
    
    # Write error to stderr so it appears in Vercel logs
    print(init_error, file=sys.stderr)
    sys.stderr.flush()
    
    # Create a minimal error handler that will work even if FastAPI import fails
    try:
        from fastapi import FastAPI, Request
        from fastapi.responses import JSONResponse
        
        error_app = FastAPI()
        
        @error_app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
        async def error_handler(request: Request, path: str = ""):
            return JSONResponse(
                status_code=500,
                content={"detail": init_error}
            )
        
        try:
            from mangum import Mangum
            handler = Mangum(error_app, lifespan="off")
        except ImportError:
            handler = error_app
    except Exception as e2:
        # If even FastAPI import fails, create a minimal handler
        def minimal_handler(event, context=None):
            return {
                "statusCode": 500,
                "headers": {"Content-Type": "application/json"},
                "body": f'{{"detail": "{init_error}"}}'
            }
        handler = minimal_handler

# Ensure handler is defined
if handler is None:
    def fallback_handler(event, context=None):
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": '{"detail": "Handler initialization failed"}'
        }
    handler = fallback_handler

