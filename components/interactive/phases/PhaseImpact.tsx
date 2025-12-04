'use client';

import { Box, Typography, Button, Paper, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface ImpactMetric {
  label: string;
  value: string;
  change: string;
}

interface PhaseImpactProps {
  impactMetrics: Record<string, ImpactMetric>;
  selectedScenario: string;
  onReplay: () => void;
}

export default function PhaseImpact({
  impactMetrics,
  selectedScenario,
  onReplay,
}: PhaseImpactProps) {
  const router = useRouter();
  const metrics = Object.values(impactMetrics);

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h4"
          sx={{
            color: '#fff',
            fontWeight: 700,
            mb: 2,
            textAlign: 'center',
          }}
        >
          Impact Summary
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255,255,255,0.7)',
            mb: 4,
            textAlign: 'center',
          }}
        >
          Results based on your choices
        </Typography>
      </motion.div>

      {/* Metrics Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 2,
          mb: 4,
        }}
      >
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <Paper
              sx={{
                p: 3,
                bgcolor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.85rem',
                  display: 'block',
                  mb: 1,
                }}
              >
                {metric.label}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: '#ff4d4d',
                  fontWeight: 700,
                  mb: 0.5,
                }}
              >
                {metric.value}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '0.8rem',
                }}
              >
                {metric.change}
              </Typography>
            </Paper>
          </motion.div>
        ))}
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onReplay}
            variant="outlined"
            startIcon={<RefreshIcon />}
            sx={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: '#fff',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#ff4d4d',
                bgcolor: 'rgba(255,77,77,0.1)',
              },
            }}
          >
            Replay with Different Scenario
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            sx={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: '#fff',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#ff4d4d',
                bgcolor: 'rgba(255,77,77,0.1)',
              },
            }}
          >
            Download Summary PDF
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => router.push('/dashboard/ai')}
            variant="contained"
            startIcon={<AutoAwesomeIcon />}
            sx={{
              bgcolor: '#ff0000',
              color: '#fff',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#cc0000',
              },
            }}
          >
            Talk to AI Consultant
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
}

