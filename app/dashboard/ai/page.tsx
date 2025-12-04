'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { aiCatalog, UseCaseCatalogItem, industries } from '../../../data/ai/catalog';
import SendIcon from '@mui/icons-material/Send';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  useCaseId?: string;
}

interface ConversationEvent {
  id: string;
  type: 'industry_selected' | 'use_case_selected' | 'message_sent' | 'suggestion_clicked';
  data: any;
  timestamp: Date;
}

export default function AICopilotPage() {
  const router = useRouter();
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedUseCase, setSelectedUseCase] = useState<UseCaseCatalogItem | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [events, setEvents] = useState<ConversationEvent[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get use cases for selected industry
  const industryUseCases = selectedIndustry
    ? aiCatalog.filter(uc => uc.industry === selectedIndustry)
    : [];

  // Generate suggestions based on context
  useEffect(() => {
    if (selectedIndustry && !selectedUseCase) {
      const industry = industries.find(i => i.id === selectedIndustry);
      const suggestionsList = [
        `Tell me about ${industry?.name} use cases`,
        `What AI solutions are available for ${industry?.name}?`,
        `Show me the best use cases for ${industry?.name}`,
        `I need help with ${industry?.name} challenges`,
      ];
      setSuggestions(suggestionsList);
    } else if (selectedUseCase) {
      const suggestionsList = [
        `Tell me more about ${selectedUseCase.displayName}`,
        `How does ${selectedUseCase.displayName} work?`,
        `What's the ROI for ${selectedUseCase.displayName}?`,
        `Show me a demo of ${selectedUseCase.displayName}`,
      ];
      setSuggestions(suggestionsList);
    } else {
      setSuggestions([
        'I want to explore AI solutions',
        'Show me available industries',
        'What can AI do for my business?',
        'Help me find the right use case',
      ]);
    }
  }, [selectedIndustry, selectedUseCase]);

  const addEvent = (type: ConversationEvent['type'], data: any) => {
    setEvents(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        type,
        data,
        timestamp: new Date(),
      },
    ]);
  };

  const handleIndustrySelect = (industryId: string) => {
    setSelectedIndustry(industryId);
    setSelectedUseCase(null);
    setMessages([]);
    addEvent('industry_selected', { industryId });
    
    const industry = industries.find(i => i.id === industryId);
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Great! I see you're interested in **${industry?.name}**. I have ${industryUseCases.length} AI use cases available for this industry. Would you like to explore them?`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  const handleUseCaseSelect = (useCase: UseCaseCatalogItem) => {
    setSelectedUseCase(useCase);
    addEvent('use_case_selected', { useCaseId: useCase.id });
    
    const useCaseMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Excellent choice! **${useCase.displayName}** is a powerful solution for ${useCase.industry}. ${useCase.shortDescription}\n\nWould you like to:\n• See a live demo\n• Learn about implementation\n• Calculate ROI\n• Explore similar solutions`,
      timestamp: new Date(),
      useCaseId: useCase.id,
    };
    setMessages(prev => [...prev, useCaseMessage]);
  };

  const handleSendMessage = useCallback((message?: string) => {
    const text = message || inputValue.trim();
    if (!text) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    addEvent('message_sent', { message: text });

    // Simulate AI response
    setTimeout(() => {
      let response = '';
      if (text.toLowerCase().includes('demo') || text.toLowerCase().includes('show')) {
        response = `I'd be happy to show you a demo! Let me prepare an interactive experience for **${selectedUseCase?.displayName || 'this solution'}**.`;
      } else if (text.toLowerCase().includes('roi') || text.toLowerCase().includes('return')) {
        response = `Based on industry benchmarks, **${selectedUseCase?.displayName || 'this solution'}** typically delivers:\n• 25-40% revenue increase\n• 4-6 weeks implementation\n• Medium complexity\n\nWould you like to see a detailed ROI calculator?`;
      } else if (text.toLowerCase().includes('implement') || text.toLowerCase().includes('how')) {
        response = `Implementation involves:\n1. Data integration and setup\n2. Model training and validation\n3. Testing and optimization\n4. Deployment and monitoring\n\nWould you like to explore the technical pipeline?`;
      } else {
        response = `I understand you're asking about "${text}". Let me help you with that. Would you like to explore a specific use case or see how this applies to your industry?`;
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        useCaseId: selectedUseCase?.id,
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 800);
  }, [inputValue, selectedUseCase]);

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    addEvent('suggestion_clicked', { suggestion });
    setTimeout(() => handleSendMessage(suggestion), 100);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Get tips and stats for right panel
  const getTips = () => {
    if (selectedUseCase) {
      return [
        `Focus on ${selectedUseCase.displayName} implementation best practices`,
        `Consider data requirements for ${selectedUseCase.category}`,
        `Plan for ${selectedUseCase.industry} specific challenges`,
      ];
    }
    if (selectedIndustry) {
      return [
        `Explore all ${industryUseCases.length} use cases for this industry`,
        `Consider your specific business needs`,
        `Ask about ROI and implementation timelines`,
      ];
    }
    return [
      'Select an industry to get started',
      'Each industry has multiple AI use cases',
      'You can ask questions or explore demos',
    ];
  };

  const getStats = () => {
    return {
      industries: industries.length,
      useCases: aiCatalog.length,
      conversations: events.length,
      selectedIndustry: selectedIndustry || 'None',
      selectedUseCase: selectedUseCase?.displayName || 'None',
    };
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%)',
      }}
    >
      <Header variant="simple" />
      
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          gap: 2,
          px: { xs: 2, md: 4 },
          py: 3,
          pt: { xs: 6, md: 8 }, // Add top padding to account for fixed header
          maxWidth: '1600px',
          mx: 'auto',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Main Content Area (70%) */}
        <Box sx={{ flex: '1 1 70%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Industries Section - Sleek Tiles */}
          {!selectedIndustry && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#fff',
                  fontWeight: 600,
                  mb: 2,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                }}
              >
                Select an Industry
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(2, 1fr)',
                    sm: 'repeat(3, 1fr)',
                    md: 'repeat(4, 1fr)',
                    lg: 'repeat(5, 1fr)',
                  },
                  gap: 1.5,
                  alignItems: 'stretch',
                }}
              >
                {industries.map((industry) => (
                  <motion.div
                    key={industry.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{ height: '100%' }}
                  >
                    <Button
                      onClick={() => handleIndustrySelect(industry.id)}
                      sx={{
                        p: 2,
                        borderRadius: 1.5,
                        bgcolor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff',
                        textTransform: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.5,
                        height: '100%',
                        minHeight: 90,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.08)',
                          borderColor: 'rgba(255,255,255,0.2)',
                        },
                      }}
                    >
                      <Typography sx={{ fontSize: '1.5rem', lineHeight: 1 }}>
                        {industry.icon}
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: '0.85rem',
                          color: 'rgba(255,255,255,0.9)',
                          textAlign: 'center',
                        }}
                      >
                        {industry.name}
                      </Typography>
                    </Button>
                  </motion.div>
                ))}
              </Box>
            </Box>
          )}

          {/* Use Cases Section */}
          <AnimatePresence>
            {selectedIndustry && !selectedUseCase && industryUseCases.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: { xs: '1rem', md: '1.1rem' },
                      }}
                    >
                      Available Use Cases
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedIndustry(null);
                        setMessages([]);
                      }}
                      sx={{
                        color: 'rgba(255,255,255,0.6)',
                        textTransform: 'none',
                        fontSize: '0.85rem',
                      }}
                    >
                      Change Industry
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                      },
                      gap: 1.5,
                    }}
                  >
                    {industryUseCases.map((useCase) => (
                      <motion.div
                        key={useCase.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Paper
                          onClick={() => handleUseCaseSelect(useCase)}
                          sx={{
                            p: 2,
                            bgcolor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 1.5,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              bgcolor: 'rgba(255,255,255,0.08)',
                              borderColor: 'rgba(255,255,255,0.2)',
                            },
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              color: '#fff',
                              fontWeight: 600,
                              mb: 0.5,
                              fontSize: '0.95rem',
                            }}
                          >
                            {useCase.displayName}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: 'rgba(255,255,255,0.6)',
                              fontSize: '0.8rem',
                              lineHeight: 1.4,
                            }}
                          >
                            {useCase.shortDescription}
                          </Typography>
                        </Paper>
                      </motion.div>
                    ))}
                  </Box>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat Conversation Area */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              mb: 2,
            }}
          >
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                mb: 2,
                px: 1,
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(255,255,255,0.05)',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '4px',
                },
              }}
            >
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Paper
                        sx={{
                          p: 2,
                          maxWidth: '75%',
                          bgcolor:
                            message.role === 'user'
                              ? 'rgba(255,77,77,0.15)'
                              : 'rgba(255,255,255,0.05)',
                          border:
                            message.role === 'user'
                              ? '1px solid rgba(255,77,77,0.3)'
                              : '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          sx={{
                            color: '#fff',
                            fontSize: '0.9rem',
                            lineHeight: 1.6,
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {message.content}
                        </Typography>
                      </Paper>
                    </Box>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </Box>

            {/* Suggestions Chips */}
            {suggestions.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {suggestions.map((suggestion, index) => (
                  <Chip
                    key={index}
                    label={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.05)',
                      color: 'rgba(255,255,255,0.8)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                        borderColor: 'rgba(255,255,255,0.2)',
                      },
                    }}
                  />
                ))}
              </Box>
            )}

            {/* Big Text Input Box */}
            <Paper
              sx={{
                p: 2,
                bgcolor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2,
              }}
            >
              <TextField
                inputRef={inputRef}
                fullWidth
                multiline
                maxRows={4}
                placeholder={
                  selectedUseCase
                    ? `Ask about ${selectedUseCase.displayName}...`
                    : selectedIndustry
                    ? 'Select a use case or ask a question...'
                    : 'Select an industry to get started...'
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={!selectedIndustry}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleSendMessage()}
                        disabled={!inputValue.trim() || !selectedIndustry}
                        sx={{
                          color: inputValue.trim() && selectedIndustry ? '#ff4d4d' : 'rgba(255,255,255,0.3)',
                        }}
                      >
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Paper>
          </Box>
        </Box>

        {/* Right Side Panel (30%) - Accordion */}
        <Box
          sx={{
            flex: '0 0 350px',
            display: { xs: 'none', lg: 'flex' },
            flexDirection: 'column',
            gap: 2,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(255,255,255,0.05)',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '4px',
            },
          }}
        >
          {/* Tips Accordion */}
          <Accordion
            defaultExpanded
            sx={{
              bgcolor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
              sx={{ color: '#fff' }}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                💡 Tips & Guidance
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {getTips().map((tip, index) => (
                  <Typography
                    key={index}
                    sx={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.85rem',
                      lineHeight: 1.6,
                    }}
                  >
                    • {tip}
                  </Typography>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Stats Accordion */}
          <Accordion
            sx={{
              bgcolor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
              sx={{ color: '#fff' }}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                📊 Statistics
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {Object.entries(getStats()).map(([key, value]) => (
                  <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography
                      sx={{
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '0.85rem',
                        textTransform: 'capitalize',
                      }}
                    >
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </Typography>
                    <Typography
                      sx={{
                        color: '#fff',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                      }}
                    >
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Pipeline Accordion */}
          <Accordion
            sx={{
              bgcolor: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: '#fff' }} />}
              sx={{ color: '#fff' }}
            >
              <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                🔄 Conversation Pipeline
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {events.length === 0 ? (
                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: '0.85rem',
                      fontStyle: 'italic',
                    }}
                  >
                    No events yet. Start a conversation to see the pipeline.
                  </Typography>
                ) : (
                  events.map((event) => (
                    <Box
                      key={event.id}
                      sx={{
                        p: 1.5,
                        bgcolor: 'rgba(255,255,255,0.03)',
                        borderRadius: 1,
                        border: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      <Typography
                        sx={{
                          color: '#fff',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          mb: 0.5,
                        }}
                      >
                        {event.type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Typography>
                      <Typography
                        sx={{
                          color: 'rgba(255,255,255,0.6)',
                          fontSize: '0.75rem',
                        }}
                      >
                        {typeof event.data === 'object'
                          ? JSON.stringify(event.data, null, 2)
                          : event.data}
                      </Typography>
                      <Typography
                        sx={{
                          color: 'rgba(255,255,255,0.4)',
                          fontSize: '0.7rem',
                          mt: 0.5,
                        }}
                      >
                        {event.timestamp.toLocaleTimeString()}
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>

      <Footer variant="simple" />
    </Box>
  );
}