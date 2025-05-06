'use client'

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { ReactNode } from 'react'

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f3f4f6',
    },
    primary: {
      main: '#1976d2',
    },
  },
  typography: {
    fontFamily: 'Satoshi, sans-serif',
  },
})

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
