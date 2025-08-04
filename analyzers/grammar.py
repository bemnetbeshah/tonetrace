# analyzers/grammar.py

import spacy
from analyzers.grammar_rules import run_all_rules

nlp = spacy.load("en_core_web_sm")

def analyze_grammar(text):
    doc = nlp(text)
    errors = run_all_rules(doc)
    return {
        "num_errors": len(errors),
        "errors": errors
    } 