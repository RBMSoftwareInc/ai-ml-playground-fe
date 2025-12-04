'use client';

import { useEffect, useRef } from 'react';
import { Box, Avatar, Typography, Chip, alpha } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  actions?: Array<{ label: string; action: () => void }>;
}

interface AICopilotChatProps {
  messages: ChatMessage[];
  isTyping?: boolean;
  onQuickAction?: (action: string) => void;
}

export default function AICopilotChat({ messages, isTyping = false, onQuickAction }: AICopilotChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(10,10,10,0.9) 100%)',
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 3,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255,77,77,0.3)',
            borderRadius: '3px',
          },
        }}
      >
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  mb: 3,
                  flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: message.role === 'user' 
                      ? 'rgba(255,77,77,0.2)' 
                      : 'rgba(255,0,0,0.2)',
                    border: `2px solid ${message.role === 'user' ? 'rgba(255,77,77,0.5)' : 'rgba(255,0,0,0.5)'}`,
                    width: 40,
                    height: 40,
                  }}
                >
                  {message.role === 'user' ? (
                    <PersonIcon sx={{ color: '#ff4d4d' }} />
                  ) : (
                    <SmartToyIcon sx={{ color: '#ff0000' }} />
                  )}
                </Avatar>

                <Box
                  sx={{
                    flex: 1,
                    maxWidth: '75%',
                  }}
                >
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 3,
                      background: message.role === 'user'
                        ? 'linear-gradient(135deg, rgba(255,77,77,0.15) 0%, rgba(255,0,0,0.1) 100%)'
                        : 'linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(10,10,10,0.95) 100%)',
                      border: `1px solid ${message.role === 'user' 
                        ? 'rgba(255,77,77,0.3)' 
                        : 'rgba(255,0,0,0.3)'}`,
                      backdropFilter: 'blur(10px)',
                      position: 'relative',
                      '&::before': message.role === 'assistant' ? {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent, #ff0000, transparent)',
                        opacity: 0.5,
                      } : {},
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#fff',
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                        '& strong': {
                          color: '#ff4d4d',
                          fontWeight: 600,
                        },
                      }}
                    >
                      {message.content}
                    </Typography>
                  </Box>

                  {message.actions && message.actions.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                      {message.actions.map((action, idx) => (
                        <Chip
                          key={idx}
                          label={action.label}
                          onClick={action.action}
                          sx={{
                            bgcolor: alpha('#ff4d4d', 0.15),
                            color: '#ff4d4d',
                            border: '1px solid rgba(255,77,77,0.3)',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            '&:hover': {
                              bgcolor: alpha('#ff4d4d', 0.25),
                              borderColor: 'rgba(255,77,77,0.5)',
                            },
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Avatar
                sx={{
                  bgcolor: 'rgba(255,0,0,0.2)',
                  border: '2px solid rgba(255,0,0,0.5)',
                  width: 40,
                  height: 40,
                }}
              >
                <SmartToyIcon sx={{ color: '#ff0000' }} />
              </Avatar>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(10,10,10,0.95) 100%)',
                  border: '1px solid rgba(255,0,0,0.3)',
                }}
              >
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -8, 0],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: '#ff4d4d',
                        }}
                      />
                    </motion.div>
                  ))}
                </Box>
              </Box>
            </Box>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </Box>
    </Box>
  );
}

