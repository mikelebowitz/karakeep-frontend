# Karakeep Frontend

A modern bookmark management system frontend built with React-Admin and Material UI.

![React](https://img.shields.io/badge/React-18.3-blue)
![React-Admin](https://img.shields.io/badge/React--Admin-5.x-orange)
![Material-UI](https://img.shields.io/badge/Material--UI-6.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Vite](https://img.shields.io/badge/Vite-6.x-purple)

## Features

- 📚 **Bookmark Management**: Full CRUD operations for bookmarks with metadata
- 🏷️ **Tag System**: Color-coded tags with bulk assignment
- 📁 **Lists**: Organize bookmarks into custom lists
- 🔐 **JWT Authentication**: Secure login with token refresh
- ⚡ **Keyboard Shortcuts**: Power user features (Cmd+K for search, Cmd+N for new)
- 🎯 **Batch Operations**: Bulk archive, tag, and list assignment
- 🔍 **Real-time Search**: Fast filtering across all resources
- 📱 **Responsive Design**: Mobile-friendly Material UI components

## Tech Stack

- **Framework**: React 18.3 with TypeScript
- **Admin Framework**: React-Admin 5.x
- **UI Library**: Material UI 6.x
- **Build Tool**: Vite 6.x
- **HTTP Client**: Axios
- **Authentication**: JWT with automatic refresh

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Backend API running (see API documentation)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/karakeep-frontend.git
cd karakeep-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env.local
# Edit .env.local and set VITE_API_URL to your backend API
```

4. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Demo Credentials

If using the demo backend:
- Email: `demo@example.com`
- Password: `password`

## Keyboard Shortcuts

- `Cmd/Ctrl + K`: Quick search
- `Cmd/Ctrl + N`: New bookmark
- `G then B`: Go to bookmarks
- `G then T`: Go to tags  
- `G then L`: Go to lists
- `?`: Show help

## Project Structure

```
src/
├── components/      # Reusable components
│   ├── BatchActions.tsx
│   └── KeyboardShortcuts.tsx
├── pages/          # Page components
│   ├── bookmarks/  # Bookmark CRUD screens
│   ├── tags/       # Tag CRUD screens
│   └── lists/      # List CRUD screens
├── providers/      # Data and auth providers
│   ├── authProvider.ts
│   └── dataProvider.ts
├── types/          # TypeScript definitions
└── App.tsx         # Main application
```

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/karakeep-frontend)

1. Click the button above or import your GitHub repository on Vercel
2. Configure environment variables:
   - `VITE_API_URL`: Your backend API URL
3. Deploy!

### Manual Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The built files will be in the `dist` directory.

## API Integration

This frontend expects a REST API with the following endpoints:

- `POST /auth/login` - Authentication
- `POST /auth/refresh` - Token refresh
- `GET /bookmarks` - List bookmarks with pagination
- `POST /bookmarks` - Create bookmark
- `PUT /bookmarks/:id` - Update bookmark
- `DELETE /bookmarks/:id` - Delete bookmark
- Similar endpoints for `/tags` and `/lists`

See the [backend documentation](https://github.com/YOUR_USERNAME/karakeep-backend) for API details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [React-Admin](https://marmelab.com/react-admin/)
- UI components from [Material-UI](https://mui.com/)
- Icons from [Material Icons](https://mui.com/material-ui/material-icons/)
- Bundled with [Vite](https://vitejs.dev/)