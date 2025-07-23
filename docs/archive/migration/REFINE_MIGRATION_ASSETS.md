# Refine Migration Assets

This document preserves all valuable code and patterns from the React-Admin implementation for use in the Refine migration.

## Core Reusable Assets

### 1. Data Provider Logic (`src/providers/dataProvider.ts`)

**Key Features to Port:**
- JWT token management with automatic refresh
- Cursor-based pagination for bookmarks
- Custom methods for tag/list attachment
- Inbox-specific bookmark loading
- Error handling and retry logic

**Critical API Patterns:**
```typescript
// Environment configuration
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const apiToken = import.meta.env.VITE_API_TOKEN;

// Token refresh interceptor
this.httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Refresh token logic
      const refreshToken = localStorage.getItem('refresh_token');
      const response = await axios.post(`${apiUrl}/auth/refresh`, {
        refresh_token: refreshToken,
      });
    }
  }
);

// Cursor-based pagination for bookmarks
private async getInboxBookmarks(page: number, perPage: number) {
  const inboxListId = 'qukdzoowmmsnr8hb19b0z1xc';
  const url = `/lists/${inboxListId}/bookmarks`;
  // Cursor storage logic for pagination
}

// Tag/List attachment methods
async attachTags(bookmarkId: string, tagIds: string[]) {
  return this.httpClient.post(`/bookmarks/${bookmarkId}/tags`, {
    tag_ids: tagIds,
  });
}

async attachLists(bookmarkId: string, listIds: string[]) {
  const promises = listIds.map(listId =>
    this.httpClient.put(`/lists/${listId}/bookmarks/${bookmarkId}`)
  );
  await Promise.all(promises);
}
```

### 2. Authentication Provider (`src/providers/authProvider.ts`)

**Key Features to Port:**
- JWT login/logout flow
- Token validation
- Environment token support
- User identity management

**Critical Auth Patterns:**
```typescript
// Login flow
login: async ({ username, password }) => {
  const { data } = await axios.post(`${apiUrl}/auth/login`, {
    email: username,
    password,
  });
  localStorage.setItem('auth_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  localStorage.setItem('user', JSON.stringify(data.user));
}

// Token validation
checkAuth: async () => {
  if (apiToken) return Promise.resolve();
  const token = localStorage.getItem('auth_token');
  if (!token) return Promise.reject();
  
  await axios.get(`${apiUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}
```

### 3. Keyboard Shortcuts (`src/components/KeyboardShortcuts.tsx`)

**Key Features to Port:**
- Cmd/Ctrl + K for search
- Cmd/Ctrl + N for new bookmark
- G then B/T/L navigation patterns
- ? for help
- Input field detection

**Critical Keyboard Patterns:**
```typescript
// Search shortcut
if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
  e.preventDefault();
  const searchInput = document.querySelector('input[name="q"]');
  searchInput?.focus();
}

// Navigation patterns
if (e.key === 'g') {
  const listener = (event: KeyboardEvent) => {
    if (event.key === 'b') redirect('list', 'bookmarks');
    // etc.
  };
  window.addEventListener('keydown', listener);
}
```

### 4. DaisyUI Theme Configuration

**Files to Review:**
- `src/theme/daisyuiTheme.ts` - Theme configuration
- `src/index.css` - CSS overrides (analyze patterns, avoid in Refine)
- `tailwind.config.js` - Tailwind configuration

### 5. API Endpoint Documentation

**Reference:** `docs/KARAKEEP_API_ENDPOINTS.md`
- Complete API specification
- Working request/response examples
- Authentication patterns
- Error handling

## Working Component Patterns

### 1. Triage Mode Implementation

**Files to Reference:**
- `src/pages/TriageMode.tsx` - Full-screen triage interface
- `src/components/CommandSidebar.tsx` - Command reference
- Keyboard shortcut integration

**Key Features:**
- Card-based bookmark display
- List selection with number keys
- Keyboard command reference
- Full-screen modal overlay

### 2. Custom Form Components

**Files to Reference:**
- `src/components/TagSelector.tsx` - Multi-select with API integration
- `src/components/ListSelector.tsx` - Multi-select with API integration
- `src/pages/BookmarkEdit.tsx` - Form integration patterns

**Key Features:**
- React Hook Form integration
- API-driven autocomplete
- Real-time validation
- Custom styling with DaisyUI

## API Integration Patterns

### 1. Bookmark Data Structure
```typescript
interface Bookmark {
  id: string;
  content: {
    url?: string;
    title?: string;
    description?: string;
  };
  tags: string[];
  lists: string[];
  created_at: string;
  updated_at: string;
}
```

### 2. Pagination Handling
```typescript
// Cursor-based pagination for bookmarks
{
  limit: number;
  cursor?: string;
  includeContent?: boolean;
}

// Response format
{
  bookmarks: Bookmark[];
  nextCursor?: string;
}
```

### 3. Tag/List Management
```typescript
// Attach tags to bookmark
POST /bookmarks/{id}/tags
{ "tag_ids": ["tag1", "tag2"] }

// Attach bookmark to list  
PUT /lists/{listId}/bookmarks/{bookmarkId}

// Get tags/lists for filters
GET /tags -> { tags: Tag[] }
GET /lists -> { lists: List[] }
```

## Configuration Files

### 1. Vite Configuration
**File:** `vite.config.ts`
- Proxy setup for API calls
- Build configuration
- Development server settings

### 2. TypeScript Configuration
**File:** `tsconfig.json`
- Strict type checking
- Path aliases
- Module resolution

### 3. Package Dependencies
**Key packages to maintain:**
- Axios for HTTP client
- TypeScript for type safety
- Tailwind CSS + DaisyUI for styling
- React Hook Form for forms (if migrating)

## Migration Strategy Notes

### What to Port Directly:
1. **API client logic** - JWT handling, refresh logic, endpoint patterns
2. **Authentication flow** - Login/logout, token management
3. **Keyboard shortcuts** - All current shortcuts and patterns
4. **Data structures** - Bookmark, tag, list interfaces
5. **Environment configuration** - API URL, token handling

### What to Rebuild:
1. **Data fetching hooks** - Convert to Refine's useList, useOne, etc.
2. **Form components** - Use Refine's form handling or React Hook Form
3. **Table/list components** - Use TanStack Table or custom DaisyUI
4. **Navigation** - Use React Router or Refine's routing
5. **Layout** - Build custom layout with DaisyUI

### What to Avoid:
1. **CSS overrides** - No more Material-UI fighting
2. **React-Admin specific patterns** - Resource components, dataProvider interface
3. **Complex pagination workarounds** - Use simpler patterns with Refine

## Performance Optimizations

### Current Working Solutions:
1. **Cursor caching** - Window-based cursor storage for pagination
2. **Batch loading** - getAllInboxBookmarks for triage mode
3. **Lazy loading** - Only load content when needed
4. **Token refresh** - Automatic background refresh

### Areas for Improvement:
1. **Bundle size** - Refine is 50% smaller than React-Admin
2. **Rendering** - Custom components should be faster
3. **API calls** - Reduce unnecessary requests
4. **Memory usage** - Better cleanup of event listeners

## Next Steps for Migration

1. **Set up Refine + DaisyUI project**
2. **Port authentication logic first**
3. **Implement basic bookmark listing**
4. **Add CRUD operations**
5. **Port triage mode**
6. **Add keyboard shortcuts**
7. **Performance testing and optimization**