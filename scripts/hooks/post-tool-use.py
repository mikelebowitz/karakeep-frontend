#!/usr/bin/env python3
"""
Claude Code PostToolUse hook for GitOps automation.
Captures development work and automatically generates documentation and commits.
"""

import sys
import json
import os
import time
from pathlib import Path

# Add utils to Python path
sys.path.insert(0, str(Path(__file__).parent / "utils"))

from git_analyzer import GitAnalyzer
from doc_generator import DocumentationGenerator
from commit_creator import CommitCreator

class GitOpsHook:
    def __init__(self):
        self.repo_path = Path(__file__).parent.parent.parent
        self.config_path = self.repo_path / "scripts/hooks/config/gitops-config.json"
        self.session_file = Path("/tmp/claude-gitops-session.json")
        
        # Initialize components
        self.git_analyzer = GitAnalyzer(str(self.repo_path))
        self.doc_generator = DocumentationGenerator(str(self.repo_path), str(self.config_path))
        self.commit_creator = CommitCreator(str(self.repo_path), str(self.config_path))
        
        # Load configuration
        self.config = self._load_config()
    
    def _load_config(self) -> dict:
        """Load GitOps configuration."""
        try:
            with open(self.config_path) as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError) as e:
            print(f"Error loading config: {e}", file=sys.stderr)
            return {"gitops": {"enabled": True, "target_tools": ["Edit", "Write", "MultiEdit", "Bash"]}}
    
    def should_process_tool(self, tool_name: str) -> bool:
        """Determine if this tool should trigger GitOps processing."""
        target_tools = self.config.get("gitops", {}).get("target_tools", ["Edit", "Write", "MultiEdit", "Bash"])
        return tool_name in target_tools
    
    def load_session_data(self) -> list:
        """Load existing session data."""
        try:
            if self.session_file.exists():
                with open(self.session_file) as f:
                    data = json.load(f)
                    # Check if session is still valid (within max duration)
                    max_duration = self.config.get("gitops", {}).get("max_session_duration", 3600)
                    if time.time() - data.get("start_time", 0) < max_duration:
                        return data.get("operations", [])
        except (FileNotFoundError, json.JSONDecodeError):
            pass
        
        return []
    
    def save_session_data(self, operations: list):
        """Save session data to temporary storage."""
        try:
            session_data = {
                "start_time": time.time(),
                "operations": operations
            }
            
            with open(self.session_file, 'w') as f:
                json.dump(session_data, f, indent=2)
                
        except Exception as e:
            print(f"Error saving session data: {e}", file=sys.stderr)
    
    def process_tool_use(self, input_data: dict) -> bool:
        """Process a tool use event and perform GitOps operations."""
        tool_name = input_data.get('tool', '')
        
        # Check if we should process this tool
        if not self.should_process_tool(tool_name):
            return True  # Success, but no processing needed
        
        # Check if GitOps is enabled
        if not self.config.get("gitops", {}).get("enabled", True):
            return True
        
        try:
            # Analyze current git state
            if not self.git_analyzer.has_changes():
                print("No git changes detected, skipping GitOps processing", file=sys.stderr)
                return True
            
            # Generate change summary
            change_summary = self.git_analyzer.generate_change_summary(input_data)
            
            # Load session data
            session_operations = self.load_session_data()
            
            # Add current operation to session
            current_operation = {
                "timestamp": time.time(),
                "tool": tool_name,
                "tool_input": input_data.get('tool_input', {}),
                "change_summary": change_summary
            }
            session_operations.append(current_operation)
            
            # Check if we should batch commits or commit immediately
            batch_commits = self.config.get("gitops", {}).get("batch_commits", True)
            
            if batch_commits:
                # Save session and defer commit
                self.save_session_data(session_operations)
                self._update_documentation_only(change_summary, input_data)
                print(f"Added {tool_name} operation to session batch", file=sys.stderr)
            else:
                # Immediate processing
                self._process_immediate_commit(change_summary, input_data, session_operations)
            
            return True
            
        except Exception as e:
            print(f"Error in GitOps hook: {e}", file=sys.stderr)
            return True  # Non-blocking error
    
    def _update_documentation_only(self, change_summary: dict, tool_context: dict):
        """Update documentation without committing."""
        try:
            if self.config.get("documentation", {}).get("update_progress", True):
                self.doc_generator.update_progress_file(change_summary, tool_context)
            
            if self.config.get("documentation", {}).get("generate_changelog", True):
                self.doc_generator.update_changelog(change_summary, tool_context)
            
            if self.config.get("documentation", {}).get("update_readme", True):
                self.doc_generator.update_readme_status(change_summary, tool_context)
                
        except Exception as e:
            print(f"Error updating documentation: {e}", file=sys.stderr)
    
    def _process_immediate_commit(self, change_summary: dict, tool_context: dict, session_operations: list):
        """Process immediate commit and push."""
        try:
            # Update documentation
            self._update_documentation_only(change_summary, tool_context)
            
            # Create commit
            if self.commit_creator.create_commit(change_summary, tool_context, session_operations):
                print("Created commit successfully", file=sys.stderr)
                
                # Push to GitHub if configured
                if self.config.get("github", {}).get("auto_push", True):
                    remote = self.config.get("github", {}).get("remote", "origin")
                    
                    if self.commit_creator.push_to_remote(remote):
                        print("Pushed to GitHub successfully", file=sys.stderr)
                    else:
                        print("Failed to push to GitHub", file=sys.stderr)
            else:
                print("Failed to create commit", file=sys.stderr)
            
            # Clear session data
            if self.session_file.exists():
                self.session_file.unlink()
                
        except Exception as e:
            print(f"Error in immediate commit processing: {e}", file=sys.stderr)
    
    def process_session_end(self) -> bool:
        """Process session end - commit batched operations."""
        try:
            session_operations = self.load_session_data()
            
            if not session_operations:
                return True  # No operations to process
            
            # Get overall change summary
            if not self.git_analyzer.has_changes():
                # Clear session file if no changes
                if self.session_file.exists():
                    self.session_file.unlink()
                return True
            
            change_summary = self.git_analyzer.generate_change_summary()
            
            # Create session summary
            session_duration = int(time.time() - session_operations[0].get("timestamp", time.time()))
            
            # Update documentation with session context
            self._update_documentation_only(change_summary, None)
            
            # Create commit with session context
            if self.commit_creator.create_commit(change_summary, None, session_operations):
                print(f"Created session commit with {len(session_operations)} operations", file=sys.stderr)
                
                # Push to GitHub if configured
                if self.config.get("github", {}).get("auto_push", True):
                    remote = self.config.get("github", {}).get("remote", "origin")
                    
                    if self.commit_creator.push_to_remote(remote):
                        print("Pushed session to GitHub successfully", file=sys.stderr)
            
            # Clear session data
            if self.session_file.exists():
                self.session_file.unlink()
            
            return True
            
        except Exception as e:
            print(f"Error processing session end: {e}", file=sys.stderr)
            return True  # Non-blocking

def main():
    """Main hook entry point."""
    try:
        # Read input from stdin
        input_data = json.load(sys.stdin)
        
        # Initialize hook
        hook = GitOpsHook()
        
        # Process the tool use
        success = hook.process_tool_use(input_data)
        
        # Exit with appropriate code
        sys.exit(0 if success else 1)
        
    except json.JSONDecodeError:
        print("Error: Invalid JSON input", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error in GitOps hook: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()