#!/usr/bin/env python3
"""
Git analysis utilities for Claude Code GitOps hooks.
Analyzes git changes and provides context for documentation generation.
"""

import subprocess
import json
import os
import re
from typing import Dict, List, Optional, Tuple
from pathlib import Path

class GitAnalyzer:
    def __init__(self, repo_path: str = "."):
        self.repo_path = Path(repo_path)
        
    def has_changes(self) -> bool:
        """Check if there are any uncommitted changes."""
        try:
            result = subprocess.run(
                ['git', 'status', '--porcelain'],
                cwd=self.repo_path,
                capture_output=True,
                text=True,
                check=True
            )
            return bool(result.stdout.strip())
        except subprocess.CalledProcessError:
            return False
    
    def get_changed_files(self) -> List[Dict[str, str]]:
        """Get list of changed files with their status."""
        try:
            result = subprocess.run(
                ['git', 'status', '--porcelain'],
                cwd=self.repo_path,
                capture_output=True,
                text=True,
                check=True
            )
            
            files = []
            for line in result.stdout.strip().split('\n'):
                if line:
                    status = line[:2].strip()
                    filename = line[3:].strip()
                    files.append({
                        'filename': filename,
                        'status': status,
                        'change_type': self._interpret_status(status)
                    })
            
            return files
        except subprocess.CalledProcessError:
            return []
    
    def get_diff_stats(self) -> Dict[str, int]:
        """Get diff statistics (insertions, deletions, files changed)."""
        try:
            result = subprocess.run(
                ['git', 'diff', '--stat', '--cached'],
                cwd=self.repo_path,
                capture_output=True,
                text=True,
                check=True
            )
            
            stats = {'files_changed': 0, 'insertions': 0, 'deletions': 0}
            
            if result.stdout:
                lines = result.stdout.strip().split('\n')
                if lines:
                    # Last line contains summary
                    summary_line = lines[-1]
                    
                    # Parse files changed
                    files_match = re.search(r'(\d+) files? changed', summary_line)
                    if files_match:
                        stats['files_changed'] = int(files_match.group(1))
                    
                    # Parse insertions
                    insertions_match = re.search(r'(\d+) insertions?', summary_line)
                    if insertions_match:
                        stats['insertions'] = int(insertions_match.group(1))
                    
                    # Parse deletions
                    deletions_match = re.search(r'(\d+) deletions?', summary_line)
                    if deletions_match:
                        stats['deletions'] = int(deletions_match.group(1))
            
            return stats
        except subprocess.CalledProcessError:
            return {'files_changed': 0, 'insertions': 0, 'deletions': 0}
    
    def get_last_commit_info(self) -> Optional[Dict[str, str]]:
        """Get information about the last commit."""
        try:
            result = subprocess.run(
                ['git', 'log', '-1', '--pretty=format:%H|%s|%an|%ae|%ad'],
                cwd=self.repo_path,
                capture_output=True,
                text=True,
                check=True
            )
            
            if result.stdout:
                parts = result.stdout.strip().split('|')
                return {
                    'hash': parts[0],
                    'message': parts[1],
                    'author_name': parts[2],
                    'author_email': parts[3],
                    'date': parts[4]
                }
        except subprocess.CalledProcessError:
            pass
        
        return None
    
    def categorize_changes(self, changed_files: List[Dict[str, str]]) -> Dict[str, List[str]]:
        """Categorize changed files by type."""
        categories = {
            'source_code': [],
            'documentation': [],
            'configuration': [],
            'assets': [],
            'tests': [],
            'other': []
        }
        
        for file_info in changed_files:
            filename = file_info['filename']
            category = self._categorize_file(filename)
            categories[category].append(filename)
        
        return categories
    
    def generate_change_summary(self, tool_context: Dict = None) -> Dict[str, any]:
        """Generate a comprehensive summary of changes."""
        changed_files = self.get_changed_files()
        diff_stats = self.get_diff_stats()
        categories = self.categorize_changes(changed_files)
        last_commit = self.get_last_commit_info()
        
        summary = {
            'has_changes': len(changed_files) > 0,
            'changed_files': changed_files,
            'diff_stats': diff_stats,
            'categories': categories,
            'last_commit': last_commit,
            'change_type': self._determine_change_type(categories, tool_context),
            'suggested_commit_message': self._suggest_commit_message(categories, tool_context)
        }
        
        return summary
    
    def _interpret_status(self, status: str) -> str:
        """Interpret git status codes."""
        status_map = {
            'A': 'added',
            'M': 'modified',
            'D': 'deleted',
            'R': 'renamed',
            'C': 'copied',
            'U': 'unmerged',
            '?': 'untracked'
        }
        
        # Handle two-character status
        if len(status) == 2:
            index_status = status[0]
            working_status = status[1]
            
            if index_status in status_map:
                return status_map[index_status]
            elif working_status in status_map:
                return status_map[working_status]
        elif len(status) == 1 and status in status_map:
            return status_map[status]
        
        return 'unknown'
    
    def _categorize_file(self, filename: str) -> str:
        """Categorize a file based on its path and extension."""
        filename_lower = filename.lower()
        
        # Documentation
        if any(doc in filename_lower for doc in ['.md', 'readme', 'changelog', 'docs/']):
            return 'documentation'
        
        # Configuration
        if any(conf in filename_lower for conf in ['.json', '.yml', '.yaml', '.config', '.env', 'package.json', 'tsconfig']):
            return 'configuration'
        
        # Source code
        if any(ext in filename_lower for ext in ['.ts', '.tsx', '.js', '.jsx', '.py', '.css', '.scss']):
            return 'source_code'
        
        # Tests
        if any(test in filename_lower for test in ['test/', 'spec/', '.test.', '.spec.']):
            return 'tests'
        
        # Assets
        if any(ext in filename_lower for ext in ['.png', '.jpg', '.svg', '.ico', '.woff']):
            return 'assets'
        
        return 'other'
    
    def _determine_change_type(self, categories: Dict[str, List[str]], tool_context: Dict = None) -> str:
        """Determine the overall type of changes made."""
        if categories['source_code']:
            if tool_context and tool_context.get('tool') == 'Write':
                return 'feature_development'
            else:
                return 'code_modification'
        elif categories['documentation']:
            return 'documentation_update'
        elif categories['configuration']:
            return 'configuration_change'
        elif categories['tests']:
            return 'test_update'
        else:
            return 'general_update'
    
    def _suggest_commit_message(self, categories: Dict[str, List[str]], tool_context: Dict = None) -> str:
        """Suggest a commit message based on changes."""
        if not any(categories.values()):
            return "Update project files"
        
        # Use tool context if available
        if tool_context:
            tool_name = tool_context.get('tool', '')
            description = tool_context.get('tool_input', {}).get('description', '')
            
            if tool_name == 'Write' and categories['source_code']:
                return f"Add new feature: {description}" if description else "Add new source files"
            elif tool_name == 'Edit' and description:
                return f"Update code: {description}"
            elif tool_name == 'Bash' and description:
                return f"Execute command: {description}"
        
        # Fallback to file-based suggestions
        if categories['source_code'] and categories['documentation']:
            return "Update code and documentation"
        elif categories['source_code']:
            return "Update source code"
        elif categories['documentation']:
            return "Update documentation"
        elif categories['configuration']:
            return "Update configuration"
        else:
            return "Update project files"

if __name__ == "__main__":
    # Test the analyzer
    analyzer = GitAnalyzer()
    summary = analyzer.generate_change_summary()
    print(json.dumps(summary, indent=2))