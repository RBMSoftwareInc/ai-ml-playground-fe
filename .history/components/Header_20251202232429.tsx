'use client';

import React from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface HeaderProps {
  title?: string;
  tagline?: string;
  showBackButton?: boolean;
  backUrl?: string;
  titleColor?: string;
  variant?: 'simple' | 'full';
  themeOptions?: { key: string; label: string }[];
  themeKey?: string;
  onThemeChange?: (key: string) => void;
}

export default function Header({ 
  title, 
  tagline, 
  showBackButton = true, 
  backUrl = '/',
  titleColor,
  variant,
  themeOptions,
  themeKey,
  onThemeChange
}: HeaderProps) {
  const router = useRouter();

  // Auto-detect variant: if themeOptions provided, use full; if title provided, use simple
  const actualVariant = variant || (themeOptions ? 'full' : (title ? 'simple' : 'full'));

  // Simple variant for industry pages
  if (actualVariant === 'simple' && title) {
    return (
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {showBackButton && (
            <Tooltip title="Back to Industries    ----" arrow>
              <IconButton
                onClick={() => router.push(backUrl)}
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.05)',
                    borderColor: 'rgba(255,255,255,0.2)',
                  },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
          )}
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                background: titleColor || 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: '"Inter", "Roboto", sans-serif',
              }}
            >
              {title}
            </Typography>
            {tagline && (
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
                {tagline}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    );
  }

  // Full variant for MainLayout - if themeOptions provided, use full header
  // Otherwise, just return null or a minimal header
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1300,
        bgcolor: 'rgba(0,0,0,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Box sx={{ height: '80px', display: 'flex', alignItems: 'center', px: { xs: 2, sm: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <img 
            src="/images/rbm-logo.svg" 
            alt="RBM" 
            style={{ 
              height: 40, 
              filter: 'brightness(0) saturate(100%) invert(15%) sepia(100%) saturate(7472%) hue-rotate(0deg) brightness(99%) contrast(118%)' 
            }} 
          />
          <Typography variant="h6" sx={{ color: '#fff' }}>RBM Software</Typography>
        </Box>
      </Box>
    </Box>
  );
}
