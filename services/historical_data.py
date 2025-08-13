import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, case
from app.models import Submission, AnalysisResult, Student
from app.database import AsyncSessionLocal

logger = logging.getLogger(__name__)

async def get_sentiment_history(student_id: str, limit: int = 50) -> List[Dict[str, Any]]:
    """
    Get sentiment scores over time from database.
    
    Args:
        student_id: The student identifier
        limit: Maximum number of results to return
        
    Returns:
        List of sentiment scores with timestamps
    """
    try:
        async with AsyncSessionLocal() as session:
            # Get student
            student = await _get_student_by_id(session, student_id)
            if not student:
                return []
            
            # Query sentiment analysis results
            stmt = (
                select(
                    AnalysisResult.result_json,
                    Submission.created_at,
                    Submission.id
                )
                .join(Submission)
                .where(
                    Submission.student_id == student.id,
                    AnalysisResult.analyzer_name == "sentiment"
                )
                .order_by(desc(Submission.created_at))
                .limit(limit)
            )
            
            result = await session.execute(stmt)
            history = []
            
            for row in result:
                history.append({
                    "submission_id": row.id,
                    "score": row.result_json.get("score", 0),
                    "polarity": row.result_json.get("polarity", 0),
                    "date": row.created_at.isoformat(),
                    "text_preview": await _get_text_preview(session, row.id)
                })
            
            return history
            
    except Exception as e:
        logger.error(f"Failed to retrieve sentiment history: {e}")
        return []

async def get_formality_trends(student_id: str, days: int = 30) -> List[Dict[str, Any]]:
    """
    Get formality scores over the last N days.
    
    Args:
        student_id: The student identifier
        days: Number of days to look back
        
    Returns:
        List of formality scores with timestamps
    """
    try:
        async with AsyncSessionLocal() as session:
            student = await _get_student_by_id(session, student_id)
            if not student:
                return []
            
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            
            stmt = (
                select(
                    AnalysisResult.result_json,
                    Submission.created_at,
                    Submission.id
                )
                .join(Submission)
                .where(
                    Submission.student_id == student.id,
                    AnalysisResult.analyzer_name == "formality",
                    Submission.created_at >= cutoff_date
                )
                .order_by(desc(Submission.created_at))
            )
            
            result = await session.execute(stmt)
            trends = []
            
            for row in result:
                trends.append({
                    "submission_id": row.id,
                    "flesch_kincaid_grade": row.result_json.get("details", {}).get("flesch_kincaid_grade", 0),
                    "date": row.created_at.isoformat(),
                    "text_preview": await _get_text_preview(session, row.id)
                })
            
            return trends
            
    except Exception as e:
        logger.error(f"Failed to retrieve formality trends: {e}")
        return []

async def get_lexical_diversity_history(student_id: str, limit: int = 50) -> List[Dict[str, Any]]:
    """
    Get lexical diversity scores over time.
    
    Args:
        student_id: The student identifier
        limit: Maximum number of results to return
        
    Returns:
        List of lexical diversity scores with timestamps
    """
    try:
        async with AsyncSessionLocal() as session:
            student = await _get_student_by_id(session, student_id)
            if not student:
                return []
            
            stmt = (
                select(
                    AnalysisResult.result_json,
                    Submission.created_at,
                    Submission.id
                )
                .join(Submission)
                .where(
                    Submission.student_id == student.id,
                    AnalysisResult.analyzer_name == "lexical_diversity"
                )
                .order_by(desc(Submission.created_at))
                .limit(limit)
            )
            
            result = await session.execute(stmt)
            history = []
            
            for row in result:
                history.append({
                    "submission_id": row.id,
                    "score": row.result_json.get("score", 0),
                    "date": row.created_at.isoformat(),
                    "text_preview": await _get_text_preview(session, row.id)
                })
            
            return history
            
    except Exception as e:
        logger.error(f"Failed to retrieve lexical diversity history: {e}")
        return []

async def get_readability_history(student_id: str, metric: str = "flesch_kincaid_grade", limit: int = 50) -> List[Dict[str, Any]]:
    """
    Get readability scores over time for a specific metric.
    
    Args:
        student_id: The student identifier
        metric: Readability metric to retrieve (flesch_kincaid_grade, smog_index, etc.)
        limit: Maximum number of results to return
        
    Returns:
        List of readability scores with timestamps
    """
    try:
        async with AsyncSessionLocal() as session:
            student = await _get_student_by_id(session, student_id)
            if not student:
                return []
            
            stmt = (
                select(
                    AnalysisResult.result_json,
                    Submission.created_at,
                    Submission.id
                )
                .join(Submission)
                .where(
                    Submission.student_id == student.id,
                    AnalysisResult.analyzer_name == "readability"
                )
                .order_by(desc(Submission.created_at))
                .limit(limit)
            )
            
            result = await session.execute(stmt)
            history = []
            
            for row in result:
                score = row.result_json.get(metric, 0)
                history.append({
                    "submission_id": row.id,
                    "metric": metric,
                    "score": score,
                    "date": row.created_at.isoformat(),
                    "text_preview": await _get_text_preview(session, row.id)
                })
            
            return history
            
    except Exception as e:
        logger.error(f"Failed to retrieve readability history: {e}")
        return []

