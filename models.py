# app/models.py
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON, Float, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Student(Base):
    __tablename__ = "students"
    student_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    submissions = relationship("Submission", back_populates="student")

class Submission(Base):
    __tablename__ = "submissions"
    submission_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.student_id"))
    text = Column(Text, nullable=False)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    student = relationship("Student", back_populates="submissions")
    grammar_errors = relationship("GrammarError", back_populates="submission")
    readability_scores = relationship("ReadabilityScore", back_populates="submission", uselist=False)
    lexical_diversity_scores = relationship("LexicalDiversityScore", back_populates="submission", uselist=False)
    lexical_richness_scores = relationship("LexicalRichnessScore", back_populates="submission", uselist=False)
    sentiment_scores = relationship("SentimentScore", back_populates="submission", uselist=False)
    tone_scores = relationship("ToneScore", back_populates="submission", uselist=False)
    hedging_scores = relationship("HedgingScore", back_populates="submission", uselist=False)
    passive_voice_scores = relationship("PassiveVoiceScore", back_populates="submission", uselist=False)
    style_metrics = relationship("StyleMetric", back_populates="submission", uselist=False)
    anomaly_flags = relationship("AnomalyFlag", back_populates="submission", uselist=False)

class GrammarError(Base):
    __tablename__ = "grammar_errors"
    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.submission_id"))
    error_type = Column(String(100))
    message = Column(Text)
    sentence = Column(Text)
    submission = relationship("Submission", back_populates="grammar_errors")

class ReadabilityScore(Base):
    __tablename__ = "readability_scores"
    submission_id = Column(Integer, ForeignKey("submissions.submission_id"), primary_key=True)
    flesch_kincaid_grade = Column(Float)
    smog_index = Column(Float)
    gunning_fog = Column(Float)
    dale_chall_score = Column(Float)
    word_count = Column(Integer)
    sentence_count = Column(Integer)
    submission = relationship("Submission", back_populates="readability_scores")

class LexicalDiversityScore(Base):
    __tablename__ = "lexical_diversity_scores"
    submission_id = Column(Integer, ForeignKey("submissions.submission_id"), primary_key=True)
    ttr = Column(Float)
    mtld = Column(Float)
    hdd = Column(Float)
    submission = relationship("Submission", back_populates="lexical_diversity_scores")

class LexicalRichnessScore(Base):
    __tablename__ = "lexical_richness_scores"
    submission_id = Column(Integer, ForeignKey("submissions.submission_id"), primary_key=True)
    avg_zipf_score = Column(Float)
    percent_rare_words = Column(Float)
    num_advanced_words = Column(Integer)
    total_tokens = Column(Integer)
    submission = relationship("Submission", back_populates="lexical_richness_scores")

class SentimentScore(Base):
    __tablename__ = "sentiment_scores"
    submission_id = Column(Integer, ForeignKey("submissions.submission_id"), primary_key=True)
    polarity = Column(Float)
    subjectivity = Column(Float)
    submission = relationship("Submission", back_populates="sentiment_scores")

class ToneScore(Base):
    __tablename__ = "tone_scores"
    submission_id = Column(Integer, ForeignKey("submissions.submission_id"), primary_key=True)
    top_emotion = Column(String(50))
    top_emotion_score = Column(Float)
    secondary_tone = Column(String(50))
    confidence = Column(Float)
    submission = relationship("Submission", back_populates="tone_scores")

class HedgingScore(Base):
    __tablename__ = "hedging_scores"
    submission_id = Column(Integer, ForeignKey("submissions.submission_id"), primary_key=True)
    hedging_count = Column(Integer)
    hedging_density = Column(Float)
    hedging_style = Column(String(20))
    submission = relationship("Submission", back_populates="hedging_scores")

class PassiveVoiceScore(Base):
    __tablename__ = "passive_voice_scores"
    submission_id = Column(Integer, ForeignKey("submissions.submission_id"), primary_key=True)
    passive_sentence_ratio = Column(Float)
    passive_count = Column(Integer)
    total_sentences = Column(Integer)
    passive_style = Column(String(20))
    submission = relationship("Submission", back_populates="passive_voice_scores")

class StyleMetric(Base):
    __tablename__ = "style_metrics"
    submission_id = Column(Integer, ForeignKey("submissions.submission_id"), primary_key=True)
    formality_score = Column(Float)
    complexity_score = Column(Float)
    avg_sentence_length = Column(Float)
    lexical_density = Column(Float)
    submission = relationship("Submission", back_populates="style_metrics")

class AnomalyFlag(Base):
    __tablename__ = "anomaly_flags"
    submission_id = Column(Integer, ForeignKey("submissions.submission_id"), primary_key=True)
    is_anomaly = Column(Boolean)
    sentence_length_diff = Column(Float)
    tone_similarity = Column(Float)
    formality_diff = Column(Float)
    anomaly_reason = Column(Text)
    submission = relationship("Submission", back_populates="anomaly_flags")

# Legacy models (keeping for backward compatibility if needed)
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    submissions = relationship("AnalysisResult", back_populates="user")

class AnalysisResult(Base):
    __tablename__ = "analysis_results"
    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.submission_id"))
    analyzer_name = Column(String, nullable=False)
    result_json = Column(JSON, nullable=False)
    user = relationship("User", back_populates="submissions")
