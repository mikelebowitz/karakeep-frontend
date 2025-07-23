# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

This is the **Karakeep Frontend** - a modern React application built with Refine and DaisyUI for bookmark management. This project has been migrated from React-Admin to Refine for better performance and maintainability.

## AI Assistant Guidelines

When working on this project, AI assistants MUST follow these guidelines:

### **Sequential Thinking Requirement**
- **ALWAYS** use the Sequential Thinking tool when in Plan mode for complex tasks
- Use it to break down problems, analyze requirements, and plan implementation steps
- Especially important for:
  - New feature implementation
  - Complex refactoring tasks
  - API integration work
  - Multi-step migrations

### **Documentation Review Requirement**
- **ALWAYS** review relevant documentation with Context7 before implementing new code
- Required for any work involving:
  - Refine framework patterns and hooks
  - DaisyUI component usage
  - React Hook Form integration
  - TypeScript best practices
  - API integration patterns

### **Examples:**
- Before adding a new Refine resource → Use Context7 to review Refine documentation
- Before implementing new DaisyUI components → Use Context7 to review DaisyUI docs
- Before planning a complex feature → Use Sequential Thinking to break it down
- Before API integration → Use Context7 to review Refine data provider patterns

These tools ensure thorough planning and adherence to framework best practices.

## Repository Structure

This is a single repository containing both the frontend code and all documentation:
- GitHub: `git@github.com:mikelebowitz/karakeep-frontend.git`
- All code and documentation changes should be made in this repository

## Karakeep Frontend - Refine + DaisyUI Bookmark Manager

A modern, fast, and maintainable frontend for the Karakeep bookmark management system.

## Working Directory

This is a single repository - all work happens in the repository root.

## Common Development Commands

```bash
# Development
npm run dev          # Start development server on port 5173

# Build & Test
npm run build        # TypeScript check + Vite production build
npm run lint         # Run ESLint
npm run preview      # Preview production build

# No test command defined - ask user before assuming testing framework
```

## Architecture Overview

**Tech Stack:**
- React 19.1.0 + TypeScript 5.8
- Refine 4.57.10 (headless admin framework)
- DaisyUI 5.0.46 + Tailwind CSS 4.1.11 (UI components)
- Vite 7.0.4 (build tool)
- React Hook Form 7.60.0 (form handling)
- React Router v7 (routing)
- Axios 1.10.0 (HTTP client)

**Key Directories:**
- `src/components/` - Reusable UI components (Layout, etc.)
- `src/pages/` - Page-level components organized by resource
- `archive/` - Archived React-Admin implementation for reference

## Critical Implementation Details

### API Integration
- Environment variable `VITE_API_URL` controls backend connection (`/api`)
- JWT authentication complete with automatic token refresh
- Smart endpoint selection for optimal performance
- Custom data provider with cursor-based pagination
- Client-side filtering for complex queries

### Current State
- **Refine Setup**: Complete with routing, data provider, and comprehensive CRUD
- **DaisyUI Integration**: Custom Karakeep themes with full component usage
- **Authentication**: JWT token system with API key support (`ak1_*` format)
- **Advanced Features**: Search, filtering, and two-tier bulk selection system
- **Bundle Size**: 210KB gzipped (50% smaller than React-Admin)
- **TypeScript**: Strict type checking enabled with full coverage
- **Bookmark Management**: Professional-grade interface with keyboard navigation

### Routing Structure
- `/bookmarks` - Advanced bookmark listing with search, filtering, and bulk operations
- `/bookmarks/show/:id` - Bookmark detail view with triage modal
- `/bookmarks/edit/:id` - Bookmark editing form with tag/list management
- `/bookmarks/create` - New bookmark creation

### Theme Configuration
- **karakeep** - Light theme with blue primary colors
- **karakeep-dark** - Dark theme variant
- Responsive design with mobile-first approach

## Current Development Status

### ✅ Completed (Migration + Core Features):
- **Complete Refine Migration**: Vite + Refine + DaisyUI with 50% bundle reduction
- **Authentication System**: JWT with API token support and automatic refresh
- **Advanced Search & Filtering**: Debounced search, tag/list filters, special filters
- **Two-Tier Bulk Selection**: Visible vs all matching results with Cmd+Shift+A
- **Professional Keyboard Navigation**: Complete keyboard control with global shortcuts
- **Smart Data Provider**: Optimal endpoint selection with client-side filtering
- **Claude Code Hooks**: Automated documentation and GitOps workflows
- **Layout System**: Responsive drawer layout with navigation
- **TypeScript**: Full type safety with strict mode compliance

