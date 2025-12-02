'use client';

import React, { useEffect, useState } from 'react';
import { AppBar, Box, Container, Stack, Toolbar, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const phrases = [
  { text: 'AI Playground', gradient: 'linear-gradient(120deg, #ffffff 0%, #ff8a8a 45%, #ffd1a9 100%)' },
  { text: 'AI-Powered eCommerce', gradient: 'linear-gradient(120deg, #ff4d4d 0%, #fcb045 60%, #ffe29f 100%)' },
  { text: 'Transform Your Business', gradient: 'linear-gradient(120deg, #e0e7ff 0%, #8c9eff 60%, #c4b5fd 100%)' },
  { text: 'Innovate • Automate • Scale', gradient: 'linear-gradient(120deg, #ff6cab 0%, #7366ff 50%, #3db3ff 100%)' }
];

type ThemeOption = { key: string; label: string };

interface HeaderProps {
  themeOptions?: ThemeOption[];
  themeKey?: string;
  onThemeChange?: (key: string) => void;
}

export default function Header({ themeOptions, themeKey, onThemeChange }: HeaderProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user info
  useEffect(() => {
    fetch('http://localhost:5000/api/v1/setup/userinfo')
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  // Optional: Use userData to customize header content
  const welcomeText = userData ? `Welcome, ${userData.name}` : 'Welcome to RBM';

  return (
     <AppBar
      position="fixed"
      elevation={0}
      sx={{
        zIndex: 1300,
        bgcolor: 'rgba(0,0,0,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Toolbar sx={{ height: '80px' }}>
        {/* Logo Section */}
        <Box sx={{ width: '280px', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <img src="/images/rbm-logo.svg" alt="RBM" style={{ height: 40 }} />
            <Typography variant="h6">RBM Software</Typography>
          </Stack>
        </Box>

      <Container maxWidth="lg">
        <Toolbar sx={{ height: 80, px: { xs: 2, sm: 4 } }}>
          <Box 
            display="flex" 
            alignItems="center" 
            sx={{ 
              flexGrow: 1,
              gap: { xs: 2, sm: 4 }
            }}
          >
            


            <Stack
              spacing={1}
              sx={{
                height: '80px',
                flex: 1,
                overflow: 'hidden',
                pl: { xs: 1, sm: 4 },
              }}
            >
              <Typography
                variant="caption"
                sx={{ letterSpacing: '0.35em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}
              >
                {welcomeText}
              </Typography>
              <Box sx={{ position: 'relative', overflow: 'hidden', flex: 1 }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={phrases[phraseIndex].text}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.65, ease: 'easeOut' }}
                    style={{ width: '100%' }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontFamily: '"Space Grotesk", "Roboto", sans-serif',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        fontSize: { xs: '1.4rem', sm: '2.15rem', md: '2.6rem' },
                        backgroundImage: phrases[phraseIndex].gradient,
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        textShadow: '0 12px 35px rgba(0,0,0,0.45)',
                        position: 'relative',
                      }}
                    >
                      {phrases[phraseIndex].text}
                      <motion.span
                        key={`${phrases[phraseIndex].text}-spark`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        style={{ display: 'inline-block', marginLeft: 12 }}
                      >
                        ✦
                      </motion.span>
                    </Typography>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      exit={{ scaleX: 0 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      style={{
                        height: 2,
                        marginTop: 10,
                        background: 'linear-gradient(90deg, rgba(255,255,255,0.25), rgba(255,0,86,0.8))',
                        transformOrigin: 'left',
                      }}
                    />
                    <motion.div
                      initial={{ x: -40, opacity: 0 }}
                      animate={{ x: 220, opacity: [0, 1, 0] }}
                      transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        width: 120,
                        height: 2,
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)',
                        filter: 'blur(0.5px)',
                      }}
                    />
                  </motion.div>
                </AnimatePresence>
              </Box>
            </Stack>
            {themeOptions && onThemeChange && (
              <ToggleButtonGroup
                exclusive
                value={themeKey}
                onChange={(_, value) => value && onThemeChange(value)}
                size="small"
                sx={{
                  ml: { xs: 0, md: 'auto' },
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: 999,
                }}
              >
                {themeOptions.map((option) => (
                  <ToggleButton
                    key={option.key}
                    value={option.key}
                    sx={{
                      textTransform: 'uppercase',
                      fontSize: '0.7rem',
                      letterSpacing: '0.15em',
                      color: themeKey === option.key ? '#fff' : 'rgba(255,255,255,0.6)',
                      border: 'none',
                      px: 2,
                    }}
                  >
                    {option.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            )}
          </Box>
        </Toolbar>
      </Container>
     </Toolbar>
    </AppBar>
  );
}