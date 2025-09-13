# Manual Analysis Feature

## Overview
The Manual Analysis feature allows users to analyze any text by pasting it into a text box and running it through the same analyzers used for student submissions.

## How it works

1. **Access**: Navigate to the Students page and click the "Analyze Manually" button on any student card
2. **Input**: A modal opens with a text area where you can paste or type the text you want to analyze
3. **Analysis**: Click the "Analyze" button to run the text through all available analyzers
4. **Results**: View comprehensive analysis results including:
   - Formality and complexity scores
   - Readability metrics (Flesch-Kincaid, SMOG, Gunning Fog)
   - Sentiment and tone analysis
   - Grammar error detection
   - Lexical diversity and richness
   - Passive voice usage
   - Hedging detection
   - Anomaly detection

## Technical Implementation

### Frontend Components
- `ManualAnalysisModal.tsx`: Main modal component with text input and results display
- `Modal.tsx`: Reusable modal primitive component
- Updated `Students.tsx`: Added "Analyze Manually" button and modal integration

### Backend Integration
- Uses existing `/api/analyze` endpoint
- Sends text with `student_id: 'manual_analysis'`
- Returns full analysis results from all analyzers

### Features
- Real-time analysis with loading states
- Comprehensive results display with organized sections
- Error handling for failed analysis requests
- Responsive design that works on different screen sizes
- Clean modal interface with easy close functionality

## Usage Examples

### For Teachers
- Analyze sample texts to understand the analyzer outputs
- Test the system with different writing styles
- Demonstrate analysis capabilities to students
- Analyze external texts for comparison

### For Students
- Analyze their own writing before submission
- Understand what metrics the system evaluates
- Learn about their writing patterns and areas for improvement

## API Response Format
The analysis returns detailed metrics including:
- Formality score (0-1)
- Complexity score (0-1) 
- Sentiment analysis (polarity, bucket)
- Readability scores (multiple indices)
- Grammar error count and details
- Tone classification
- Lexical diversity and richness
- Passive voice usage
- Hedging detection
- Anomaly detection results

## Future Enhancements
- Save analysis results for future reference
- Export results to PDF or other formats
- Compare multiple texts side by side
- Historical analysis tracking for manual analyses
