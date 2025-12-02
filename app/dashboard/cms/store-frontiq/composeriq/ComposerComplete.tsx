// store-frontiq/composeriq/ComposerComplete.tsx
'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface ComposerCompleteProps {
  onBack: () => void;
  onOutputSelect: (outputOption: 'inline' | 'standalone' | 'staging' | 'zip') => void;
}

export default function ComposerComplete({ onBack, onOutputSelect }: ComposerCompleteProps) {
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 4, bgcolor: '#FFF', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#616161', fontWeight: 700 }}>
        Composition Complete!
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 400, mx: 'auto' }}>
        Your store has been successfully composed. Choose an output option or return to the start.
      </Typography>
      <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onOutputSelect('inline')}
          sx={{ px: 3, py: 1, borderRadius: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.2)' } }}
        >
          Inline Code
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => onOutputSelect('standalone')}
          sx={{ px: 3, py: 1, borderRadius: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.2)' } }}
        >
          Standalone Code
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={() => onOutputSelect('staging')}
          sx={{ px: 3, py: 1, borderRadius: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.2)' } }}
        >
          Deploy to Staging
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => onOutputSelect('zip')}
          sx={{ px: 3, py: 1, borderRadius: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.2)' } }}
        >
          Download ZIP
        </Button>
      </Box>
      <Button
        variant="outlined"
        color="primary"
        onClick={onBack}
        sx={{ mt: 4, px: 2, py: 1, borderRadius: 20, color: '#616161', borderColor: '#E0E0E0', '&:hover': { borderColor: '#FFCCCC' } }}
      >
        Back to Start
      </Button>
    </Box>
  );
}