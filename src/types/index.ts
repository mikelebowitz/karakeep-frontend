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