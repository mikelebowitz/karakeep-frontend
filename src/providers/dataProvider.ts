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

class KarakeepDataProvider implements DataProvider {
  private httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      baseURL: apiUrl,
    });

    // Add auth token to requests
    this.httpClient.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
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
    const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
    const { field, order } = params.sort || { field: 'id', order: 'DESC' };
    const query = {
      page,
      per_page: perPage,
      sort: field,
      order: order.toLowerCase(),
      ...params.filter,
    };

    const { data } = await this.httpClient.get(`/${resource}`, { params: query });
    
    return {
      data: data.data,
      total: data.total,
    };
  }

  async getOne(resource: string, params: GetOneParams) {
    const { data } = await this.httpClient.get(`/${resource}/${params.id}`);
    return { data };
  }

  async getMany(resource: string, params: GetManyParams) {
    const query = { ids: params.ids.join(',') };
    const { data } = await this.httpClient.get(`/${resource}/many`, { params: query });
    return { data };
  }

  async getManyReference(resource: string, params: GetManyReferenceParams) {
    const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
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