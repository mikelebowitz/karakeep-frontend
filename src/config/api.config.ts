// API Configuration
// This file centralizes API settings to avoid Vite env caching issues

export const apiConfig = {
  // API URL - uses proxy through Vite dev server
  apiUrl: '/api',
  
  // API Token - update this when changing tokens
  apiToken: 'ak1_f464dd3f16050b5d9a77_24541f3f615b7bc731f0',
  
  // Optional: Fall back to environment variables if needed
  // apiUrl: import.meta.env.VITE_API_URL || '/api',
  // apiToken: import.meta.env.VITE_API_TOKEN || 'your-token-here',
};