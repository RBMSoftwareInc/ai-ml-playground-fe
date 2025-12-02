'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';

// Map feature keys to their actual routes
const featureRoutes: Record<string, string> = {
  // Product Discovery
  nlp: '/nlp',
  vss: '/vss',
  bundle: '/bundle',
  // Logistics & Operations
  eta: '/eta',
  delay: '/delay',
  inventory: '/inventory',
  // Personalization
  personalization: '/personalization',
  chat: '/chat',
  voice: '/voice',
  // Pricing & Fraud
  pricing: '/pricing',
  fraud: '/fruad', // Note: typo in original folder name
  coupon: '/coupon',
  // Marketing Intelligence
  churn: '/churn',
  segmentation: '/segmentation',
  subject: '/subject',
  leadgen: '/leadgen',
  // Product Intelligence
  variant: '/variant',
  categorization: '/categorization',
  sentiment: '/sentiment',
  descriptions: '/descriptions',
  // Creative & AR Tools
  remover: '/remover',
  upscaler: '/upscaler',
  tryon: '/tryon',
  // Gamification
  quiz: '/quiz',
  spin: '/spin',
  iq: '/iq',
  // Analytics & Insights
  forecast: '/forecast',
  timing: '/timing',
  abtest: '/abtest',
};

export default function EcommerceFeaturePage() {
  const router = useRouter();
  const params = useParams();
  const feature = params.feature as string;

  useEffect(() => {
    const targetRoute = featureRoutes[feature];
    if (targetRoute) {
      router.replace(targetRoute);
    } else {
      router.replace('/industries/ecommerce');
    }
  }, [feature, router]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#121212',
        gap: 2,
      }}
    >
      <CircularProgress sx={{ color: '#f44336' }} />
      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
        Loading {feature}...
      </Typography>
    </Box>
  );
}

