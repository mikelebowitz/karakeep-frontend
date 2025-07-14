# Karakeep API Integration

## Overview

This document describes the integration of the Karakeep frontend application with the live Karakeep API at `http://karakeep.lab`.

## Configuration

### Environment Variables

The application uses the following environment variables (configured in `.env.local`):

```bash
VITE_API_URL=/api
VITE_API_TOKEN=ak1_efbd421282425d43ef9f_6594c44e78a794e79e85
```

### Vite Proxy Configuration

To handle CORS issues, we configured Vite to proxy API requests:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://karakeep.lab',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1')
      }
    }
  }
})
```

This configuration:
- Routes all `/api/*` requests through the Vite dev server
- Forwards them to `http://karakeep.lab/api/v1/*`
- Avoids CORS issues during development

## Data Provider Updates

### API Response Format Handling

The data provider was updated to handle the Karakeep API's response format:

```typescript
// dataProvider.ts
async getList(resource: string, params: GetListParams) {
  // ... request setup ...
  const { data } = await this.httpClient.get(`/${resource}`, { params: query });
  
  // Handle Karakeep API response format
  const resourceData = data[resource] || data.data || [];
  const total = data.total || data.count || resourceData.length;
  
  return {
    data: resourceData,
    total: total,
  };
}
```

### Authentication

The data provider uses Bearer token authentication:

```typescript
this.httpClient.interceptors.request.use((config) => {
  // Use environment token if available, otherwise fallback to localStorage
  const token = apiToken || localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Type Updates

Updated TypeScript interfaces to match the actual Karakeep API response structure:

### Bookmark Type

```typescript
export interface Bookmark {
  id: string;
  title?: string;
  archived: boolean;
  favourited: boolean;
  taggingStatus: string;
  summarizationStatus: string;
  note?: string;
  summary?: string;
  tags: KarakeepTag[];
  content: {
    type: string;
    url: string;
    title?: string;
    description?: string;
    imageUrl?: string;
    screenshotAssetId?: string;
    favicon?: string;
    htmlContent?: string;
  };
  createdAt: string;
  modifiedAt: string;
}
```

### Tag Type

```typescript
export interface KarakeepTag {
  id: string;
  name: string;
  attachedBy: 'ai' | 'human';
}

export interface Tag {
  id: string;
  name: string;
  numBookmarks: number;
  numBookmarksByAttachedType: {
    ai: number;
    human: number;
  };
}
```

### List Type

```typescript
export interface List {
  id: string;
  name: string;
  description: string;
  icon: string;
  parentId?: string;
  type: 'manual' | 'smart';
  query?: string;
  public: boolean;
}
```

## Keyboard Shortcuts

Implemented keyboard shortcuts with React-Admin integration:

- **Cmd/Ctrl + K**: Quick search
- **Cmd/Ctrl + N**: New bookmark
- **G then B**: Go to bookmarks
- **G then T**: Go to tags
- **G then L**: Go to lists
- **?**: Show help

The keyboard shortcuts were integrated using a custom layout component to work within React-Admin's routing system.

## Known Issues and Solutions

1. **CORS Error**: Resolved by implementing Vite proxy configuration
2. **Router Context Error**: Fixed by using React-Admin's `useRedirect` instead of React Router's `useNavigate`
3. **JSX Fragment Error**: Resolved by importing React and using React.Fragment

## Next Steps

1. Complete keyboard shortcut testing
2. Test batch actions for bookmark management
3. Implement default untagged bookmarks filter for triage workflow
4. Add vim-style navigation (j/k keys)
5. Add auto-focus search on page load