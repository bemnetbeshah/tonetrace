import pytest
import sys
import os

# Add the project root to sys.path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from analyzers.grammar import analyze_grammar

def test_subject_verb_agreement():
    """Test the subject-verb agreement detection with the example from the user."""
    test_text = "He go to school every day. They walks together sometimes."
    
    result = analyze_grammar(test_text)
    
    # Should detect 2 errors
    assert result["num_errors"] == 2
    
    # Check that both errors are subject-verb agreement errors
    errors = result["errors"]
    assert len(errors) == 2
    
    # Check first error: "He go"
    first_error = errors[0]
    assert first_error["type"] == "Subject-Verb Agreement"
    assert "'He' may not agree with 'go'" in first_error["error"]
    assert "He go to school every day." in first_error["sentence"]
    
    # Check second error: "They walks"
    second_error = errors[1]
    assert second_error["type"] == "Subject-Verb Agreement"
    assert "'They' may not agree with 'walks'" in second_error["error"]
    assert "They walks together sometimes." in second_error["sentence"]

def test_correct_grammar():
    """Test that correct grammar doesn't trigger errors."""
    test_text = "He goes to school every day. They walk together sometimes."
    
    result = analyze_grammar(test_text)
    
    # Should detect no errors
    assert result["num_errors"] == 0
    assert len(result["errors"]) == 0

def test_sentence_fragments():
    """Test the sentence fragment detection with the example from the user."""
    test_text = "I was tired. Went to sleep early. Because I had practice."
    
    result = analyze_grammar(test_text)
    
    # Should detect 2 fragment errors
    assert result["num_errors"] == 2
    
    # Check that both errors are sentence fragment errors
    errors = result["errors"]
    assert len(errors) == 2
    
    # Check first error: "Went to sleep early."
    first_error = errors[0]
    assert first_error["type"] == "Sentence Fragment"
    assert "This may be a sentence fragment (missing subject or verb, or starts with a subordinating conjunction)." in first_error["error"]
    assert "Went to sleep early." in first_error["sentence"]
    
    # Check second error: "Because I had practice."
    second_error = errors[1]
    assert second_error["type"] == "Sentence Fragment"
    assert "This may be a sentence fragment (missing subject or verb, or starts with a subordinating conjunction)." in second_error["error"]
    assert "Because I had practice." in second_error["sentence"]

if __name__ == "__main__":
    # Run the tests
    test_subject_verb_agreement()
    test_correct_grammar()
    test_sentence_fragments()
    print("All grammar tests passed!") 