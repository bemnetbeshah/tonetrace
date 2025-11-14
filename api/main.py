"""
Vercel Serverless Function Wrapper for ToneTrace API

This file serves as a wrapper to expose the FastAPI application
from the backend directory as a Vercel serverless function.
"""

# Import basic modules first - these should always work
import sys
import os
import traceback
import asyncio

# Simple logging functions - Vercel captures print() statements
# Use print() for info, print(..., file=sys.stderr) for errors
def log_info(message, **kwargs):
    """Log info message - Vercel captures print() to stdout"""
    extra = f" {kwargs}" if kwargs else ""
    print(f"[INFO] {message}{extra}", flush=True)

def log_error(message, error=None, **kwargs):
    """Log error message - Vercel captures print() to stderr"""
    error_msg = f"[ERROR] {message}"
    if kwargs:
        error_msg += f" {kwargs}"
    if error:
        error_msg += f"\nError Type: {type(error).__name__}"
        error_msg += f"\nError Message: {str(error)}"
        error_msg += f"\nTraceback:\n{traceback.format_exc()}"
    print(error_msg, file=sys.stderr, flush=True)

# Immediate logging to ensure we capture startup
print("=== VERCEL FUNCTION STARTING ===", flush=True)
print(f"Python version: {sys.version}", flush=True)
print(f"Python executable: {sys.executable}", flush=True)
print(f"Current directory: {os.getcwd()}", flush=True)
print(f"Script location: {__file__}", flush=True)

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
    log_error("Could not set NLTK_DATA path", error=e)

# Wrap everything in try-except to prevent any crashes
handler = None
init_error = None

try:
    log_info("Step 1: Setting up paths")
    
    # Add the project root and backend directory to the Python path
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    backend_dir = os.path.join(project_root, 'backend')
    
    log_info("Path configuration", 
             project_root=project_root,
             backend_dir=backend_dir,
             backend_dir_exists=os.path.exists(backend_dir))
    
    # Add both to sys.path so imports work correctly
    if project_root not in sys.path:
        sys.path.insert(0, project_root)
    if backend_dir not in sys.path:
        sys.path.insert(0, backend_dir)
    
    # Change to backend directory context for relative imports
    try:
        os.chdir(backend_dir)
        log_info("Changed working directory", cwd=os.getcwd())
    except Exception as chdir_err:
        log_error("Could not change directory", error=chdir_err)
    
    # Import the FastAPI app from backend
    # Wrap in try-except to catch any import errors
    log_info("Step 2: Importing backend/main.py")
    
    try:
        from main import app
        log_info("Successfully imported FastAPI app")
        
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
            log_error("Could not register debug endpoint", error=debug_error)
        
    except Exception as import_error:
        # If import fails, create a minimal app with detailed error
        error_trace = traceback.format_exc()
        error_msg = f"Failed to import backend/main.py: {str(import_error)}"
        
        # Log detailed error - Vercel will capture this
        log_error("IMPORT ERROR DETECTED", 
                 error=import_error,
                 step="import_backend_main",
                 traceback=error_trace)
        
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
    print("[INFO] Step 3: Wrapping app with Mangum", flush=True)
    
    try:
        from mangum import Mangum
        handler = Mangum(app, lifespan="off")
        print("[INFO] Successfully created Mangum handler", flush=True)
    except ImportError as e:
        # If Mangum is not available, use the app directly
        print(f"[WARNING] Mangum not available, using app directly: {e}", file=sys.stderr, flush=True)
        handler = app
    
    print("[INFO] INITIALIZATION COMPLETE - HANDLER READY", flush=True)
        
except Exception as e:
    # Store the error for debugging
    init_error = f"Initialization error: {str(e)}\n{traceback.format_exc()}"
    
    # Log critical error - Vercel will capture this
    log_error("CRITICAL INITIALIZATION ERROR",
             error=e,
             step="initialization",
             traceback=traceback.format_exc())
    
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

# Wrap the handler to catch and return errors in the response
# This ensures we can see errors even if logs aren't captured
_original_handler = handler

async def _async_handler(event, context=None):
    """Internal async handler that processes the request"""
    try:
        # Log that handler was called
        print("=== HANDLER CALLED ===", flush=True)
        print(f"Event keys: {list(event.keys()) if isinstance(event, dict) else type(event)}", flush=True)
        if isinstance(event, dict) and 'path' in event:
            print(f"Request path: {event.get('path', 'N/A')}", flush=True)
        if isinstance(event, dict) and 'rawPath' in event:
            print(f"Request rawPath: {event.get('rawPath', 'N/A')}", flush=True)
        
        # Call the original handler - Mangum returns a coroutine that must be awaited
        # Handle both sync and async handlers by checking the result
        import inspect
        result = _original_handler(event, context)
        
        # If the result is a coroutine, await it (Mangum handlers return coroutines)
        if inspect.iscoroutine(result):
            result = await result
        
        print("=== HANDLER SUCCESS ===", flush=True)
        return result
    except Exception as e:
        # Return error in response so we can see it
        error_msg = f"Handler Error: {type(e).__name__}: {str(e)}"
        error_trace = traceback.format_exc()
        
        print(f"=== HANDLER ERROR ===", file=sys.stderr, flush=True)
        print(error_msg, file=sys.stderr, flush=True)
        print(error_trace, file=sys.stderr, flush=True)
        
        # Return error in response body
        import json
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({
                "error": error_msg,
                "traceback": error_trace,
                "message": "Check the response body for error details"
            }, indent=2)
        }

def wrapped_handler(event, context=None):
    """
    Synchronous wrapper for async handler.
    Vercel Python functions expect a synchronous handler,
    so we use asyncio.run() to execute the async handler.
    """
    try:
        # Use asyncio.run() which creates a new event loop and runs the coroutine
        # This is the recommended way for Python 3.7+
        return asyncio.run(_async_handler(event, context))
    except Exception as e:
        # Fallback error handling if asyncio setup fails
        error_msg = f"Handler Wrapper Error: {type(e).__name__}: {str(e)}"
        error_trace = traceback.format_exc()
        
        print(f"=== HANDLER WRAPPER ERROR ===", file=sys.stderr, flush=True)
        print(error_msg, file=sys.stderr, flush=True)
        print(error_trace, file=sys.stderr, flush=True)
        
        import json
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({
                "error": error_msg,
                "traceback": error_trace,
                "message": "Handler wrapper failed - check logs"
            }, indent=2)
        }

handler = wrapped_handler

