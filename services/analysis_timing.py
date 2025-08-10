"""
Utility service for timing analysis runs and storing performance metrics.
"""

import time
from contextlib import contextmanager
from typing import Generator, Dict, Any
from sqlalchemy.orm import Session
from app.models import AnalysisResult


@contextmanager
def time_analysis_run(
    submission_id: int,
    analyzer_name: str,
    analyzer_version: str = "v1",
    db: Session = None
) -> Generator[Dict[str, Any], None, None]:
    """
    Context manager for timing analysis runs and automatically storing results.
    
    Usage:
        with time_analysis_run(submission_id, "sentiment", "v1", db) as timing_data:
            result = analyze_sentiment(text)
            timing_data["result"] = result
            timing_data["status"] = "ok"
    
    Args:
        submission_id: ID of the submission being analyzed
        analyzer_name: Name of the analyzer (e.g., "sentiment", "tone")
        analyzer_version: Version of the analyzer
        db: Database session (optional, for automatic result storage)
        
    Yields:
        Dictionary with timing data and placeholders for result and status
    """
    start_time = time.time()
    timing_data = {
        "submission_id": submission_id,
        "analyzer_name": analyzer_name,
        "analyzer_version": analyzer_version,
        "start_time": start_time,
        "result": None,
        "status": "ok",
        "error_message": None
    }
    
    try:
        yield timing_data
    except Exception as e:
        timing_data["status"] = "error"
        timing_data["error_message"] = str(e)
        raise
    finally:
        end_time = time.time()
        duration_ms = int((end_time - start_time) * 1000)
        timing_data["duration_ms"] = duration_ms
        
        # Store the analysis result if database session is provided
        if db and timing_data["result"]:
            try:
                analysis_result = AnalysisResult(
                    submission_id=submission_id,
                    analyzer_name=analyzer_name,
                    analyzer_version=analyzer_version,
                    status=timing_data["status"],
                    error_message=timing_data["error_message"],
                    duration_ms=duration_ms,
                    result_json=timing_data["result"]
                )
                db.add(analysis_result)
                db.commit()
            except Exception as e:
                # Log error but don't fail the analysis
                print(f"Failed to store analysis result: {e}")
                db.rollback()


def create_analysis_result(
    submission_id: int,
    analyzer_name: str,
    result: Dict[str, Any],
    analyzer_version: str = "v1",
    status: str = "ok",
    error_message: str = None,
    duration_ms: int = None,
    db: Session = None
) -> AnalysisResult:
    """
    Create and optionally store an AnalysisResult instance.
    
    Args:
        submission_id: ID of the submission
        analyzer_name: Name of the analyzer
        result: Analysis result dictionary
        analyzer_version: Version of the analyzer
        status: Analysis status ("ok", "error", "skipped")
        error_message: Error message if status is "error"
        duration_ms: Duration of analysis in milliseconds
        db: Database session (optional)
        
    Returns:
        AnalysisResult instance
    """
    analysis_result = AnalysisResult(
        submission_id=submission_id,
        analyzer_name=analyzer_name,
        analyzer_version=analyzer_version,
        status=status,
        error_message=error_message,
        duration_ms=duration_ms,
        result_json=result
    )
    
    if db:
        db.add(analysis_result)
        db.commit()
        db.refresh(analysis_result)
    
    return analysis_result 