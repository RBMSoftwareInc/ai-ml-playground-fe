import React from 'react';
import { Box, Typography } from '@mui/material';

export default function LayoutPreview({ structure }) {
  return (
    <Box sx={{ width: '100%', height: 80, bgcolor: '#e0e0e0', borderRadius: 1, p: 1 }}>
      {structure.map((row, rowIdx) => (
        <Box key={rowIdx} display="flex" mb={0.5}>
          {row.columns.map((col, colIdx) => (
            <Box
              key={colIdx}
              sx={{
                flex: col / 100,
                height: 30,
                bgcolor: '#90caf9',
                borderRadius: 1,
                mr: colIdx < row.columns.length - 1 ? 0.5 : 0,
              }}
            >
              <Typography variant="caption" color="white" align="center" lineHeight="30px">
                {col}%
              </Typography>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}