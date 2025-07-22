// Test auth provider - always authenticated
import type { AuthProvider } from '@refinedev/core';

export const testAuthProvider: AuthProvider = {
  login: async () => {
    return { success: true };
  },
  logout: async () => {
    return { success: true };
  },
  check: async () => {
    return { authenticated: true };
  },
  onError: async () => {
    return {};
  },
  getPermissions: async () => {
    return 'user';
  },
  getIdentity: async () => {
    return {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    };
  },
};