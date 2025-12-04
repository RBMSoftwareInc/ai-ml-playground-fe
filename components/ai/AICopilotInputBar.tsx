'use client';

import { useState, KeyboardEvent } from 'react';
import { Box, IconButton, TextField, alpha } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { motion } from 'framer-motion';

interface AICopilotInputBarProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function AICopilotInputBar({ 
  onSend, 
  disabled = false,
  placeholder = 'Describe your business or ask about problems...'
}: AICopilotInputBarProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{
        position: 'relative',
        p: 2,
        background: 'linear-gradient(135deg, rgba(10,10,10,0.95) 0%, rgba(5,5,5,0.95) 100%)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 1.5,
          maxWidth: '100%',
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 3,
              color: '#fff',
              fontSize: '0.95rem',
              '&:hover': {
                borderColor: 'rgba(255,77,77,0.3)',
              },
              '&.Mui-focused': {
                borderColor: '#ff4d4d',
                boxShadow: '0 0 0 2px rgba(255,77,77,0.1)',
              },
              '& fieldset': {
                border: 'none',
              },
            },
            '& .MuiInputBase-input': {
              color: '#fff',
              '&::placeholder': {
                color: 'rgba(255,255,255,0.4)',
                opacity: 1,
              },
            },
          }}
        />
        <IconButton
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          sx={{
            bgcolor: message.trim() ? '#ff0000' : 'rgba(255,255,255,0.1)',
            color: '#fff',
            width: 48,
            height: 48,
            borderRadius: 2,
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: message.trim() ? '#cc0000' : 'rgba(255,255,255,0.15)',
              transform: 'scale(1.05)',
            },
            '&:disabled': {
              bgcolor: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.3)',
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

