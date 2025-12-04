'use client';

import React, { useState, useEffect } from 'react';
import { Box, IconButton, Tooltip, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { motion, AnimatePresence } from 'framer-motion';
import TopNav from './TopNav';

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
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [taglineIndex, setTaglineIndex] = useState(0);

  // Professional headline variations
  const headlines = [
    { 
      main: 'RBM AI', 
      accent: 'Playground', 
      gradient: 'linear-gradient(135deg, #ffffff 0%, #ff4d4d 50%, #ff0000 100%)',
      spark: true 
    },
    { 
      main: 'Enterprise', 
      accent: 'AI Solutions', 
      gradient: 'linear-gradient(135deg, #ff4d4d 0%, #ff0000 50%, #cc0000 100%)',
      spark: false 
    },
    { 
      main: 'Intelligent', 
      accent: 'Commerce', 
      gradient: 'linear-gradient(135deg, #ffffff 0%, #ff8a8a 50%, #ff4d4d 100%)',
      spark: true 
    },
  ];

  // Professional taglines
  const taglines = [
    'Reimagine • Build • Modernize',
    'Where AI Meets Enterprise',
    'Transforming Business with Intelligence',
    'Next-Gen AI for Next-Gen Commerce',
  ];

  // Rotate headlines every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % headlines.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [headlines.length]);

  // Rotate taglines every 4 seconds (offset from headlines)
  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [taglines.length]);

  const currentHeadline = headlines[headlineIndex];
  const currentTagline = taglines[taglineIndex];

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 1 }}>
            <Box
              component="img"
              src="/images/rbm-logo.svg"
              alt="RBM"
              sx={{
                height: 56,
                filter: 'brightness(0) saturate(100%) invert(15%) sepia(100%) saturate(7472%) hue-rotate(0deg) brightness(99%) contrast(118%)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
              onError={(e: any) => {
                e.target.style.display = 'none';
              }}
            />
            <Box sx={{ position: 'relative', minHeight: '4rem' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={headlineIndex}
                  initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: '1.8rem', md: '2.2rem' },
                      fontWeight: 600,
                      letterSpacing: '-0.02em',
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      lineHeight: 1.2,
                      position: 'relative',
                      display: 'inline-block',
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        color: '#ffffff',
                        position: 'relative',
                        display: 'inline-block',
                      }}
                    >
                      {currentHeadline.main}
                    </Box>
                    <Box
                      component="span"
                      sx={{
                        ml: 1,
                        color: 'rgba(255,255,255,0.8)',
                        fontWeight: 500,
                        position: 'relative',
                        display: 'inline-block',
                      }}
                    >
                      {currentHeadline.accent}
                    </Box>
                  </Typography>
                </motion.div>
              </AnimatePresence>
            </Box>
          </Box>
          <Box sx={{ ml: { xs: 0, md: '88px' }, mt: 1, position: 'relative', minHeight: '1.5rem' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={taglineIndex}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: { xs: '0.85rem', md: '0.95rem' },
                    fontWeight: 400,
                    letterSpacing: '0.05em',
                    fontFamily: '"Inter", "Roboto", sans-serif',
                    position: 'relative',
                    display: 'inline-block',
                  }}
                >
                  {currentTagline}
                </Typography>
              </motion.div>
            </AnimatePresence>
          </Box>
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
      <Box sx={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: { xs: 2, sm: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img 
              src="/images/rbm-logo.svg" 
              alt="RBM" 
              style={{ 
                height: 40, 
                filter: 'brightness(0) saturate(100%) invert(15%) sepia(100%) saturate(7472%) hue-rotate(0deg) brightness(99%) contrast(118%)',
                transition: 'transform 0.3s ease',
              }} 
            />
            <Box sx={{ position: 'relative', minHeight: '2.5rem' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={headlineIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#ffffff',
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      fontSize: '1rem',
                    }}
                  >
                    {currentHeadline.main} {currentHeadline.accent}
                  </Typography>
                </motion.div>
              </AnimatePresence>
            </Box>
          </Box>
          <Box sx={{ position: 'relative', minHeight: '1rem' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={taglineIndex}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.5)', 
                    fontSize: '0.7rem',
                    letterSpacing: '0.05em',
                    fontWeight: 400,
                  }}
                >
                  {currentTagline}
                </Typography>
              </motion.div>
            </AnimatePresence>
          </Box>
        </Box>
        <TopNav />
            </Box>
          </Box>
  );
}
