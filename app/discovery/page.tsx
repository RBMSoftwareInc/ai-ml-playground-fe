'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MicroAITile from '../../components/discovery/MicroAITile';
import { getAllDiscoveryTools, getPersonalizedTools, DiscoveryTool } from '../../lib/discoveryLoader';
import { motion } from 'framer-motion';

export default function DiscoveryPage() {
  const router = useRouter();
  const [tools, setTools] = useState<DiscoveryTool[]>([]);

  useEffect(() => {
    // Get personalized tools based on context
    const personalized = getPersonalizedTools({
      deviceType: typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop',
    });
    setTools(personalized);
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
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
      <Header variant="simple" />

      <Container maxWidth="xl" sx={{ flex: 1, py: 6, position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h3"
            sx={{
              color: '#fff',
              fontWeight: 700,
              mb: 2,
              textAlign: 'center',
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            Discovery Zone
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.7)',
              mb: 6,
              textAlign: 'center',
              fontSize: { xs: '1rem', md: '1.2rem' },
            }}
          >
            Quick AI tricks and tools — 5-20 second interactions with surprising results
          </Typography>
        </motion.div>

        {/* Micro-AI Tiles Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {tools.map((tool, index) => (
            <motion.div
              key={tool.metadata.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <MicroAITile tool={tool} />
            </motion.div>
          ))}
        </Box>
      </Container>

      <Footer variant="simple" />
    </Box>
  );
}

