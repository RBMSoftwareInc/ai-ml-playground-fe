'use client';

import { ReactNode, useState } from 'react';
import { Box, Typography, IconButton, Select, MenuItem, FormControl, Avatar } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DevCompanionPanel from './DevCompanionPanel';
import { useDevLabState } from '../../hooks/useDevLabState';

interface DevLabLayoutProps {
  children: ReactNode;
  title?: string;
}

export default function DevLabLayout({ children, title = 'DevLab' }: DevLabLayoutProps) {
  const [companionOpen, setCompanionOpen] = useState(true);
  const { session, setEnvironment } = useDevLabState();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        color: '#fff',
        fontFamily: '"Inter", "IBM Plex Sans", sans-serif',
      }}
    >
      {/* Top Header */}
      <Box
        sx={{
          height: 64,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          bgcolor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: '1.1rem',
              letterSpacing: '-0.01em',
            }}
          >
            RBM {title}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={session.environment}
              onChange={(e) => setEnvironment(e.target.value as 'dev' | 'staging' | 'prod')}
              sx={{
                color: '#fff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.2)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ff0000',
                },
              }}
            >
              <MenuItem value="dev">Dev</MenuItem>
              <MenuItem value="staging">Staging</MenuItem>
              <MenuItem value="prod">Prod</MenuItem>
            </Select>
          </FormControl>

          {session.environment === 'prod' && (
            <Typography
              variant="caption"
              sx={{
                color: '#ff0000',
                fontSize: '0.7rem',
                px: 1,
                py: 0.5,
                bgcolor: 'rgba(255,0,0,0.1)',
                borderRadius: 1,
              }}
            >
              ⚠ Simulated
            </Typography>
          )}

          <Avatar sx={{ width: 32, height: 32, bgcolor: '#ff0000', fontSize: '0.875rem' }}>
            D
          </Avatar>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Content */}
        <Box sx={{ flex: 1, overflow: 'auto', position: 'relative' }}>
          {children}
        </Box>

        {/* Right Companion Panel */}
        <AnimatePresence>
          {companionOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 350, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <Box
                sx={{
                  width: 350,
                  height: '100%',
                  borderLeft: '1px solid rgba(255,255,255,0.1)',
                  bgcolor: 'rgba(0,0,0,0.3)',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Dev Companion
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setCompanionOpen(false)}
                    sx={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
                <DevCompanionPanel />
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Companion Toggle Button (when closed) */}
        {!companionOpen && (
          <Box
            sx={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
            }}
          >
            <IconButton
              onClick={() => setCompanionOpen(true)}
              sx={{
                bgcolor: 'rgba(255,0,0,0.1)',
                color: '#ff0000',
                border: '1px solid rgba(255,0,0,0.3)',
                '&:hover': {
                  bgcolor: 'rgba(255,0,0,0.2)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
}

