"""
Lightweight Analysis Routes for ToneTrace API

This module provides analysis endpoints using lightweight NLP libraries
optimized for Render's free tier memory constraints.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import sys
import os
import logging
import traceback
import time

# Configure logging (only if not already configured)
if not logging.getLogger().handlers:
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
logger = logging.getLogger(__name__)

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Lazy imports to prevent initialization crashes
# Import analyzers only when needed, not at module load time
def _get_analyzers():
    """Lazy import analyzers to avoid initialization crashes with comprehensive error logging"""
    analyzers = {}
    import_errors = {}
    
    # Define analyzer imports with their module paths
    analyzer_imports = {
        'compute_formality': ('analyzers.style_metrics_lightweight', 'compute_formality'),
        'compute_complexity': ('analyzers.style_metrics_lightweight', 'compute_complexity'),
        'analyze_lexical_richness': ('analyzers.lexical_richness_lightweight', 'analyze_lexical_richness'),
        'classify_tone_model': ('analyzers.tone_lightweight', 'classify_tone_model'),
        'detect_passive_sentences': ('analyzers.passive_voice_lightweight', 'detect_passive_sentences'),
        'analyze_grammar': ('analyzers.grammar_lightweight', 'analyze_grammar'),
        'analyze_readability': ('analyzers.readability', 'analyze_readability'),
        'analyze_sentiment': ('analyzers.sentiment', 'analyze_sentiment')
    }
    
    # Try to import each analyzer with individual error handling
    for analyzer_name, (module_path, function_name) in analyzer_imports.items():
        try:
            logger.info(f"Importing analyzer: {module_path}.{function_name}")
            module = __import__(module_path, fromlist=[function_name])
            analyzer_func = getattr(module, function_name)
            analyzers[analyzer_name] = analyzer_func
            logger.info(f"Successfully imported analyzer: {analyzer_name}")
        except ImportError as e:
            error_msg = f"Failed to import {module_path}.{function_name}: {str(e)}"
            logger.error(error_msg)
            logger.error(traceback.format_exc())
            import_errors[analyzer_name] = {
                'error_type': 'ImportError',
                'error_message': str(e),
                'traceback': traceback.format_exc()
            }
        except AttributeError as e:
            error_msg = f"Function {function_name} not found in {module_path}: {str(e)}"
            logger.error(error_msg)
            logger.error(traceback.format_exc())
            import_errors[analyzer_name] = {
                'error_type': 'AttributeError',
                'error_message': str(e),
                'traceback': traceback.format_exc()
            }
        except Exception as e:
            error_msg = f"Unexpected error importing {module_path}.{function_name}: {str(e)}"
            logger.error(error_msg)
            logger.error(traceback.format_exc())
            import_errors[analyzer_name] = {
                'error_type': type(e).__name__,
                'error_message': str(e),
                'traceback': traceback.format_exc()
            }
    
    # Log summary of imports
    if import_errors:
        logger.warning(f"Some analyzers failed to import. Successful: {len(analyzers)}, Failed: {len(import_errors)}")
        for analyzer_name, error_info in import_errors.items():
            logger.warning(f"  - {analyzer_name}: {error_info['error_type']} - {error_info['error_message']}")
    else:
        logger.info(f"All analyzers imported successfully ({len(analyzers)} total)")
    
    # Store import errors in analyzers dict for reference
    analyzers['_import_errors'] = import_errors
    
    return analyzers

router = APIRouter()

class TextAnalysisRequest(BaseModel):
    text: str
    student_id: str = None
    assignment_id: str = None

class AnalysisResponse(BaseModel):
    text: str
    analysis: Dict[str, Any]
    metadata: Dict[str, Any] = {}

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_text(request: TextAnalysisRequest):
    """
    Analyze student text using lightweight NLP libraries.
    
    This endpoint provides comprehensive writing analysis including:
    - Formality and complexity metrics
    - Lexical richness analysis
    - Tone classification
    - Passive voice detection
    - Grammar issue identification
    - Readability scores
    - Sentiment analysis
    """
    analysis_start_time = time.time()
    text = None
    
    try:
        text = request.text.strip()
        word_count = len(text.split()) if text else 0
        
        # Log request start
        logger.info(f"Starting text analysis request. Text length: {len(text)}, Word count: {word_count}, Student ID: {request.student_id}")
        
        if not text:
            logger.warning("Empty text provided in analysis request")
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        # Lazy load analyzers (only when endpoint is called)
        logger.info("Loading analyzers...")
        analyzers = _get_analyzers()
        import_errors = analyzers.pop('_import_errors', {})
        
        if not analyzers:
            error_msg = "No analyzers were successfully imported"
            logger.error(error_msg)
            raise HTTPException(status_code=500, detail=error_msg)
        
        logger.info(f"Loaded {len(analyzers)} analyzers successfully")
        if import_errors:
            logger.warning(f"{len(import_errors)} analyzers failed to import and will be skipped")
        
        # Perform lightweight analysis with individual error handling
        analysis = {}
        analysis_errors = {}
        step_counter = 0
        
        # Define analyzer execution plan
        analyzer_plan = [
            ('formality', 'compute_formality', 'Style metrics - Formality'),
            ('complexity', 'compute_complexity', 'Style metrics - Complexity'),
            ('lexical_richness', 'analyze_lexical_richness', 'Lexical richness'),
            ('tone', 'classify_tone_model', 'Tone analysis'),
            ('passive_voice', 'detect_passive_sentences', 'Passive voice detection'),
            ('grammar', 'analyze_grammar', 'Grammar analysis'),
            ('readability', 'analyze_readability', 'Readability analysis'),
            ('sentiment', 'analyze_sentiment', 'Sentiment analysis')
        ]
        
        # Execute each analyzer with individual error handling
        for analysis_key, analyzer_key, analyzer_name in analyzer_plan:
            step_counter += 1
            
            # Skip if analyzer failed to import
            if analyzer_key not in analyzers:
                logger.warning(f"Step {step_counter}: Skipping {analyzer_name} ({analyzer_key}) - not available (import failed)")
                analysis_errors[analysis_key] = {
                    'error_type': 'ImportError',
                    'error_message': f"Analyzer {analyzer_key} was not available due to import failure",
                    'step': step_counter
                }
                continue
            
            # Execute analyzer with timing and error handling
            step_start_time = time.time()
            logger.info(f"Step {step_counter}/{len(analyzer_plan)}: Starting {analyzer_name} ({analyzer_key})")
            
            try:
                analyzer_func = analyzers[analyzer_key]
                result = analyzer_func(text)
                step_duration_ms = (time.time() - step_start_time) * 1000
                analysis[analysis_key] = result
                logger.info(f"Step {step_counter}: Completed {analyzer_name} in {step_duration_ms:.2f}ms")
                
            except Exception as e:
                step_duration_ms = (time.time() - step_start_time) * 1000
                error_msg = f"Failed during {analyzer_name}: {str(e)}"
                logger.error(f"Step {step_counter}: {error_msg}")
                logger.error(f"Step {step_counter}: Traceback for {analyzer_name}: {traceback.format_exc()}")
                
                analysis_errors[analysis_key] = {
                    'error_type': type(e).__name__,
                    'error_message': str(e),
                    'step': step_counter,
                    'duration_ms': step_duration_ms,
                    'traceback': traceback.format_exc()
                }
                # Continue with other analyzers even if this one fails
                logger.warning(f"Step {step_counter}: Continuing with remaining analyzers despite {analyzer_name} failure")
        
        # Calculate total analysis time
        analysis_time_ms = (time.time() - analysis_start_time) * 1000
        
        # Prepare metadata
        metadata = {
            'text_length': len(text),
            'word_count': word_count,
            'analysis_version': 'lightweight',
            'student_id': request.student_id,
            'assignment_id': request.assignment_id,
            'analysis_time_ms': round(analysis_time_ms, 2),
            'analyzers_executed': len(analysis),
            'analyzers_failed': len(analysis_errors),
            'analyzers_skipped': len(import_errors)
        }
        
        # Add error information to metadata if any errors occurred
        if analysis_errors or import_errors:
            metadata['errors'] = {
                'analysis_errors': analysis_errors,
                'import_errors': import_errors
            }
            logger.warning(f"Analysis completed with errors. Successful: {len(analysis)}, Failed: {len(analysis_errors)}, Skipped: {len(import_errors)}")
        else:
            logger.info(f"Analysis completed successfully. All {len(analysis)} analyzers executed in {analysis_time_ms:.2f}ms")
        
        logger.info(f"Analysis request completed. Total time: {analysis_time_ms:.2f}ms")
        
        return AnalysisResponse(
            text=text,
            analysis=analysis,
            metadata=metadata
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        analysis_time_ms = (time.time() - analysis_start_time) * 1000
        error_detail = f"Analysis failed: {str(e)}"
        logger.error(f"Unhandled exception in analyze_text: {error_detail}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        logger.error(f"Analysis failed after {analysis_time_ms:.2f}ms")
        raise HTTPException(status_code=500, detail=f"{error_detail}\n{traceback.format_exc()}")

