# ToneTrace

An AI-powered classroom analytics and writing evaluation platform built to empower teachers with deeper visibility into their classroom's performance, needs, and progress. ToneTrace isn't just about grading writing — it's about giving teachers the insights they need to adapt lessons, provide personalized feedback, and ensure every student feels seen and heard in their writing journey.

## Why ToneTrace Matters

**Literacy is the foundation of education.** A student who cannot read or write at the expected level will struggle with everything else — solving math word problems, understanding science concepts, engaging with history texts, or expressing themselves clearly.

When writing struggles go unnoticed, the effects compound: students fall behind, confidence drops, and opportunities narrow. But when teachers have the right tools to catch those struggles early and respond with targeted support, the trajectory of a student's entire education can change.

ToneTrace exists to make sure no student is invisible. By equipping teachers with sharper insights, we make it possible for every student to not just keep up, but to thrive — in school, in higher education, and in life.

## Goals

### Empower Teachers with Actionable Insights
Provide dashboards and reports that show not just individual performance but class-wide trends: where students struggle, where they excel, and how their writing evolves.

### Make Students Feel Heard
By surfacing writing patterns and emotional tones, ToneTrace helps teachers connect with the student behind the assignment. This creates a feedback loop where students feel understood, supported, and motivated.

### Save Time Without Losing Depth
Automate repetitive parts of feedback (grammar checks, readability, tone detection) while freeing teachers to focus on higher-level coaching and relationship building.

### Prevent Blind Spots in the Classroom
Teachers can easily see which students are falling behind, who may not be expressing themselves authentically, or who might be relying too heavily on AI. This ensures no student slips through unnoticed.

### Support Data-Driven Pedagogy
Turn classroom writing into a source of structured insight. Educators can adjust lessons based on clear evidence, not just instinct or anecdote, ensuring every student receives instruction tailored to their needs.

## Teacher-Focused Features

### Classroom Analytics Dashboard
- **Classroom Health Check**: See where all your students stand — academically, stylistically, and emotionally
- **Class-Wide Trends**: Identify patterns in how your class writes: recurring issues with tone or formality, gaps in grammar understanding, shifts in sentiment
- **Early Intervention Alerts**: Catch problems early before small struggles turn into lasting barriers
- **Long-Term Growth Tracking**: Monitor student progress over semesters and years

### Student-Centered Insights
- **Individual Student Profiles**: Deep dive into each student's writing patterns and emotional tones
- **Authentic Voice Detection**: Identify students who may not be expressing themselves authentically
- **Confidence Building**: Surface writing patterns that help teachers connect with the student behind the assignment
- **At-Risk Student Identification**: Detect shifts in sentiment and performance that may indicate struggling students

### Writing Analysis Engine
- **Tone & Sentiment Analysis**: Understand the emotional state and communication style of student writing
- **Formality & Complexity Assessment**: Track academic writing development and grade-level appropriateness
- **Vocabulary Growth Monitoring**: Measure lexical sophistication and vocabulary expansion
- **Grammar & Style Pattern Recognition**: Identify recurring issues and areas for improvement
- **Writing Authenticity Detection**: Help teachers identify when students may be relying too heavily on AI tools

### Data-Driven Pedagogy Support
- **Adaptive Lesson Planning**: Use insights to adjust instruction based on clear evidence, not just instinct
- **Personalized Feedback Generation**: Provide timely, specific feedback that builds student confidence
- **Cross-Subject Impact Awareness**: Understand how writing struggles affect performance in all subjects
- **Relationship Building Tools**: Free teachers from repetitive tasks to focus on coaching and connection

## Technical Implementation

### Core Analysis API

The ToneTrace backend provides comprehensive writing analysis through our REST API, designed to support teacher workflows and classroom management.

### POST /analyze
Analyzes student writing and returns insights designed to help teachers understand their students better.

**Request:**
```json
{
  "text": "Student's writing sample to analyze",
  "student_id": "student_identifier_for_tracking_progress"
}
```

**Response:**
```json
{
  "formality": {
    "score": 0.8,
    "bucket": "formal",
    "confidence": 0.85,
    "details": {
      "flesch_kincaid_grade": 12.5,
      "gunning_fog_index": 14.2,
      "dale_chall_score": 8.1
    }
  },
  "complexity": {
    "score": 0.7,
    "bucket": "moderate",
    "confidence": 0.9,
    "details": {
      "average_sentence_length": 18.5,
      "lexical_density": 0.65
    }
  },
  "tone": {
    "score": 0.85,
    "bucket": "neutral",
    "confidence": 0.82,
    "raw_emotions": [...]
  },
  "sentiment": {
    "score": 0.2,
    "bucket": "positive",
    "confidence": 0.75
  },
  "passive_voice": {
    "score": 0.15,
    "bucket": "low",
    "confidence": 0.8
  },
  "lexical_diversity": {
    "score": 0.75,
    "bucket": "high",
    "confidence": 0.9
  },
  "anomaly": true,
  "anomaly_reasons": [
    "Formality deviation: 25.0%",
    "Tone distribution shift: similarity 0.72"
  ],
  "anomaly_details": {
    "formality_diff": 0.25,
    "tone_similarity": 0.72,
    "sentence_length_diff": 0.12
  }
}
```

