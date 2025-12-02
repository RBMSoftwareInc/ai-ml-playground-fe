// store-frontiq/composeriq/ComposerProgress.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1/cms/composer';

interface ComposerProgressProps {
  storeId: string;
  canvasId: string; // Single canvas for now, can extend for multiple
  onComplete: (outputOption: 'inline' | 'standalone' | 'staging' | 'zip') => void;
}

export default function ComposerProgress({ storeId, canvasId, onComplete }: ComposerProgressProps) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Initializing composition...');
  const [visualState, setVisualState] = useState({ type: 'skeleton', sections: 1, progress: 0 });
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const eventSource = new EventSource(
      `${API_BASE_URL}/api/v1/compose/store?store_id=${storeId}&canvas_id=${canvasId}`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.status === 'error') {
        setError(data.message);
        eventSource.close();
        return;
      }
      if (data.status === 'progress') {
        setMessage(data.message);
        setVisualState(data.visual);
        setProgress(data.visual.progress);
      }
      if (data.status === 'completed') {
        setMessage(data.message);
        setVisualState(data.visual);
        setProgress(100);
        setIsComplete(true);
        eventSource.close();
      }
    };

    eventSource.onerror = () => {
      setError('Connection to server failed');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [storeId, canvasId]);

  const renderVisualFeedback = () => {
    if (progress < 100) {
      return (
        <Box
          ref={canvasRef}
          sx={{
            height: 200,
            bgcolor: '#F5F5F5',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'rocketLaunch 2s infinite',
            backgroundImage: 'url(/rocket-launch.gif)', // Replace with actual GIF path
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <Typography variant="h6" color="#616161" sx={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
            Launching {progress}%
          </Typography>
        </Box>
      );
    }
    return (
      <Box
        ref={canvasRef}
        sx={{
          height: 200,
          bgcolor: '#FFF',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <Typography variant="h6" color="#616161">
          Storefront Ready!
        </Typography>
      </Box>
    );
  };

  if (error) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 4, bgcolor: '#FFF', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
        <Typography variant="h5" color="error" gutterBottom sx={{ fontWeight: 600 }}>
          Composition Failed
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
          sx={{ mt: 2, px: 3, py: 1, borderRadius: 20 }}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 4, bgcolor: '#FFF', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#616161', fontWeight: 700 }}>
        Composing Store...
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph sx={{ animation: 'fadeIn 1s ease-in-out', maxWidth: 400, mx: 'auto' }}>
        {message}
      </Typography>
      {renderVisualFeedback()}
      {isComplete && (
        <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onComplete('inline')}
            sx={{ px: 3, py: 1, borderRadius: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.2)' } }}
          >
            Inline Code
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => onComplete('standalone')}
            sx={{ px: 3, py: 1, borderRadius: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.2)' } }}
          >
            Standalone Code
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={() => onComplete('staging')}
            sx={{ px: 3, py: 1, borderRadius: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.2)' } }}
          >
            Deploy to Staging
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => onComplete('zip')}
            sx={{ px: 3, py: 1, borderRadius: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.2)' } }}
          >
            Download ZIP
          </Button>
        </Box>
      )}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes rocketLaunch {
            0% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-50px) scale(1.1); }
            100% { transform: translateY(0) scale(1); }
          }
        `}
      </style>
    </Box>
  );
}