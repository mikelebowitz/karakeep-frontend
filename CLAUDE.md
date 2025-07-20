# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

This is an **experimental alternative UI** for the Karakeep bookmark management system. It is NOT the official Karakeep frontend, but rather an independent project exploring different UI/UX approaches using React-Admin.

## Repository Structure

This is a single repository containing both the frontend code and all documentation:
- GitHub: `git@github.com:mikelebowitz/karakeep-frontend.git`
- All code and documentation changes should be made in this repository

## Karakeep Alternative UI - React-Admin Bookmark Manager

This is an experimental React-Admin based frontend designed to work with the official Karakeep REST API.

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
- React 19.1.0 + TypeScript 5.7
- React-Admin 5.9.1 (admin framework)
- DaisyUI 4.12.22 + Tailwind CSS 4.1.11 (UI components - transitioning from Material UI)
- Vite 7.0.4 (build tool)
- Axios (HTTP with JWT auth)

**Key Directories:**
- `src/providers/` - Authentication and data provider implementations
- `src/pages/` - CRUD screens for bookmarks, tags, and lists
- `src/components/` - Reusable components (BatchActions, KeyboardShortcuts)

## Critical Implementation Details

### API Integration
- Proxy configuration in `vite.config.ts` rewrites `/api/*` to backend
- JWT tokens stored in localStorage
- Automatic token refresh via axios interceptors in `authProvider.ts`
- Data provider uses cursor-based pagination for bookmarks

### Current State (Updated)
- Bookmarks display is hardcoded to show items from "Inbox" list (ID: `qukdzoowmmsnr8hb19b0z1xc`)
- Tags and Lists resources are currently commented out in `App.tsx`
- Environment variable `VITE_API_URL` controls backend connection
- **BookmarkEdit now fully functional** with proper field population and tag/list editing
- Custom TagSelector and ListSelector components implemented
- Comprehensive API documentation available in `docs/KARAKEEP_API_ENDPOINTS.md`

### Authentication Flow
1. Login via `/auth/login` endpoint
2. Tokens stored in localStorage (`access_token`, `refresh_token`)
3. Axios interceptor adds `Authorization: Bearer` header
4. 401 responses trigger automatic refresh via `/auth/refresh`

### Keyboard Shortcuts
Implemented in `KeyboardShortcuts.tsx`:
- `Cmd/Ctrl + K`: Search
- `Cmd/Ctrl + N`: New bookmark
- `G then B/T/L`: Navigate sections
- `?`: Help

## Documentation Files
- `docs/requirements.md`: Source of truth for project requirements
- `docs/prd.md`: Product specification and features
- `docs/techstack.md`: Technical decisions and architecture
- `docs/status.md`: Progress tracking and milestones
- `DEVELOPMENT_PROGRESS.md`: Session-by-session development progress
- `TRIAGE_MODE_SPECIFICATION.md`: Detailed specification for triage mode implementation
- `docs/KARAKEEP_API_ENDPOINTS.md`: Comprehensive API endpoint documentation

## Development Workflow
1. Always check existing patterns before implementing new features
2. Update `docs/status.md` after completing tasks
3. Follow React-Admin conventions for resources and providers
4. Use DaisyUI components and Tailwind CSS classes (migrating away from Material UI)
5. Check `src/theme/daisyuiTheme.ts` for theme configuration
6. Remember this is an experimental UI - feel free to explore creative solutions

## Current Development Status

### Completed Features
- ✅ **BookmarkEdit Functionality**: Complete CRUD operations for bookmarks
- ✅ **Tag Management**: Custom TagSelector component with API integration
- ✅ **List Management**: Custom ListSelector component with API integration
- ✅ **API Integration**: Fixed dataProvider getMany method, all endpoints working
- ✅ **Field Mapping**: Corrected nested field structure (content.url, content.title)
- ✅ **Documentation**: Comprehensive API documentation and development progress

### Next Phase: Triage Mode
- **Goal**: Implement card-based interface for processing unassigned bookmarks
- **Features**: Keyboard shortcuts (1-9 for lists, Cmd+Return to apply), visual command reference
- **Design**: Full-screen cards with sidebar showing available lists and commands
- **Status**: Specification complete, ready for implementation

### Key Implementation Notes
- Use custom components when React-Admin patterns don't fit API structure
- Maintain TypeScript safety throughout development
- Document all API interactions for future reference
- Test thoroughly with actual API endpoints