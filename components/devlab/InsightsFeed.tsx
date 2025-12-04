'use client';

import { Box, Typography, Paper, Chip, Button } from '@mui/material';
import { motion } from 'framer-motion';
import insightsData from '../../data/devlab/insights-feed.json';

const typeColors: Record<string, string> = {
  optimization: '#4caf50',
  security: '#f44336',
  refactor: '#ff9800',
  test: '#2196f3',
  dependency: '#9c27b0',
};

export default function InsightsFeed() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: '1rem' }}>
        AI Insights Feed
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {insightsData.insights.map((insight, idx) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Paper
              sx={{
                p: 2,
                bgcolor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2,
                '&:hover': {
                  borderColor: 'rgba(255,0,0,0.3)',
                  bgcolor: 'rgba(255,255,255,0.08)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip
                  label={insight.type}
                  size="small"
                  sx={{
                    bgcolor: `${typeColors[insight.type]}20`,
                    color: typeColors[insight.type],
                    fontSize: '0.7rem',
                    height: 20,
                  }}
                />
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', ml: 'auto' }}>
                  {new Date(insight.timestamp).toLocaleTimeString()}
                </Typography>
              </Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                {insight.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2, fontSize: '0.85rem' }}>
                {insight.description}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                  Confidence: {Math.round(insight.confidence * 100)}%
                </Typography>
                <Button
                  size="small"
                  sx={{
                    textTransform: 'none',
                    color: '#ff0000',
                    fontSize: '0.75rem',
                    '&:hover': {
                      bgcolor: 'rgba(255,0,0,0.1)',
                    },
                  }}
                >
                  {insight.action} →
                </Button>
              </Box>
            </Paper>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
}

