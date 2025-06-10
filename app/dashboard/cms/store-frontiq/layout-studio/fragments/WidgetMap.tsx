// fragments/WidgetMap.tsx
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function WidgetMap({ type }: { type: string }) {
  return (
    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5' }}>
      <Typography variant="body2" fontWeight="bold">{type}</Typography>
    </Paper>
  );
}
