#!/usr/bin/env python3
"""
Development setup script for ToneTrace.

This script helps set up the development environment for both backend and frontend.
"""

import os
import subprocess
import sys
from pathlib import Path

def run_command(command, cwd=None):
    """Run a command and return success status."""
    try:
        result = subprocess.run(command, shell=True, cwd=cwd, check=True, capture_output=True, text=True)
        print(f"✅ {command}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {command}")
        print(f"   Error: {e.stderr}")
        return False

def setup_backend():
    """Set up the backend development environment."""
    print("🔧 Setting up backend...")
    
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("❌ Backend directory not found!")
        return False
    
    # Install Python dependencies
    if not run_command("pip install -r requirements.txt", cwd=backend_dir):
        return False
    
    # Download NLTK data
    nltk_setup = """
import nltk
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('stopwords')
nltk.download('vader_lexicon')
print('NLTK data downloaded successfully')
"""
    
    if not run_command(f'python -c "{nltk_setup}"', cwd=backend_dir):
        return False
    
    print("✅ Backend setup complete!")
    return True

def setup_frontend():
    """Set up the frontend development environment."""
    print("🔧 Setting up frontend...")
    
    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print("❌ Frontend directory not found!")
        return False
    
    # Install Node.js dependencies
    if not run_command("npm install", cwd=frontend_dir):
        return False
    
    print("✅ Frontend setup complete!")
    return True

def main():
    """Main setup function."""
    print("🚀 Setting up ToneTrace development environment...\n")
    
    # Check if we're in the project root
    if not Path("README.md").exists():
        print("❌ Please run this script from the project root directory.")
        sys.exit(1)
    
    success = True
    
    # Setup backend
    if not setup_backend():
        success = False
    
    print()
    
    # Setup frontend
    if not setup_frontend():
        success = False
    
    print("\n" + "="*50)
    
    if success:
        print("🎉 Development environment setup complete!")
        print("\nNext steps:")
        print("1. Start the backend: cd backend && python main.py")
        print("2. Start the frontend: cd frontend && npm run dev")
        print("3. Visit http://localhost:5173 to see the application")
    else:
        print("❌ Setup encountered errors. Please check the output above.")
        sys.exit(1)

if __name__ == "__main__":
    main()
