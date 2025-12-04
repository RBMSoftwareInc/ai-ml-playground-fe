'use client';

import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

interface PipelineStep {
  id: string;
  label: string;
  description: string;
}

interface PipelineVisualizationProps {
  pipeline: PipelineStep[];
  activeSteps: number[];
}

export default function PipelineVisualization({
  pipeline,
  activeSteps,
}: PipelineVisualizationProps) {
  return (
    <Paper
      sx={{
        p: 3,
        bgcolor: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: '#fff',
          fontWeight: 600,
          mb: 3,
          fontSize: '1rem',
        }}
      >
        AI Pipeline
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {pipeline.map((step, index) => {
          const isActive = activeSteps.includes(index);
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: isActive ? 1 : 0.5,
                x: 0,
              }}
              transition={{ delay: index * 0.2 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 1.5,
                  bgcolor: isActive ? 'rgba(255,77,77,0.1)' : 'transparent',
                  border: isActive ? '1px solid #ff4d4d' : '1px solid transparent',
                  borderRadius: 1,
                  transition: 'all 0.3s ease',
                }}
              >
                {isActive ? (
                  <CheckCircleIcon sx={{ color: '#ff4d4d', fontSize: 20 }} />
                ) : (
                  <RadioButtonUncheckedIcon
                    sx={{ color: 'rgba(255,255,255,0.3)', fontSize: 20 }}
                  />
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
                      fontWeight: isActive ? 600 : 400,
                      fontSize: '0.9rem',
                    }}
                  >
                    {step.label}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: '0.75rem',
                    }}
                  >
                    {step.description}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          );
        })}
      </Box>
    </Paper>
  );
}

