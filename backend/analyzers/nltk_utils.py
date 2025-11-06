"""
Utility functions for safe NLTK data loading with fallbacks.
Handles serverless environments where NLTK data may not be available.
"""

import os
import nltk

# Common English stopwords as fallback if NLTK stopwords unavailable
FALLBACK_STOPWORDS = {
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've",
    "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself',
    'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them',
    'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll",
    'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has',
    'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or',
    'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'through', 'during',
    'before', 'after', 'above', 'below', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under',
    'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all',
    'each', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
    'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't",
    'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't",
    'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't",
    'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn',
    "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't",
    'won', "won't", 'wouldn', "wouldn't"
}

# Set NLTK data path for serverless environments
def setup_nltk_path():
    """Configure NLTK data path for serverless environments."""
    if os.path.exists('/tmp'):
        nltk.data.path.insert(0, '/tmp/nltk_data')
        if '/tmp' not in nltk.data.path:
            nltk.data.path.append('/tmp')

def safe_download_nltk_data(resource_name: str, download_dir: str = None) -> bool:
    """
    Safely attempt to download NLTK data.
    
    Args:
        resource_name: Name of NLTK resource (e.g., 'punkt', 'stopwords', 'averaged_perceptron_tagger')
        download_dir: Directory to download to (default: /tmp if available)
        
    Returns:
        True if resource is available (either found or downloaded), False otherwise
    """
    # Map resource names to their expected paths
    resource_paths = {
        'punkt': 'tokenizers/punkt',
        'stopwords': 'corpora/stopwords',
        'averaged_perceptron_tagger': 'taggers/averaged_perceptron_tagger'
    }
    
    # Check known paths first
    if resource_name in resource_paths:
        try:
            nltk.data.find(resource_paths[resource_name])
            return True
        except LookupError:
            pass
    else:
        # For unknown resources, try common paths
        for path_prefix in ['tokenizers', 'taggers', 'corpora']:
            try:
                nltk.data.find(f'{path_prefix}/{resource_name}')
                return True
            except LookupError:
                continue
    
    # Try to download if not found
    try:
        if download_dir is None:
            download_dir = '/tmp/nltk_data' if os.path.exists('/tmp') else None
        
        nltk.download(resource_name, quiet=True, download_dir=download_dir)
        # Verify download succeeded by trying to find it
        try:
            if resource_name in resource_paths:
                nltk.data.find(resource_paths[resource_name])
            return True
        except LookupError:
            # Download may have succeeded but path is wrong, return False to use fallback
            return False
    except Exception:
        return False

def get_stopwords() -> set:
    """
    Safely get English stopwords with fallback.
    
    Returns:
        Set of stopwords (from NLTK if available, otherwise fallback set)
    """
    try:
        from nltk.corpus import stopwords
        return set(stopwords.words('english'))
    except (LookupError, OSError, ImportError):
        return FALLBACK_STOPWORDS

def safe_word_tokenize(text: str) -> list:
    """
    Safely tokenize text into words with error handling.
    
    Args:
        text: Input text to tokenize
        
    Returns:
        List of tokens (empty list if tokenization fails)
    """
    try:
        # Try to download punkt if not available
        safe_download_nltk_data('punkt')
        from nltk.tokenize import word_tokenize
        return word_tokenize(text)
    except (LookupError, OSError, ImportError, Exception):
        # Fallback to simple whitespace tokenization
        return text.split()

def safe_sent_tokenize(text: str) -> list:
    """
    Safely tokenize text into sentences with error handling.
    
    Args:
        text: Input text to tokenize
        
    Returns:
        List of sentences (single-item list with full text if tokenization fails)
    """
    try:
        # Try to download punkt if not available
        safe_download_nltk_data('punkt')
        from nltk.tokenize import sent_tokenize
        return sent_tokenize(text)
    except (LookupError, OSError, ImportError, Exception):
        # Fallback to simple sentence splitting
        sentences = []
        for line in text.split('\n'):
            for sent in line.split('.'):
                sent = sent.strip()
                if sent:
                    sentences.append(sent + '.')
        return sentences if sentences else [text]

def safe_pos_tag(words: list) -> list:
    """
    Safely perform part-of-speech tagging with error handling.
    
    Args:
        words: List of words to tag
        
    Returns:
        List of (word, tag) tuples (words with 'UNKNOWN' tag if tagging fails)
    """
    try:
        # Try to download tagger if not available
        safe_download_nltk_data('averaged_perceptron_tagger')
        from nltk.tag import pos_tag
        return pos_tag(words)
    except (LookupError, OSError, ImportError, Exception):
        # Fallback: return words with unknown tags
        return [(word, 'UNKNOWN') for word in words]

# Initialize NLTK path on module import
setup_nltk_path()

