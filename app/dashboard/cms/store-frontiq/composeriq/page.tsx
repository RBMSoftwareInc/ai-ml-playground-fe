// store-frontiq/composeriq/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Alert, Button, CircularProgress, Grid, LinearProgress } from '@mui/material';
import Header from '../../../../../components/cms/Header';
import Footer from '../../../../../components/cms/Footer';
import ComposerStart from './ComposerStart';
import ComposerProgress from './ComposerProgress';
import ComposerComplete from './ComposerComplete';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const API_BASE_URL = 'http://localhost:5000/api/v1/cms/composer';

export default function ComposerPage() {
  const router = useRouter();
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [selectedCanvasIds, setSelectedCanvasIds] = useState<string[]>([]);
  const [step, setStep] = useState<'start' | 'progress' | 'complete'>('start');
  const [stores, setStores] = useState<{ store_id: string; name: string }[]>([]);
  const [canvases, setCanvases] = useState<{ canvas_id: string; name: string; store_id: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Initializing...');
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data...');
        const [storesResponse, canvasesResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/stores`),
          axios.get(`${API_BASE_URL}/canvases`),
        ]);
        console.log('Stores response:', storesResponse.data);
        console.log('Canvases response:', canvasesResponse.data);
        setStores(storesResponse.data);
        if (storesResponse.data.length > 0) setSelectedStoreId(storesResponse.data[0].store_id);
        setCanvases(canvasesResponse.data);
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  const handleStart = () => {
    if (selectedStoreId && selectedCanvasIds.length > 0) {
      setStep('progress');
      composeStore();
    }
  };

  const composeStore = async () => {
    try {
      selectedCanvasIds.forEach(async (canvasId) => {
        const response = await axios.post(`${API_BASE_URL}/api/v1/compose/store`, {
          store_id: selectedStoreId,
          canvas_id: canvasId,
        });
        const reader = response.data.getReader();
        let done = false;
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            const data = JSON.parse(new TextDecoder().decode(value));
            setMessage(data.message);
            setProgress(data.visual.progress);
            if (data.status === 'completed') {
              setStep('complete');
            }
          }
        }
      });
    } catch (err) {
      setError('Composition failed. Please try again.');
      console.error('Error composing store:', err);
    }
  };

  const handleComplete = (outputOption: 'inline' | 'standalone' | 'staging' | 'zip') => {
    console.log(`Generating ${outputOption} for store ${selectedStoreId}`);
    // Add output generation logic here
  };

  const steps = ['Start', 'Progress', 'Complete'];
  const currentStep = steps.indexOf(step.charAt(0).toUpperCase() + step.slice(1));

  const renderVisualFeedback = () => {
    if (step === 'progress' && progress < 100) {
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
            backgroundImage: 'url(/rocket-launch.gif)',
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
    return null;
  };

  const renderCircularProgress = () => {
    const circumference = 2 * Math.PI * 70;
    const progressOffset = circumference - (progress / 100) * circumference;

    return (
      <Box sx={{ position: 'relative', width: 150, height: 150, mx: 'auto', mt: 4 }}>
        <svg width="150" height="150">
          <circle
            cx="75"
            cy="75"
            r="70"
            stroke="#E0E0E0"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="75"
            cy="75"
            r="70"
            stroke="#FFCCCC"
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            transform="rotate(-90 75 75)"
            style={{ transition: 'stroke-dashoffset 0.3s ease-in-out' }}
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dy=".3em"
            fontSize="20"
            fill="#616161"
          >
            {currentStep + 1}/{steps.length}
          </text>
        </svg>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {steps[currentStep]}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Header onLogout={() => router.push('/dashboard/cms/login')} />
      <Box sx={{ p: 4, minHeight: 'calc(100vh - 200px)', background: 'linear-gradient(145deg, #F5F5F5 0%, #E0E0E0 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#616161', fontWeight: 'bold', textAlign: 'center' }}>
          .comIQ Studio ComposerIQ Builder
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2, maxWidth: 600, width: '100%' }}>{error}</Alert>}
        {step === 'start' && (
          <ComposerStart
            stores={stores}
            selectedStoreId={selectedStoreId}
            setSelectedStoreId={setSelectedStoreId}
            canvases={canvases}
            selectedCanvasIds={selectedCanvasIds}
            setSelectedCanvasIds={setSelectedCanvasIds}
            onStart={handleStart}
          />
        )}
        {step === 'progress' && (
          <Box sx={{ maxWidth: 600, width: '100%', textAlign: 'center' }}>
            <LinearProgress variant="determinate" value={progress} sx={{ mb: 2, height: 10, borderRadius: 5, maxWidth: 400, mx: 'auto' }} />
            <Typography variant="body1" color="text.secondary" paragraph sx={{ animation: 'fadeIn 1s ease-in-out', maxWidth: 400, mx: 'auto' }}>
              {message}
            </Typography>
            {renderVisualFeedback()}
          </Box>
        )}
        {step === 'complete' && (
          <ComposerComplete onBack={() => setStep('start')} onOutputSelect={handleComplete} />
        )}
        {renderCircularProgress()}
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
      <Footer />
    </>
  );
}