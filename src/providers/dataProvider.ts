import type { DataProvider, CrudFilters, CrudSorting } from "@refinedev/core";
import axiosInstance from "../lib/axios";

// Cursor storage for pagination
const cursorStorage = {
  bookmarks: new Map<number, string>(),
  clearCursors: () => {
    cursorStorage.bookmarks.clear();
  }
};

export const karakeepDataProvider = (apiUrl: string): DataProvider => {
  return {
    getApiUrl: () => apiUrl,

    // Get list of resources
    getList: async ({ resource, pagination, filters, sorters, meta: _meta }) => {
      const { current = 1, pageSize = 10 } = pagination ?? {};

      if (resource === "bookmarks") {
        return getBookmarksList({ current, pageSize, filters, sorters, meta: _meta });
      } else if (resource === "tags") {
        return getTagsList({ current, pageSize, filters, sorters });
      } else if (resource === "lists") {
        return getListsList({ current, pageSize, filters, sorters });
      }

      throw new Error(`Resource ${resource} not supported`);
    },

    // Get single resource
    getOne: async ({ resource, id, meta: _meta }) => {
      if (resource === "bookmarks") {
        const { data } = await axiosInstance.get(`/bookmarks/${id}`);
        return { data };
      } else if (resource === "tags") {
        const { data } = await axiosInstance.get(`/tags/${id}`);
        return { data };
      } else if (resource === "lists") {
        const { data } = await axiosInstance.get(`/lists/${id}`);
        return { data };
      }

      throw new Error(`Resource ${resource} not supported`);
    },

    // Get multiple resources by IDs
    getMany: async ({ resource, ids, meta: _meta }) => {
      if (resource === "bookmarks") {
        const promises = ids.map(id => axiosInstance.get(`/bookmarks/${id}`));
        const responses = await Promise.all(promises);
        return { data: responses.map(r => r.data) };
      } else if (resource === "tags") {
        const promises = ids.map(id => axiosInstance.get(`/tags/${id}`));
        const responses = await Promise.all(promises);
        return { data: responses.map(r => r.data) };
      } else if (resource === "lists") {
        const promises = ids.map(id => axiosInstance.get(`/lists/${id}`));
        const responses = await Promise.all(promises);
        return { data: responses.map(r => r.data) };
      }

      throw new Error(`Resource ${resource} not supported`);
    },

    // Create new resource
    create: async ({ resource, variables, meta: _meta }) => {
      if (resource === "bookmarks") {
        const { data } = await axiosInstance.post("/bookmarks", variables);
        return { data };
      } else if (resource === "tags") {
        const { data } = await axiosInstance.post("/tags", variables);
        return { data };
      } else if (resource === "lists") {
        const { data } = await axiosInstance.post("/lists", variables);
        return { data };
      }

      throw new Error(`Resource ${resource} not supported`);
    },

    // Update existing resource
    update: async ({ resource, id, variables, meta: _meta }) => {
      if (resource === "bookmarks") {
        const { data } = await axiosInstance.put(`/bookmarks/${id}`, variables);
        return { data };
      } else if (resource === "tags") {
        const { data } = await axiosInstance.put(`/tags/${id}`, variables);
        return { data };
      } else if (resource === "lists") {
        const { data } = await axiosInstance.put(`/lists/${id}`, variables);
        return { data };
      }

      throw new Error(`Resource ${resource} not supported`);
    },

    // Delete resource
    deleteOne: async ({ resource, id, variables: _variables, meta: _meta }) => {
      if (resource === "bookmarks") {
        const { data } = await axiosInstance.delete(`/bookmarks/${id}`);
        return { data };
      } else if (resource === "tags") {
        const { data } = await axiosInstance.delete(`/tags/${id}`);
        return { data };
      } else if (resource === "lists") {
        const { data } = await axiosInstance.delete(`/lists/${id}`);
        return { data };
      }

      throw new Error(`Resource ${resource} not supported`);
    },

    // Custom methods for tag/list management
    custom: async ({ url, method, filters: _filters, sorters: _sorters, payload, query: _query, headers, meta: _meta }) => {
      const requestUrl = `${url}`;
      
      if (method === 'post') {
        const { data } = await axiosInstance.post(requestUrl, payload, { headers });
        return { data };
      } else if (method === 'put') {
        const { data } = await axiosInstance.put(requestUrl, payload, { headers });
        return { data };
      } else if (method === 'delete') {
        const { data } = await axiosInstance.delete(requestUrl, { headers });
        return { data };
      } else {
        const { data } = await axiosInstance.get(requestUrl, { headers });
        return { data };
      }
    },
  };
};

