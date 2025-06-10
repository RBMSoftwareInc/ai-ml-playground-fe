'use client';

import React, { useState } from 'react';
import {
  Box, IconButton, TextField, Button, Slide, Typography, styled,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BookmarkIcon from '@mui/icons-material/Bookmark';


// Styled Components for PromptBar
const NotchContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 64, // Adjust for header height (assumed 64px)
  right: theme.spacing(2), // Align with the right edge of the adjusted prompt bar
  zIndex: 1000,
}));

const NotchButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#C0C0C0',
  color: '#616161',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#A9A9A9',
    transform: 'rotate(10deg)',
  },
}));

const PromptContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 112, // Position below header (64px) + notch (48px)
  left: 240, // Start from the right edge of the sidebar
  width: `calc(100% - 250px)`, // Span the remaining width
  backgroundColor: '#FFFFFF',
  padding: theme.spacing(2),
  borderBottom: '1px solid #C0C0C0',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  zIndex: 999,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  backgroundColor: '#F5F5F5',
  borderRadius: theme.shape.borderRadius,
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#C0C0C0',
    },
    '&:hover fieldset': {
      borderColor: '#A9A9A9',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#616161',
    },
  },
  '& .MuiInputBase-input': {
    color: '#616161',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#C0C0C0',
  color: '#FFFFFF',
  textTransform: 'none',
  padding: theme.spacing(1, 2),
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#A9A9A9',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
}));

interface PromptBarProps {
  onPrompt: (text: string) => void;
}

export default function PromptBar({ onPrompt }: PromptBarProps) {
  const [expanded, setExpanded] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleSubmit = () => {
    if (prompt.trim()) {
      onPrompt(prompt);
      setPrompt('');
    }
  };

  return (
    <>
      {/* Paper Notch/Bookmark Icon */}
      <NotchContainer>
        <NotchButton onClick={() => setExpanded(!expanded)}>
          <BookmarkIcon />
        </NotchButton>
      </NotchContainer>

      {/* Prompt Bar with Slide Animation */}
      <Slide direction="down" in={expanded} timeout={600}>
        <PromptContainer>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ color: '#616161', fontWeight: 'bold' }}
          >
            AI Layout Assistant
          </Typography>
          <Box display="flex" gap={1}>
            <StyledTextField
              fullWidth
              placeholder="e.g. Design a minimalist homepage for electronics"
              size="small"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <StyledButton
              variant="contained"
              endIcon={<AutoAwesomeIcon />}
              onClick={handleSubmit}
            >
              Suggest
            </StyledButton>
          </Box>
        </PromptContainer>
      </Slide>
    </>
  );
}