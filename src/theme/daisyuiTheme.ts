import { defaultTheme } from 'react-admin';
import { deepmerge } from '@mui/utils';

// DaisyUI Design Tokens mapped to React-Admin theme using proper deepmerge pattern
// Based on React-Admin documentation and DaisyUI's default light theme color palette
const daisyuiTheme = deepmerge(defaultTheme, {
  palette: {
    mode: 'light',
    primary: {
      main: '#570df8',      // DaisyUI primary
      light: '#7c3aed',     // Lighter variant
      dark: '#4c1d95',      // Darker variant
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f000b8',      // DaisyUI secondary
      light: '#f472b6',     // Lighter variant
      dark: '#be185d',      // Darker variant
      contrastText: '#ffffff',
    },
    error: {
      main: '#ff5861',      // DaisyUI error
      light: '#fca5a5',
      dark: '#dc2626',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ffbe00',      // DaisyUI warning
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#000000',
    },
    info: {
      main: '#00b5ff',      // DaisyUI info
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#ffffff',
    },
    success: {
      main: '#00a96e',      // DaisyUI success
      light: '#4ade80',
      dark: '#16a34a',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',   // DaisyUI base-100
      paper: '#f9fafb',     // DaisyUI base-200
    },
    text: {
      primary: '#1f2937',   // DaisyUI base-content
      secondary: '#6b7280', // DaisyUI base-content with opacity
      disabled: '#9ca3af',
    },
    divider: '#e5e7eb',     // DaisyUI border color
    action: {
      hover: '#f3f4f6',     // DaisyUI base-300
      selected: '#e5e7eb',  // DaisyUI base-200
      disabled: '#d1d5db',
      disabledBackground: '#f3f4f6',
    },
  },
  typography: {
    // Following React-Admin patterns for Inter font
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    fontSize: 16,  // Larger base font size
    h1: {
      fontSize: '2.5rem',     // Much larger headers
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '2rem',       // Larger than before
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.75rem',    // Significantly larger
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',     // Much larger
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h5: {
      fontSize: '1.25rem',    // Larger
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.125rem',   // Larger base
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1.125rem',   // Larger body text
      lineHeight: 1.7,
      fontWeight: 400,
    },
    body2: {
      fontSize: '1rem',       // Larger secondary text
      lineHeight: 1.6,
      fontWeight: 400,
    },
    caption: {
      fontSize: '0.875rem',   // Larger captions
      lineHeight: 1.5,
      fontWeight: 500,
    },
    button: {
      fontSize: '1rem',       // Larger button text
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.025em',
    },
  },
  shape: {
    borderRadius: 12,         // Much more rounded corners
  },
  spacing: 12,                // Larger spacing throughout (1.5rem base instead of 0.5rem)
  components: {
    // Global styles
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
        },
        '#root': {
          width: '100%',
          height: '100%',
        },
        '.RaLayout-appFrame': {
          width: '100%',
          height: '100%',
        },
      },
    },
    // React-Admin Datagrid - basic styling without complex overrides
    RaDatagrid: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          '& .RaDatagrid-headerCell': {
            backgroundColor: '#570df8',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.875rem',
            padding: '0.75rem 0.5rem',
          },
          '& .RaDatagrid-rowCell': {
            padding: '0.75rem 0.5rem',
            borderBottom: '1px solid #f3f4f6',
          },
          '& .RaDatagrid-row': {
            '&:hover': {
              backgroundColor: '#f9fafb',
            },
          },
        },
      },
    },
    // React-Admin List styling
    RaList: {
      styleOverrides: {
        root: {
          width: '100%',
          maxWidth: 'none',
          '& .RaList-main': {
            backgroundColor: 'transparent',
            width: '100%',
            maxWidth: 'none',
            margin: 0,
            padding: 0,
          },
          '& .RaList-content': {
            width: '100%',
            maxWidth: 'none',
          },
        },
      },
    },
    // Layout styling for full width without sidebar
    RaLayout: {
      styleOverrides: {
        root: {
          '& .RaLayout-content': {
            marginLeft: 0,
            width: '100%',
            maxWidth: 'none',
            padding: '1rem',
          },
          '& .RaLayout-contentWithSidebar': {
            marginLeft: 0,
            width: '100%',
            maxWidth: 'none',
          },
        },
      },
    },
    // Main content area styling
    RaMain: {
      styleOverrides: {
        root: {
          width: '100%',
          maxWidth: 'none',
          margin: 0,
          padding: '1rem',
        },
      },
    },
    // Filter form styling
    RaFilterForm: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
          padding: '1rem',
          margin: '1rem 0',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        },
      },
    },
    // Button styling to match DaisyUI buttons
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '1rem',          // Much more rounded
          fontWeight: 700,               // Bolder
          fontSize: '1.125rem',          // Larger text
          padding: '1rem 2rem',          // Much more padding
          minHeight: '3rem',             // Taller buttons
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
        small: {
          fontSize: '0.875rem',
          padding: '0.75rem 1.5rem',
          minHeight: '2.5rem',
        },
        large: {
          fontSize: '1.25rem',
          padding: '1.25rem 2.5rem',
          minHeight: '3.5rem',
        },
      },
    },
    // Card styling to match DaisyUI cards
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '1rem',           // DaisyUI card border radius
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    // Chip styling to match DaisyUI badges
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '9999px',         // DaisyUI badge border radius
          fontWeight: 500,
          fontSize: '0.75rem',
        },
        outlined: {
          borderWidth: '2px',
        },
      },
    },
    // Paper styling for consistent elevation
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '1rem',
          border: '1px solid #e5e7eb',
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        elevation3: {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    // Input styling - better form input appearance
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          backgroundColor: '#ffffff',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d1d5db',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#9ca3af',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#570df8',
            borderWidth: '2px',
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          '&:hover': {
            backgroundColor: '#f3f4f6',
          },
          '&.Mui-focused': {
            backgroundColor: '#ffffff',
            borderColor: '#570df8',
          },
          '&:before': {
            borderBottom: 'none',
          },
          '&:after': {
            borderBottom: 'none',
          },
        },
      },
    },
    // Search filter styling
    MuiFormControl: {
      styleOverrides: {
        root: {
          margin: '0.5rem',
          '& .MuiInputLabel-root': {
            color: '#6b7280',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#570df8',
          },
        },
      },
    },
    // AppBar styling
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1f2937',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid #e5e7eb',
          width: '100%',
        },
      },
    },
    // Container styling - remove max-width constraints
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: 'none !important',
          width: '100%',
          padding: '0 1rem',
        },
      },
    },
  },
});

export default daisyuiTheme;