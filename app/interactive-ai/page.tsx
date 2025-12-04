'use client';

import { useState } from 'react';
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import Footer from '../../components/Footer';
import { industries } from '../../data/ai/catalog';
import { motion } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

// Recommended solutions per industry
const recommendedSolutions: Record<string, { id: string; title: string; icon: string }> = {
  fintech: { id: 'fraud-detection', title: 'Fraud Detection System', icon: '🛡️' },
  ecommerce: { id: 'dynamic-pricing', title: 'Dynamic Pricing Engine', icon: '💰' },
  retail: { id: 'loss-prevention', title: 'Loss Prevention System', icon: '🔒' },
};

export default function InteractiveAIHub() {
  const router = useRouter();
  const [hoveredIndustry, setHoveredIndustry] = useState<string | null>(null);

  const handleLaunchSimulation = (industryId: string) => {
    const solution = recommendedSolutions[industryId];
    if (solution) {
      router.push(`/interactive-ai/${industryId}/${solution.id}`);
    } else {
      // Fallback: navigate to first available solution or industry page
      router.push(`/interactive-ai/${industryId}`);
    }
  };

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
      <Container maxWidth="xl" sx={{ flex: 1, py: 6, pt: { xs: 10, md: 12 }, position: 'relative', zIndex: 1 }}>
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
            Interactive AI Simulations
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
            Experience AI solutions through immersive, cinematic simulations
          </Typography>
        </motion.div>

        {/* Horizontal Scroll Industry Chips */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: 'auto',
            pb: 2,
            mb: 4,
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(255,255,255,0.05)',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '4px',
            },
          }}
        >
          {industries.map((industry) => {
            const solution = recommendedSolutions[industry.id];
            const isHovered = hoveredIndustry === industry.id;

            return (
              <motion.div
                key={industry.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setHoveredIndustry(industry.id)}
                onHoverEnd={() => setHoveredIndustry(null)}
              >
                <Paper
                  sx={{
                    minWidth: 280,
                    p: 3,
                    bgcolor: isHovered
                      ? 'rgba(255,255,255,0.1)'
                      : 'rgba(255,255,255,0.05)',
                    border: isHovered
                      ? '2px solid #ff4d4d'
                      : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Typography sx={{ fontSize: '2.5rem' }}>{industry.icon}</Typography>
                    <Box>
                      <Typography
                        sx={{
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: '1.1rem',
                        }}
                      >
                        {industry.name}
                      </Typography>
                      {solution && (
                        <Typography
                          sx={{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '0.85rem',
                          }}
                        >
                          {solution.icon} {solution.title}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {solution && (
                    <Button
                      onClick={() => handleLaunchSimulation(industry.id)}
                      variant="contained"
                      fullWidth
                      startIcon={<PlayArrowIcon />}
                      sx={{
                        bgcolor: '#ff0000',
                        color: '#fff',
                        py: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          bgcolor: '#cc0000',
                        },
                      }}
                    >
                      Launch Simulation
                    </Button>
                  )}
                </Paper>
              </motion.div>
            );
          })}
        </Box>
      </Container>

      <Footer variant="simple" />
    </Box>
  );
}
