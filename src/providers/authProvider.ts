import type { AuthProvider } from 'react-admin';
import axios from 'axios';
import type { AuthResponse } from '../types';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const apiToken = import.meta.env.VITE_API_TOKEN;

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    try {
      const { data } = await axios.post<AuthResponse>(`${apiUrl}/auth/login`, {
        email: username,
        password,
      });

      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        await axios.post(
          `${apiUrl}/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      // Continue with logout even if API call fails
    }

    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    return Promise.resolve();
  },

  checkAuth: async () => {
    // If we have an API token from environment, we're always authenticated
    if (apiToken) {
      return Promise.resolve();
    }

    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      return Promise.reject();
    }

    try {
      // Verify token is still valid
      await axios.get(`${apiUrl}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return Promise.resolve();
    } catch (error) {
      // Token is invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      return Promise.reject();
    }
  },

  checkError: async (error) => {
    const status = error.response?.status;
    
    if (status === 401 || status === 403) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      return Promise.reject();
    }
    
    return Promise.resolve();
  },

  getPermissions: async () => {
    // For now, we'll return a simple role
    // This can be expanded based on your permission system
    const user = localStorage.getItem('user');
    
    if (user) {
      return Promise.resolve('user');
    }
    
    return Promise.reject();
  },

  getIdentity: async () => {
    const userStr = localStorage.getItem('user');
    
    if (!userStr) {
      return Promise.reject();
    }

    try {
      const user = JSON.parse(userStr);
      
      return Promise.resolve({
        id: user.id,
        fullName: user.name,
        email: user.email,
      });
    } catch (error) {
      return Promise.reject();
    }
  },
};