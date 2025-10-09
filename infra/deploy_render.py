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
    if not os.path.exists("backend/requirements.txt"):
        print("❌ Error: backend/requirements.txt not found. Please run from project root.")
        sys.exit(1)
    
    # Create backup of original requirements
    if os.path.exists("backend/requirements.txt"):
        shutil.copy("backend/requirements.txt", "backend/requirements-full.txt")
        print("✅ Backed up original requirements.txt to requirements-full.txt")
    
    # Use minimal requirements for deployment
    if os.path.exists("requirements-render-minimal.txt"):
        shutil.copy("requirements-render-minimal.txt", "backend/requirements.txt")
        print("✅ Using minimal requirements for deployment")
    
    # Create backup of original main.py
    if os.path.exists("backend/main.py"):
        shutil.copy("backend/main.py", "backend/main-full.py")
        print("✅ Backed up original main.py to main-full.py")
    
    print("✅ Backend structure is already optimized for deployment")
    
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
    
    if os.path.exists("backend/requirements-full.txt"):
        shutil.copy("backend/requirements-full.txt", "backend/requirements.txt")
        print("✅ Restored full requirements.txt")
    
    if os.path.exists("backend/main-full.py"):
        shutil.copy("backend/main-full.py", "backend/main.py")
        print("✅ Restored full main.py")
    
    print("✅ Full functionality restored!")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "restore":
        restore_full()
    else:
        main()



