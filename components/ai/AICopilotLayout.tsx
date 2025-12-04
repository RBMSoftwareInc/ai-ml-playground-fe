'use client';

import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface AICopilotLayoutProps {
  sidebar: ReactNode;
  chat: ReactNode;
  insights: ReactNode;
}

export default function AICopilotLayout({ sidebar, chat, insights }: AICopilotLayoutProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '30% 40% 30%' },
        height: 'calc(100vh - 80px)',
        mt: '80px',
        overflow: 'hidden',
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
          animation: 'gridMove 20s linear infinite',
          '@keyframes gridMove': {
            '0%': { transform: 'translate(0, 0)' },
            '100%': { transform: 'translate(50px, 50px)' },
          },
        },
      }}
    >
      {/* Sidebar */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          overflow: 'hidden',
        }}
      >
        {sidebar}
      </Box>

      {/* Chat */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderLeft: { xs: 'none', lg: '1px solid rgba(255,255,255,0.1)' },
          borderRight: { xs: 'none', lg: '1px solid rgba(255,255,255,0.1)' },
        }}
      >
        {chat}
      </Box>

      {/* Insights */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          overflow: 'hidden',
        }}
      >
        {insights}
      </Box>
    </Box>
  );
}

