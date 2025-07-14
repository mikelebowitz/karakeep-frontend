# Karakeep Frontend Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Access to Karakeep API at `http://karakeep.lab`
- Valid Karakeep API token

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd karakeep-frontend-repo
```

2. Install dependencies:
```bash
npm install
```

3. Create environment configuration:
```bash
# Create .env.local file
cat > .env.local << EOF
VITE_API_URL=/api
VITE_API_TOKEN=your_api_token_here
EOF
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Configuration

### API Token

The API token should be obtained from your Karakeep instance. The format is:
```
ak1_[identifier]_[secret]
```

### Proxy Configuration

The application is configured to proxy API requests to avoid CORS issues during development. The Vite configuration automatically handles this.

## Features

### Current Capabilities

- **Bookmark Management**: View, create, edit, and archive bookmarks
- **Tag Management**: View and manage tags (AI and human-generated)
- **List Management**: Organize bookmarks into lists
- **Keyboard Shortcuts**: Power-user navigation and actions
- **Search**: Quick search across bookmarks
- **Batch Operations**: Select and perform actions on multiple bookmarks

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Focus search |
| `Cmd/Ctrl + N` | Create new bookmark |
| `G then B` | Go to bookmarks |
| `G then T` | Go to tags |
| `G then L` | Go to lists |
| `?` | Show help |

## Architecture

The application is built with:
- **React** + **TypeScript** for the frontend
- **React-Admin** for the admin interface
- **Material-UI** for components and theming
- **Axios** for API communication
- **Vite** for development and build tooling

## File Structure

```
src/
├── components/          # Reusable components
│   ├── KeyboardShortcuts.tsx
│   └── AdminWithKeyboardShortcuts.tsx
├── pages/              # Page components
│   ├── bookmarks/      # Bookmark-related pages
│   ├── tags/           # Tag-related pages
│   └── lists/          # List-related pages
├── providers/          # Data and auth providers
│   ├── dataProvider.ts
│   └── authProvider.ts
├── types/              # TypeScript type definitions
│   └── index.ts
└── App.tsx            # Main application component
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the Vite proxy is configured correctly and the development server is running
2. **Authentication Issues**: Verify the API token is correct and properly formatted
3. **Network Errors**: Check that `http://karakeep.lab` is accessible from your development machine

### Development Tips

1. Use browser developer tools to monitor network requests
2. Check the console for any JavaScript errors
3. Verify environment variables are loaded correctly (visible in console logs)
4. Restart the development server after configuration changes