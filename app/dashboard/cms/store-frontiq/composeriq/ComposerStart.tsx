// store-frontiq/composeriq/ComposerStart.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Chip, Grid } from '@mui/material';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1/cms/composer';

interface ComposerStartProps {
  stores: { store_id: string; name: string }[];
  selectedStoreId: string | null;
  setSelectedStoreId: (storeId: string | null) => void;
  canvases: { canvas_id: string; name: string; store_id: string }[];
  selectedCanvasIds: string[];
  setSelectedCanvasIds: (canvasIds: string[]) => void;
  onStart: () => void;
}

export default function ComposerStart({
  stores,
  selectedStoreId,
  setSelectedStoreId,
  canvases,
  selectedCanvasIds,
  setSelectedCanvasIds,
  onStart,
}: ComposerStartProps) {
  const handleStoreSelect = (storeId: string) => {
    setSelectedStoreId(storeId);
    setSelectedCanvasIds([]); // Reset canvas selection when store changes
  };

  const handleCanvasToggle = (canvasId: string) => {
    setSelectedCanvasIds((prev) =>
      prev.includes(canvasId) ? prev.filter((id) => id !== canvasId) : [...prev, canvasId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStoreId) {
      const storeCanvases = canvases.filter((c) => c.store_id === selectedStoreId).map((c) => c.canvas_id);
      setSelectedCanvasIds(storeCanvases);
    }
  };

  const handleSelectNone = () => {
    setSelectedCanvasIds([]);
  };

  const filteredCanvases = canvases;
  console.log('Filtered Canvases:', filteredCanvases); // Debug log

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 4, bgcolor: '#FFF', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', animation: 'fadeIn 0.5s' }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#616161', fontWeight: 700, textAlign: 'center' }}>
        Start Store Composition
      </Typography>
      <Typography variant="body1" paragraph sx={{ color: '#757575', textAlign: 'center', mb: 4 }}>
        Select a store and one or more canvases (page blueprints) to compose the storefront.
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4, justifyContent: 'center' }}>
        {stores.map((store) => (
          <Grid item key={store.store_id}>
            <Chip
              label={store.name}
              onClick={() => handleStoreSelect(store.store_id)}
              sx={{
                cursor: 'pointer',
                fontSize: '1rem',
                padding: '10px 20px',
                border: selectedStoreId === store.store_id ? '2px solid #FFCCCC' : '1px solid #E0E0E0',
                borderRadius: 16,
                transition: 'all 0.3s ease',
                '&:hover': { borderColor: '#FFCCCC', transform: 'scale(1.05)' },
              }}
            />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2} sx={{ mb: 4, justifyContent: 'center' }}>
        {filteredCanvases.length > 0 ? (
          filteredCanvases.map((canvas) => (
            <Grid item key={canvas.canvas_id}>
              <Chip
                label={canvas.name}
                onClick={() => handleCanvasToggle(canvas.canvas_id)}
                sx={{
                  cursor: 'pointer',
                  fontSize: '1rem',
                  padding: '10px 20px',
                  border: selectedCanvasIds.includes(canvas.canvas_id) ? '2px solid #FFCCCC' : '1px solid #E0E0E0',
                  borderRadius: 16,
                  transition: 'all 0.3s ease',
                  '&:hover': { borderColor: '#FFCCCC', transform: 'scale(1.05)' },
                }}
              />
            </Grid>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', width: '100%' }}>
            No canvases available for the selected store.
          </Typography>
        )}
      </Grid>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Button
          variant="outlined"
          onClick={handleSelectAll}
          sx={{ mr: 2, color: '#757575', borderColor: '#E0E0E0', '&:hover': { borderColor: '#FFCCCC' } }}
        >
          Select All
        </Button>
        <Button
          variant="outlined"
          onClick={handleSelectNone}
          sx={{ color: '#757575', borderColor: '#E0E0E0', '&:hover': { borderColor: '#FFCCCC' } }}
        >
          Select None
        </Button>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={onStart}
          disabled={!selectedStoreId || selectedCanvasIds.length === 0}
          sx={{
            mt: 2,
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            borderRadius: 20,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            '&:hover': { boxShadow: '0 6px 16px rgba(0,0,0,0.2)' },
            animation: 'pulse 1.5s infinite',
          }}
        >
          Start Composition
        </Button>
      </Box>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </Box>
  );
}