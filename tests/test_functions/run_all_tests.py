#!/usr/bin/env python3
"""
Test runner script for all analyzer functions.
This script runs all pytest tests for the analyzers and provides a summary.
"""

import sys
import os
import subprocess
import pytest

# Add the project root to sys.path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))


def run_tests_with_pytest():
    """Run all tests using pytest."""
    # Get the directory containing this script
    test_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Find all test files
    test_files = []
    for file in os.listdir(test_dir):
        if file.startswith('test_') and file.endswith('.py'):
            test_files.append(os.path.join(test_dir, file))
    
    print(f"Found {len(test_files)} test files:")
    for test_file in test_files:
        print(f"  - {os.path.basename(test_file)}")
    print()
    
    # Run pytest on each test file
    results = {}
    total_tests = 0
    total_passed = 0
    total_failed = 0
    
    for test_file in test_files:
        print(f"Running tests in {os.path.basename(test_file)}...")
        
        try:
            # Run pytest on the test file
            result = pytest.main([
                test_file,
                '-v',  # Verbose output
                '--tb=short',  # Short traceback format
                '--no-header',  # No pytest header
                '--no-summary'  # No pytest summary
            ])
            
            # Parse the result
            if result == 0:
                status = "PASSED"
                total_passed += 1
            else:
                status = "FAILED"
                total_failed += 1
            
            results[os.path.basename(test_file)] = status
            total_tests += 1
            
        except Exception as e:
            print(f"Error running tests in {os.path.basename(test_file)}: {e}")
            results[os.path.basename(test_file)] = "ERROR"
            total_failed += 1
            total_tests += 1
    
    # Print summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    for test_file, status in results.items():
        print(f"{test_file:<30} {status}")
    
    print("-"*60)
    print(f"Total test files: {total_tests}")
    print(f"Passed: {total_passed}")
    print(f"Failed: {total_failed}")
    print(f"Success rate: {(total_passed/total_tests)*100:.1f}%" if total_tests > 0 else "No tests run")
    
    return total_failed == 0


def run_individual_test(test_name):
    """Run a specific test file."""
    test_dir = os.path.dirname(os.path.abspath(__file__))
    test_file = os.path.join(test_dir, f"test_{test_name}.py")
    
    if not os.path.exists(test_file):
        print(f"Test file {test_file} not found!")
        return False
    
    print(f"Running {test_file}...")
    result = pytest.main([test_file, '-v'])
    return result == 0


def list_available_tests():
    """List all available test files."""
    test_dir = os.path.dirname(os.path.abspath(__file__))
    test_files = []
    
    for file in os.listdir(test_dir):
        if file.startswith('test_') and file.endswith('.py'):
            test_name = file[5:-3]  # Remove 'test_' prefix and '.py' suffix
            test_files.append(test_name)
    
    print("Available tests:")
    for test_name in sorted(test_files):
        print(f"  - {test_name}")
    
    return test_files


if __name__ == "__main__":
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == "list":
            list_available_tests()
        elif command == "run":
            if len(sys.argv) > 2:
                test_name = sys.argv[2]
                success = run_individual_test(test_name)
                sys.exit(0 if success else 1)
            else:
                print("Usage: python run_all_tests.py run <test_name>")
                print("Available tests:")
                list_available_tests()
        else:
            print("Unknown command. Use 'list' to see available tests or 'run <test_name>' to run a specific test.")
    else:
        # Run all tests by default
        success = run_tests_with_pytest()
        sys.exit(0 if success else 1) 