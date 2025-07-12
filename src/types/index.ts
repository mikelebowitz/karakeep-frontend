export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description?: string;
  tags: Tag[];
  lists: List[];
  favicon?: string;
  screenshot?: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
  bookmark_count?: number;
  created_at: string;
  updated_at: string;
}

export interface List {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  bookmark_count?: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
}