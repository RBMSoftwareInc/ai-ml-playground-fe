import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
   zIndex: {
    appBar: 1200,
    drawer: 1100,
    modal: 1300
  },
  shape: {
    borderRadius: 12
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    }
  }
});