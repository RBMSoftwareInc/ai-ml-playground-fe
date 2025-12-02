'use client';

import { Box, Typography } from '@mui/material';

interface FooterProps {
  text?: string;
  variant?: 'simple' | 'full';
}

export default function Footer({ 
  text,
  variant = 'simple'
}: FooterProps) {
  // Simple variant for industry pages
  if (variant === 'simple') {
    return (
      <Box sx={{ textAlign: 'center', pb: 4 }}>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.3)' }}>
          {text || '© 2025 RBM Software • AI-Driven Digital Transformation'}
        </Typography>
      </Box>
    );
  }

  // Full variant (keeping existing functionality for MainLayout)
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        mt: 'auto',
        bgcolor: 'rgba(0,0,0,0.95)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        pr: { xs: 3, md: 6 },
        pl: { xs: 3, md: 'calc(280px + 24px)' },
        py: 4,
        backdropFilter: 'blur(10px)',
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          pt: 2,
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Typography
          variant="caption"
          sx={{ 
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.5)'
          }}
        >
          ©2025 RBM Software Inc. • All Rights Reserved
        </Typography>
      </Box>
    </Box>
  );
}