// Helper function to get bookmarks with cursor-based pagination
async function getBookmarksList({ 
  current, 
  pageSize, 
  filters: _filters, 
  sorters: _sorters, 
  meta: _meta 
}: {
  current: number;
  pageSize: number;
  filters?: CrudFilters;
  sorters?: CrudSorting;
  meta?: any;
}) {
  // Use official API endpoint as documented
  // Get cursor for current page
  const cursor = cursorStorage.bookmarks.get(current);
  
  // Build query parameters
  const params: any = {
    limit: pageSize,
    includeContent: true,
  };
  
  if (cursor) {
    params.cursor = cursor;
  }

  try {
    const { data } = await axiosInstance.get(`/bookmarks`, {
      params
    });

    // Store next cursor if available
    if (data.nextCursor) {
      cursorStorage.bookmarks.set(current + 1, data.nextCursor);
    }

    // Handle different API response formats
    let bookmarks = [];
    if (Array.isArray(data)) {
      bookmarks = data;
    } else if (data.bookmarks && Array.isArray(data.bookmarks)) {
      bookmarks = data.bookmarks;
    } else if (data.data && Array.isArray(data.data)) {
      bookmarks = data.data;
    }

    // Ensure each bookmark has required properties and filter out invalid ones
    bookmarks = bookmarks.filter(bookmark => {
      return bookmark && typeof bookmark === 'object' && bookmark.id;
    });

    const result = {
      data: bookmarks,
      total: bookmarks.length || 0, // Note: cursor pagination doesn't provide total count
    };

    return result;
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return {
      data: [],
      total: 0,
    };
  }
}

// Helper function to get tags list
async function getTagsList({ current, pageSize, filters: _filters, sorters: _sorters }: {
  current: number;
  pageSize: number;
  filters?: CrudFilters;
  sorters?: CrudSorting;
}) {
  try {
    const { data } = await axiosInstance.get('/tags', {
      params: {
        limit: pageSize,
        offset: (current - 1) * pageSize,
      }
    });

    return {
      data: data.tags || [],
      total: data.total || data.tags?.length || 0,
    };
  } catch (error) {
    console.error('Error fetching tags:', error);
    return {
      data: [],
      total: 0,
    };
  }
}

// Helper function to get lists list
async function getListsList({ current, pageSize, filters: _filters, sorters: _sorters }: {
  current: number;
  pageSize: number;
  filters?: CrudFilters;
  sorters?: CrudSorting;
}) {
  try {
    const { data } = await axiosInstance.get('/lists', {
      params: {
        limit: pageSize,
        offset: (current - 1) * pageSize,
      }
    });

    return {
      data: data.lists || [],
      total: data.total || data.lists?.length || 0,
    };
  } catch (error) {
    console.error('Error fetching lists:', error);
    return {
      data: [],
      total: 0,
    };
  }
}

// Export helper functions for tag/list attachment
export const attachTagsToBookmark = async (bookmarkId: string, tagIds: string[]) => {
  return axiosInstance.post(`/bookmarks/${bookmarkId}/tags`, {
    tag_ids: tagIds,
  });
};

export const attachBookmarkToLists = async (bookmarkId: string, listIds: string[]) => {
  const promises = listIds.map(listId =>
    axiosInstance.put(`/lists/${listId}/bookmarks/${bookmarkId}`)
  );
  return Promise.all(promises);
};

export const detachTagsFromBookmark = async (bookmarkId: string, tagIds: string[]) => {
  const promises = tagIds.map(tagId =>
    axiosInstance.delete(`/bookmarks/${bookmarkId}/tags/${tagId}`)
  );
  return Promise.all(promises);
};

export const detachBookmarkFromLists = async (bookmarkId: string, listIds: string[]) => {
  const promises = listIds.map(listId =>
    axiosInstance.delete(`/lists/${listId}/bookmarks/${bookmarkId}`)
  );
  return Promise.all(promises);
};