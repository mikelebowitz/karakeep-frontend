// API Configuration
// Uses environment variables to avoid hardcoded tokens in committed code

export const apiConfig = {
  // API URL - uses proxy through Vite dev server
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  
  // API Token - loaded from environment variables for security
  apiToken: import.meta.env.VITE_API_TOKEN,
  
  // Development helpers
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};