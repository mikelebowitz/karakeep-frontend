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
      return this.getInboxBookmarks(page, perPage);
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
      
      // If page 1, start fresh
      if (page === 1) {
        console.log('📡 Making request to:', url, '(page 1)');
        const { data } = await this.httpClient.get(url, {
          params: { limit: perPage }
        });
        
        console.log('✅ Page 1 response:', {
          bookmarkCount: data.bookmarks?.length,
          firstBookmarkId: data.bookmarks?.[0]?.id,
          nextCursor: data.nextCursor
        });
        
        // Store cursor for next page
        if (data.nextCursor) {
          (window as any).__karakeepNextCursor = data.nextCursor;
        }
        
        return {
          data: data.bookmarks || [],
          total: 200, // Higher estimate to enable pagination
        };
      }
      
      // For subsequent pages, use stored cursor
      const nextCursor = (window as any).__karakeepNextCursor;
      if (nextCursor) {
        console.log('📡 Making request to:', url, 'with cursor:', nextCursor.substring(0, 20) + '...');
        const { data } = await this.httpClient.get(url, {
          params: { limit: perPage, nextCursor }
        });
        
        console.log('✅ Page', page, 'response:', {
          bookmarkCount: data.bookmarks?.length,
          firstBookmarkId: data.bookmarks?.[0]?.id,
          nextCursor: data.nextCursor
        });
        
        // Update cursor for next page
        if (data.nextCursor) {
          (window as any).__karakeepNextCursor = data.nextCursor;
        }
        
        return {
          data: data.bookmarks || [],
          total: 200, // Higher estimate to enable pagination
        };
      }
      
      // No cursor available, return empty
      console.log('⚠️ No cursor available for page', page);
      return {
        data: [],
        total: 200,
      };
      
    } catch (error) {
      console.error('❌ Error fetching Inbox bookmarks:', error);
      return {
        data: [],
        total: 0,
      };
    }
  }

  async getOne(resource: string, params: GetOneParams) {
    const { data } = await this.httpClient.get(`/${resource}/${params.id}`);
    // Handle Karakeep API response format - return the resource data directly
    return { data: data[resource.slice(0, -1)] || data };
  }

  async getMany(resource: string, params: GetManyParams) {
    const query = { ids: params.ids.join(',') };
    const { data } = await this.httpClient.get(`/${resource}/many`, { params: query });
    return { data };
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