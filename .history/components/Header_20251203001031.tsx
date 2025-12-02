'use client';

import React from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTypewriter } from './hooks/useTypewriter';

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

  // Typewriter animations
  const { displayedText: aiPlaygroundText } = useTypewriter({ 
    text: 'AI Playground', 
    speed: 80,
    delay: 300 
  });
  
  const { displayedText: rbmTaglineText } = useTypewriter({ 
    text: 'RBM → Reimagine. Build. Modernize', 
    speed: 50,
    delay: 1500 
  });

  // Auto-detect variant: if themeOptions provided, use full; if title provided, use simple
  const actualVariant = variant || (themeOptions ? 'full' : (title ? 'simple' : 'full'));

  // Simple variant for industry pages
  if (actualVariant === 'simple' && title) {
    return (
      <Box sx={{ mb: 5 }}>
        {/* Logo and AI Playground - Always visible */}
        <Box
          sx={{
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 1,
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              component="img"
              src="/images/rbm-logo.svg"
              alt="RBM"
              sx={{
                height: 56,
                filter: 'brightness(0) saturate(100%) invert(15%) sepia(100%) saturate(7472%) hue-rotate(0deg) brightness(99%) contrast(118%)',
              }}
              onError={(e: any) => {
                e.target.style.display = 'none';
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.03em',
                textShadow: '0 0 60px rgba(239,68,68,0.3)',
                fontFamily: '"Inter", "Roboto", sans-serif',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  right: -8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 3,
                  height: '60%',
                  background: '#ef4444',
                  animation: 'blink 1s infinite',
                  '@keyframes blink': {
                    '0%, 50%': { opacity: 1 },
                    '51%, 100%': { opacity: 0 },
                  },
                },
              }}
            >
              {aiPlaygroundText}
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: { xs: '0.9rem', md: '1rem' },
              fontWeight: 400,
              letterSpacing: '0.05em',
              fontFamily: '"Inter", "Roboto", sans-serif',
              ml: { xs: 0, md: 9 }, // Align with text below logo
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                right: -8,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 2,
                height: '50%',
                background: 'rgba(255,255,255,0.5)',
                animation: 'blink 1s infinite',
                '@keyframes blink': {
                  '0%, 50%': { opacity: 1 },
                  '51%, 100%': { opacity: 0 },
                },
              },
            }}
          >
            {rbmTaglineText}
          </Typography>
        </Box>

        {/* Page-specific header with back button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {showBackButton && (
            <Tooltip title="Back to Industries" arrow>
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
                background: titleColor || 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
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
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'rgba(255,255,255,0.5)', 
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                right: -8,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 2,
                height: '50%',
                background: 'rgba(255,255,255,0.5)',
                animation: 'blink 1s infinite',
                '@keyframes blink': {
                  '0%, 50%': { opacity: 1 },
                  '51%, 100%': { opacity: 0 },
                },
              },
            }}
          >
            {rbmTaglineText}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
