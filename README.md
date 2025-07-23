# Karakeep Frontend

A modern, fast, and maintainable bookmark management frontend built with Refine and DaisyUI.

## 🚀 Features

- **Modern Tech Stack**: React 19 + TypeScript + Refine + DaisyUI
- **50% Smaller Bundle**: 210KB gzipped (vs 315KB from React-Admin)
- **Responsive Design**: Mobile-first approach with clean UI
- **Type Safety**: Full TypeScript implementation
- **Fast Development**: Hot reload and modern build tools

## 📦 Tech Stack

- **Framework**: [Refine](https://refine.dev/) 4.57.10 - Headless admin framework
- **UI**: [DaisyUI](https://daisyui.com/) 5.0.46 + [Tailwind CSS](https://tailwindcss.com/) 4.1.11
- **Build Tool**: [Vite](https://vitejs.dev/) 7.0.4
- **Forms**: [React Hook Form](https://react-hook-form.com/) 7.60.0
- **Routing**: [React Router](https://reactrouter.com/) v7
- **HTTP Client**: [Axios](https://axios-http.com/) 1.10.0

## 🛠 Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Backend API URL
VITE_API_URL=http://localhost:8000/api

# Optional: Development API token
VITE_API_TOKEN=your_dev_token_here
```

## 📁 Project Structure

```
├── src/
│   ├── components/          # Reusable UI components
│   │   └── Layout.tsx       # Main app layout
│   ├── pages/               # Page components
│   │   └── bookmarks/       # Bookmark CRUD pages
│   ├── App.tsx              # Main app configuration
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles
├── archive/                 # Archived React-Admin implementation
├── tailwind.config.js       # Tailwind + DaisyUI configuration
└── vite.config.ts           # Vite configuration
```

## 🎨 UI Components

The app uses DaisyUI components with custom Karakeep themes:

- **karakeep**: Light theme with blue primary colors
- **karakeep-dark**: Dark theme variant

### Key UI Features

- Responsive drawer layout with sidebar navigation
- Card-based bookmark display
- Form handling with validation
- Loading states and error handling
- Mobile-optimized interface

## 🔗 API Integration

The frontend integrates with the Karakeep REST API:

- **Data Provider**: Refine's simple-rest with custom extensions
- **Authentication**: JWT-based (implementation in progress)
- **Resources**: Bookmarks, tags, lists management

### Available Routes

- `/bookmarks` - Bookmark listing (card view)
- `/bookmarks/show/:id` - Bookmark detail view
- `/bookmarks/edit/:id` - Bookmark editing form
- `/bookmarks/create` - New bookmark creation

## 📋 Migration Status

This project was migrated from React-Admin to Refine for better performance and maintainability.

### ✅ Completed
- Complete Refine + DaisyUI setup
- Basic CRUD operations for bookmarks
- Responsive layout and navigation
- TypeScript configuration
- Build and development tools

### 🚧 In Progress
- JWT authentication implementation
- Custom data provider with API integration
- DaisyUI component optimization
- **GitOps automation** with Claude Code hooks for streamlined development

### 📅 Planned
- Triage mode for bookmark processing
- Keyboard shortcuts system
- Advanced search and filtering
- Bulk operations
- Real-time updates

## 📚 Documentation

- [`CLAUDE.md`](./CLAUDE.md) - Development guide and project context
- [`REFINE_MIGRATION_ASSETS.md`](./REFINE_MIGRATION_ASSETS.md) - Migration reference materials
- [`REFINE_MIGRATION_PROGRESS.md`](./REFINE_MIGRATION_PROGRESS.md) - Detailed migration status
- [`archive/README.md`](./archive/README.md) - Archived React-Admin implementation

## 🏗 Architecture Benefits

The Refine migration provides several key advantages:

1. **Performance**: 50% smaller bundle size
2. **Maintainability**: No CSS override battles
3. **Flexibility**: True headless architecture
4. **Developer Experience**: Modern hooks-based patterns
5. **Type Safety**: Better TypeScript integration

## 📄 License

This project is part of the Karakeep bookmark management system.

## 🤝 Contributing

Please refer to the project documentation in [`CLAUDE.md`](./CLAUDE.md) for development guidelines and architectural decisions.