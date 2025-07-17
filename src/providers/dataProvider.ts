import type {
  DataProvider,
  GetListParams,
  GetOneParams,
  GetManyParams,
  GetManyReferenceParams,
  CreateParams,
  UpdateParams,
  UpdateManyParams,
  DeleteParams,
  DeleteManyParams,
} from 'react-admin';
import axios, { type AxiosInstance } from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const apiToken = import.meta.env.VITE_API_TOKEN;

class KarakeepDataProvider implements DataProvider {
  private httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      baseURL: apiUrl,
    });

    // Add auth token to requests
    this.httpClient.interceptors.request.use((config) => {
      // Use environment token if available, otherwise fallback to localStorage
      const token = apiToken || localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle token refresh
    this.httpClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await axios.post(`${apiUrl}/auth/refresh`, {
                refresh_token: refreshToken,
              });
              
              const { access_token } = response.data;
              localStorage.setItem('auth_token', access_token);
              
              originalRequest.headers.Authorization = `Bearer ${access_token}`;
              return this.httpClient(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  async getList(resource: string, params: GetListParams) {
    const { page, perPage } = params.pagination || { page: 1, perPage: 20 };
    
    // For bookmarks, show Inbox list contents directly
    if (resource === 'bookmarks') {
      // Add a timestamp to the params to force React-Admin to treat each request as unique
      const result = await this.getInboxBookmarks(page, perPage);
      // Ensure each bookmark has a stable ID
      result.data = result.data.map((bookmark: any) => ({
        ...bookmark,
        id: bookmark.id || bookmark._id || Math.random().toString()
      }));
      return result;
    }
    
    // For other resources, use simple limit-based approach
    const query = {
      limit: perPage,
      ...params.filter,
    };

    const { data } = await this.httpClient.get(`/${resource}`, { params: query });
    
    // Handle Karakeep API response format
    const resourceData = data[resource] || data.data || [];
    
    // Estimate total for other resources
    let total;
    if (resource === 'tags') {
      total = 500; // Estimate for tags
    } else if (resource === 'lists') {
      total = 20; // Estimate for lists
    } else {
      total = Math.max(resourceData.length, 100); // Default estimate
    }
    
    return {
      data: resourceData,
      total: total,
    };
  }

  // Get bookmarks from the Inbox list with working pagination
  private async getInboxBookmarks(page: number, perPage: number) {
    console.log('🔍 Fetching Inbox bookmarks - page:', page, 'perPage:', perPage);
    
    try {
      const inboxListId = 'qukdzoowmmsnr8hb19b0z1xc'; // Inbox list ID
      const url = `/lists/${inboxListId}/bookmarks`;
      
      // Initialize cursor storage if needed
      if (!(window as any).__karakeepPageCursors) {
        (window as any).__karakeepPageCursors = new Map();
      }
      
      // Clear cache when perPage changes
      const currentPerPage = (window as any).__karakeepLastPerPage;
      if (currentPerPage !== perPage) {
        console.log('🔄 PerPage changed, clearing cache');
        (window as any).__karakeepPageCursors.clear();
        (window as any).__karakeepLastPerPage = perPage;
      }
      
      const cursors = (window as any).__karakeepPageCursors;
      
      // If page 1, start fresh
      if (page === 1) {
        console.log('📡 Making request to:', url, '(page 1)');
        const { data } = await this.httpClient.get(url, {
          params: { limit: perPage }
        });
        
        console.log('✅ Page 1 response:', {
          bookmarkCount: data.bookmarks?.length,
          firstBookmarkId: data.bookmarks?.[0]?.id,
          firstBookmarkTitle: data.bookmarks?.[0]?.title || data.bookmarks?.[0]?.content?.title,
          nextCursor: data.nextCursor
        });
        
        // Log first 3 bookmark titles for comparison
        console.log('📋 First 3 bookmarks on page 1:', 
          data.bookmarks?.slice(0, 3).map((b: any) => b.title || b.content?.title || 'No title')
        );
        
        // Store cursor for page 2
        if (data.nextCursor) {
          cursors.set(2, data.nextCursor);
        }
        
        const result = {
          data: data.bookmarks || [],
          // Use partial pagination instead of total count
          pageInfo: {
            hasNextPage: !!data.nextCursor,
            hasPreviousPage: false, // First page never has previous
          },
          meta: {
            page,
            cursor: data.nextCursor || 'none',
            // Force unique cache key for React Query
            cacheKey: `page-${page}-cursor-${(data.nextCursor || 'none').substring(0, 10)}`,
            timestamp: Date.now()
          }
        };
        
        console.log('📋 Returning data for page 1 - Count:', result.data.length, 'hasNextPage:', result.pageInfo.hasNextPage);
        console.log('📋 First bookmark title:', result.data[0]?.title || result.data[0]?.content?.title);
        
        return result;
      }
      
      // For subsequent pages, use stored cursor
      const nextCursor = cursors.get(page);
      console.log('🔍 Available cursors:', Array.from(cursors.keys()), 'Looking for page:', page);
      
      if (nextCursor) {
        console.log('📡 Making request to:', url, 'with cursor for page', page, ':', nextCursor.substring(0, 20) + '...');
        console.log('🔧 Full request params:', { limit: perPage, cursor: nextCursor });
        const { data } = await this.httpClient.get(url, {
          params: { limit: perPage, cursor: nextCursor }
        });
        
        console.log('✅ Page', page, 'response:', {
          bookmarkCount: data.bookmarks?.length,
          firstBookmarkId: data.bookmarks?.[0]?.id,
          firstBookmarkTitle: data.bookmarks?.[0]?.title || data.bookmarks?.[0]?.content?.title,
          nextCursor: data.nextCursor
        });
        
        // Log first 3 bookmark titles for comparison
        console.log('📋 First 3 bookmarks on page', page, ':', 
          data.bookmarks?.slice(0, 3).map((b: any) => b.title || b.content?.title || 'No title')
        );
        
        // Store cursor for next page
        if (data.nextCursor) {
          cursors.set(page + 1, data.nextCursor);
          console.log('💾 Stored cursor for page', page + 1, ':', data.nextCursor.substring(0, 20) + '...');
        } else {
          console.log('⚠️ No nextCursor in response for page', page);
        }
        
        const result = {
          data: data.bookmarks || [],
          // Use partial pagination with proper hasNextPage/hasPreviousPage
          pageInfo: {
            hasNextPage: !!data.nextCursor,
            hasPreviousPage: page > 1, // Any page after 1 has previous
          },
          meta: {
            page,
            cursor: data.nextCursor || 'none',
            // Force unique cache key for React Query
            cacheKey: `page-${page}-cursor-${(data.nextCursor || 'none').substring(0, 10)}`,
            timestamp: Date.now()
          }
        };
        
        console.log('📋 Returning data for page', page, '- Count:', result.data.length, 
          'hasNextPage:', result.pageInfo.hasNextPage, 'hasPreviousPage:', result.pageInfo.hasPreviousPage);
        console.log('📋 First bookmark title:', result.data[0]?.title || result.data[0]?.content?.title);
        
        return result;
      }
      
      // No cursor available for this page
      console.log('⚠️ No cursor available for page', page);
      return {
        data: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: page > 1,
        }
      };
      
    } catch (error) {
      console.error('❌ Error fetching Inbox bookmarks:', error);
      return {
        data: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        }
      };
    }
  }

  async getOne(resource: string, params: GetOneParams) {
    console.log('🔍 Getting single', resource, 'with ID:', params.id);
    
    try {
      const { data } = await this.httpClient.get(`/${resource}/${params.id}`);
      console.log('✅ getOne response:', data);
      
      // Handle Karakeep API response format
      if (resource === 'bookmarks') {
        // For bookmarks, the API returns the bookmark data directly
        return { data: data };
      } else {
        // For other resources, try to extract from nested structure
        return { data: data[resource.slice(0, -1)] || data };
      }
    } catch (error) {
      console.error('❌ Error in getOne:', error);
      throw error;
    }
  }

  async getMany(resource: string, params: GetManyParams) {
    console.log('🔍 getMany called for resource:', resource, 'with IDs:', params.ids);
    
    // Handle tags - call GET /tags and filter by requested IDs
    if (resource === 'tags') {
      try {
        const { data } = await this.httpClient.get('/tags');
        console.log('✅ Got tags data:', data);
        const filteredTags = data.tags.filter((tag: any) => params.ids.includes(tag.id));
        console.log('✅ Filtered tags:', filteredTags);
        return { data: filteredTags };
      } catch (error) {
        console.error('❌ Error fetching tags:', error);
        return { data: [] };
      }
    }
    
    // Handle lists - call GET /lists and filter by requested IDs
    if (resource === 'lists') {
      try {
        const { data } = await this.httpClient.get('/lists');
        console.log('✅ Got lists data:', data);
        const filteredLists = data.lists.filter((list: any) => params.ids.includes(list.id));
        console.log('✅ Filtered lists:', filteredLists);
        return { data: filteredLists };
      } catch (error) {
        console.error('❌ Error fetching lists:', error);
        return { data: [] };
      }
    }
    
    // Fallback for other resources (if they have /many endpoints)
    try {
      const query = { ids: params.ids.join(',') };
      const { data } = await this.httpClient.get(`/${resource}/many`, { params: query });
      return { data };
    } catch (error) {
      console.error(`❌ Error fetching ${resource}/many:`, error);
      return { data: [] };
    }
  }

  async getManyReference(resource: string, params: GetManyReferenceParams) {
    const { page, perPage } = params.pagination || { page: 1, perPage: 20 };
    const { field, order } = params.sort || { field: 'id', order: 'DESC' };
    const query = {
      page,
      per_page: perPage,
      sort: field,
      order: order.toLowerCase(),
      [params.target]: params.id,
      ...params.filter,
    };

    const { data } = await this.httpClient.get(`/${resource}`, { params: query });
    
    return {
      data: data.data,
      total: data.total,
    };
  }

  async create(resource: string, params: CreateParams) {
    const { data } = await this.httpClient.post(`/${resource}`, params.data);
    return { data };
  }

  async update(resource: string, params: UpdateParams) {
    const { data } = await this.httpClient.put(`/${resource}/${params.id}`, params.data);
    return { data };
  }

  async updateMany(resource: string, params: UpdateManyParams) {
    const promises = params.ids.map(id =>
      this.httpClient.put(`/${resource}/${id}`, params.data)
    );
    
    await Promise.all(promises);
    return { data: params.ids };
  }

  async delete(resource: string, params: DeleteParams) {
    await this.httpClient.delete(`/${resource}/${params.id}`);
    return { data: params.previousData };
  }

  async deleteMany(resource: string, params: DeleteManyParams) {
    const promises = params.ids.map(id =>
      this.httpClient.delete(`/${resource}/${id}`)
    );
    
    await Promise.all(promises);
    return { data: params.ids };
  }

  // Custom methods for tag/list attachment
  async attachTags(bookmarkId: string, tagIds: string[]) {
    const { data } = await this.httpClient.post(`/bookmarks/${bookmarkId}/tags`, {
      tag_ids: tagIds,
    });
    return data;
  }

  async detachTags(bookmarkId: string, tagIds: string[]) {
    const { data } = await this.httpClient.delete(`/bookmarks/${bookmarkId}/tags`, {
      data: { tag_ids: tagIds },
    });
    return data;
  }

  async attachLists(bookmarkId: string, listIds: string[]) {
    const { data } = await this.httpClient.post(`/bookmarks/${bookmarkId}/lists`, {
      list_ids: listIds,
    });
    return data;
  }

  async detachLists(bookmarkId: string, listIds: string[]) {
    const { data } = await this.httpClient.delete(`/bookmarks/${bookmarkId}/lists`, {
      data: { list_ids: listIds },
    });
    return data;
  }
}

export const dataProvider = new KarakeepDataProvider();