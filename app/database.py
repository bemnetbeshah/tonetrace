# app/database.py
import os
import logging
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL not set")

# Clean the URL by removing extra quotes that might be added by Render
original_url = DATABASE_URL
DATABASE_URL = DATABASE_URL.strip().strip("'").strip('"')

# Log the URL cleaning (without exposing credentials)
if original_url != DATABASE_URL:
    logger.info(f"Cleaned DATABASE_URL: removed quotes from environment variable")

# echo=True is helpful in dev to see SQL
engine = create_async_engine(DATABASE_URL, echo=True, future=True)

# SQLAlchemy 2.x style session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    class_=AsyncSession,
)

class Base(DeclarativeBase):
    pass

# FastAPI dependency
async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session