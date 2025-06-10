import React from 'react';
import { Box, Typography } from '@mui/material';

export const CanvasFooter = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    bgcolor="#f0f0f0"
    px={2}
    py={1}
    borderRadius={1}
    border="1px solid #ccc"
    mt={2}
  >
    <Typography variant="caption">© 2025 your store footer</Typography>
  </Box>
);
