import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const GridOverlayStyled = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundImage: 'linear-gradient(to right, #ddd 1px, transparent 1px), linear-gradient(to bottom, #ddd 1px, transparent 1px)',
  backgroundSize: '20px 20px',
  pointerEvents: 'none',
  opacity: 0.3,
}));

const GridOverlay: React.FC = () => {
  return <GridOverlayStyled />;
};

export default GridOverlay;