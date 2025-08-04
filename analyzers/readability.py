# analyzers/readability.py

import textstat

def analyze_readability(text):
    """
    Analyzes text readability using multiple academic scoring methods.
    
    Args:
        text (str): The text to analyze
        
    Returns:
        dict: Dictionary containing readability scores and metrics
    """
    if not text or not text.strip():
        return {
            "flesch_kincaid_grade": 0,
            "smog_index": 0,
            "gunning_fog": 0,
            "dale_chall_score": 0,
            "word_count": 0,
            "sentence_count": 0,
            "error": "No text provided for analysis"
        }
    
    try:
        return {
            "flesch_kincaid_grade": round(textstat.flesch_kincaid_grade(text), 2),
            "smog_index": round(textstat.smog_index(text), 2),
            "gunning_fog": round(textstat.gunning_fog(text), 2),
            "dale_chall_score": round(textstat.dale_chall_readability_score(text), 2),
            "word_count": textstat.lexicon_count(text, removepunct=True),
            "sentence_count": textstat.sentence_count(text)
        }
    except Exception as e:
        return {
            "flesch_kincaid_grade": 0,
            "smog_index": 0,
            "gunning_fog": 0,
            "dale_chall_score": 0,
            "word_count": 0,
            "sentence_count": 0,
            "error": f"Error analyzing readability: {str(e)}"
        }

def get_readability_interpretation(scores):
    """
    Provides educational interpretation of readability scores.
    
    Args:
        scores (dict): Dictionary containing readability scores
        
    Returns:
        dict: Dictionary with interpretations and recommendations
    """
    fk_grade = scores.get("flesch_kincaid_grade", 0)
    smog = scores.get("smog_index", 0)
    gunning_fog = scores.get("gunning_fog", 0)
    dale_chall = scores.get("dale_chall_score", 0)
    
    interpretations = {
        "flesch_kincaid": {
            "score": fk_grade,
            "interpretation": _interpret_flesch_kincaid(fk_grade),
            "recommendation": _get_fk_recommendation(fk_grade)
        },
        "smog": {
            "score": smog,
            "interpretation": _interpret_smog(smog),
            "recommendation": _get_smog_recommendation(smog)
        },
        "gunning_fog": {
            "score": gunning_fog,
            "interpretation": _interpret_gunning_fog(gunning_fog),
            "recommendation": _get_gunning_fog_recommendation(gunning_fog)
        },
        "dale_chall": {
            "score": dale_chall,
            "interpretation": _interpret_dale_chall(dale_chall),
            "recommendation": _get_dale_chall_recommendation(dale_chall)
        }
    }
    
    return interpretations

def _interpret_flesch_kincaid(grade):
    """Interpret Flesch-Kincaid Grade Level."""
    if grade <= 5:
        return "Elementary school level - very easy to read"
    elif grade <= 8:
        return "Middle school level - moderately easy to read"
    elif grade <= 12:
        return "High school level - standard reading difficulty"
    elif grade <= 16:
        return "College level - advanced reading required"
    else:
        return "Graduate level - very advanced reading required"

def _get_fk_recommendation(grade):
    """Get recommendations based on Flesch-Kincaid score."""
    if grade <= 5:
        return "Consider using more complex vocabulary for academic writing"
    elif grade <= 8:
        return "Appropriate for general audience, consider audience needs"
    elif grade <= 12:
        return "Good for academic writing, suitable for educated adults"
    elif grade <= 16:
        return "Advanced level - ensure your audience can handle this complexity"
    else:
        return "Very advanced - consider simplifying for broader accessibility"

def _interpret_smog(years):
    """Interpret SMOG Index (years of education needed)."""
    if years <= 6:
        return "Elementary level - requires 6 years of education"
    elif years <= 10:
        return "Middle school level - requires 6-10 years of education"
    elif years <= 12:
        return "High school level - requires 10-12 years of education"
    elif years <= 16:
        return "College level - requires 12-16 years of education"
    else:
        return "Graduate level - requires 16+ years of education"

def _get_smog_recommendation(years):
    """Get recommendations based on SMOG score."""
    if years <= 6:
        return "Very simple text - may be too basic for academic writing"
    elif years <= 10:
        return "Good for general audience - consider your target readers"
    elif years <= 12:
        return "Appropriate for high school and general adult audience"
    elif years <= 16:
        return "Suitable for college-educated audience"
    else:
        return "Very complex - ensure your audience has advanced education"

def _interpret_gunning_fog(grade):
    """Interpret Gunning Fog Index."""
    if grade <= 6:
        return "Very easy to read - elementary level"
    elif grade <= 10:
        return "Easy to read - middle school level"
    elif grade <= 15:
        return "Standard difficulty - high school to college level"
    elif grade <= 20:
        return "Difficult to read - college to graduate level"
    else:
        return "Very difficult to read - graduate level and above"

def _get_gunning_fog_recommendation(grade):
    """Get recommendations based on Gunning Fog score."""
    if grade <= 6:
        return "Very simple - may need more sophisticated vocabulary"
    elif grade <= 10:
        return "Good for general audience - consider complexity needs"
    elif grade <= 15:
        return "Appropriate for educated adult audience"
    elif grade <= 20:
        return "Complex text - ensure audience can handle this level"
    else:
        return "Very complex - consider simplifying for broader accessibility"

def _interpret_dale_chall(score):
    """Interpret Dale-Chall Readability Score."""
    if score <= 4.9:
        return "Easy to read - 4th grade level and below"
    elif score <= 5.9:
        return "Easy to read - 5th-6th grade level"
    elif score <= 6.9:
        return "Easy to read - 7th-8th grade level"
    elif score <= 7.9:
        return "Easy to read - 9th-10th grade level"
    elif score <= 8.9:
        return "Easy to read - 11th-12th grade level"
    elif score <= 9.9:
        return "Difficult to read - college level"
    else:
        return "Very difficult to read - college graduate level"

def _get_dale_chall_recommendation(score):
    """Get recommendations based on Dale-Chall score."""
    if score <= 4.9:
        return "Very simple vocabulary - may be too basic for academic writing"
    elif score <= 6.9:
        return "Simple vocabulary - good for general audience"
    elif score <= 8.9:
        return "Moderate vocabulary - appropriate for educated adults"
    elif score <= 9.9:
        return "Advanced vocabulary - suitable for college-educated audience"
    else:
        return "Very advanced vocabulary - ensure audience has graduate-level education" 