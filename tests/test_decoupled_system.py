"""
Tests for the new decoupled analysis system.
"""

import pytest
from unittest.mock import Mock, patch
from app.models import AnalysisResult, SubmissionSummary
from services.analysis_timing import time_analysis_run, create_analysis_result
from services.summary_service import SummaryService
from analyzers.sentiment import analyze_sentiment
from analyzers.tone import classify_tone_model
from analyzers.readability import analyze_readability


class TestStandardizedResponse:
    """Test that analyzers return standardized responses."""
    
    def test_sentiment_analyzer_response_format(self):
        """Test sentiment analyzer returns correct format."""
        text = "I love this amazing product! It's fantastic."
        result = analyze_sentiment(text)
        
        # Check required fields exist
        assert "score" in result
        assert "bucket" in result
        assert "raw" in result
        assert "confidence" in result
        assert "details" in result
        
        # Check data types
        assert isinstance(result["score"], (float, type(None)))
        assert isinstance(result["bucket"], (str, type(None)))
        assert isinstance(result["raw"], dict)
        assert isinstance(result["confidence"], (float, type(None)))
        assert isinstance(result["details"], dict)
        
        # Check sentiment-specific logic
        assert result["score"] > 0  # Should be positive
        assert result["bucket"] == "positive"
        assert "polarity" in result["raw"]
        assert "subjectivity" in result["raw"]
    
    def test_readability_analyzer_response_format(self):
        """Test readability analyzer returns correct format."""
        text = "The quick brown fox jumps over the lazy dog."
        result = analyze_readability(text)
        
        # Check required fields exist
        assert "score" in result
        assert "bucket" in result
        assert "raw" in result
        assert "confidence" in result
        assert "details" in result
        
        # Check data types
        assert isinstance(result["score"], (float, type(None)))
        assert isinstance(result["bucket"], (str, type(None)))
        assert isinstance(result["raw"], dict)
        assert isinstance(result["confidence"], (float, type(None)))
        assert isinstance(result["details"], dict)
        
        # Check readability-specific logic
        assert "flesch_kincaid_grade" in result["raw"]
        assert "word_count" in result["raw"]
        assert "interpretations" in result["details"]


class TestAnalysisTiming:
    """Test the analysis timing utilities."""
    
    def test_time_analysis_run_context_manager(self):
        """Test the timing context manager works correctly."""
        submission_id = 1
        analyzer_name = "test_analyzer"
        analyzer_version = "v1"
        
        with time_analysis_run(submission_id, analyzer_name, analyzer_version) as timing_data:
            # Simulate analysis work
            timing_data["result"] = {"test": "data"}
            timing_data["status"] = "ok"
        
        # Check timing data was populated
        assert timing_data["submission_id"] == submission_id
        assert timing_data["analyzer_name"] == analyzer_name
        assert timing_data["analyzer_version"] == analyzer_version
        assert timing_data["status"] == "ok"
        assert timing_data["result"] == {"test": "data"}
        assert "duration_ms" in timing_data
        assert timing_data["duration_ms"] >= 0
    
    def test_create_analysis_result(self):
        """Test creating analysis result instances."""
        submission_id = 1
        analyzer_name = "test_analyzer"
        result = {"test": "data"}
        
        analysis_result = create_analysis_result(
            submission_id=submission_id,
            analyzer_name=analyzer_name,
            result=result,
            analyzer_version="v1",
            status="ok"
        )
        
        assert analysis_result.submission_id == submission_id
        assert analysis_result.analyzer_name == analyzer_name
        assert analysis_result.result_json == result
        assert analysis_result.analyzer_version == "v1"
        assert analysis_result.status == "ok"


class TestSummaryService:
    """Test the summary service functionality."""
    
    def test_update_submission_summary_creates_new(self):
        """Test creating a new summary when none exists."""
        # Mock database session
        mock_db = Mock()
        
        # Mock query results for each analyzer
        sentiment_result = Mock()
        sentiment_result.result_json = {"score": 0.8}
        
        tone_result = Mock()
        tone_result.result_json = {"bucket": "positive"}
        
        readability_result = Mock()
        readability_result.result_json = {"score": 12.5}
        
        # Mock database queries
        mock_db.execute.return_value.scalar_one_or_none.side_effect = [
            sentiment_result,  # sentiment
            tone_result,       # tone
            readability_result, # readability
            None               # no existing summary
        ]
        
        # Mock the summary creation
        mock_summary = Mock()
        mock_summary.submission_id = 1
        mock_summary.sentiment_score = 0.8
        mock_summary.tone_primary = "positive"
        mock_summary.readability_grade = 12.5
        
        mock_db.add.return_value = None
        mock_db.commit.return_value = None
        mock_db.refresh.return_value = None
        
        # Call the service
        summary = SummaryService.update_submission_summary(1, mock_db)
        
        # Verify summary was created with correct values
        assert summary.submission_id == 1
        assert summary.sentiment_score == 0.8
        assert summary.tone_primary == "positive"
        assert summary.readability_grade == 12.5
    
    def test_get_summaries_for_dashboard_filtering(self):
        """Test dashboard filtering functionality."""
        # Mock database session
        mock_db = Mock()
        
        # Mock summary results
        mock_summaries = [
            Mock(submission_id=1, sentiment_score=0.8, tone_primary="positive", readability_grade=10.0),
            Mock(submission_id=2, sentiment_score=-0.5, tone_primary="negative", readability_grade=15.0),
        ]
        
        # Mock the query execution
        mock_query = Mock()
        mock_query.where.return_value = mock_query
        mock_query.order_by.return_value = mock_query
        mock_query.offset.return_value = mock_query
        mock_query.limit.return_value = mock_query
        
        mock_db.execute.return_value.scalars.return_value.all.return_value = mock_summaries
        
        # Test filtering
        summaries = SummaryService.get_summaries_for_dashboard(
            mock_db, limit=10, sentiment_filter='positive'
        )
        
        assert len(summaries) == 2
        assert summaries[0].submission_id == 1
        assert summaries[1].submission_id == 2


class TestDatabaseSchema:
    """Test that the database schema supports the new design."""
    
    def test_analysis_result_model_fields(self):
        """Test AnalysisResult model has all required fields."""
        # Create a mock result
        result = AnalysisResult(
            submission_id=1,
            analyzer_name="test_analyzer",
            analyzer_version="v1",
            status="ok",
            result_json={"test": "data"}
        )
        
        # Check all fields exist
        assert hasattr(result, 'id')
        assert hasattr(result, 'submission_id')
        assert hasattr(result, 'analyzer_name')
        assert hasattr(result, 'analyzer_version')
        assert hasattr(result, 'status')
        assert hasattr(result, 'error_message')
        assert hasattr(result, 'duration_ms')
        assert hasattr(result, 'result_json')
        assert hasattr(result, 'created_at')
    
    def test_submission_summary_model_fields(self):
        """Test SubmissionSummary model has all required fields."""
        # Create a mock summary
        summary = SubmissionSummary(
            submission_id=1,
            sentiment_score=0.8,
            tone_primary="positive",
            readability_grade=12.5
        )
        
        # Check all fields exist
        assert hasattr(summary, 'submission_id')
        assert hasattr(summary, 'sentiment_score')
        assert hasattr(summary, 'tone_primary')
        assert hasattr(summary, 'readability_grade')
        assert hasattr(summary, 'updated_at')


if __name__ == "__main__":
    pytest.main([__file__]) 