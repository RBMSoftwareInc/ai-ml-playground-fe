'use client';

import { Box, Typography, Button, Paper, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface Scenario {
  id: string;
  label: string;
  description: string;
  recommended: boolean;
}

interface PhaseScenarioProps {
  scenarios: Scenario[];
  selectedScenario: string | null;
  onSelectScenario: (scenarioId: string) => void;
  onStartWithRecommended: () => void;
}

export default function PhaseScenario({
  scenarios,
  selectedScenario,
  onSelectScenario,
  onStartWithRecommended,
}: PhaseScenarioProps) {
  const recommendedScenario = scenarios.find(s => s.recommended);

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
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
          Choose a Scenario
        </Typography>
      </motion.div>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
          gap: 2,
          mb: 4,
        }}
      >
        {scenarios.map((scenario, index) => (
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Paper
              onClick={() => onSelectScenario(scenario.id)}
              sx={{
                p: 3,
                bgcolor:
                  selectedScenario === scenario.id
                    ? 'rgba(255,77,77,0.15)'
                    : 'rgba(255,255,255,0.05)',
                border:
                  selectedScenario === scenario.id
                    ? '2px solid #ff4d4d'
                    : scenario.recommended
                    ? '2px solid rgba(255,77,77,0.3)'
                    : '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.08)',
                  borderColor: 'rgba(255,255,255,0.2)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {scenario.recommended && (
                <Chip
                  icon={<CheckCircleIcon />}
                  label="Recommended"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(255,77,77,0.2)',
                    color: '#ff4d4d',
                    border: '1px solid rgba(255,77,77,0.4)',
                  }}
                />
              )}
              <Typography
                variant="h6"
                sx={{
                  color: '#fff',
                  fontWeight: 600,
                  mb: 1,
                  pr: scenario.recommended ? 6 : 0,
                }}
              >
                {scenario.label}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '0.9rem',
                }}
              >
                {scenario.description}
              </Typography>
            </Paper>
          </motion.div>
        ))}
      </Box>

      {recommendedScenario && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Button
              onClick={onStartWithRecommended}
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#ff0000',
                color: '#fff',
                px: 5,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0 4px 20px rgba(255,0,0,0.4)',
                '&:hover': {
                  bgcolor: '#cc0000',
                  boxShadow: '0 6px 30px rgba(255,0,0,0.5)',
                },
              }}
            >
              Start with Recommended
            </Button>
          </Box>
        </motion.div>
      )}
    </Box>
  );
}