## Deployment

### Environment Variables Required

Set these environment variables in your Render deployment:

```bash
DATABASE_URL=postgresql+asyncpg://neondb_owner:npg_BZlVjuAs5gd4@ep-lingering-mud-adhn0gr1-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
ALLOWED_ORIGINS=https://tonetrace.vercel.app,http://localhost:5173
```

### Render Deployment Steps

1. **Set Environment Variables**: Add the above variables in your Render service settings
2. **Build Command**: `pip install -r requirements.txt`
3. **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. **Database Migration**: Run `alembic upgrade head` after first deployment

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tonetrace
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Download required models:
```bash
python -m spacy download en_core_web_sm
```

## Usage

### Running the API Server
```bash
# Local development
uvicorn app.main:app --reload

# Production (Render)
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Student Progress Tracking

The student progress tracking automatically works with the `/analyze` endpoint. It:

1. **Creates/Retrieves Student Profile**: Automatically creates a baseline profile for new students or retrieves existing ones
2. **Analyzes Current Writing**: Performs comprehensive analysis on the student's writing sample
3. **Compares to Baseline**: Compares current analysis against the student's established writing patterns
4. **Identifies Changes**: Detects significant changes that may indicate growth, struggles, or areas needing attention
5. **Updates Progress**: Saves the new analysis to track the student's writing development over time

### Example Usage: Tracking Student Growth

```python
import requests

# First writing sample (establishes baseline)
response1 = requests.post("https://your-render-backend.ondigitalocean.app/analyze", json={
    "text": "I think that the main character in the story was really brave and showed courage.",
    "student_id": "student_123"
})

# Later writing sample (tracks development)
response2 = requests.post("https://your-render-backend.ondigitalocean.app/analyze", json={
    "text": "The protagonist's unwavering determination in the face of adversity exemplifies the thematic exploration of resilience throughout the narrative.",
    "student_id": "student_123"
})

# Check for significant changes that indicate growth or areas needing attention
result = response2.json()
if result["anomaly"]:
    print("Significant writing development detected!")
    for reason in result["anomaly_reasons"]:
        print(f"- {reason}")
    # Teacher can now provide targeted feedback or celebrate growth
```

## Testing

Run the test suite:
```bash
python -m pytest tests/
```

Run anomaly detection tests specifically:
```bash
python -m pytest tests/test_anomaly.py -v
```

## Architecture

### Core Components

- **Writing Analyzers**: Individual analysis modules that examine different aspects of student writing
- **Student Profiles**: Data structures that track each student's writing patterns and growth over time
- **Progress Detection**: Comparison engine that identifies significant changes in student writing development
- **Classroom Analytics**: Aggregation layer that provides class-wide insights and trends
- **Database Layer**: Student profile storage and retrieval with historical tracking

### Student Progress Tracking Algorithm

The progress tracking system uses multiple thresholds to identify meaningful changes in student writing:

1. **Growth Indicators**: Detect improvements in vocabulary, complexity, and formality
2. **Concern Indicators**: Identify potential struggles or regression in writing skills
3. **Authenticity Monitoring**: Detect shifts that may indicate AI assistance or other authenticity concerns
4. **Emotional State Tracking**: Monitor sentiment changes that may indicate student well-being issues
5. **Teacher Alerts**: Generate actionable insights for teacher intervention and support

## Vision & Mission

ToneTrace is built on the idea that teachers deserve better tools — and that better tools for teachers mean better outcomes for students. Education has been slow to evolve in the face of technological change, and teachers are often left with either oversimplified grading apps or overwhelming LMS dashboards. 

ToneTrace bridges this gap by:
- **Acting as a teaching assistant**: spotting patterns in submissions, surfacing trends, and highlighting students who need attention
- **Offering a classroom health check**: at a glance, teachers know where their students stand — academically, stylistically, and emotionally  
- **Restoring balance**: letting technology handle the repetitive work, so teachers can spend their energy building relationships and fostering creativity

For students, the impact goes beyond a single assignment:
- A teacher who has real insight into their needs can give timely, specific feedback that builds confidence
- Students who feel heard are more engaged and more willing to grow
- Early detection of struggles in reading and writing can change the trajectory of a student's education, preventing a literacy gap that would otherwise hinder them across every subject in future grades

In the long run, ToneTrace aims to be the go-to platform for writing analytics in education:
- A central hub where teachers can track growth over semesters or years
- A system that helps identify at-risk students early by analyzing shifts in sentiment and performance
- A scalable solution that strengthens the teacher-student relationship rather than replacing it

ToneTrace isn't about taking teachers out of the loop. It's about giving them superpowers — so every student feels noticed, every teacher feels supported, and every classroom has the chance to thrive.

## Contributing

We welcome contributions from educators, developers, and anyone passionate about improving educational outcomes through better tools for teachers.

1. Fork the repository
2. Create a feature branch
3. Make your changes with teacher and student outcomes in mind
4. Add tests for new functionality
5. Submit a pull request

## License

[Add your license information here]

---

**Built with ❤️ for educators and students everywhere**
