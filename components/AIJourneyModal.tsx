'use client';

import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  Paper 
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SmartToyIcon from '@mui/icons-material/SmartToy';

export default function AIJourneyModal() {
  const router = useRouter();
  const [isHoveredConventional, setIsHoveredConventional] = useState(false);
  const [isHoveredAI, setIsHoveredAI] = useState(false);

  const JourneyCard = ({ 
    title, 
    description, 
    icon, 
    onClick, 
    isHovered, 
    setHovered 
  }) => (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onClick}
      sx={{
        position: 'relative',
        p: 4,
        cursor: 'pointer',
        bgcolor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid',
        borderColor: isHovered ? '#ff0000' : 'rgba(255,255,255,0.1)',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Animated gradient background */}
      <Box
        component={motion.div}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.1 : 1,
        }}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at center, rgba(255,0,0,0.15) 0%, transparent 70%)',
          zIndex: 0,
        }}
      />

      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mb: 2 
          }}
        >
          {icon}
          <Typography
            variant="h4"
            sx={{
              color: isHovered ? '#ff0000' : '#fff',
              fontWeight: 700,
              fontFamily: '"Roboto", sans-serif',
              letterSpacing: '-0.02em',
              transition: 'color 0.3s ease',
            }}
          >
            {title}
          </Typography>
        </Box>

        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255,255,255,0.8)',
            fontFamily: '"Roboto", sans-serif',
            lineHeight: 1.6,
            mb: 3,
          }}
        >
          {description}
        </Typography>

        <Button
          variant="outlined"
          sx={{
            color: isHovered ? '#ff0000' : '#fff',
            borderColor: isHovered ? '#ff0000' : 'rgba(255,255,255,0.3)',
            '&:hover': {
              borderColor: '#ff0000',
              bgcolor: 'rgba(255,0,0,0.1)',
            },
          }}
        >
          Get Started
        </Button>
      </Box>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ textAlign: 'center', mb: 6 }}
      >
        <Typography
          variant="h2"
          sx={{
            color: '#fff',
            fontWeight: 700,
            fontFamily: '"Roboto", sans-serif',
            letterSpacing: '-0.02em',
            mb: 2,
          }}
        >
          Choose Your Journey
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'rgba(255,255,255,0.7)',
            fontWeight: 400,
            fontFamily: '"Roboto", sans-serif',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          Explore our AI Playground your way - through traditional navigation or 
          our innovative AI-driven experience
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 4,
        }}
      >
        <JourneyCard
          title="Conventional"
          description="Navigate through our platform using traditional menu-based interface with enhanced UX design and intuitive controls."
          icon={
            <RocketLaunchIcon 
              sx={{ 
                fontSize: 40, 
                color: isHoveredConventional ? '#ff0000' : '#fff' 
              }} 
            />
          }
          onClick={() => router.push('/dashboard/conventional')}
          isHovered={isHoveredConventional}
          setHovered={setIsHoveredConventional}
        />

        <JourneyCard
          title="AI Assistant"
          description="Experience our platform through an intelligent AI assistant that guides you and adapts to your needs."
          icon={
            <SmartToyIcon 
              sx={{ 
                fontSize: 40, 
                color: isHoveredAI ? '#ff0000' : '#fff' 
              }} 
            />
          }
          onClick={() => router.push('/dashboard/ai')}
          isHovered={isHoveredAI}
          setHovered={setIsHoveredAI}
        />
      </Box>
    </Container>
  );
}