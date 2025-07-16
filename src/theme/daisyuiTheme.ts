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
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
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
    // React-Admin Datagrid - using correct component name and CSS classes from documentation
    RaDatagrid: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: '1.5rem',
          border: '2px solid #e5e7eb',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          fontSize: '1.125rem',
          // Target documented CSS classes
          '& .RaDatagrid-headerCell': {
            backgroundColor: '#570df8 !important',  // DaisyUI primary with !important
            color: '#ffffff !important',            // White text
            fontWeight: '800 !important',
            padding: '1.5rem 1.25rem !important',
            fontSize: '1rem !important',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            borderBottom: '3px solid #4c1d95 !important',
          },
          '& .RaDatagrid-rowCell': {
            padding: '1.5rem 1.25rem !important',
            fontSize: '1rem !important',
            lineHeight: 1.7,
            borderBottom: '1px solid #f3f4f6',
          },
          '& .RaDatagrid-row': {
            '&:hover': {
              backgroundColor: '#ede9fe !important',
              transform: 'scale(1.01)',
              transition: 'all 0.2s ease-in-out',
            },
          },
          '& .RaDatagrid-rowEven': {
            backgroundColor: '#f9fafb',
          },
          '& .RaDatagrid-rowOdd': {
            backgroundColor: '#ffffff',
          },
          '& .RaDatagrid-expandIcon': {
            color: '#570df8',
            fontSize: '1.5rem',
          },
          '& .RaDatagrid-clickableRow': {
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#ede9fe !important',
              transform: 'scale(1.01)',
            },
          },
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
    // Table styling for React-Admin Datagrid
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f9fafb',     // DaisyUI base-200
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          color: '#374151',               // DaisyUI base-content
          borderBottom: '2px solid #e5e7eb',
        },
        body: {
          borderBottom: '1px solid #f3f4f6',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#f9fafb',   // DaisyUI base-200
          },
          '&.Mui-selected': {
            backgroundColor: '#ede9fe',   // DaisyUI primary with low opacity
            '&:hover': {
              backgroundColor: '#ddd6fe',
            },
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
    // Input styling
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d1d5db',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#9ca3af',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#570df8',       // DaisyUI primary
            borderWidth: '2px',
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
        },
      },
    },
    // Material-UI Table components that React-Admin uses
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: '1.5rem',
          border: '2px solid #e5e7eb',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          fontSize: '1.125rem',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: '1.5rem',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          border: '2px solid #e5e7eb',
        },
      },
    },
    // Material-UI Table Header - this is what React-Admin actually uses for headers
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#570df8',  // DaisyUI primary
          '& .MuiTableCell-head': {
            backgroundColor: '#570df8 !important',
            color: '#ffffff !important',
            fontWeight: '800 !important',
            fontSize: '1rem !important',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '1.5rem 1.25rem !important',
            borderBottom: '3px solid #4c1d95 !important',
          },
        },
      },
    },
    // Material-UI Table Cell - target both header and body cells
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          padding: '1rem 1.25rem',
        },
        head: {
          backgroundColor: '#570df8 !important',
          color: '#ffffff !important',
          fontWeight: '800 !important',
          fontSize: '1rem !important',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          padding: '1.5rem 1.25rem !important',
          borderBottom: '3px solid #4c1d95 !important',
        },
        body: {
          padding: '1.5rem 1.25rem !important',
          fontSize: '1rem !important',
          lineHeight: 1.7,
          borderBottom: '1px solid #f3f4f6',
        },
      },
    },
    // Material-UI Table Row - for hover effects
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#ede9fe !important',
            transform: 'scale(1.005)',
            transition: 'all 0.2s ease-in-out',
          },
          '&:nth-of-type(even)': {
            backgroundColor: '#f9fafb',
          },
        },
      },
    },
  },
});

export default daisyuiTheme;