import React from 'react';
import { Box, Typography } from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';

export const CanvasHeader = () => (
  <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    bgcolor="#f0f0f0"
    px={2}
    py={1}
    borderRadius={1}
    border="1px solid #ccc"
    mb={2}
  >
    <Typography variant="subtitle2" display="flex" alignItems="center">
      <StoreIcon fontSize="small" sx={{ mr: 1 }} /> Your Brand
    </Typography>
    <Typography variant="subtitle2" display="flex" alignItems="center">
      Welcome, Admin <EmojiPeopleIcon fontSize="small" sx={{ ml: 1 }} />
    </Typography>
  </Box>
);