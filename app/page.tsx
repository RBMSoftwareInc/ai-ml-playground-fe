'use client';

import { useState } from 'react';
import { Box, Typography, Container, Grid, Paper, alpha, IconButton, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExploreIcon from '@mui/icons-material/Explore';
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
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
                mb: 3,
              }}
            >
              <Box
                component="img"
                src="/images/rbm-logo.svg"
                alt="RBM"
                sx={{
                  height: 56,
                  filter: 'brightness(0) invert(1)',
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
                }}
              >
                AI Playground
              </Typography>
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                fontWeight: 400,
                maxWidth: 650,
                mx: 'auto',
                lineHeight: 1.7,
                fontSize: { xs: '1rem', md: '1.2rem' },
              }}
            >
              Explore AI/ML solutions across industries — interactive demos, 
              real-time predictions, and enterprise-ready implementations
            </Typography>
          </motion.div>
        </Box>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Paper
            sx={{
              p: 2.5,
              mb: 4,
              background: 'rgba(239, 68, 68, 0.06)',
              border: '1px solid rgba(239, 68, 68, 0.15)',
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <InfoOutlinedIcon sx={{ color: '#ef4444', fontSize: 28 }} />
            <Box sx={{ flex: 1, minWidth: 250 }}>
              <Typography variant="body1" sx={{ color: '#fff', fontWeight: 600, mb: 0.5 }}>
                Interactive AI Demos for Every Industry
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                Each industry includes multiple AI use cases with live demos, sample data, and production-ready implementations. 
                Click any tile to explore.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'rgba(255,255,255,0.5)' }}>
              <ExploreIcon sx={{ fontSize: 18 }} />
              <Typography variant="caption">9 Industries • 90+ Use Cases</Typography>
            </Box>
          </Paper>
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
          <Grid container spacing={3}>
            {industries.map((industry) => (
              <Grid 
                item 
                xs={12} 
                sm={6} 
                md={columns === 3 ? 4 : 3} 
                key={industry.id}
              >
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
              </Grid>
            ))}
          </Grid>
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
