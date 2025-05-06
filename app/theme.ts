// app/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#d32f2f', // RBM Red
    },
    secondary: {
      main: '#616161', // Gray
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Santoshi',
  },
});

export default theme;
