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
- Environment variable `VITE_API_URL` controls backend connection
- JWT token handling (to be implemented)
- RESTful API integration via Refine's simple-rest data provider

### Current State
- **Refine Setup**: Complete with routing, data provider, and basic CRUD
- **DaisyUI Integration**: Custom Karakeep themes configured
- **Bundle Size**: 210KB gzipped (50% smaller than React-Admin)
- **TypeScript**: Strict type checking enabled
- **Bookmark Management**: Full CRUD interface with card-based display

### Routing Structure
- `/bookmarks` - Bookmark listing (card view)
- `/bookmarks/show/:id` - Bookmark detail view
- `/bookmarks/edit/:id` - Bookmark editing form
- `/bookmarks/create` - New bookmark creation

### Theme Configuration
- **karakeep** - Light theme with blue primary colors
- **karakeep-dark** - Dark theme variant
- Responsive design with mobile-first approach

## Migration Status

### ✅ Completed (Refine Migration):
- **Project Setup**: Vite + Refine + DaisyUI configuration
- **Basic CRUD**: Complete bookmark management interface
- **Layout System**: Responsive drawer layout with navigation
- **Form Handling**: React Hook Form integration
- **TypeScript**: Full type safety implementation
- **Archive System**: React-Admin files safely archived

### 🚧 In Progress:
- **Authentication**: Porting JWT logic from React-Admin
- **Custom Data Provider**: API integration with cursor pagination
- **DaisyUI Configuration**: Optimizing component class usage

### 📋 Next Priorities:
1. **Authentication Provider**: Port JWT authentication from archive
2. **Custom Data Provider**: Implement Karakeep API integration
3. **Triage Mode**: Card-based bookmark processing interface
4. **Keyboard Shortcuts**: Global shortcut system
5. **Advanced Features**: Search, filtering, bulk operations

## Reference Materials

### Archive Directory (`archive/`):
Contains complete React-Admin implementation for reference:
- `archive/react-admin-files/src/providers/` - Data and auth providers
- `archive/react-admin-files/src/components/` - Custom components
- `archive/react-admin-files/docs/` - API documentation

### Migration Documentation:
- `REFINE_MIGRATION_ASSETS.md` - Reusable code patterns from React-Admin
- `REFINE_MIGRATION_PROGRESS.md` - Detailed migration status
- `archive/README.md` - Archive contents explanation

### Git History:
- **Current Branch**: `refine-migration` (active development)
- **Archive Branch**: `archive/react-admin-implementation`
- **Archive Tag**: `v1.0-react-admin`

## Development Workflow

1. Always check existing Refine patterns before implementing new features
2. Use DaisyUI components and Tailwind CSS classes
3. Follow TypeScript best practices with strict type checking
4. Reference archived React-Admin code for API integration patterns
5. Update this documentation when adding major features
6. Test thoroughly with actual API endpoints when available

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