'use client'

import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { rbmTheme } from '../styles/rbmtheme'

export default function MUIProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={rbmTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}