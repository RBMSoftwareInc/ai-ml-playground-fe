'use client'

import { Box, AppBar, Toolbar } from '@mui/material'
import { motion } from 'framer-motion'
import { ModernNavigation } from '../navigation/ModernNavigation'

export const ClientAppShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" color="inherit" elevation={0} sx={{ 
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(255,255,255,0.8)'
      }}>
        <Toolbar>
          {/* Header content */}
        </Toolbar>
      </AppBar>
      
      <ModernNavigation />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          flexGrow: 1,
          padding: '24px',
          marginTop: '64px'
        }}
      >
        {children}
      </motion.main>
    </Box>
  )
}