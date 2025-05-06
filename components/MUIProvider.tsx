'use client'

import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from '../lib/mui-theme'

export default function MUIProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
