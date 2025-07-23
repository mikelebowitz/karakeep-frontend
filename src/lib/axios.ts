import axios from 'axios';
import { apiConfig } from '../config/api.config';

const apiUrl = apiConfig.apiUrl;
const apiToken = apiConfig.apiToken;

// Debug logging in development
if (apiConfig.isDevelopment) {
  console.log('🔧 API Configuration:', {
    apiUrl,
    hasToken: !!apiToken,
    tokenPrefix: apiToken ? apiToken.substring(0, 10) + '...' : 'none'
  });
}

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // If we have an API token from environment, use it
    if (apiToken) {
      config.headers.Authorization = `Bearer ${apiToken}`;
      if (apiConfig.isDevelopment) {
        console.log('🔑 Using API token for request to:', config.url);
      }
      return config;
    }

    // Otherwise, get token from localStorage
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      if (apiConfig.isDevelopment) {
        console.log('🔑 Using localStorage token for request to:', config.url);
      }
    } else if (apiConfig.isDevelopment) {
      console.warn('⚠️ No authentication token available for request to:', config.url);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If we're using API token authentication, don't try to refresh JWT tokens
    if (apiToken) {
      if (apiConfig.isDevelopment) {
        console.error('🚨 API request failed:', {
          status: error.response?.status,
          url: error.config?.url,
          message: error.response?.data?.message || error.message
        });
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh token
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${apiUrl}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          localStorage.setItem('auth_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          
          // Let the auth provider handle the redirect
          return Promise.reject(error);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;