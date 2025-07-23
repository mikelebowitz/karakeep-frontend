#!/usr/bin/env python3
"""
Minimal Claude Code Stop hook for testing.
No dependencies or imports to isolate the issue.
"""

import sys
import os

def main():
    """Minimal session stop hook entry point."""
    try:
        # Debug output to confirm this version is running
        print(f"[DEBUG] MINIMAL session-stop v1.0 - File path: {__file__}", file=sys.stderr)
        print(f"[DEBUG] Python version: {sys.version}", file=sys.stderr)
        print(f"[DEBUG] Working directory: {os.getcwd()}", file=sys.stderr)
        print(f"[DEBUG] Environment PATH: {os.environ.get('PATH', 'NOT_SET')}", file=sys.stderr)
        print(f"[DEBUG] Python executable: {sys.executable}", file=sys.stderr)
        
        # Read any input (but don't require it)
        try:
            input_data = sys.stdin.read()
            print(f"[DEBUG] Received input: {len(input_data)} characters", file=sys.stderr)
        except:
            print(f"[DEBUG] No input received", file=sys.stderr)
        
        print(f"[DEBUG] Minimal session-stop hook completed successfully", file=sys.stderr)
        
        # Exit successfully
        sys.exit(0)
        
    except Exception as e:
        print(f"[ERROR] Minimal session-stop hook failed: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()