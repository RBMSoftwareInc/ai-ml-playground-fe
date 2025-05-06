// components/forms/GenericTheory.tsx
'use client';
import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface GenericTheoryProps {
  content: ReactNode;
}

export default function GenericTheory({ content }: GenericTheoryProps) {
  return <Box sx={{ mt: 4 }}>{content}</Box>;
}