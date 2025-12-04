'use client';

import { Box, Typography, Button, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface PhaseBriefProps {
  title: string;
  tagline: string;
  icon: string;
  businessStory: string;
  impact: {
    revenue_saved?: string;
    fraud_reduction?: string;
    margin_improvement?: string;
    shrinkage_reduction?: string;
    roi: string;
  };
  onStart: () => void;
}

export default function PhaseBrief({
  title,
  tagline,
  icon,
  businessStory,
  impact,
  onStart,
}: PhaseBriefProps) {
  const impactValue = impact.revenue_saved || impact.fraud_reduction || impact.margin_improvement || impact.shrinkage_reduction || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Paper
        sx={{
          p: { xs: 4, md: 6 },
          bgcolor: 'rgba(255,255,255,0.05)',
          border: '2px solid rgba(255,0,0,0.3)',
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #ff0000, #ff4d4d, transparent)',
          },
        }}
      >
        <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <Box
              sx={{
                fontSize: '5rem',
                mb: 2,
                display: 'inline-block',
              }}
            >
              {icon}
            </Box>
          </motion.div>

          {/* Title */}
          <Typography
            variant="h3"
            sx={{
              color: '#fff',
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            {title}
          </Typography>

          {/* Tagline */}
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255,255,255,0.7)',
              mb: 4,
              fontSize: { xs: '1rem', md: '1.2rem' },
            }}
          >
            {tagline}
          </Typography>

          {/* Business Story */}
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255,255,255,0.8)',
              mb: 4,
              lineHeight: 1.8,
              fontSize: { xs: '0.95rem', md: '1.1rem' },
            }}
          >
            {businessStory}
          </Typography>

          {/* Impact Highlight */}
          {impactValue && (
            <Box
              sx={{
                mb: 4,
                p: 3,
                bgcolor: 'rgba(255,77,77,0.1)',
                border: '1px solid rgba(255,77,77,0.3)',
                borderRadius: 2,
                display: 'inline-block',
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: '#ff4d4d',
                  fontWeight: 600,
                  mb: 0.5,
                }}
              >
                {impactValue}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                ROI: {impact.roi}
              </Typography>
            </Box>
          )}

          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onStart}
              variant="contained"
              size="large"
              startIcon={<AutoAwesomeIcon />}
              sx={{
                bgcolor: '#ff0000',
                color: '#fff',
                px: 5,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1.1rem',
                boxShadow: '0 4px 20px rgba(255,0,0,0.4)',
                '&:hover': {
                  bgcolor: '#cc0000',
                  boxShadow: '0 6px 30px rgba(255,0,0,0.5)',
                },
              }}
            >
              Start Simulation
            </Button>
          </motion.div>
        </Box>
      </Paper>
    </motion.div>
  );
}

