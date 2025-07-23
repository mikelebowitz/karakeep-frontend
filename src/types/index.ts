// Authentication types
export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

// API response types for bookmark management
export interface Bookmark {
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

export interface Tag {
  id: string;
  name: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface List {
  id: string;
  name: string;
  icon?: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

// API response wrappers
export interface BookmarksResponse {
  bookmarks: Bookmark[];
  nextCursor?: string;
  total?: number;
}

export interface TagsResponse {
  tags: Tag[];
  total?: number;
}

export interface ListsResponse {
  lists: List[];
  total?: number;
}

// Form types
export interface CreateBookmarkForm {
  content: {
    url?: string;
    title?: string;
    description?: string;
  };
  tags?: string[];
  lists?: string[];
}

export interface UpdateBookmarkForm extends CreateBookmarkForm {
  id: string;
}

export interface CreateTagForm {
  name: string;
  color?: string;
}

export interface CreateListForm {
  name: string;
  icon?: string;
  parent_id?: string;
}

// Component props types
export interface BookmarkCardProps {
  bookmark: Bookmark;
  onEdit?: (bookmark: Bookmark) => void;
  onDelete?: (bookmarkId: string) => void;
}

export interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export interface ListSelectorProps {
  selectedLists: string[];
  onChange: (lists: string[]) => void;
}

// API error types
export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

// Pagination types
export interface CursorPagination {
  limit: number;
  cursor?: string;
  includeContent?: boolean;
}

export interface OffsetPagination {
  limit: number;
  offset: number;
}