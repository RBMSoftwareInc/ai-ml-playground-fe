import React from 'react';
import { Box, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

const footerHeight = 40;

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: grey[200],
        textAlign: 'center',
        py: 1,
        borderTop: '1px solid #d1d5db',
        fontSize: '0.75rem',
        color: grey[600],
        height: footerHeight,
      }}
    >
      © 2025 RBM .comIQ Studio. All rights reserved.
    </Box>
  );
}