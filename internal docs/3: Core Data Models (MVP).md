# 🧬 ToneTrace – Step 3: Core Data Models (MVP)

This document defines the core data models for ToneTrace. These are **tech-agnostic** entity blueprints for what data the system needs to track in order to support feature development, fingerprinting, and writing analysis.

---

## 🔹 Core Entities & Relationships

### 👨‍🏫 Teacher
Teachers manage students and access writing data.

| Field         | Type      | Description                            |
|---------------|-----------|----------------------------------------|
| id            | UUID/int  | Unique teacher ID                      |
| name          | string    | Full name                              |
| email         | string    | Login email                            |
| password_hash | string    | Encrypted password                     |
| created_at    | datetime  | Account creation timestamp             |

---

### 👩‍🎓 Student
Each student belongs to a teacher and has multiple writing samples.

| Field        | Type      | Description                           |
|--------------|-----------|---------------------------------------|
| id           | UUID/int  | Unique student ID                     |
| teacher_id   | FK        | References the Teacher                |
| name         | string    | Full name                             |
| language     | string    | e.g., "English", "Amharic", etc.      |
| created_at   | datetime  | Student registration date             |

---

### 📄 WritingSample
Writing samples are submitted and analyzed individually. They are stored permanently to allow trend analysis, comparison, and training.

| Field         | Type     | Description                            |
|---------------|----------|----------------------------------------|
| id            | UUID     | Unique writing sample ID               |
| student_id    | FK       | References the Student                 |
| content       | text     | Raw written text                       |
| submitted_at  | datetime | Timestamp of submission                |
| metadata      | JSON?    | Optional info (e.g., assignment type)  |

---

### 🧬 WritingFingerprint (stored per sample)
A permanent stylometric fingerprint derived from each sample. Enables comparison, tracking, and graphing.

| Field                  | Type      | Description                          |
|------------------------|-----------|--------------------------------------|
| sample_id              | FK        | Linked to WritingSample              |
| tone_labels            | list      | High-level tones (e.g., 'formal')    |
| sentiment_score        | float     | TextBlob polarity score              |
| passive_voice_pct      | float     | % passive voice usage                |
| lexical_density        | float     | Content vs function word ratio       |
| reading_grade_level    | float     | Flesch-Kincaid score                 |
| sentence_length_avg    | float     | Words per sentence                   |
| computed_at            | datetime  | When this fingerprint was generated  |

These will be stored in a structured table for easy:
- Plotting (time-series)
- Drift analysis (distance functions)
- LLM style modeling

---

### ⚠️ AnomalyAlert (optional, computed)
Represents flagged drift or anomalies in style.

| Field         | Type     | Description                            |
|---------------|----------|----------------------------------------|
| id            | UUID     | Unique alert ID                        |
| student_id    | FK       | References Student                     |
| sample_id     | FK       | References WritingSample               |
| message       | string   | Alert summary                          |
| severity      | float    | Optional confidence score (0–1)        |
| triggered_at  | datetime | Time of alert creation                 |

---

### 📈 ProgressSnapshot (optional, computed or cached)
Aggregates over time for plotting trends.

| Field                  | Type     | Description                         |
|------------------------|----------|-------------------------------------|
| student_id             | FK       | Who this progress belongs to        |
| date_range             | string   | Time window (e.g., "Q1 2025")       |
| avg_tone_distribution  | vector   | Average tone vector                 |
| avg_readability        | float    | Mean grade level                    |
| avg_sentence_length    | float    | Average sentence size               |

---

## 🔄 Entity Relationships


