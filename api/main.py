"""
Vercel Serverless Function Wrapper for ToneTrace API

This file serves as a wrapper to expose the FastAPI application
from the backend directory as a Vercel serverless function.
"""

import sys
import os

# Add the project root and backend directory to the Python path
project_root = os.path.join(os.path.dirname(__file__), '..')
backend_dir = os.path.join(project_root, 'backend')

# Add both to sys.path so imports work correctly
sys.path.insert(0, project_root)
sys.path.insert(0, backend_dir)

# Change to backend directory context for relative imports
os.chdir(backend_dir)

# Import the FastAPI app from backend
from main import app

# Use Mangum to wrap FastAPI for Vercel (AWS Lambda/API Gateway compatible)
try:
    from mangum import Mangum
    handler = Mangum(app, lifespan="off")
except ImportError:
    # Fallback: try direct app export (may work for some Vercel configurations)
    handler = app

