#!/usr/bin/env python3
"""
Test script to verify requirements installation before Render deployment.
This helps catch blis and other compilation issues locally.
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(command, description):
    """Run a command and return success status."""
    print(f"\n🔄 {description}")
    print(f"Running: {command}")
    
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            capture_output=True, 
            text=True, 
            cwd=Path(__file__).parent
        )
        
        if result.returncode == 0:
            print(f"✅ {description} - SUCCESS")
            return True
        else:
            print(f"❌ {description} - FAILED")
            print(f"Error: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ {description} - EXCEPTION: {e}")
        return False

def test_requirements(requirements_file):
    """Test installation of a requirements file."""
    print(f"\n📦 Testing {requirements_file}")
    
    # Create a temporary virtual environment
    venv_name = f"test_venv_{requirements_file.replace('.txt', '')}"
    
    # Clean up any existing test venv
    run_command(f"rm -rf {venv_name}", f"Cleaning up existing {venv_name}")
    
    # Create new virtual environment
    if not run_command(f"python3 -m venv {venv_name}", f"Creating virtual environment {venv_name}"):
        return False
    
    # Activate and install requirements
    activate_cmd = f"source {venv_name}/bin/activate"
    install_cmd = f"{activate_cmd} && pip install --upgrade pip setuptools wheel"
    
    if not run_command(install_cmd, "Upgrading pip, setuptools, and wheel"):
        return False
    
    # Install requirements
    install_req_cmd = f"{activate_cmd} && pip install -r {requirements_file}"
    if not run_command(install_req_cmd, f"Installing {requirements_file}"):
        return False
    
    # Test basic imports
    test_imports_cmd = f"{activate_cmd} && python -c \"import fastapi, uvicorn, pydantic; print('✅ Core imports successful')\""
    if not run_command(test_imports_cmd, "Testing core imports"):
        return False
    
    # Test NLP imports (if applicable)
    if "spacy" in open(requirements_file).read():
        test_spacy_cmd = f"{activate_cmd} && python -c \"import spacy; print('✅ spaCy import successful')\""
        if not run_command(test_spacy_cmd, "Testing spaCy import"):
            return False
    
    # Clean up
    run_command(f"rm -rf {venv_name}", f"Cleaning up {venv_name}")
    
    return True

def main():
    """Main test function."""
    print("🧪 Testing Requirements for Render Deployment")
    print("=" * 50)
    
    # Test main requirements
    main_success = test_requirements("requirements.txt")
    
    # Test render-optimized requirements
    render_success = test_requirements("requirements-render.txt")
    
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS")
    print("=" * 50)
    
    if main_success:
        print("✅ requirements.txt - READY FOR DEPLOYMENT")
    else:
        print("❌ requirements.txt - HAS ISSUES")
    
    if render_success:
        print("✅ requirements-render.txt - READY FOR DEPLOYMENT")
    else:
        print("❌ requirements-render.txt - HAS ISSUES")
    
    if not main_success and not render_success:
        print("\n🚨 Both requirements files have issues!")
        print("Consider using Docker deployment or alternative platform.")
        sys.exit(1)
    elif not main_success:
        print("\n💡 Use requirements-render.txt for Render deployment")
        print("Update your Render build command to: pip install -r requirements-render.txt")
    else:
        print("\n🎉 All tests passed! Ready for deployment.")

if __name__ == "__main__":
    main()
