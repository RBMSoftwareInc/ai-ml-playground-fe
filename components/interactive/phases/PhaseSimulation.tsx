'use client';

import { Box, Typography, Button, Paper, CircularProgress, Alert } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Decision {
  id: string;
  label: string;
  outcome: string;
}

interface PipelineStep {
  id: string;
  label: string;
  description: string;
}

interface PhaseSimulationProps {
  scenarioLabel: string;
  visualization: string;
  decisions: Decision[];
  pipeline: PipelineStep[];
  onDecision: (decisionId: string, outcome: string) => void;
  onComplete: () => void;
  pipelineProgress?: number[];
  loading?: boolean;
  error?: string | null;
  visualizationData?: any;
}

export default function PhaseSimulation({
  scenarioLabel,
  visualization,
  decisions,
  pipeline,
  onDecision,
  onComplete,
  pipelineProgress = [],
  loading = false,
  error = null,
  visualizationData = null,
}: PhaseSimulationProps) {
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleDecision = (decisionId: string, outcome: string) => {
    setSelectedDecision(decisionId);
    setIsCompleting(true);
    onDecision(decisionId, outcome);
    
    // Complete simulation after decision (with delay for API response)
    setTimeout(() => {
      onComplete();
      setIsCompleting(false);
    }, 2000);
  };

  const renderVisualization = () => {
    // Use visualizationData if available from API, otherwise use static visualization
    if (visualizationData) {
      return (
        <Box
          sx={{
            height: '400px',
            bgcolor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Render dynamic visualization data */}
          <Typography sx={{ color: '#fff' }}>
            {JSON.stringify(visualizationData, null, 2)}
          </Typography>
        </Box>
      );
    }

    switch (visualization) {
      case 'transaction_stream':
        return (
          <Box
            sx={{
              height: '400px',
              bgcolor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Animated transaction stream */}
            <Box
              sx={{
                position: 'absolute',
                top: '20%',
                left: '10%',
                width: '80%',
                height: '60%',
                bgcolor: 'rgba(255,77,77,0.1)',
                border: '2px solid #ff4d4d',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 0.6 },
                  '50%': { opacity: 1 },
                },
              }}
            >
              <Typography sx={{ color: '#ff4d4d', fontWeight: 600 }}>
                Transaction Stream Visualization
              </Typography>
            </Box>
            {/* Animated data points */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: '100%', opacity: [0, 1, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: 'linear',
                }}
                style={{
                  position: 'absolute',
                  top: `${20 + i * 15}%`,
                  width: '4px',
                  height: '4px',
                  backgroundColor: '#ff4d4d',
                  borderRadius: '50%',
                }}
              />
            ))}
          </Box>
        );
      case 'price_chart':
        return (
          <Box
            sx={{
              height: '400px',
              bgcolor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Animated price chart */}
            <Box
              component="svg"
              sx={{ width: '100%', height: '100%' }}
              viewBox="0 0 400 300"
            >
              <motion.path
                d="M 0 200 Q 100 150 200 100 T 400 50"
                stroke="#ff4d4d"
                strokeWidth="3"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              />
            </Box>
            <Typography
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#fff',
              }}
            >
              Price Chart Visualization
            </Typography>
          </Box>
        );
      case 'store_heatmap':
        return (
          <Box
            sx={{
              height: '400px',
              bgcolor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 2,
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gridTemplateRows: 'repeat(4, 1fr)',
              gap: 1,
              p: 2,
            }}
          >
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.3 }}
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                  backgroundColor: [
                    'rgba(255,77,77,0.1)',
                    'rgba(255,77,77,0.5)',
                    'rgba(255,77,77,0.1)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
                style={{
                  borderRadius: '4px',
                  border: '1px solid rgba(255,77,77,0.3)',
                }}
              />
            ))}
            <Typography
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#fff',
                pointerEvents: 'none',
              }}
            >
              Store Heatmap Visualization
            </Typography>
          </Box>
        );
      default:
        return (
          <Box
            sx={{
              height: '400px',
              bgcolor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography sx={{ color: '#fff' }}>Live Simulation Visualization</Typography>
          </Box>
        );
    }
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Typography
          variant="h5"
          sx={{
            color: '#fff',
            fontWeight: 600,
            mb: 3,
            textAlign: 'center',
          }}
        >
          {scenarioLabel} - Live Simulation
        </Typography>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(255,77,77,0.1)', color: '#ff4d4d' }}>
          {error}
        </Alert>
      )}

      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress size={24} sx={{ color: '#ff4d4d' }} />
        </Box>
      )}

      {/* Visualization */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {renderVisualization()}
      </motion.div>

      {/* Decision Buttons */}
      <Box
        sx={{
          mt: 4,
          display: 'flex',
          gap: 2,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <AnimatePresence>
          {decisions.map((decision, index) => (
            <motion.div
              key={decision.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                onClick={() => handleDecision(decision.id, decision.outcome)}
                variant={selectedDecision === decision.id ? 'contained' : 'outlined'}
                disabled={selectedDecision !== null || loading || isCompleting}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: selectedDecision === decision.id ? '#fff' : 'rgba(255,255,255,0.8)',
                  bgcolor: selectedDecision === decision.id ? '#ff4d4d' : 'transparent',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#ff4d4d',
                    bgcolor: 'rgba(255,77,77,0.1)',
                  },
                  '&:disabled': {
                    borderColor: 'rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.4)',
                  },
                }}
              >
                {selectedDecision === decision.id && isCompleting ? (
                  <>
                    <CircularProgress size={16} sx={{ color: '#fff', mr: 1 }} />
                    Processing...
                  </>
                ) : (
                  decision.label
                )}
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>
    </Box>
  );
}
