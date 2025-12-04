'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper, alpha, IconButton, Tooltip, Button, Chip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ModeSwitcher from '../components/ModeSwitcher';
import {
  LocalHospital,
  Flight,
  AccountBalance,
  Restaurant,
  ShoppingCart,
  Movie,
  Factory,
  Apartment,
  Store,
  ViewModule,
  GridView,
} from '@mui/icons-material';

const MotionPaper = motion(Paper);

interface Industry {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  explorationTime: string;
  useCaseCount: number;
  highlights: string[];
}

const industries: Industry[] = [
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Patient analytics, diagnostics AI, drug discovery, and clinical decision support',
    icon: <LocalHospital sx={{ fontSize: 44 }} />,
    route: '/industries/healthcare',
    explorationTime: '~45 min',
    useCaseCount: 8,
    highlights: ['Patient Risk Scoring', 'Diagnostic AI', 'Drug Discovery'],
  },
  {
    id: 'travel',
    name: 'Travel',
    description: 'Dynamic pricing, demand forecasting, personalized recommendations',
    icon: <Flight sx={{ fontSize: 44 }} />,
    route: '/industries/travel',
    explorationTime: '~40 min',
    useCaseCount: 8,
    highlights: ['Dynamic Pricing', 'Route Optimization', 'Demand Forecast'],
  },
  {
    id: 'fintech',
    name: 'Fintech',
    description: 'Risk scoring, fraud detection, algorithmic trading, credit underwriting',
    icon: <AccountBalance sx={{ fontSize: 44 }} />,
    route: '/industries/fintech',
    explorationTime: '~50 min',
    useCaseCount: 8,
    highlights: ['Fraud Detection', 'Credit Scoring', 'Algo Trading'],
  },
  {
    id: 'hospitality',
    name: 'Restaurant & Hospitality',
    description: 'Menu optimization, demand prediction, customer sentiment analysis',
    icon: <Restaurant sx={{ fontSize: 44 }} />,
    route: '/industries/hospitality',
    explorationTime: '~35 min',
    useCaseCount: 8,
    highlights: ['Menu AI', 'Demand Prediction', 'Staff Scheduling'],
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Product discovery, personalization, pricing optimization, fraud detection',
    icon: <ShoppingCart sx={{ fontSize: 44 }} />,
    route: '/industries/ecommerce',
    explorationTime: '~60 min',
    useCaseCount: 30,
    highlights: ['Visual Search', 'Dynamic Pricing', 'Personalization'],
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    description: 'Content recommendation, audience analytics, sentiment analysis',
    icon: <Movie sx={{ fontSize: 44 }} />,
    route: '/industries/entertainment',
    explorationTime: '~35 min',
    useCaseCount: 8,
    highlights: ['Content Recs', 'Audience Analytics', 'Ad Optimization'],
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    description: 'Predictive maintenance, quality control, supply chain optimization',
    icon: <Factory sx={{ fontSize: 44 }} />,
    route: '/industries/manufacturing',
    explorationTime: '~45 min',
    useCaseCount: 8,
    highlights: ['Predictive Maintenance', 'Quality AI', 'Supply Chain'],
  },
  {
    id: 'realestate',
    name: 'Real Estate',
    description: 'Property valuation, market analytics, project risk assessment',
    icon: <Apartment sx={{ fontSize: 44 }} />,
    route: '/industries/realestate',
    explorationTime: '~40 min',
    useCaseCount: 8,
    highlights: ['Valuation AI', 'Market Analytics', 'Risk Assessment'],
  },
  {
    id: 'retail',
    name: 'Retail',
    description: 'In-store analytics, inventory optimization, customer journey mapping',
    icon: <Store sx={{ fontSize: 44 }} />,
    route: '/industries/retail',
    explorationTime: '~40 min',
    useCaseCount: 8,
    highlights: ['Store Analytics', 'Inventory AI', 'Loss Prevention'],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function HomePage() {
  const router = useRouter();
  const [columns, setColumns] = useState<3 | 4>(3);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [taglineIndex, setTaglineIndex] = useState(0);

  // Professional taglines
  const taglines = [
    'Reimagine • Build • Modernize',
    'Where AI Meets Enterprise',
    'Transforming Business with Intelligence',
    'Next-Gen AI for Next-Gen Commerce',
  ];

  // Rotate taglines every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [taglines.length]);

  const currentTagline = taglines[taglineIndex];

  const handleIndustryClick = (industry: Industry) => {
    router.push(industry.route);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#0a0a0a',
        py: { xs: 6, md: 10 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Reddish ambient glow - top right */}
      <Box
        sx={{
          position: 'absolute',
          top: '-15%',
          right: '-10%',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(220,38,38,0.12) 0%, rgba(220,38,38,0.04) 40%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(60px)',
        }}
      />

      {/* Reddish ambient glow - bottom left */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '-20%',
          left: '-15%',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(185,28,28,0.1) 0%, rgba(185,28,28,0.03) 40%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(80px)',
        }}
      />

      {/* Subtle center glow */}
      <Box
        sx={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1000px',
          height: '600px',
          background: 'radial-gradient(ellipse, rgba(239,68,68,0.05) 0%, transparent 60%)',
          pointerEvents: 'none',
          filter: 'blur(100px)',
        }}
      />

      {/* Subtle grid pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header with Switch to AI Mode Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: { xs: 4, md: 6 } }}>
          <Box sx={{ flex: 1 }} />
          <Box sx={{ textAlign: 'center', flex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1.5,
                mb: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, mb: 2 }}>
                <Box
                  component="img"
                  src="/images/rbm-logo.svg"
                  alt="RBM"
                  sx={{
                    height: 64,
                    filter: 'brightness(0) saturate(100%) invert(15%) sepia(100%) saturate(7472%) hue-rotate(0deg) brightness(99%) contrast(118%)',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.08) rotate(2deg)',
                    },
                  }}
                  onError={(e: any) => {
                    e.target.style.display = 'none';
                  }}
                />
                <Box sx={{ position: 'relative', minHeight: '5rem', display: 'flex', alignItems: 'center' }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={headlineIndex}
                      initial={{ opacity: 0, y: 30, filter: 'blur(15px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -30, filter: 'blur(15px)' }}
                      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <Typography
                        variant="h1"
                        sx={{
                          fontSize: { xs: '2rem', md: '2.5rem', lg: '3rem' },
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
                          RBM AI
                        </Box>
                        <Box
                          component="span"
                          sx={{
                            ml: 1.5,
                            color: 'rgba(255,255,255,0.8)',
                            fontWeight: 500,
                            position: 'relative',
                            display: 'inline-block',
                          }}
                        >
                          Playground
                        </Box>
                      </Typography>
                    </motion.div>
                  </AnimatePresence>
                </Box>
              </Box>
              <Box sx={{ position: 'relative', minHeight: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={taglineIndex}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: { xs: '0.9rem', md: '1rem' },
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
          </motion.div>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
            <ModeSwitcher />
          </Box>
        </Box>

          {/* Professional Description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 500,
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.8,
                fontSize: { xs: '1rem', md: '1.15rem' },
                textAlign: 'center',
                mb: 6,
              }}
            >
              Enterprise AI solutions powered by advanced machine learning. 
              Experience interactive simulations, real-time predictions, and production-ready implementations 
              across 9 industries.
            </Typography>
          </motion.div>

        {/* Column Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3, gap: 1 }}>
            <Tooltip title="3 Column View" arrow>
              <IconButton
                onClick={() => setColumns(3)}
                sx={{
                  color: columns === 3 ? '#ef4444' : 'rgba(255,255,255,0.4)',
                  border: '1px solid',
                  borderColor: columns === 3 ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)',
                  background: columns === 3 ? 'rgba(239,68,68,0.1)' : 'transparent',
                  '&:hover': {
                    background: 'rgba(239,68,68,0.15)',
                    borderColor: 'rgba(239,68,68,0.4)',
                  },
                }}
              >
                <ViewModule />
              </IconButton>
            </Tooltip>
            <Tooltip title="4 Column View" arrow>
              <IconButton
                onClick={() => setColumns(4)}
                sx={{
                  color: columns === 4 ? '#ef4444' : 'rgba(255,255,255,0.4)',
                  border: '1px solid',
                  borderColor: columns === 4 ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)',
                  background: columns === 4 ? 'rgba(239,68,68,0.1)' : 'transparent',
                  '&:hover': {
                    background: 'rgba(239,68,68,0.15)',
                    borderColor: 'rgba(239,68,68,0.4)',
                  },
                }}
              >
                <GridView />
              </IconButton>
            </Tooltip>
          </Box>
        </motion.div>

        {/* Industry Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { 
                xs: '1fr', 
                sm: 'repeat(2, 1fr)', 
                md: columns === 3 ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)' 
              },
              gap: 3,
            }}
          >
            {industries.map((industry) => (
              <Box key={industry.id}>
                <motion.div variants={itemVariants}>
                  <MotionPaper
                    onClick={() => handleIndustryClick(industry)}
                    whileHover={{ 
                      scale: 1.03,
                      y: -10,
                    }}
                    whileTap={{ scale: 0.98 }}
                    sx={{
                      p: { xs: 3, md: 4 },
                      height: '100%',
                      minHeight: columns === 3 ? 280 : 260,
                      cursor: 'pointer',
                      background: 'linear-gradient(145deg, #141414 0%, #1a1a1a 50%, #111111 100%)',
                      border: '1px solid rgba(239,68,68,0.15)',
                      borderRadius: 4,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      boxShadow: '0 10px 40px rgba(239,68,68,0.05), 0 0 80px rgba(239,68,68,0.02)',
                      '&:hover': {
                        borderColor: 'rgba(239,68,68,0.4)',
                        boxShadow: '0 20px 60px rgba(239,68,68,0.12), 0 0 100px rgba(239,68,68,0.06)',
                        '& .industry-icon': {
                          color: '#ef4444',
                          transform: 'scale(1.15)',
                          filter: 'drop-shadow(0 0 20px rgba(239,68,68,0.5))',
                        },
                        '& .industry-glow': {
                          opacity: 0.25,
                        },
                        '& .highlight-chips': {
                          opacity: 1,
                        },
                      },
                    }}
                  >
                    {/* Background glow effect */}
                    <Box
                      className="industry-glow"
                      sx={{
                        position: 'absolute',
                        top: -50,
                        right: -50,
                        width: '200px',
                        height: '200px',
                        background: 'radial-gradient(circle, rgba(239,68,68,0.4) 0%, transparent 70%)',
                        opacity: 0.08,
                        transition: 'opacity 0.4s ease',
                        pointerEvents: 'none',
                        filter: 'blur(30px)',
                      }}
                    />

                    {/* Time & Use Case Badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: 0.5,
                      }}
                    >
                      <Tooltip title="Estimated exploration time" arrow placement="left">
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 999,
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.25)',
                          }}
                        >
                          <AccessTimeIcon sx={{ fontSize: 12, color: '#ef4444' }} />
                          <Typography
                            variant="caption"
                            sx={{
                              color: '#ef4444',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                            }}
                          >
                            {industry.explorationTime}
                          </Typography>
                        </Box>
                      </Tooltip>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'rgba(255,255,255,0.4)',
                          fontSize: '0.65rem',
                          pr: 0.5,
                        }}
                      >
                        {industry.useCaseCount} use cases
                      </Typography>
                    </Box>

                    {/* Icon */}
                    <Box
                      className="industry-icon"
                      sx={{
                        color: 'rgba(255,255,255,0.85)',
                        mb: 2.5,
                        transition: 'all 0.4s ease',
                      }}
                    >
                      {industry.icon}
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: '#ffffff',
                        mb: 1.5,
                        fontSize: columns === 3 ? '1.1rem' : '1rem',
                        fontFamily: '"Inter", "Roboto", sans-serif',
                      }}
                    >
                      {industry.name}
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255,255,255,0.6)',
                        lineHeight: 1.7,
                        fontSize: columns === 3 ? '0.875rem' : '0.8rem',
                        mb: 2,
                      }}
                    >
                      {industry.description}
                    </Typography>

                    {/* Highlight Chips */}
                    <Box
                      className="highlight-chips"
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 0.5,
                        opacity: 0.7,
                        transition: 'opacity 0.3s ease',
                      }}
                    >
                      {industry.highlights.map((highlight) => (
                        <Box
                          key={highlight}
                          sx={{
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'rgba(255,255,255,0.5)',
                              fontSize: '0.65rem',
                            }}
                          >
                            {highlight}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </MotionPaper>
                </motion.div>
              </Box>
            ))}
          </Box>
        </motion.div>

        {/* DevLab Featured Card - Centered below Industry Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
            <Paper
              onClick={() => router.push('/devlab')}
              sx={{
                maxWidth: '400px',
                p: 2.5,
                bgcolor: 'rgba(255,255,255,0.05)',
                border: '2px solid rgba(255,255,255,0.1)',
                borderRadius: 3,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.08)',
                  borderColor: 'rgba(255,77,77,0.4)',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(255,77,77,0.2)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, #ff0000, #ff4d4d, transparent)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,77,77,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255,77,77,0.3)',
                    fontSize: '1.5rem',
                  }}
                >
                  💻
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#fff',
                      fontWeight: 600,
                      mb: 0.5,
                      fontSize: '1.1rem',
                    }}
                  >
                    RBM DevLab
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      lineHeight: 1.5,
                      fontSize: '0.85rem',
                    }}
                  >
                    Developer AI Command Center
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                fullWidth
                size="small"
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: '#fff',
                  py: 0.8,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  '&:hover': {
                    borderColor: '#ff4d4d',
                    bgcolor: 'rgba(255,77,77,0.1)',
                  },
                }}
              >
                Open DevLab →
              </Button>
            </Paper>
          </Box>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <Box sx={{ textAlign: 'center', mt: { xs: 8, md: 12 } }}>
            <Typography
              variant="body2"
              sx={{ color: 'rgba(255,255,255,0.35)' }}
            >
              © 2025 RBM Software • AI-Driven Digital Transformation
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
