"""
Service for managing submission summaries and populating summary tables
for efficient dashboard queries.
"""

from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models import AnalysisResult, SubmissionSummary
from app.database import get_db


class SummaryService:
    """Service for managing submission summaries."""
    
    @staticmethod
    def update_submission_summary(submission_id: int, db: Session) -> SubmissionSummary:
        """
        Update or create a submission summary based on the latest analysis results.
        
        Args:
            submission_id: ID of the submission to summarize
            db: Database session
            
        Returns:
            Updated or created SubmissionSummary instance
        """
        # Get the latest analysis results for each analyzer
        sentiment_result = db.execute(
            select(AnalysisResult)
            .where(AnalysisResult.submission_id == submission_id)
            .where(AnalysisResult.analyzer_name == 'sentiment')
            .where(AnalysisResult.status == 'ok')
            .order_by(AnalysisResult.created_at.desc())
        ).scalar_one_or_none()
        
        tone_result = db.execute(
            select(AnalysisResult)
            .where(AnalysisResult.submission_id == submission_id)
            .where(AnalysisResult.analyzer_name == 'tone')
            .where(AnalysisResult.status == 'ok')
            .order_by(AnalysisResult.created_at.desc())
        ).scalar_one_or_none()
        
        readability_result = db.execute(
            select(AnalysisResult)
            .where(AnalysisResult.submission_id == submission_id)
            .where(AnalysisResult.analyzer_name == 'readability')
            .where(AnalysisResult.status == 'ok')
            .order_by(AnalysisResult.created_at.desc())
        ).scalar_one_or_none()
        
        # Extract summary values
        sentiment_score = None
        if sentiment_result and sentiment_result.result_json:
            sentiment_score = sentiment_result.result_json.get('score')
        
        tone_primary = None
        if tone_result and tone_result.result_json:
            tone_primary = tone_result.result_json.get('bucket')
        
        readability_grade = None
        if readability_result and readability_result.result_json:
            readability_grade = readability_result.result_json.get('score')
        
        # Get or create summary record
        summary = db.execute(
            select(SubmissionSummary)
            .where(SubmissionSummary.submission_id == submission_id)
        ).scalar_one_or_none()
        
        if summary:
            # Update existing summary
            summary.sentiment_score = sentiment_score
            summary.tone_primary = tone_primary
            summary.readability_grade = readability_grade
        else:
            # Create new summary
            summary = SubmissionSummary(
                submission_id=submission_id,
                sentiment_score=sentiment_score,
                tone_primary=tone_primary,
                readability_grade=readability_grade
            )
            db.add(summary)
        
        db.commit()
        db.refresh(summary)
        return summary
    
    @staticmethod
    def get_submission_summary(submission_id: int, db: Session) -> Optional[SubmissionSummary]:
        """
        Get the summary for a specific submission.
        
        Args:
            submission_id: ID of the submission
            db: Database session
            
        Returns:
            SubmissionSummary instance or None if not found
        """
        return db.execute(
            select(SubmissionSummary)
            .where(SubmissionSummary.submission_id == submission_id)
        ).scalar_one_or_none()
    
    @staticmethod
    def get_summaries_for_dashboard(
        db: Session,
        limit: int = 100,
        offset: int = 0,
        sentiment_filter: Optional[str] = None,
        tone_filter: Optional[str] = None,
        readability_min: Optional[float] = None,
        readability_max: Optional[float] = None
    ) -> list[SubmissionSummary]:
        """
        Get submission summaries for dashboard display with optional filtering.
        
        Args:
            db: Database session
            limit: Maximum number of results to return
            offset: Number of results to skip
            sentiment_filter: Filter by sentiment bucket (e.g., 'positive', 'negative')
            tone_filter: Filter by tone bucket
            readability_min: Minimum readability grade
            readability_max: Maximum readability grade
            
        Returns:
            List of SubmissionSummary instances
        """
        query = select(SubmissionSummary)
        
        # Apply filters
        if sentiment_filter:
            query = query.where(SubmissionSummary.sentiment_score > 0.1 if sentiment_filter == 'positive' else 
                               SubmissionSummary.sentiment_score < -0.1 if sentiment_filter == 'negative' else
                               SubmissionSummary.sentiment_score.between(-0.1, 0.1))
        
        if tone_filter:
            query = query.where(SubmissionSummary.tone_primary.contains(tone_filter))
        
        if readability_min is not None:
            query = query.where(SubmissionSummary.readability_grade >= readability_min)
        
        if readability_max is not None:
            query = query.where(SubmissionSummary.readability_grade <= readability_max)
        
        # Apply pagination and ordering
        query = query.order_by(SubmissionSummary.updated_at.desc()).offset(offset).limit(limit)
        
        return list(db.execute(query).scalars().all()) 