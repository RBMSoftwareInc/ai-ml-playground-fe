'use client';

import { useState } from 'react';
import { Box, Typography, Paper, Button, Chip, Switch, FormControlLabel, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddIcon from '@mui/icons-material/Add';
import chaosScenarios from '../../data/devlab/chaos-scenarios.json';

export default function TestingConsole() {
  const [tests, setTests] = useState([
    { id: 'test-1', name: 'UserService.getUserById', status: 'pass', duration: '0.023s' },
    { id: 'test-2', name: 'UserService.createUser', status: 'pass', duration: '0.045s' },
    { id: 'test-3', name: 'ProductService.getProduct', status: 'fail', duration: '0.012s', error: 'AssertionError: Expected 200, got 404' },
  ]);
  const [chaosEnabled, setChaosEnabled] = useState({
    dbFail: false,
    latencySpike: false,
    workerCrash: false,
  });
  const [resilienceScore, setResilienceScore] = useState<number | null>(null);
  const [running, setRunning] = useState(false);

  const handleRunTests = () => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
    }, 2000);
  };

  const handleGenerateTests = () => {
    // Mock test generation
    const newTest = {
      id: `test-${Date.now()}`,
      name: 'Generated Test',
      status: 'pending',
      duration: '0s',
    };
    setTests([...tests, newTest]);
  };

  const handleChaosToggle = (scenario: keyof typeof chaosEnabled) => {
    setChaosEnabled((prev) => {
      const updated = { ...prev, [scenario]: !prev[scenario] };
      
      // Calculate resilience score
      if (Object.values(updated).some(v => v)) {
        const activeScenarios = Object.values(updated).filter(v => v).length;
        const score = 100 - (activeScenarios * 10);
        setResilienceScore(Math.max(0, score));
      } else {
        setResilienceScore(null);
      }
      
      return updated;
    });
  };

  return (
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Left: Module Selection */}
      <Box sx={{ width: 250, borderRight: '1px solid rgba(255,255,255,0.1)', p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: '1rem' }}>
          Modules
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {['UserService', 'ProductService', 'AuthService', 'PaymentService'].map((module) => (
            <Paper
              key={module}
              sx={{
                p: 1.5,
                bgcolor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'rgba(255,0,0,0.3)',
                },
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {module}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* Center: Test Runner */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Toolbar */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            p: 2,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            bgcolor: 'rgba(0,0,0,0.3)',
          }}
        >
          <Button
            startIcon={<PlayArrowIcon />}
            onClick={handleRunTests}
            disabled={running}
            sx={{
              bgcolor: '#ff0000',
              color: '#fff',
              textTransform: 'none',
              '&:hover': {
                bgcolor: '#cc0000',
              },
              '&:disabled': {
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Run Tests
          </Button>
          <Button
            startIcon={<AddIcon />}
            onClick={handleGenerateTests}
            sx={{
              textTransform: 'none',
              color: 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              '&:hover': {
                bgcolor: 'rgba(255,0,0,0.1)',
                borderColor: '#ff0000',
              },
            }}
          >
            Generate Unit Tests
          </Button>
          <Button
            startIcon={<AddIcon />}
            sx={{
              textTransform: 'none',
              color: 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              '&:hover': {
                bgcolor: 'rgba(255,0,0,0.1)',
                borderColor: '#ff0000',
              },
            }}
          >
            Create Integration Test
          </Button>
        </Box>

        {/* Test Results */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
          {running && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress sx={{ mb: 1 }} />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                Running tests...
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {tests.map((test) => (
              <Paper
                key={test.id}
                sx={{
                  p: 2,
                  bgcolor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Chip
                    label={test.status}
                    size="small"
                    sx={{
                      bgcolor: test.status === 'pass' ? '#4caf50' : test.status === 'fail' ? '#f44336' : '#ff9800',
                      color: '#fff',
                      fontSize: '0.7rem',
                      height: 20,
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: 500, flex: 1 }}>
                    {test.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    {test.duration}
                  </Typography>
                </Box>
                {test.error && (
                  <Typography
                    variant="caption"
                    component="pre"
                    sx={{
                      mt: 1,
                      p: 1,
                      bgcolor: 'rgba(244,67,54,0.1)',
                      borderRadius: 1,
                      color: '#f44336',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                    }}
                  >
                    {test.error}
                  </Typography>
                )}
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Right: Chaos Simulation */}
      <Box sx={{ width: 350, borderLeft: '1px solid rgba(255,255,255,0.1)', p: 2, overflow: 'auto' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: '1rem' }}>
          Chaos Simulation
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          {chaosScenarios.scenarios.map((scenario) => (
            <Paper
              key={scenario.id}
              sx={{
                p: 2,
                bgcolor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {scenario.name}
                </Typography>
                <Switch
                  checked={chaosEnabled[scenario.id as keyof typeof chaosEnabled] || false}
                  onChange={() => handleChaosToggle(scenario.id as keyof typeof chaosEnabled)}
                  size="small"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#ff0000',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      bgcolor: '#ff0000',
                    },
                  }}
                />
              </Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
                {scenario.description}
              </Typography>
            </Paper>
          ))}
        </Box>

        {resilienceScore !== null && (
          <Paper
            sx={{
              p: 2,
              bgcolor: 'rgba(255,0,0,0.1)',
              border: '1px solid rgba(255,0,0,0.3)',
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Resilience Score
            </Typography>
            <Box
              sx={{
                width: '100%',
                height: 40,
                bgcolor: 'rgba(0,0,0,0.3)',
                borderRadius: 1,
                position: 'relative',
                overflow: 'hidden',
                mb: 1,
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${resilienceScore}%` }}
                transition={{ duration: 1 }}
                style={{
                  height: '100%',
                  background: resilienceScore >= 70 ? '#4caf50' : resilienceScore >= 50 ? '#ff9800' : '#f44336',
                  borderRadius: 1,
                }}
              />
              <Typography
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: '#fff',
                  fontWeight: 600,
                }}
              >
                {resilienceScore}%
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              System resilience under chaos conditions
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
}

