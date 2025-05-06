// lib/mui-theme.ts
'use client'
import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#b71c1c', // RBM red
    },
    secondary: {
      main: '#424242', // Gray
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
})

export default theme
