#!/usr/bin/env python3
"""
Claude Code Stop hook for GitOps session processing.
Processes batched operations when Claude Code session ends.
"""

import sys
import json
import os
import importlib.util
from pathlib import Path

def main():
    """Main session stop hook entry point."""
    try:
        # Debug output to confirm correct version is running
        print(f"[DEBUG] session-stop.py v4.0-FRESH - File path: {__file__}", file=sys.stderr)
        print(f"[DEBUG] Python version: {sys.version}", file=sys.stderr)
        print(f"[DEBUG] Current working directory: {os.getcwd()}", file=sys.stderr)
        
        # Add utils to Python path
        utils_path = Path(__file__).parent / "utils"
        sys.path.insert(0, str(utils_path))
        
        # Import GitOpsHook class from post-tool-use.py
        post_tool_use_path = Path(__file__).parent / "post-tool-use.py"
        spec = importlib.util.spec_from_file_location("post_tool_use_module", post_tool_use_path)
        post_tool_use_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(post_tool_use_module)
        GitOpsHook = post_tool_use_module.GitOpsHook
        
        print(f"[DEBUG] Successfully imported GitOpsHook from {post_tool_use_path}", file=sys.stderr)
        
        # Read input from stdin (though Stop hooks may not have much context)
        try:
            input_data = json.load(sys.stdin)
        except json.JSONDecodeError:
            input_data = {}
        
        # Initialize hook
        hook = GitOpsHook()
        
        # Process session end
        success = hook.process_session_end()
        
        print(f"[DEBUG] Session end processing completed with success: {success}", file=sys.stderr)
        
        # Exit with appropriate code
        sys.exit(0 if success else 1)
        
    except Exception as e:
        print(f"[ERROR] Error in session stop hook: {e}", file=sys.stderr)
        print(f"[ERROR] Exception type: {type(e).__name__}", file=sys.stderr)
        import traceback
        print(f"[ERROR] Traceback: {traceback.format_exc()}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()