'use client';

import { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Grid, Button, CircularProgress
} from '@mui/material';
import MainLayout from '../../components/MainLayout';
import { useRouter } from 'next/navigation';
import AIJourneyModal from '../../components/AIJourneyModal';

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [showModal, setShowModal] = useState(true);
  const [mode, setMode] = useState<'conventional' | 'ai' | null>(null);

  const handleJourneySelect = (selected: 'conventional' | 'ai') => {
    setMode(selected);
    setShowModal(false);
    // Optionally: route based on selection
    console.log('User chose:', selected);
  };

  const handleEndSession = () => {
    // Optionally clear local storage or state
    router.push('/');
  };

  const renderInfoItem = (label: string, value: any) => (
    <Grid item xs={12} sm={6} md={4}>
      <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
      <Typography variant="body1" fontWeight="medium">{value || '—'}</Typography>
    </Grid>
  );

  return (

    <Box sx={{ px: 4, py: 3 }}>
      <AIJourneyModal open={showModal} onClose={() => setShowModal(false)} onSelect={handleJourneySelect} />


      {mode === 'conventional' && (
        <Typography variant="body1">
          You're in classic mode! Explore all features using the sidebar and menus.
        </Typography>
      )}

      {mode === 'ai' && (
        <Typography variant="body1" color="secondary">
          🔮 Ask Gene: Our AI assistant will guide your journey!
        </Typography>
      )}
    </Box>
   
  );
}
