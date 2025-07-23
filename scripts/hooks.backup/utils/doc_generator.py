#!/usr/bin/env python3
"""
Documentation generation utilities for Claude Code GitOps hooks.
Automatically updates project documentation based on git changes.
"""

import json
import os
import re
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

class DocumentationGenerator:
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
            return {"gitops": {"documentation_files": []}}
    
    def update_progress_file(self, change_summary: Dict, tool_context: Dict = None) -> bool:
        """Update REFINE_MIGRATION_PROGRESS.md with new developments."""
        progress_file = self.repo_path / "REFINE_MIGRATION_PROGRESS.md"
        
        if not progress_file.exists():
            return False
        
        try:
            with open(progress_file, 'r') as f:
                content = f.read()
            
            # Generate new entry
            new_entry = self._generate_progress_entry(change_summary, tool_context)
            
            # Find insertion point (after "## Current Status" or similar)
            insertion_patterns = [
                r"(## Current Status.*?\n)",
                r"(## ✅ Phase \d+ Complete.*?\n)",
                r"(### Working Features:.*?\n)"
            ]
            
            inserted = False
            for pattern in insertion_patterns:
                if re.search(pattern, content, re.IGNORECASE | re.DOTALL):
                    content = re.sub(
                        pattern,
                        f"\\1\n{new_entry}\n",
                        content,
                        flags=re.IGNORECASE | re.DOTALL
                    )
                    inserted = True
                    break
            
            if not inserted:
                # Append to end
                content += f"\n\n{new_entry}\n"
            
            with open(progress_file, 'w') as f:
                f.write(content)
            
            return True
            
        except Exception as e:
            print(f"Error updating progress file: {e}")
            return False
    
    def update_changelog(self, change_summary: Dict, tool_context: Dict = None) -> bool:
        """Update or create CHANGELOG.md with new entry."""
        changelog_file = self.repo_path / "CHANGELOG.md"
        
        # Create changelog if it doesn't exist
        if not changelog_file.exists():
            self._create_changelog_file(changelog_file)
        
        try:
            with open(changelog_file, 'r') as f:
                content = f.read()
            
            # Generate changelog entry
            entry = self._generate_changelog_entry(change_summary, tool_context)
            
            # Insert after the "## [Unreleased]" section or at the top
            if "## [Unreleased]" in content:
                content = content.replace(
                    "## [Unreleased]\n",
                    f"## [Unreleased]\n\n{entry}\n"
                )
            else:
                # Insert after first heading
                lines = content.split('\n')
                insert_index = 1
                for i, line in enumerate(lines):
                    if line.startswith('## '):
                        insert_index = i
                        break
                
                lines.insert(insert_index, f"\n{entry}\n")
                content = '\n'.join(lines)
            
            with open(changelog_file, 'w') as f:
                f.write(content)
            
            return True
            
        except Exception as e:
            print(f"Error updating changelog: {e}")
            return False
    
    def update_readme_status(self, change_summary: Dict, tool_context: Dict = None) -> bool:
        """Update README.md status sections."""
        readme_file = self.repo_path / "README.md"
        
        if not readme_file.exists():
            return False
        
        try:
            with open(readme_file, 'r') as f:
                content = f.read()
            
            # Update migration status if relevant
            if self._is_migration_work(change_summary, tool_context):
                content = self._update_migration_status(content, change_summary)
            
            # Update last updated timestamp
            content = self._update_last_modified(content)
            
            with open(readme_file, 'w') as f:
                f.write(content)
            
            return True
            
        except Exception as e:
            print(f"Error updating README: {e}")
            return False
    
    def generate_session_summary(self, changes_list: List[Dict], session_duration: int = 0) -> str:
        """Generate a summary of the entire development session."""
        total_files = sum(len(change['changed_files']) for change in changes_list)
        total_insertions = sum(change['diff_stats'].get('insertions', 0) for change in changes_list)
        total_deletions = sum(change['diff_stats'].get('deletions', 0) for change in changes_list)
        
        # Categorize all changes
        all_categories = {'source_code': set(), 'documentation': set(), 'configuration': set()}
        for change in changes_list:
            for category, files in change.get('categories', {}).items():
                if category in all_categories:
                    all_categories[category].update(files)
        
        summary = f"""## Development Session Summary
**Date**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Duration**: {session_duration // 60}m {session_duration % 60}s
**Files Modified**: {total_files}
**Changes**: +{total_insertions} -{total_deletions}

### Work Completed:
"""
        
        if all_categories['source_code']:
            summary += f"- **Source Code**: Modified {len(all_categories['source_code'])} files\n"
        if all_categories['documentation']:
            summary += f"- **Documentation**: Updated {len(all_categories['documentation'])} files\n"
        if all_categories['configuration']:
            summary += f"- **Configuration**: Changed {len(all_categories['configuration'])} files\n"
        
        return summary
    
    def _generate_progress_entry(self, change_summary: Dict, tool_context: Dict = None) -> str:
        """Generate a progress update entry."""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M')
        change_type = change_summary.get('change_type', 'general_update')
        
        entry = f"### Update {timestamp}\n"
        
        if tool_context:
            tool_name = tool_context.get('tool', '')
            description = tool_context.get('tool_input', {}).get('description', '')
            
            if description:
                entry += f"**Tool Used**: {tool_name} - {description}\n"
            else:
                entry += f"**Tool Used**: {tool_name}\n"
        
        # Add file changes summary
        categories = change_summary.get('categories', {})
        if categories['source_code']:
            entry += f"- Modified {len(categories['source_code'])} source files\n"
        if categories['documentation']:
            entry += f"- Updated {len(categories['documentation'])} documentation files\n"
        if categories['configuration']:
            entry += f"- Changed {len(categories['configuration'])} configuration files\n"
        
        diff_stats = change_summary.get('diff_stats', {})
        if diff_stats.get('insertions') or diff_stats.get('deletions'):
            entry += f"- **Changes**: +{diff_stats.get('insertions', 0)} -{diff_stats.get('deletions', 0)} lines\n"
        
        return entry
    
    def _generate_changelog_entry(self, change_summary: Dict, tool_context: Dict = None) -> str:
        """Generate a changelog entry."""
        timestamp = datetime.now().strftime('%Y-%m-%d')
        change_type = change_summary.get('change_type', 'Changed')
        
        # Map change types to changelog categories
        type_mapping = {
            'feature_development': 'Added',
            'code_modification': 'Changed',
            'documentation_update': 'Documentation',
            'configuration_change': 'Changed',
            'test_update': 'Testing'
        }
        
        category = type_mapping.get(change_type, 'Changed')
        
        entry = f"### {category}\n"
        
        if tool_context:
            description = tool_context.get('tool_input', {}).get('description', '')
            if description:
                entry += f"- {description}\n"
        
        # Add specific file changes
        categories = change_summary.get('categories', {})
        for category_name, files in categories.items():
            if files and category_name != 'other':
                entry += f"- Updated {category_name.replace('_', ' ')}: {', '.join(files[:3])}\n"
                if len(files) > 3:
                    entry += f"  (and {len(files) - 3} more files)\n"
        
        return entry
    
    def _create_changelog_file(self, filepath: Path):
        """Create a new CHANGELOG.md file."""
        content = """# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

"""
        with open(filepath, 'w') as f:
            f.write(content)
    
    def _is_migration_work(self, change_summary: Dict, tool_context: Dict = None) -> bool:
        """Determine if changes are related to Refine migration."""
        # Check for migration-related files
        changed_files = [f['filename'] for f in change_summary.get('changed_files', [])]
        migration_indicators = [
            'refine', 'daisyui', 'migration', 'react-admin',
            'src/pages/', 'src/components/', 'tailwind.config'
        ]
        
        return any(indicator in ' '.join(changed_files).lower() for indicator in migration_indicators)
    
    def _update_migration_status(self, content: str, change_summary: Dict) -> str:
        """Update migration status in README."""
        # Simple placeholder - could be more sophisticated
        categories = change_summary.get('categories', {})
        
        if categories.get('source_code'):
            # Look for migration status sections and update them
            # This is a simplified implementation
            pass
        
        return content
    
    def _update_last_modified(self, content: str) -> str:
        """Update last modified timestamp in content."""
        timestamp = datetime.now().strftime('%Y-%m-%d')
        
        # Look for existing timestamp patterns and update
        patterns = [
            r'Last updated: \d{4}-\d{2}-\d{2}',
            r'Updated: \d{4}-\d{2}-\d{2}',
            r'Modified: \d{4}-\d{2}-\d{2}'
        ]
        
        for pattern in patterns:
            if re.search(pattern, content):
                content = re.sub(pattern, f'Last updated: {timestamp}', content)
                return content
        
        return content

if __name__ == "__main__":
    # Test the documentation generator
    generator = DocumentationGenerator()
    
    # Mock change summary for testing
    test_summary = {
        'changed_files': [{'filename': 'src/App.tsx', 'status': 'M'}],
        'categories': {'source_code': ['src/App.tsx']},
        'diff_stats': {'insertions': 10, 'deletions': 5},
        'change_type': 'code_modification'
    }
    
    print("Testing documentation generator...")
    generator.update_changelog(test_summary)