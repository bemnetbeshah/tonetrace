import logging
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models import Submission, AnalysisResult, User
from app.database import AsyncSessionLocal

logger = logging.getLogger(__name__)

async def store_analysis_results(
    text: str,
    user_id: str,
    analysis_results: Dict[str, Any]
) -> Optional[int]:
    """
    Store text submission and all analysis results in the database.
    
    Args:
        text: The input text that was analyzed
        user_id: The user identifier
        analysis_results: Dictionary of analyzer results
        
    Returns:
        Submission ID if successful, None otherwise
    """
    try:
        async with AsyncSessionLocal() as session:
            # Get or create user
            user = await get_or_create_user(session, user_id)
            
            # Create submission
            submission = Submission(
                user_id=user.id,
                text=text
            )
            session.add(submission)
            await session.flush()  # Get the ID
            
            # Store each analyzer result
            for analyzer_name, result in analysis_results.items():
                if result is None:
                    continue
                    
                # Convert result to JSON-serializable format
                result_json = _prepare_result_json(result)
                
                analysis_result = AnalysisResult(
                    submission_id=submission.id,
                    analyzer_name=analyzer_name,
                    analyzer_version="v1",
                    status="ok",
                    result_json=result_json,
                    duration_ms=result.get("duration_ms") if isinstance(result, dict) else None
                )
                session.add(analysis_result)
            
            await session.commit()
            logger.info(f"Stored analysis results for submission {submission.id}")
            return submission.id
            
    except Exception as e:
        logger.error(f"Failed to store analysis results: {e}")
        return None

async def get_or_create_user(session: AsyncSession, user_id: str) -> User:
    """Get existing user or create a new one."""
    # For now, create a simple user with email as user_id
    # In production, this would be handled by authentication
    stmt = select(User).where(User.email == f"{user_id}@example.com")
    result = await session.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        user = User(email=f"{user_id}@example.com")
        session.add(user)
        await session.flush()
    
    return user

def _prepare_result_json(result: Any) -> Dict[str, Any]:
    """Convert analyzer result to JSON-serializable format."""
    if isinstance(result, dict):
        return result
    elif hasattr(result, '__dict__'):
        return result.__dict__
    else:
        return {"value": str(result)}

async def get_analysis_history(user_id: str, limit: int = 10) -> list[Dict[str, Any]]:
    """
    Retrieve analysis history for a user.
    
    Args:
        user_id: The user identifier
        limit: Maximum number of submissions to return
        
    Returns:
        List of analysis submissions with results
    """
    try:
        async with AsyncSessionLocal() as session:
            # Get user
            stmt = select(User).where(User.email == f"{user_id}@example.com")
            result = await session.execute(stmt)
            user = result.scalar_one_or_none()
            
            if not user:
                return []
            
            # Get submissions with results
            stmt = (
                select(Submission)
                .where(Submission.user_id == user.id)
                .order_by(Submission.created_at.desc())
                .limit(limit)
            )
            result = await session.execute(stmt)
            submissions = result.scalars().all()
            
            history = []
            for submission in submissions:
                # Load the results relationship explicitly
                await session.refresh(submission, attribute_names=['results'])
                
                submission_data = {
                    "id": submission.id,
                    "text": submission.text[:100] + "..." if len(submission.text) > 100 else submission.text,
                    "created_at": submission.created_at.isoformat(),
                    "results": {}
                }
                
                for analysis_result in submission.results:
                    submission_data["results"][analysis_result.analyzer_name] = {
                        "status": analysis_result.status,
                        "result": analysis_result.result_json,
                        "duration_ms": analysis_result.duration_ms
                    }
                
                history.append(submission_data)
            
            return history
            
    except Exception as e:
        logger.error(f"Failed to retrieve analysis history: {e}")
        return [] 