'use client';

import { useState } from 'react';
import { Box, Typography, Button, TextField, Paper, Chip, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import SendIcon from '@mui/icons-material/Send';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
import { useDevLabState } from '../../hooks/useDevLabState';

export default function DevCompanionPanel() {
  const { session } = useDevLabState();
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages((prev) => [...prev, { role: 'user', content: input }]);
    
    // Mock AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `I understand you're asking about "${input}". Here's a suggestion based on your code context.`,
        },
      ]);
    }, 500);
    
    setInput('');
  };

  // Mock context data
  const contextData = {
    functions: ['getUserById', 'createUser', 'updateUser'],
    todos: ['Add error handling', 'Implement caching', 'Write tests'],
    complexity: 'Medium (Cyclomatic: 8)',
    recommendations: [
      'Consider extracting authentication logic',
      'Add input validation',
      'Optimize database queries',
    ],
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
      {/* Context Info */}
      {session.activeFile && (
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1, display: 'block' }}>
            Active File
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 2 }}>
            {session.activeFile}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                Functions
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                {contextData.functions.map((fn) => (
                  <Chip key={fn} label={fn} size="small" sx={{ fontSize: '0.7rem', height: 20 }} />
                ))}
              </Box>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                Complexity
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {contextData.complexity}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Quick Actions */}
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1, display: 'block' }}>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            size="small"
            startIcon={<CodeIcon />}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              color: 'rgba(255,255,255,0.9)',
              bgcolor: 'rgba(255,255,255,0.05)',
              '&:hover': {
                bgcolor: 'rgba(255,0,0,0.1)',
                color: '#ff0000',
              },
            }}
          >
            Explain Code
          </Button>
          <Button
            size="small"
            startIcon={<BugReportIcon />}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              color: 'rgba(255,255,255,0.9)',
              bgcolor: 'rgba(255,255,255,0.05)',
              '&:hover': {
                bgcolor: 'rgba(255,0,0,0.1)',
                color: '#ff0000',
              },
            }}
          >
            Suggest Fix
          </Button>
        </Box>
      </Box>

      {/* Recommendations */}
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)', flex: 1, overflow: 'auto' }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1, display: 'block' }}>
          Recommendations
        </Typography>
        <List dense>
          {contextData.recommendations.map((rec, idx) => (
            <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
              <ListItemText
                primary={rec}
                primaryTypographyProps={{
                  variant: 'body2',
                  sx: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)' },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Chat Input */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Ask Dev Companion..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: '#fff',
              bgcolor: 'rgba(255,255,255,0.05)',
              '& fieldset': {
                borderColor: 'rgba(255,255,255,0.1)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255,255,255,0.2)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#ff0000',
              },
            },
          }}
          InputProps={{
            endAdornment: (
              <IconButton size="small" onClick={handleSend} sx={{ color: '#ff0000' }}>
                <SendIcon fontSize="small" />
              </IconButton>
            ),
          }}
        />
      </Box>
    </Box>
  );
}

