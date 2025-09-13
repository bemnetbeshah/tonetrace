#!/usr/bin/env python3
"""
Deployment script for Render free tier optimization.
This script helps prepare the codebase for deployment with minimal memory usage.
"""

import os
import shutil
import subprocess
import sys

def main():
    print("🚀 Preparing ToneTrace for Render free tier deployment...")
    
    # Check if we're in the right directory
    if not os.path.exists("requirements.txt"):
        print("❌ Error: requirements.txt not found. Please run from project root.")
        sys.exit(1)
    
    # Create backup of original requirements
    if os.path.exists("requirements.txt"):
        shutil.copy("requirements.txt", "requirements-full.txt")
        print("✅ Backed up original requirements.txt to requirements-full.txt")
    
    # Use minimal requirements for deployment
    if os.path.exists("requirements-render-minimal.txt"):
        shutil.copy("requirements-render-minimal.txt", "requirements.txt")
        print("✅ Using minimal requirements for deployment")
    
    # Create backup of original main.py
    if os.path.exists("app/main.py"):
        shutil.copy("app/main.py", "app/main-full.py")
        print("✅ Backed up original main.py to main-full.py")
    
    # Use lightweight main for deployment
    if os.path.exists("app/main_lightweight.py"):
        shutil.copy("app/main_lightweight.py", "app/main.py")
        print("✅ Using lightweight main.py for deployment")
    
    # Create backup of original analyze route
    if os.path.exists("routes/analyze.py"):
        shutil.copy("routes/analyze.py", "routes/analyze-full.py")
        print("✅ Backed up original analyze.py to analyze-full.py")
    
    # Use lightweight analyze route for deployment
    if os.path.exists("routes/analyze_lightweight.py"):
        shutil.copy("routes/analyze_lightweight.py", "routes/analyze.py")
        print("✅ Using lightweight analyze.py for deployment")
    
    print("\n🎯 Deployment optimizations applied:")
    print("   • Removed spaCy dependency (~50MB)")
    print("   • Removed transformers dependency (~500MB+)")
    print("   • Removed torch dependency (~200MB+)")
    print("   • Using NLTK + TextBlob for NLP")
    print("   • Using rule-based tone analysis")
    print("   • Total estimated memory usage: <200MB")
    
    print("\n📋 Next steps:")
    print("   1. Commit these changes to your repository")
    print("   2. Deploy to Render using the render.yaml configuration")
    print("   3. Monitor memory usage in Render dashboard")
    
    print("\n🔄 To restore full functionality after deployment:")
    print("   python restore_full.py")

def restore_full():
    """Restore full functionality after deployment"""
    print("🔄 Restoring full functionality...")
    
    if os.path.exists("requirements-full.txt"):
        shutil.copy("requirements-full.txt", "requirements.txt")
        print("✅ Restored full requirements.txt")
    
    if os.path.exists("app/main-full.py"):
        shutil.copy("app/main-full.py", "app/main.py")
        print("✅ Restored full main.py")
    
    if os.path.exists("routes/analyze-full.py"):
        shutil.copy("routes/analyze-full.py", "routes/analyze.py")
        print("✅ Restored full analyze.py")
    
    print("✅ Full functionality restored!")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "restore":
        restore_full()
    else:
        main()
