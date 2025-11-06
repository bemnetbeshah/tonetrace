"""
Vercel Serverless Function Wrapper for ToneTrace API

This file serves as a wrapper to expose the FastAPI application
from the backend directory as a Vercel serverless function.
"""

import sys
import os
import traceback
import json

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

try:
    # Import the FastAPI app from backend
    from main import app
    
    # Use Mangum to wrap FastAPI for Vercel (AWS Lambda/API Gateway compatible)
    try:
        from mangum import Mangum
        handler = Mangum(app, lifespan="off")
    except ImportError:
        # If Mangum is not available, use the app directly
        # Vercel should handle ASGI apps natively
        handler = app
        
except Exception as e:
    # If there's an import error, log it and create a simple error handler
    error_msg = f"Initialization error: {str(e)}\n{traceback.format_exc()}"
    print(error_msg, file=sys.stderr)
    
    # Create a simple FastAPI app that returns the error
    from fastapi import FastAPI, Request
    from fastapi.responses import JSONResponse
    
    error_app = FastAPI()
    
    @error_app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
    async def error_handler(request: Request, path: str = ""):
        return JSONResponse(
            status_code=500,
            content={"detail": error_msg}
        )
    
    try:
        from mangum import Mangum
        handler = Mangum(error_app, lifespan="off")
    except ImportError:
        handler = error_app

