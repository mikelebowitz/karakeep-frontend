// DaisyUI Theme Manager
// Manages theme switching and persistence for all available DaisyUI themes

export const AVAILABLE_THEMES = [
  // Light themes
  'light',
  'cupcake', 
  'bumblebee',
  'emerald',
  'corporate',
  'garden',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'cmyk',
  'autumn',
  'lemonade',
  'winter',
  'nord',
  'sunset',
  
  // Dark themes
  'dark',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'forest',
  'aqua',
  'luxury',
  'dracula',
  'business',
  'acid',
  'night',
  'coffee',
  'dim',
  'abyss',
  
  // Special themes
  'caramellatte',
  'silk'
] as const;

export type ThemeName = typeof AVAILABLE_THEMES[number];

const STORAGE_KEY = 'karakeep-theme';
const DEFAULT_THEME: ThemeName = 'light';

let currentThemeIndex = 0;

/**
 * Initialize theme system
 * Loads saved theme from localStorage or uses default
 */
export const initializeTheme = (): ThemeName => {
  try {
    const savedTheme = localStorage.getItem(STORAGE_KEY) as ThemeName;
    if (savedTheme && AVAILABLE_THEMES.includes(savedTheme)) {
      currentThemeIndex = AVAILABLE_THEMES.indexOf(savedTheme);
      applyTheme(savedTheme);
      return savedTheme;
    }
  } catch (error) {
    console.warn('Failed to load theme from localStorage:', error);
  }
  
  // Fall back to default theme
  currentThemeIndex = AVAILABLE_THEMES.indexOf(DEFAULT_THEME);
  applyTheme(DEFAULT_THEME);
  return DEFAULT_THEME;
};

/**
 * Apply theme to document root
 */
export const applyTheme = (theme: ThemeName): void => {
  document.documentElement.setAttribute('data-theme', theme);
  
  // Save to localStorage
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
};

/**
 * Get current theme
 */
export const getCurrentTheme = (): ThemeName => {
  return AVAILABLE_THEMES[currentThemeIndex];
};

/**
 * Cycle to next theme
 */
export const cycleToNextTheme = (): ThemeName => {
  currentThemeIndex = (currentThemeIndex + 1) % AVAILABLE_THEMES.length;
  const newTheme = AVAILABLE_THEMES[currentThemeIndex];
  applyTheme(newTheme);
  return newTheme;
};

/**
 * Cycle to previous theme
 */
export const cycleToPreviousTheme = (): ThemeName => {
  currentThemeIndex = currentThemeIndex === 0 
    ? AVAILABLE_THEMES.length - 1 
    : currentThemeIndex - 1;
  const newTheme = AVAILABLE_THEMES[currentThemeIndex];
  applyTheme(newTheme);
  return newTheme;
};

/**
 * Set specific theme by name
 */
export const setTheme = (theme: ThemeName): void => {
  if (AVAILABLE_THEMES.includes(theme)) {
    currentThemeIndex = AVAILABLE_THEMES.indexOf(theme);
    applyTheme(theme);
  } else {
    console.warn(`Theme "${theme}" is not available`);
  }
};

/**
 * Get theme display name (capitalize first letter)
 */
export const getThemeDisplayName = (theme?: ThemeName): string => {
  const themeName = theme || getCurrentTheme();
  return themeName.charAt(0).toUpperCase() + themeName.slice(1);
};