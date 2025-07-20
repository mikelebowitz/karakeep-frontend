# Karakeep Alternative UI - An Experimental Frontend for Karakeep

**⚠️ DISCLAIMER**: This is an unofficial, experimental UI project for the [Karakeep bookmark management system](https://github.com/karakeep/karakeep). This is NOT the official Karakeep project, but rather a humble attempt to explore alternative UI approaches for the excellent Karakeep backend API.

A modern, productivity-focused experimental frontend built with React-Admin, designed to work with the Karakeep REST API.

![React](https://img.shields.io/badge/React-19.1-blue)
![React-Admin](https://img.shields.io/badge/React--Admin-5.9-orange)
![DaisyUI](https://img.shields.io/badge/DaisyUI-4.12-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Vite](https://img.shields.io/badge/Vite-7.0-purple)

## 📚 Project Overview

This project is an experimental alternative frontend for the Karakeep bookmark management system. It aims to explore different UI/UX approaches, particularly focused on rapid triage workflows and keyboard-driven interactions. The frontend connects to the official Karakeep REST API and provides features like batch operations, real-time search, keyboard shortcuts, and a specialized triage mode for rapid content processing.

### About This Project

This is an independent project created to:
- Explore alternative UI approaches for bookmark management
- Experiment with triage-focused workflows
- Test React-Admin as a framework for productivity applications
- Learn from and potentially contribute ideas back to the Karakeep community

**This project requires a running Karakeep backend API to function.**

### Key Features

- 🔖 **Advanced Bookmark Management**: Full CRUD operations with metadata support
- 🏷️ **Smart Tagging System**: Color-coded tags with bulk assignment capabilities
- 📁 **List Organization**: Custom lists for project-based content organization
- 🎯 **Triage Mode**: Card-based interface for rapid bookmark processing
- ⚡ **Keyboard Shortcuts**: Power-user navigation and actions
- 🔍 **Real-time Search**: Fast filtering across all content and metadata
- 🔄 **Batch Operations**: Bulk tagging, listing, and archiving
- 🔐 **Secure Authentication**: JWT-based auth with automatic token refresh
- 📱 **Responsive Design**: Mobile-friendly DaisyUI components

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Karakeep backend API running (see [official Karakeep documentation](https://github.com/karakeep/karakeep))

### Development Setup

1. Clone the repository:
```bash
git clone https://github.com/mikelebowitz/karakeep-frontend.git
cd karakeep-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Commands

```bash
# Development
npm run dev          # Start development server on port 5173

# Build & Test  
npm run build        # TypeScript check + Vite production build
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## 🛠️ Technology Stack

**Frontend Framework:**
- React 19.1.0 + TypeScript 5.7
- React-Admin 5.9.1 (admin interface framework)
- DaisyUI 4.12.22 + Tailwind CSS 4.1.11 (replacing Material UI)
- Vite 7.0.4 (build tool)

**Key Libraries:**
- Axios (HTTP client with JWT authentication)
- React Router (navigation)
- React Hook Form (form management)

**Development Tools:**
- ESLint (code linting)
- Prettier (code formatting)
- TypeScript (type safety)

## ⌨️ Keyboard Shortcuts

- `Cmd/Ctrl + K`: Quick search
- `Cmd/Ctrl + N`: New bookmark
- `G then B`: Go to bookmarks
- `G then T`: Go to tags
- `G then L`: Go to lists
- `?`: Show help
- **Triage Mode**: `1-9` assign to lists, `Cmd+Return` apply changes

## 📊 Current Status

**Latest Version:** v1.1 (July 17, 2025)

### ✅ Completed Features
- **Core CRUD Operations**: Full bookmark, tag, and list management
- **BookmarkEdit Functionality**: Complete with custom TagSelector/ListSelector
- **Triage Mode**: Card-based rapid processing interface
- **Responsive Design**: Mobile-optimized layouts
- **JWT Authentication**: Secure login with token refresh
- **API Integration**: Comprehensive endpoint documentation
- **Keyboard Navigation**: Basic shortcuts implemented

### 🔄 In Progress
- Documentation cleanup and organization
- Enhanced keyboard shortcut system
- Accessibility compliance (WCAG 2.1 AA)

### 📋 Next Phase
- Re-enable Tag and List management views
- Implement bulk editing capabilities
- Performance optimization for large datasets
- Comprehensive testing framework

## 📁 Project Structure

```
karakeep-frontend/
├── 📄 Documentation
│   ├── README.md           # This file
│   ├── CLAUDE.md           # AI development guidance
│   └── docs/
│       ├── requirements.md      # Functional requirements
│       ├── prd.md              # Product specification
│       ├── techstack.md        # Architecture decisions
│       ├── status.md           # Development progress
│       └── KARAKEEP_API_ENDPOINTS.md  # API documentation
├── 🔧 Frontend Code
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # CRUD screens (bookmarks, tags, lists)
│   │   ├── providers/     # Auth and data providers
│   │   ├── types/         # TypeScript definitions
│   │   └── utils/         # Helper functions
│   ├── public/            # Static assets
│   └── dist/              # Production build output
└── ⚙️ Configuration
    ├── package.json        # Dependencies and scripts
    ├── vite.config.ts     # Build configuration
    ├── tailwind.config.js # Styling configuration
    └── vercel.json        # Deployment configuration
```

## 🔌 API Integration

This experimental frontend integrates with the official Karakeep REST API through:

- **Authentication**: `POST /auth/login`, `POST /auth/refresh`
- **Bookmarks**: Full CRUD with pagination and search
- **Tags & Lists**: Management and association endpoints
- **Batch Operations**: Bulk updates and deletions

See `docs/KARAKEEP_API_ENDPOINTS.md` for complete API documentation.

## 🚀 Deployment

This experimental frontend is configured for automatic deployment to Vercel:

1. **GitHub Integration**: Connected to `mikelebowitz/karakeep-frontend`
2. **Environment Variables**: Configure `VITE_API_URL` in Vercel dashboard
3. **Automatic Builds**: Triggered on push to main branch

For manual deployment:
```bash
npm run build  # Creates production build in dist/
```

## 🤝 Contributing

1. Fork this repository: `github.com/mikelebowitz/karakeep-frontend`
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following the existing code patterns
4. Ensure TypeScript and ESLint pass: `npm run build && npm run lint`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to your fork: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 Documentation

- **Requirements**: See `docs/requirements.md` for complete functional specifications
- **Product Design**: See `docs/prd.md` for user stories and acceptance criteria
- **Technical Decisions**: See `docs/techstack.md` for architecture choices
- **Development Progress**: See `docs/status.md` for current milestone tracking
- **API Documentation**: See `docs/KARAKEEP_API_ENDPOINTS.md` for complete API reference

## 🔮 Future Enhancements

- Browser extension for direct bookmark saving
- Advanced bookmark import/export functionality
- Social sharing and collaboration features
- Machine learning-powered auto-tagging
- Offline support with sync capabilities

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments & Attribution

### Original Project
**This is an experimental UI for [Karakeep](https://github.com/karakeep/karakeep)**, an excellent bookmark management system. All credit for the backend API, data models, and core bookmark management concepts goes to the Karakeep team and contributors.

This project is:
- ✅ An independent experiment in alternative UI/UX approaches
- ✅ A learning project exploring React-Admin for productivity apps
- ✅ Open source and available for anyone to use or learn from
- ❌ NOT officially affiliated with or endorsed by Karakeep
- ❌ NOT a replacement for the official Karakeep frontend

### Technologies Used
- Built with [React-Admin](https://marmelab.com/react-admin/)
- UI components from [DaisyUI](https://daisyui.com/)
- Icons from [Heroicons](https://heroicons.com/)
- Bundled with [Vite](https://vitejs.dev/)

### Special Thanks
To the Karakeep team for creating an excellent bookmark management API that made this UI experiment possible.