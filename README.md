# Karakeep Triager - An experiment in new UI for the excellent Karakeep Bookmark Management System

A modern, productivity-focused bookmark management system with a React-Admin frontend and comprehensive organizational features.

![React](https://img.shields.io/badge/React-19.1-blue)
![React-Admin](https://img.shields.io/badge/React--Admin-5.9-orange)
![DaisyUI](https://img.shields.io/badge/DaisyUI-4.12-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Vite](https://img.shields.io/badge/Vite-7.0-purple)

## 📚 Project Overview

Karakeep is a comprehensive bookmark management solution designed for power users who need efficient tools for organizing, categorizing, and retrieving their saved web content. The system provides advanced features like batch operations, real-time search, keyboard shortcuts, and a triage mode for rapid content processing.

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
- Backend API running (see API documentation)

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

The frontend integrates with the Karakeep REST API through:

- **Authentication**: `POST /auth/login`, `POST /auth/refresh`
- **Bookmarks**: Full CRUD with pagination and search
- **Tags & Lists**: Management and association endpoints
- **Batch Operations**: Bulk updates and deletions

See `docs/KARAKEEP_API_ENDPOINTS.md` for complete API documentation.

## 🚀 Deployment

The frontend is configured for automatic deployment to Vercel:

1. **GitHub Integration**: Connected to `mikelebowitz/karakeep-frontend`
2. **Environment Variables**: Configure `VITE_API_URL` in Vercel dashboard
3. **Automatic Builds**: Triggered on push to main branch

For manual deployment:
```bash
npm run build  # Creates production build in dist/
```

## 🤝 Contributing

1. Fork the frontend repository: `github.com/mikelebowitz/karakeep-frontend`
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

## 🙏 Acknowledgments

- Built with [React-Admin](https://marmelab.com/react-admin/)
- UI components from [DaisyUI](https://daisyui.com/)
- Icons from [Heroicons](https://heroicons.com/)
- Bundled with [Vite](https://vitejs.dev/)