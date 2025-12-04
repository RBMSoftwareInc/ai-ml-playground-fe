'use client';

import { ReactNode } from 'react';
import { Box, Typography, Breadcrumbs, Link, ToggleButton, ToggleButtonGroup, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { motion } from 'framer-motion';
import ModeSwitcher from '../ModeSwitcher';

interface InteractiveLayoutProps {
  industry: string;
  solutionId: string;
  solutionTitle: string;
  viewMode: 'business' | 'tech';
  onViewModeChange: (mode: 'business' | 'tech') => void;
  centerPanel: ReactNode;
  leftPanel: ReactNode;
  rightPanel: ReactNode;
}

export default function InteractiveLayout({
  industry,
  solutionId,
  solutionTitle,
  viewMode,
  onViewModeChange,
  centerPanel,
  leftPanel,
  rightPanel,
}: InteractiveLayoutProps) {
  const router = useRouter();

  const industryName = industry.charAt(0).toUpperCase() + industry.slice(1);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          pointerEvents: 'none',
        },
      }}
    >
      {/* Top Bar */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          bgcolor: 'rgba(0,0,0,0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          px: { xs: 2, md: 4 },
          py: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: '1600px',
            mx: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.5)' }} />}
            sx={{ color: 'rgba(255,255,255,0.7)' }}
          >
            <Link
              component="button"
              onClick={() => router.push('/interactive-ai')}
              sx={{
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                cursor: 'pointer',
                '&:hover': { color: '#ff4d4d' },
              }}
            >
              Interactive AI
            </Link>
            <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>{industryName}</Typography>
            <Typography sx={{ color: '#fff' }}>{solutionTitle}</Typography>
          </Breadcrumbs>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, newMode) => {
                if (newMode !== null) {
                  onViewModeChange(newMode);
                }
              }}
              sx={{
                '& .MuiToggleButton-root': {
                  color: 'rgba(255,255,255,0.7)',
                  borderColor: 'rgba(255,255,255,0.2)',
                  '&.Mui-selected': {
                    color: '#fff',
                    bgcolor: 'rgba(255,77,77,0.2)',
                    borderColor: '#ff4d4d',
                    '&:hover': {
                      bgcolor: 'rgba(255,77,77,0.3)',
                    },
                  },
                },
              }}
            >
              <ToggleButton value="business">Business View</ToggleButton>
              <ToggleButton value="tech">Tech View</ToggleButton>
            </ToggleButtonGroup>
            <ModeSwitcher />
          </Box>
        </Box>
      </Box>

      {/* Main Body - 3 Panels */}
      <Box
        sx={{
          maxWidth: '1600px',
          mx: 'auto',
          px: { xs: 2, md: 4 },
          py: 4,
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '300px 1fr 350px',
          },
          gap: 3,
          minHeight: 'calc(100vh - 100px)',
        }}
      >
        {/* Left Panel - Scenario & Decisions */}
        <Box
          sx={{
            display: { xs: 'none', lg: 'flex' },
            flexDirection: 'column',
            order: { xs: 2, lg: 1 },
          }}
        >
          {leftPanel}
        </Box>

        {/* Center Panel - Primary Stage */}
        <Box
          sx={{
            order: { xs: 1, lg: 2 },
            minHeight: '600px',
          }}
        >
          {centerPanel}
        </Box>

        {/* Right Panel - AI Brain / Pipeline */}
        <Box
          sx={{
            display: { xs: 'none', lg: 'flex' },
            flexDirection: 'column',
            order: { xs: 3, lg: 3 },
          }}
        >
          {rightPanel}
        </Box>

        {/* Mobile: Show Left and Right Panels Below */}
        <Box
          sx={{
            display: { xs: 'flex', lg: 'none' },
            flexDirection: 'column',
            gap: 3,
            order: 2,
            width: '100%',
          }}
        >
          {leftPanel}
          {rightPanel}
        </Box>
      </Box>
    </Box>
  );
}

