#!/usr/bin/env python3
"""
Restore full functionality after deployment.
"""

import os
import shutil
import sys

def restore_full():
    """Restore full functionality after deployment"""
    print("🔄 Restoring full functionality...")
    
    if os.path.exists("requirements-full.txt"):
        shutil.copy("requirements-full.txt", "requirements.txt")
        print("✅ Restored full requirements.txt")
    else:
        print("⚠️  requirements-full.txt not found")
    
    if os.path.exists("app/main-full.py"):
        shutil.copy("app/main-full.py", "app/main.py")
        print("✅ Restored full main.py")
    else:
        print("⚠️  app/main-full.py not found")
    
    if os.path.exists("routes/analyze-full.py"):
        shutil.copy("routes/analyze-full.py", "routes/analyze.py")
        print("✅ Restored full analyze.py")
    else:
        print("⚠️  routes/analyze-full.py not found")
    
    print("✅ Full functionality restored!")

if __name__ == "__main__":
    restore_full()
