#!/usr/bin/env python3
"""
Test harness for Claude Code hooks.
Allows testing hooks without running Claude Code.
"""

import json
import subprocess
import tempfile
import os
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, Tuple, Any

class HookTester:
    def __init__(self, repo_path: str = None):
        self.repo_path = Path(repo_path or Path(__file__).parent.parent.parent)
        self.hooks_dir = self.repo_path / "scripts" / "hooks"
        self.temp_session_file = Path("/tmp/claude-gitops-session.json")
        
        # Enable debug mode for testing
        os.environ['CLAUDE_HOOKS_DEBUG'] = 'true'
    
    def test_post_tool_use(self, tool_name: str, tool_input: Dict[str, Any]) -> Tuple[int, str, str]:
        """Test post-tool-use hook with simulated input."""
        test_input = {
            "tool": tool_name,
            "tool_input": tool_input,
            "session_id": f"test-session-{datetime.now().strftime('%Y%m%d-%H%M%S')}",
            "timestamp": datetime.now().isoformat()
        }
        
        print(f"\n=== Testing post-tool-use with {tool_name} ===")
        print(f"Input: {json.dumps(tool_input, indent=2)}")
        
        # Run hook with test input
        result = subprocess.run(
            ["python3", str(self.hooks_dir / "post-tool-use.py")],
            input=json.dumps(test_input),
            capture_output=True,
            text=True,
            cwd=str(self.repo_path)
        )
        
        print(f"Exit code: {result.returncode}")
        if result.stdout:
            print(f"Stdout: {result.stdout}")
        if result.stderr:
            print(f"Stderr: {result.stderr}")
        
        return result.returncode, result.stdout, result.stderr
    
    def test_pre_compact(self, trigger: str = "manual", custom_instructions: str = "") -> Tuple[int, str, str]:
        """Test pre-compact hook."""
        test_input = {
            "session_id": f"test-session-{datetime.now().strftime('%Y%m%d-%H%M%S')}",
            "transcript_path": str(self.repo_path / "test_transcript.md"),
            "hook_event_name": "pre-compact",
            "trigger": trigger,
            "custom_instructions": custom_instructions
        }
        
        print(f"\n=== Testing pre-compact ({trigger}) ===")
        
        # Create the pre-compact hook if it doesn't exist
        pre_compact_hook = self.hooks_dir / "pre-compact.py"
        if not pre_compact_hook.exists():
            print("Creating pre-compact.py hook...")
            self._create_pre_compact_hook()
        
        # Run hook
        result = subprocess.run(
            ["python3", str(pre_compact_hook)],
            input=json.dumps(test_input),
            capture_output=True,
            text=True,
            cwd=str(self.repo_path)
        )
        
        print(f"Exit code: {result.returncode}")
        if result.stdout:
            print(f"Stdout: {result.stdout}")
        if result.stderr:
            print(f"Stderr: {result.stderr}")
        
        return result.returncode, result.stdout, result.stderr
    
    def test_session_stop(self) -> Tuple[int, str, str]:
        """Test session-stop hook."""
        test_input = {
            "session_id": f"test-session-{datetime.now().strftime('%Y%m%d-%H%M%S')}",
            "timestamp": datetime.now().isoformat()
        }
        
        print(f"\n=== Testing session-stop ===")
        
        # Run hook
        result = subprocess.run(
            ["python3", str(self.hooks_dir / "session-stop.py")],
            input=json.dumps(test_input),
            capture_output=True,
            text=True,
            cwd=str(self.repo_path)
        )
        
        print(f"Exit code: {result.returncode}")
        if result.stdout:
            print(f"Stdout: {result.stdout}")
        if result.stderr:
            print(f"Stderr: {result.stderr}")
        
        return result.returncode, result.stdout, result.stderr
    
    def test_full_session(self):
        """Test a complete session workflow."""
        print("\n" + "="*60)
        print("TESTING FULL SESSION WORKFLOW")
        print("="*60)
        
        # Clean up any existing session data
        if self.temp_session_file.exists():
            self.temp_session_file.unlink()
        
        # 1. Simulate multiple tool uses
        print("\n1. Simulating tool uses...")
        
        self.test_post_tool_use("Edit", {
            "file_path": "src/components/TestComponent.tsx",
            "old_string": "const old = 1",
            "new_string": "const new = 2",
            "description": "Update test component"
        })
        
        self.test_post_tool_use("Write", {
            "file_path": "src/utils/newUtil.ts",
            "content": "export const util = () => {}",
            "description": "Create new utility"
        })
        
        # 2. Check if session file was created
        print("\n2. Checking session accumulation...")
        if self.temp_session_file.exists():
            with open(self.temp_session_file) as f:
                session_data = json.load(f)
                print(f"Session has {len(session_data.get('operations', []))} operations")
        else:
            print("WARNING: No session file created")
        
        # 3. Test pre-compact
        print("\n3. Testing pre-compact...")
        self.test_pre_compact("manual", "Testing hooks before compaction")
        
        # 4. Test session stop
        print("\n4. Testing session stop...")
        self.test_session_stop()
        
        print("\n" + "="*60)
        print("FULL SESSION TEST COMPLETE")
        print("="*60)
    
    def _create_pre_compact_hook(self):
        """Create a basic pre-compact hook for testing."""
        content = '''#!/usr/bin/env python3
"""Pre-compact hook - generates session documentation before context is cleared."""

import sys
import json
from datetime import datetime
from pathlib import Path

def main():
    try:
        input_data = json.load(sys.stdin)
        
        session_id = input_data.get('session_id', 'unknown')
        trigger = input_data.get('trigger', 'unknown')
        
        print(f"Pre-compact hook triggered ({trigger}) for session {session_id}", file=sys.stderr)
        
        # TODO: Implement session documentation generation
        # TODO: Create git commit with session summary
        # TODO: Update project status files
        
        sys.exit(0)
    except Exception as e:
        print(f"Error in pre-compact hook: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
'''
        
        hook_path = self.hooks_dir / "pre-compact.py"
        hook_path.write_text(content)
        hook_path.chmod(0o755)

def main():
    """Run hook tests."""
    tester = HookTester()
    
    if len(sys.argv) > 1:
        test_type = sys.argv[1]
        
        if test_type == "post-tool-use":
            tester.test_post_tool_use("Edit", {
                "file_path": "test.tsx",
                "old_string": "old",
                "new_string": "new"
            })
        elif test_type == "pre-compact":
            tester.test_pre_compact()
        elif test_type == "session-stop":
            tester.test_session_stop()
        elif test_type == "full":
            tester.test_full_session()
        else:
            print(f"Unknown test type: {test_type}")
            print("Usage: python test_hooks.py [post-tool-use|pre-compact|session-stop|full]")
    else:
        # Run all tests
        tester.test_full_session()

if __name__ == "__main__":
    main()