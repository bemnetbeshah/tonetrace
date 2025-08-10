"""
Example script demonstrating the new decoupled analysis system.

This shows how to:
1. Run analyzers with timing and metadata
2. Store results in the generic analysis_results table
3. Update submission summaries for efficient dashboard queries
4. Query results using JSONB operators
"""

import asyncio
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import AnalysisResult, SubmissionSummary
from services.analysis_timing import time_analysis_run
from services.summary_service import SummaryService
from analyzers.sentiment import analyze_sentiment
from analyzers.tone import classify_tone_model
from analyzers.readability import analyze_readability


def run_analysis_pipeline(submission_id: int, text: str, db: Session):
    """
    Run the complete analysis pipeline for a submission.
    
    Args:
        submission_id: ID of the submission
        text: Text to analyze
        db: Database session
    """
    print(f"Running analysis pipeline for submission {submission_id}")
    
    # Run sentiment analysis with timing
    print("  Running sentiment analysis...")
    with time_analysis_run(submission_id, "sentiment", "v1", db) as timing_data:
        result = analyze_sentiment(text)
        timing_data["result"] = result
        timing_data["status"] = "ok"
    
    # Run tone analysis with timing
    print("  Running tone analysis...")
    with time_analysis_run(submission_id, "tone", "v1", db) as timing_data:
        result = classify_tone_model(text)
        timing_data["result"] = result
        timing_data["status"] = "ok"
    
    # Run readability analysis with timing
    print("  Running readability analysis...")
    with time_analysis_run(submission_id, "readability", "v1", db) as timing_data:
        result = analyze_readability(text)
        timing_data["result"] = result
        timing_data["status"] = "ok"
    
    # Update submission summary
    print("  Updating submission summary...")
    summary = SummaryService.update_submission_summary(submission_id, db)
    
    print(f"  Analysis complete! Summary: {summary.tone_primary} tone, "
          f"sentiment: {summary.sentiment_score}, "
          f"readability: {summary.readability_grade}")


def demonstrate_jsonb_queries(db: Session):
    """
    Demonstrate various JSONB queries on the analysis results.
    """
    print("\n=== JSONB Query Examples ===")
    
    # Query 1: Get all positive sentiment results
    print("\n1. All positive sentiment results:")
    positive_sentiments = db.execute(
        "SELECT ar.submission_id, ar.result_json->>'score' as score, "
        "ar.result_json->>'bucket' as bucket, ar.duration_ms "
        "FROM analysis_results ar "
        "WHERE ar.analyzer_name = 'sentiment' "
        "AND ar.result_json->>'bucket' = 'positive' "
        "ORDER BY (ar.result_json->>'score')::float DESC"
    ).fetchall()
    
    for row in positive_sentiments[:5]:  # Show first 5
        print(f"  Submission {row.submission_id}: {row.score} ({row.bucket}) - {row.duration_ms}ms")
    
    # Query 2: Get readability scores sorted by grade level
    print("\n2. Readability scores sorted by grade level:")
    readability_scores = db.execute(
        "SELECT ar.submission_id, "
        "(ar.result_json->>'score')::float as grade_level, "
        "ar.result_json->>'bucket' as complexity, "
        "ar.duration_ms "
        "FROM analysis_results ar "
        "WHERE ar.analyzer_name = 'readability' "
        "AND ar.status = 'ok' "
        "ORDER BY (ar.result_json->>'score')::float DESC"
    ).fetchall()
    
    for row in readability_scores[:5]:  # Show first 5
        print(f"  Submission {row.submission_id}: Grade {row.grade_level} ({row.complexity}) - {row.duration_ms}ms")
    
    # Query 3: Get tone analysis with confidence scores
    print("\n3. Tone analysis with confidence scores:")
    tone_results = db.execute(
        "SELECT ar.submission_id, "
        "ar.result_json->>'bucket' as tone, "
        "ar.result_json->>'confidence' as confidence, "
        "ar.duration_ms "
        "FROM analysis_results ar "
        "WHERE ar.analyzer_name = 'tone' "
        "AND ar.status = 'ok' "
        "ORDER BY (ar.result_json->>'confidence')::float DESC"
    ).fetchall()
    
    for row in tone_results[:5]:  # Show first 5
        print(f"  Submission {row.submission_id}: {row.tone} (confidence: {row.confidence}) - {row.duration_ms}ms")


def demonstrate_summary_queries(db: Session):
    """
    Demonstrate queries on the summary table for dashboard performance.
    """
    print("\n=== Summary Table Query Examples ===")
    
    # Get summaries with filtering
    print("\n1. Recent submissions with positive sentiment:")
    positive_summaries = SummaryService.get_summaries_for_dashboard(
        db, limit=5, sentiment_filter='positive'
    )
    
    for summary in positive_summaries:
        print(f"  Submission {summary.submission_id}: "
              f"Sentiment {summary.sentiment_score}, "
              f"Tone {summary.tone_primary}, "
              f"Readability {summary.readability_grade}")
    
    # Get summaries with readability filtering
    print("\n2. Submissions suitable for high school level (readability 9-12):")
    hs_summaries = SummaryService.get_summaries_for_dashboard(
        db, limit=5, readability_min=9.0, readability_max=12.0
    )
    
    for summary in hs_summaries:
        print(f"  Submission {summary.submission_id}: "
              f"Readability {summary.readability_grade}, "
              f"Sentiment {summary.sentiment_score}")


def main():
    """Main function to demonstrate the system."""
    print("Decoupled Analysis System Demo")
    print("=" * 40)
    
    # Get database session
    db = next(get_db())
    
    try:
        # Example text for analysis
        sample_text = """
        The quick brown fox jumps over the lazy dog. This sentence contains all the letters 
        of the English alphabet and is commonly used for testing purposes. It demonstrates 
        various aspects of text analysis including readability, sentiment, and tone.
        """
        
        # Run analysis pipeline (assuming we have a submission with ID 1)
        # In a real scenario, you'd create a submission first
        print("Note: This example assumes submission ID 1 exists in the database")
        print("Run the analysis pipeline...")
        
        # Demonstrate JSONB queries
        demonstrate_jsonb_queries(db)
        
        # Demonstrate summary table queries
        demonstrate_summary_queries(db)
        
        print("\n=== System Benefits ===")
        print("✓ Generic analysis_results table stores all analyzer outputs")
        print("✓ JSONB allows flexible querying of analyzer-specific data")
        print("✓ Summary table provides fast dashboard queries")
        print("✓ Versioning and metadata enable analyzer evolution")
        print("✓ Composite indexes optimize common query patterns")
        
    except Exception as e:
        print(f"Error during demonstration: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    main() 