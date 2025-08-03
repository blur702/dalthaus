import { createTheme } from '@mui/material/styles';
import { palette } from './palette';

// Create the Material UI theme based on the current design
const theme = createTheme({
  palette: {
    primary: palette.primary,
    secondary: palette.secondary,
    error: palette.error,
    warning: palette.warning,
    info: palette.info,
    success: palette.success,
    grey: {
      50: '#f5f5f5',
      100: '#e8e8e8',
      200: '#d9d9d9',
      300: '#d0d0d0',
      400: '#c8c8c8',
      500: '#b8b8b8',
      600: '#757575',
      700: '#666666',
      800: '#525252',
      900: '#404040',
    },
    background: palette.background,
    text: palette.text,
    action: palette.action,
    divider: palette.divider,
  },
  typography: {
    fontFamily: '"Crimson Text", serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.15,
      color: '#404040',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.15,
      color: '#404040',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.15,
      color: '#404040',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.15,
      color: '#404040',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.15,
      color: '#404040',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.15,
      color: '#404040',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.15,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.15,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
    caption: {
      fontSize: '0.75rem',
      color: '#666666',
    },
    overline: {
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: 'smooth',
        },
        body: {
          scrollBehavior: 'smooth',
          backgroundColor: '#e8e8e8',
          color: '#404040',
        },
        '*, *::before, *::after': {
          boxSizing: 'border-box',
        },
        a: {
          color: '#404040',
          textDecoration: 'none',
          '&:hover': {
            opacity: 0.7,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          transition: 'all 0.3s ease',
        },
        sizeLarge: {
          padding: '1rem 2rem',
          fontSize: '1.125rem',
        },
        sizeSmall: {
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
        },
        containedPrimary: {
          backgroundColor: '#404040',
          color: '#e8e8e8',
          '&:hover': {
            backgroundColor: '#333333',
          },
        },
        containedSecondary: {
          backgroundColor: '#757575',
          color: '#e8e8e8',
          '&:hover': {
            backgroundColor: '#666666',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'medium',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#404040',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#404040',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#e8e8e8',
          color: '#404040',
          boxShadow: '0 2px 4px rgba(64, 64, 64, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(64, 64, 64, 0.15)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: '#e8e8e8',
          color: '#404040',
        },
        elevation1: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        elevation2: {
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
        elevation3: {
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #c8c8c8',
        },
        head: {
          backgroundColor: '#d9d9d9',
          fontWeight: 600,
          color: '#404040',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#d9d9d9',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#404040',
          textDecoration: 'none',
          '&:hover': {
            opacity: 0.7,
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#e8e8e8',
          color: '#404040',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#c8c8c8',
        },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#525252',
          color: '#e8e8e8',
          fontSize: '0.75rem',
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiSnackbarContent-root': {
            borderRadius: 4,
          },
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(64, 64, 64, 0.08)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 6,
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#404040',
        },
      },
    },
  },
  // Custom additions for specific use cases
  custom: {
    sidebar: {
      width: 240,
      collapsedWidth: 64,
    },
    appBar: {
      height: 64,
      mobileHeight: 56,
    },
    footer: {
      height: 100,
    },
    content: {
      maxWidth: 1220,
    },
  },
});

// Add responsive font sizes
theme.typography.h1 = {
  ...theme.typography.h1,
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  },
};

theme.typography.h2 = {
  ...theme.typography.h2,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
  },
};

theme.typography.h3 = {
  ...theme.typography.h3,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.25rem',
  },
};

export default theme;