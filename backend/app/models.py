# app/models.py
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, DateTime, ForeignKey, Index
)
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.dialects.postgresql import JSONB
from app.database import Base

class Student(Base):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    submissions: Mapped[list["Submission"]] = relationship(
        "Submission",
        back_populates="student",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

class Submission(Base):
    __tablename__ = "submissions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    student_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("students.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    text: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    student: Mapped["Student"] = relationship("Student", back_populates="submissions")
    results: Mapped[list["AnalysisResult"]] = relationship(
        "AnalysisResult",
        back_populates="submission",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    submission_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("submissions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    analyzer_name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    analyzer_version: Mapped[str] = mapped_column(String(50), default="v1")
    status: Mapped[str] = mapped_column(String(20), default="ok")
    error_message: Mapped[str | None] = mapped_column(String(500))
    duration_ms: Mapped[int | None] = mapped_column(Integer)
    result_json: Mapped[dict] = mapped_column(JSONB, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    submission: Mapped["Submission"] = relationship("Submission", back_populates="results")

    __table_args__ = (
        Index("ix_analysis_results_submission_analyzer", "submission_id", "analyzer_name"),
    )

class SubmissionSummary(Base):
    __tablename__ = "submission_summaries"
    
    submission_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("submissions.id", ondelete="CASCADE"),
        primary_key=True
    )
    sentiment_score: Mapped[float | None] = mapped_column()
    tone_primary: Mapped[str | None] = mapped_column(String(100))
    readability_grade: Mapped[float | None] = mapped_column()
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    
    submission: Mapped["Submission"] = relationship("Submission")
