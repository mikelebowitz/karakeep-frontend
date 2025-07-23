#!/usr/bin/env python3
"""
Claude Code Stop hook for GitOps session processing.
Processes batched operations when Claude Code session ends.
"""

import sys
import json
import os
from pathlib import Path

# Add parent directory to Python path to import post_tool_use
sys.path.insert(0, str(Path(__file__).parent))

from post_tool_use import GitOpsHook

def main():
    """Main session stop hook entry point."""
    try:
        # Read input from stdin (though Stop hooks may not have much context)
        try:
            input_data = json.load(sys.stdin)
        except json.JSONDecodeError:
            input_data = {}
        
        # Initialize hook
        hook = GitOpsHook()
        
        # Process session end
        success = hook.process_session_end()
        
        # Exit with appropriate code
        sys.exit(0 if success else 1)
        
    except Exception as e:
        print(f"Error in session stop hook: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()