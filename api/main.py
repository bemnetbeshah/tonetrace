"""
Vercel Serverless Function Wrapper for ToneTrace API

This file serves as a wrapper to expose the FastAPI application
from the backend directory as a Vercel serverless function.
"""

# Import basic modules first
import sys
import os
import traceback

# Set up NLTK data path BEFORE any imports that might use NLTK
# This is critical for serverless environments
try:
    if os.path.exists('/tmp'):
        nltk_data_dir = '/tmp/nltk_data'
        os.makedirs(nltk_data_dir, exist_ok=True)
        os.environ['NLTK_DATA'] = nltk_data_dir
    else:
        os.environ['NLTK_DATA'] = os.path.expanduser('~/nltk_data')
except Exception as e:
    # Log but continue - fallbacks will handle missing NLTK data
    print(f"Warning: Could not set NLTK_DATA path: {e}", file=sys.stderr)

# Wrap everything in try-except to prevent any crashes
handler = None
init_error = None

try:
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
    
    # Import the FastAPI app from backend
    # Wrap in try-except to catch any import errors
    try:
        from main import app
        
        # Add a debug endpoint to help troubleshoot
        # Define it after app is imported to avoid import-time issues
        try:
            @app.get("/api/debug")
            async def debug_endpoint():
                """Debug endpoint to check system status"""
                try:
                    import nltk
                except ImportError:
                    nltk = None
                
                debug_info = {
                    "status": "ok",
                    "python_version": sys.version,
                    "nltk_data_path": os.environ.get('NLTK_DATA', 'not set'),
                    "sys_path": sys.path[:5],  # First 5 entries
                    "cwd": os.getcwd(),
                    "tmp_exists": os.path.exists('/tmp'),
                }
                
                # Check NLTK resources if NLTK is available
                if nltk:
                    debug_info["nltk_data_dirs"] = nltk.data.path
                    nltk_resources = {}
                    for resource in ['punkt', 'stopwords', 'averaged_perceptron_tagger']:
                        try:
                            if resource == 'punkt':
                                nltk.data.find('tokenizers/punkt')
                            elif resource == 'stopwords':
                                nltk.data.find('corpora/stopwords')
                            elif resource == 'averaged_perceptron_tagger':
                                nltk.data.find('taggers/averaged_perceptron_tagger')
                            nltk_resources[resource] = "available"
                        except LookupError:
                            nltk_resources[resource] = "not found"
                        except Exception as e:
                            nltk_resources[resource] = f"error: {str(e)}"
                    debug_info["nltk_resources"] = nltk_resources
                else:
                    debug_info["nltk"] = "not available"
                
                # Check if analyzers can be imported
                analyzer_status = {}
                try:
                    from routes.analyze_lightweight import _get_analyzers
                    analyzers = _get_analyzers()
                    import_errors = analyzers.pop('_import_errors', {})
                    analyzer_status["loaded_count"] = len(analyzers)
                    analyzer_status["import_errors"] = {k: v.get('error_message', str(v)) for k, v in import_errors.items()}
                except Exception as e:
                    analyzer_status["error"] = str(e)
                    analyzer_status["traceback"] = traceback.format_exc()
                
                debug_info["analyzers"] = analyzer_status
                
                return debug_info
        except Exception as debug_error:
            # If debug endpoint fails to register, log but continue
            print(f"Warning: Could not register debug endpoint: {debug_error}", file=sys.stderr)
        
    except Exception as import_error:
        # If import fails, create a minimal app with detailed error
        error_trace = traceback.format_exc()
        error_msg = f"Failed to import backend/main.py: {str(import_error)}"
        
        # Write to stderr (appears in Vercel logs)
        print(f"ERROR: {error_msg}", file=sys.stderr)
        print(f"TRACEBACK:\n{error_trace}", file=sys.stderr)
        sys.stderr.flush()
        
        # Create minimal FastAPI app
        from fastapi import FastAPI, Request
        from fastapi.responses import JSONResponse
        
        error_app = FastAPI()
        
        @error_app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
        async def import_error_handler(request: Request, path: str = ""):
            return JSONResponse(
                status_code=500,
                content={
                    "detail": error_msg,
                    "error_type": type(import_error).__name__,
                    "traceback": error_trace,
                    "path": path
                }
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
    print(f"CRITICAL ERROR: {init_error}", file=sys.stderr)
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
                content={
                    "detail": init_error,
                    "error_type": type(e).__name__,
                    "path": path
                }
            )
        
        try:
            from mangum import Mangum
            handler = Mangum(error_app, lifespan="off")
        except ImportError:
            handler = error_app
    except Exception as e2:
        # If even FastAPI import fails, create a minimal handler
        def minimal_handler(event, context=None):
            import json
            error_detail = init_error.replace('"', '\\"').replace('\n', '\\n').replace('\r', '\\r')
            try:
                error_body = json.dumps({"detail": init_error})
            except Exception:
                error_body = '{"detail": "Initialization failed - check logs"}'
            return {
                "statusCode": 500,
                "headers": {"Content-Type": "application/json"},
                "body": error_body
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

