// API Configuration
// This file centralizes API settings to avoid Vite env caching issues

export const apiConfig = {
  // API URL - uses proxy through Vite dev server
  apiUrl: '/api',
  
  // API Token - update this when changing tokens
  apiToken: 'ak1_2146e488435042de0314_d8596607a8995d7a8bb6',
  
  // Optional: Fall back to environment variables if needed
  // apiUrl: import.meta.env.VITE_API_URL || '/api',
  // apiToken: import.meta.env.VITE_API_TOKEN || 'your-token-here',
};