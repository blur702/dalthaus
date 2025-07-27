import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#d9534f', // Red accent color from the original site
      dark: '#c9302c',
      light: '#e57373',
    },
    secondary: {
      main: '#2c2c2c',
      dark: '#1a1a1a',
      light: '#333333',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
      light: '#ffffff',
    },
    divider: '#e0e0e0',
  },
  typography: {
    fontFamily: [
      'Georgia',
      'serif',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: 'Georgia, serif',
      fontWeight: 400,
    },
    h2: {
      fontFamily: 'Georgia, serif',
      fontWeight: 400,
    },
    h3: {
      fontFamily: 'Georgia, serif',
      fontWeight: 400,
    },
    h4: {
      fontFamily: 'Georgia, serif',
      fontWeight: 400,
    },
    h5: {
      fontFamily: 'Georgia, serif',
      fontWeight: 400,
    },
    h6: {
      fontFamily: 'Georgia, serif',
      fontWeight: 400,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 2px 5px rgba(0,0,0,0.1)',
    '0 5px 15px rgba(0,0,0,0.2)',
    '0 2px 4px rgba(0,0,0,0.1)',
    '0 4px 8px rgba(0,0,0,0.15)',
    '0 5px 15px rgba(0,0,0,0.2)',
    '0 8px 16px rgba(0,0,0,0.2)',
    '0 10px 20px rgba(0,0,0,0.2)',
    '0 12px 24px rgba(0,0,0,0.2)',
    '0 14px 28px rgba(0,0,0,0.25)',
    '0 16px 32px rgba(0,0,0,0.25)',
    '0 18px 36px rgba(0,0,0,0.25)',
    '0 20px 40px rgba(0,0,0,0.3)',
    '0 22px 44px rgba(0,0,0,0.3)',
    '0 24px 48px rgba(0,0,0,0.3)',
    '0 26px 52px rgba(0,0,0,0.3)',
    '0 28px 56px rgba(0,0,0,0.3)',
    '0 30px 60px rgba(0,0,0,0.3)',
    '0 32px 64px rgba(0,0,0,0.3)',
    '0 34px 68px rgba(0,0,0,0.3)',
    '0 36px 72px rgba(0,0,0,0.3)',
    '0 38px 76px rgba(0,0,0,0.3)',
    '0 40px 80px rgba(0,0,0,0.3)',
    '0 42px 84px rgba(0,0,0,0.3)',
    '0 44px 88px rgba(0,0,0,0.3)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontFamily: 'Georgia, serif',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#999 #f5f5f5",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: 8,
            height: 8,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#999",
            minHeight: 24,
          },
          "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
            backgroundColor: "#666",
          },
          "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active": {
            backgroundColor: "#666",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#666",
          },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#f5f5f5",
          },
        },
      },
    },
  },
});

export default theme;