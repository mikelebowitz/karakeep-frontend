import type { AuthProvider } from '@refinedev/core';
import axiosInstance from '../lib/axios';
import type { AuthResponse, User } from '../types';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const apiToken = import.meta.env.VITE_API_TOKEN;

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const { data } = await axiosInstance.post<AuthResponse>('/auth/login', {
        email,
        password,
      });

      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return {
        success: true,
        redirectTo: '/',
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: 'LoginError',
          message: error.response?.data?.message || 'Invalid email or password',
        },
      };
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        await axiosInstance.post('/auth/logout');
      }
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    }

    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    return {
      success: true,
      redirectTo: '/login',
    };
  },

  check: async () => {
    // If we have an API token from environment, we're always authenticated
    if (apiToken) {
      return {
        authenticated: true,
      };
    }

    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      return {
        authenticated: false,
        redirectTo: '/login',
      };
    }

    try {
      // Verify token is still valid
      await axiosInstance.get('/auth/me');
      
      return {
        authenticated: true,
      };
    } catch (error: any) {
      // Token is invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      return {
        authenticated: false,
        redirectTo: '/login',
      };
    }
  },

  onError: async (error) => {
    const status = error.response?.status;
    
    if (status === 401 || status === 403) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      return {
        logout: true,
        redirectTo: '/login',
        error: {
          message: 'Your session has expired',
          name: 'Unauthorized',
        },
      };
    }
    
    return {};
  },

  getPermissions: async () => {
    // For now, we'll return a simple role
    // This can be expanded based on your permission system
    const user = localStorage.getItem('user');
    
    if (user) {
      return 'user';
    }
    
    return null;
  },

  getIdentity: async () => {
    const userStr = localStorage.getItem('user');
    
    if (!userStr) {
      return null;
    }

    try {
      const user: User = JSON.parse(userStr);
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: undefined, // Add avatar logic if needed
      };
    } catch (error) {
      return null;
    }
  },

  // Optional: Add register method for future use
  register: async ({ email, password, name }) => {
    try {
      const { data } = await axiosInstance.post<AuthResponse>('/auth/register', {
        email,
        password,
        name,
      });

      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return {
        success: true,
        redirectTo: '/',
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: 'RegisterError',
          message: error.response?.data?.message || 'Registration failed',
        },
      };
    }
  },

  // Optional: Add forgot password method for future use
  forgotPassword: async ({ email }) => {
    try {
      await axiosInstance.post('/auth/forgot-password', { email });

      return {
        success: true,
        redirectTo: '/login',
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: 'ForgotPasswordError',
          message: error.response?.data?.message || 'Failed to send reset email',
        },
      };
    }
  },

  // Optional: Add update password method for future use
  updatePassword: async ({ password, confirmPassword }) => {
    try {
      await axiosInstance.post('/auth/update-password', {
        password,
        confirmPassword,
      });

      return {
        success: true,
        redirectTo: '/login',
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: 'UpdatePasswordError',
          message: error.response?.data?.message || 'Failed to update password',
        },
      };
    }
  },
};