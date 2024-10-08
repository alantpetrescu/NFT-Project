import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1f2937',
    },
    secondary: {
      main: '#3b82f6',
      dark: '#2c5282',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0f172a',
      paper: 'rgba(30, 41, 59, 0.8)',
    },
    text: {
      primary: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h5: {
      fontWeight: 700,
    },
    logo: {
      fontFamily: '"Orbitron", sans-serif',
      fontWeight: 700,
      fontSize: '1.6rem',
      letterSpacing: '0.1rem',
      color: '#ffffff',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          color: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.2)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1f2937',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#ffffff',
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          color: '#ffffff',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0 3px 5px 2px rgba(0, 0, 0, 0.3)',
          textTransform: 'none',
        },
        containedSecondary: {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#2c5282',
          },
        },
      },
    },
  },
});

export default theme;
