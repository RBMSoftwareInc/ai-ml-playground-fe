'use client';

import React from 'react';
import { Box, IconButton, MenuItem, Select, Typography } from '@mui/material';
import BorderStyleIcon from '@mui/icons-material/BorderStyle';
import DownloadIcon from '@mui/icons-material/Download';

type Props = {
  selectedSize: string;
  setSelectedSize: (val: string) => void;
  zoom: number;
  setZoom: (val: number) => void;
  showGrid: boolean;
  setShowGrid: (val: boolean) => void;
  exportLayout: () => void;
};

const dimensions = ['1366x768', '1440x900', '1920x1080'];

export default function Toolbar({
  selectedSize,
  setSelectedSize,
  zoom,
  setZoom,
  showGrid,
  setShowGrid,
  exportLayout
}: Props) {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
      <Typography fontWeight={600}>🛠 Canvas Controls</Typography>
      <Box display="flex" gap={2}>
        <Select size="small" value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
          {dimensions.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
        </Select>
        <Select size="small" value={zoom} onChange={(e) => setZoom(Number(e.target.value))}>
          <MenuItem value={0.5}>50%</MenuItem>
          <MenuItem value={0.75}>75%</MenuItem>
          <MenuItem value={1}>100%</MenuItem>
        </Select>
        <IconButton onClick={() => setShowGrid(!showGrid)}><BorderStyleIcon /></IconButton>
        <IconButton onClick={exportLayout}><DownloadIcon /></IconButton>
      </Box>
    </Box>
  );
}
