#!/usr/bin/env python3
"""
Intelligent commit creation utilities for Claude Code GitOps hooks.
Creates meaningful commit messages and handles git operations.
"""

import subprocess
import json
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

class CommitCreator:
    def __init__(self, repo_path: str = ".", config_path: str = "scripts/hooks/config/gitops-config.json"):
        self.repo_path = Path(repo_path)
        self.config_path = Path(config_path)
        self.config = self._load_config()
        
    def _load_config(self) -> Dict:
        """Load GitOps configuration."""
        try:
            with open(self.config_path) as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {"gitops": {"commit_templates": {}}}
    
    def create_commit(self, change_summary: Dict, tool_context: Dict = None, session_data: List[Dict] = None) -> bool:
        """Create an intelligent commit with proper staging and message."""
        try:
            # Stage relevant files
            if not self._stage_files(change_summary):
                print("No files to stage")
                return False
            
            # Generate commit message
            commit_message = self._generate_commit_message(change_summary, tool_context, session_data)
            
            # Create commit
            result = subprocess.run(
                ['git', 'commit', '-m', commit_message],
                cwd=self.repo_path,
                capture_output=True,
                text=True,
                check=True
            )
            
            print(f"Commit created successfully: {result.stdout.strip()}")
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"Error creating commit: {e.stderr}")
            return False
    
    def push_to_remote(self, remote: str = "origin", branch: str = None) -> bool:
        """Push commits to remote repository."""
        if not branch:
            # Get current branch dynamically
            branch_info = self.get_branch_info()
            branch = branch_info.get('current_branch')
            
            # Fallback if dynamic detection fails
            if not branch or branch == 'unknown':
                # Try config first, then default to main
                fallback_branch = self.config.get("github", {}).get("branch", "main")
                branch = fallback_branch
                print(f"Warning: Could not detect current branch, using fallback: {branch}", file=sys.stderr)
            else:
                print(f"Detected current branch: {branch}", file=sys.stderr)
        
        try:
            # Check if remote exists
            result = subprocess.run(
                ['git', 'remote', 'get-url', remote],
                cwd=self.repo_path,
                capture_output=True,
                text=True,
                check=True
            )
            
            # Push to remote
            result = subprocess.run(
                ['git', 'push', remote, branch],
                cwd=self.repo_path,
                capture_output=True,
                text=True,
                check=True
            )
            
            print(f"Pushed to {remote}/{branch}: {result.stdout.strip()}")
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"Error pushing to remote: {e.stderr}")
            return False
    
    def _stage_files(self, change_summary: Dict) -> bool:
        """Stage relevant files for commit."""
        changed_files = change_summary.get('changed_files', [])
        ignore_patterns = self.config.get('gitops', {}).get('ignore_patterns', [])
        
        files_to_stage = []
        
        for file_info in changed_files:
            filename = file_info['filename']
            
            # Skip ignored files
            if self._should_ignore_file(filename, ignore_patterns):
                continue
                
            files_to_stage.append(filename)
        
        if not files_to_stage:
            return False
        
        try:
            # Stage files
            subprocess.run(
                ['git', 'add'] + files_to_stage,
                cwd=self.repo_path,
                check=True
            )
            
            print(f"Staged {len(files_to_stage)} files")
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"Error staging files: {e}")
            return False
    
    def _generate_commit_message(self, change_summary: Dict, tool_context: Dict = None, session_data: List[Dict] = None) -> str:
        """Generate an intelligent commit message."""
        
        # Start with tool-specific message
        message_parts = []
        
        if tool_context:
            tool_message = self._generate_tool_message(tool_context, change_summary)
            if tool_message:
                message_parts.append(tool_message)
        
        # Add change summary
        change_message = self._generate_change_message(change_summary)
        if change_message:
            message_parts.append(change_message)
        
        # Combine parts
        if message_parts:
            primary_message = message_parts[0]
            if len(message_parts) > 1:
                primary_message += f"\n\n{message_parts[1]}"
        else:
            primary_message = change_summary.get('suggested_commit_message', 'Update project files')
        
        # Add session context if available
        if session_data and len(session_data) > 1:
            primary_message += f"\n\nSession summary: {len(session_data)} operations performed"
        
        # Add metadata
        primary_message += self._generate_commit_footer(change_summary)
        
        return primary_message
    
    def _generate_tool_message(self, tool_context: Dict, change_summary: Dict) -> str:
        """Generate tool-specific commit message."""
        tool_name = tool_context.get('tool', '')
        tool_input = tool_context.get('tool_input', {})
        description = tool_input.get('description', '')
        
        templates = self.config.get('gitops', {}).get('commit_templates', {})
        
        if tool_name in templates:
            template = templates[tool_name]
            
            # Replace template variables
            variables = {
                'description': description,
                'filename': self._get_primary_filename(change_summary),
                'count': len(change_summary.get('changed_files', []))
            }
            
            try:
                return template.format(**variables)
            except KeyError:
                pass
        
        # Fallback messages
        if tool_name == 'Edit' and description:
            return f"Update code: {description}"
        elif tool_name == 'Write' and description:
            return f"Create new file: {description}"
        elif tool_name == 'MultiEdit':
            count = len(change_summary.get('changed_files', []))
            return f"Update {count} files: {description}" if description else f"Update {count} files"
        elif tool_name == 'Bash' and description:
            return f"Execute command: {description}"
        
        return ""
    
    def _generate_change_message(self, change_summary: Dict) -> str:
        """Generate a message based on the types of changes made."""
        categories = change_summary.get('categories', {})
        diff_stats = change_summary.get('diff_stats', {})
        
        details = []
        
        # Summarize changes by category
        for category, files in categories.items():
            if files and category != 'other':
                category_name = category.replace('_', ' ').title()
                details.append(f"• {category_name}: {len(files)} files")
        
        # Add diff statistics
        insertions = diff_stats.get('insertions', 0)
        deletions = diff_stats.get('deletions', 0)
        
        if insertions or deletions:
            details.append(f"• Changes: +{insertions} -{deletions} lines")
        
        if details:
            return "Changes:\n" + "\n".join(details)
        
        return ""
    
    def _generate_commit_footer(self, change_summary: Dict) -> str:
        """Generate commit footer with metadata."""
        footer_parts = []
        
        # Add timestamp
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        footer_parts.append(f"Timestamp: {timestamp}")
        
        # Add Claude Code signature
        footer_parts.append("")
        footer_parts.append("🤖 Generated with Claude Code (https://claude.ai/code)")
        footer_parts.append("Co-Authored-By: Claude <noreply@anthropic.com>")
        
        return "\n\n" + "\n".join(footer_parts)
    
    def _get_primary_filename(self, change_summary: Dict) -> str:
        """Get the primary filename from changes."""
        changed_files = change_summary.get('changed_files', [])
        
        if not changed_files:
            return "unknown"
        
        # Prefer source code files
        for file_info in changed_files:
            filename = file_info['filename']
            if any(ext in filename.lower() for ext in ['.ts', '.tsx', '.js', '.jsx']):
                return filename
        
        # Return first file
        return changed_files[0]['filename']
    
    def _should_ignore_file(self, filename: str, ignore_patterns: List[str]) -> bool:
        """Check if file should be ignored based on patterns."""
        for pattern in ignore_patterns:
            if pattern.endswith('*'):
                if filename.startswith(pattern[:-1]):
                    return True
            elif pattern.startswith('*'):
                if filename.endswith(pattern[1:]):
                    return True
            elif pattern in filename:
                return True
        
        return False
    
    def get_branch_info(self) -> Dict[str, str]:
        """Get current branch information."""
        try:
            # Get current branch
            result = subprocess.run(
                ['git', 'branch', '--show-current'],
                cwd=self.repo_path,
                capture_output=True,
                text=True,
                check=True
            )
            current_branch = result.stdout.strip()
            
            # Get remote tracking branch
            result = subprocess.run(
                ['git', 'rev-parse', '--abbrev-ref', f'{current_branch}@{{upstream}}'],
                cwd=self.repo_path,
                capture_output=True,
                text=True
            )
            
            upstream = result.stdout.strip() if result.returncode == 0 else None
            
            return {
                'current_branch': current_branch,
                'upstream': upstream,
                'has_upstream': upstream is not None
            }
            
        except subprocess.CalledProcessError:
            return {
                'current_branch': 'unknown',
                'upstream': None,
                'has_upstream': False
            }
    
    def check_repository_status(self) -> Dict[str, any]:
        """Check repository status before operations."""
        try:
            # Check if we're in a git repository
            subprocess.run(
                ['git', 'rev-parse', '--git-dir'],
                cwd=self.repo_path,
                capture_output=True,
                check=True
            )
            
            # Check for uncommitted changes
            result = subprocess.run(
                ['git', 'status', '--porcelain'],
                cwd=self.repo_path,
                capture_output=True,
                text=True,
                check=True
            )
            
            has_changes = bool(result.stdout.strip())
            
            # Get branch info
            branch_info = self.get_branch_info()
            
            return {
                'is_git_repo': True,
                'has_changes': has_changes,
                'branch_info': branch_info,
                'ready_for_commit': has_changes
            }
            
        except subprocess.CalledProcessError:
            return {
                'is_git_repo': False,
                'has_changes': False,
                'branch_info': {},
                'ready_for_commit': False
            }

if __name__ == "__main__":
    # Test the commit creator
    creator = CommitCreator()
    status = creator.check_repository_status()
    print(json.dumps(status, indent=2))