### 🚧 In Progress:
- **Tag/List Picker Modals**: Implement filter dropdown functionality with + Add buttons
- **Bulk Operations**: Wire up T/L/A/Delete keys to actual API operations
- **Available Tags/Lists Loading**: Fetch options for filter dropdowns

### 📋 Next Priorities:
1. **Complete Bulk Operations**: Implement actual tag/list assignment via keyboard
2. **Triage Mode**: Card-based bookmark processing interface
3. **URL Persistence**: Save filter state in URL for bookmarkable searches
4. **Performance Optimizations**: Add caching for tags/lists data

## Documentation Structure

### Core Documentation:
- **[docs/README.md](docs/README.md)** - Documentation hub and navigation
- **[docs/STATUS.md](docs/STATUS.md)** - Current project status and achievements
- **[README.md](README.md)** - Main project documentation and setup

### Development Documentation:
- **[docs/development/](docs/development/)** - Manual development logs and notes
- **[docs/sessions/](docs/sessions/)** - Automated session documentation from hooks

### Archive Materials:
- **[docs/archive/migration/](docs/archive/migration/)** - Complete migration documentation
- **[archive/react-admin-files/](archive/react-admin-files/)** - Original React-Admin implementation
- Reference data providers, components, and patterns

### Automated Documentation (Claude Code Hooks):
- **Session Documentation**: Generated before context compaction in `docs/sessions/`
- **Changelog**: Automated updates to `CHANGELOG.md`
- **Progress Tracking**: Automatic updates to status files

### Current Branch Status:
- **Active Branch**: `feature/advanced-search-filtering`
- **Main Branch**: `main` (for PRs)
- **Latest Work**: Advanced search/filtering system with bulk operations

## Development Workflow

1. Always check existing Refine patterns before implementing new features
2. Use DaisyUI components and Tailwind CSS classes
3. Follow TypeScript best practices with strict type checking
4. Reference archived React-Admin code for API integration patterns
5. **Claude Code Hooks handle documentation automatically**:
   - Session documentation generated before context compaction
   - Git commits with descriptive messages
   - Changelog updates and progress tracking
6. Test thoroughly with actual API endpoints when available

## Claude Code Hooks System

### User-Level Hooks Configuration:
- **Hook Location**: `~/.claude/hooks/` (user-level, works across all projects)
- **Project Config**: `config/gitops-config.json` (project-specific settings)
- **Session Storage**: `/tmp/claude-gitops-session.json` (temporary session data)

### Active Hooks:
- **`post-tool-use.py`**: Captures all Edit/Write/MultiEdit/Bash operations for GitOps automation
- **`pre-compact.py`**: Generates session documentation before context reset
- **`session-stop.py`**: Creates batch commits when Claude session ends

### Hook Features:
- **Automatic Documentation**: Session summaries in `docs/sessions/`
- **GitOps Automation**: Commits with conventional commit messages
- **Project Auto-Discovery**: Automatically detects project root and configuration
- **Branch-Agnostic**: Works on any branch without configuration changes
- **Progress Tracking**: Updates to status files and changelogs
- **Context Preservation**: Never lose work during compaction

### Configuration:
Hooks automatically find project configuration at:
1. `config/gitops-config.json` (preferred)
2. `scripts/hooks/config/gitops-config.json` (legacy)
3. `.claude/gitops-config.json` (alternative)

No project-specific hook installation required - user-level hooks work across all projects.

## Key Benefits of Refine Migration

1. **Performance**: 50% smaller bundle size (210KB vs 315KB)
2. **Maintainability**: No more CSS override battles
3. **Flexibility**: True headless architecture
4. **Modern Patterns**: Hooks-first development
5. **Better DX**: Cleaner codebase and faster development

## Environment Configuration

```bash
# Required environment variables
VITE_API_URL=http://localhost:8000/api

# Optional (for development with API token)
VITE_API_TOKEN=your_dev_token_here
```

The project is now running on Refine with a clean, maintainable architecture that's ready for production use.

## Development Notes

- remember to let me run the dev server in a different terminal session