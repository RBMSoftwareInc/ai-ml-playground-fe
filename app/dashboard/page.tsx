'use client';

import { useState } from 'react';
import {
  Box, Typography
} from '@mui/material';
import { useRouter } from 'next/navigation';
import AIJourneyModal from '../../components/AIJourneyModal';

export default function DashboardPage() {
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
          🔮 AI Copilot: Our assistant will guide your journey!
        </Typography>
      )}
    </Box>
   
  );
}