async def get_grammar_error_trends(student_id: str, days: int = 30) -> List[Dict[str, Any]]:
    """
    Get grammar error counts over the last N days.
    
    Args:
        student_id: The student identifier
        days: Number of days to look back
        
    Returns:
        List of grammar error counts with timestamps
    """
    try:
        async with AsyncSessionLocal() as session:
            student = await _get_student_by_id(session, student_id)
            if not student:
                return []
            
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            
            stmt = (
                select(
                    AnalysisResult.result_json,
                    Submission.created_at,
                    Submission.id
                )
                .join(Submission)
                .where(
                    Submission.student_id == student.id,
                    AnalysisResult.analyzer_name == "grammar",
                    Submission.created_at >= cutoff_date
                )
                .order_by(desc(Submission.created_at))
            )
            
            result = await session.execute(stmt)
            trends = []
            
            for row in result:
                trends.append({
                    "submission_id": row.id,
                    "error_count": row.result_json.get("raw", {}).get("num_errors", 0),
                    "date": row.created_at.isoformat(),
                    "text_preview": await _get_text_preview(session, row.id)
                })
            
            return trends
            
    except Exception as e:
        logger.error(f"Failed to retrieve grammar error trends: {e}")
        return []

async def get_tone_distribution_over_time(student_id: str, days: int = 30) -> Dict[str, List[Dict[str, Any]]]:
    """
    Get tone distribution over time, grouped by tone type.
    
    Args:
        student_id: The student identifier
        days: Number of days to look back
        
    Returns:
        Dictionary with tone types as keys and lists of submissions as values
    """
    try:
        async with AsyncSessionLocal() as session:
            student = await _get_student_by_id(session, student_id)
            if not student:
                return {}
            
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            
            stmt = (
                select(
                    AnalysisResult.result_json,
                    Submission.created_at,
                    Submission.id
                )
                .join(Submission)
                .where(
                    Submission.student_id == student.id,
                    AnalysisResult.analyzer_name == "tone",
                    Submission.created_at >= cutoff_date
                )
                .order_by(desc(Submission.created_at))
            )
            
            result = await session.execute(stmt)
            tone_distribution = {}
            
            for row in result:
                tone = row.result_json.get("bucket", "unknown")
                if tone not in tone_distribution:
                    tone_distribution[tone] = []
                
                tone_distribution[tone].append({
                    "submission_id": row.id,
                    "confidence": row.result_json.get("confidence", 0),
                    "date": row.created_at.isoformat(),
                    "text_preview": await _get_text_preview(session, row.id)
                })
            
            return tone_distribution
            
    except Exception as e:
        logger.error(f"Failed to retrieve tone distribution: {e}")
        return {}

async def get_performance_metrics(student_id: str, days: int = 30) -> Dict[str, Any]:
    """
    Get performance metrics over time including analysis duration and success rates.
    
    Args:
        student_id: The student identifier
        days: Number of days to look back
        
    Returns:
        Dictionary with performance metrics
    """
    try:
        async with AsyncSessionLocal() as session:
            student = await _get_student_by_id(session, student_id)
            if not student:
                return {}
            
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            
            # Get analysis duration statistics
            stmt = (
                select(
                    AnalysisResult.analyzer_name,
                    func.avg(AnalysisResult.duration_ms).label("avg_duration"),
                    func.count(AnalysisResult.id).label("total_analyses"),
                    func.sum(case((AnalysisResult.status == "ok", 1), else_=0)).label("successful_analyses")
                )
                .join(Submission)
                .where(
                    Submission.student_id == student.id,
                    Submission.created_at >= cutoff_date,
                    AnalysisResult.duration_ms.isnot(None)
                )
                .group_by(AnalysisResult.analyzer_name)
            )
            
            result = await session.execute(stmt)
            metrics = {}
            
            for row in result:
                metrics[row.analyzer_name] = {
                    "average_duration_ms": float(row.avg_duration) if row.avg_duration else 0,
                    "total_analyses": row.total_analyses,
                    "successful_analyses": row.successful_analyses,
                    "success_rate": (row.successful_analyses / row.total_analyses * 100) if row.total_analyses > 0 else 0
                }
            
            return metrics
            
    except Exception as e:
        logger.error(f"Failed to retrieve performance metrics: {e}")
        return {}

async def _get_student_by_id(session: AsyncSession, student_id: str) -> Optional[Student]:
    """Helper function to get student by student_id."""
    stmt = select(Student).where(Student.email == f"{student_id}@example.com")
    result = await session.execute(stmt)
    return result.scalar_one_or_none()

async def _get_text_preview(session: AsyncSession, submission_id: int) -> str:
    """Helper function to get text preview for a submission."""
    stmt = select(Submission.text).where(Submission.id == submission_id)
    result = await session.execute(stmt)
    text = result.scalar_one_or_none()
    if text:
        return text[:100] + "..." if len(text) > 100 else text
    return "" 