'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Typography, TextField, Button, Paper, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { getDiscoveryTool, DiscoveryTool } from '../../../lib/discoveryLoader';
import { motion, AnimatePresence } from 'framer-motion';
import ShareIcon from '@mui/icons-material/Share';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function DiscoveryToolPage() {
  const params = useParams();
  const router = useRouter();
  const toolId = params.tool as string;

  const [tool, setTool] = useState<DiscoveryTool | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadedTool = getDiscoveryTool(toolId);
    setTool(loadedTool);
  }, [toolId]);

  const handleSubmit = async () => {
    if (!tool || !inputValue.trim()) return;

    setLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Mock results based on tool type
      let mockResult: any = {};
      
      switch (tool.metadata.id) {
        case 'bill-negotiator':
          const amount = parseFloat(inputValue.replace(/[₹,]/g, ''));
          const savings = Math.floor(amount * 0.15);
          mockResult = {
            savings: savings,
            script: `Hi, I've been a loyal customer for [X] years and I'm considering switching providers due to pricing. I've received an offer of ₹${amount - savings} from a competitor. Is there anything you can do to help me stay?`,
          };
          break;
        case 'website-speed':
          mockResult = {
            score: Math.floor(Math.random() * 30) + 70,
            tips: [
              'Optimize images (save ~2s)',
              'Enable browser caching (save ~1s)',
              'Minify CSS/JS (save ~0.5s)',
            ],
          };
          break;
        case 'career-automation':
          mockResult = {
            percentage: Math.floor(Math.random() * 40) + 30,
            tips: [
              'Focus on creative problem-solving',
              'Develop AI collaboration skills',
              'Embrace continuous learning',
            ],
          };
          break;
        case 'city-risk':
          mockResult = {
            level: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
            heatmap: {
              cyber: Math.floor(Math.random() * 100),
              physical: Math.floor(Math.random() * 100),
            },
          };
          break;
        case 'idea-booster':
          mockResult = {
            ideas: [
              `AI-powered solution for ${inputValue}`,
              `Mobile app that addresses ${inputValue}`,
              `Platform connecting users with ${inputValue}`,
            ],
          };
          break;
        case 'color-predictor':
          mockResult = {
            vibe: ['Bold & Energetic', 'Calm & Professional', 'Creative & Playful'][Math.floor(Math.random() * 3)],
            palette: ['#ff0000', '#ff4d4d', '#ff8a8a'],
          };
          break;
      }

      setResult(mockResult);
      setLoading(false);
    }, 1500);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/discovery/${toolId}`;
    navigator.clipboard.writeText(url);
    // Could show a toast notification here
  };

  if (!tool) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%)',
        }}
      >
        <Typography sx={{ color: '#fff' }}>Tool not found</Typography>
      </Box>
    );
  }

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
          maxWidth: '800px',
          mx: 'auto',
          px: { xs: 2, md: 4 },
          py: 6,
          width: '100%',
        }}
      >
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/discovery')}
          sx={{
            color: 'rgba(255,255,255,0.7)',
            mb: 3,
            textTransform: 'none',
            '&:hover': {
              color: '#ff4d4d',
            },
          }}
        >
          Back to Discovery
        </Button>

        {/* Tool Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 3,
                bgcolor: 'rgba(255,77,77,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(255,77,77,0.3)',
                fontSize: '2.5rem',
              }}
            >
              {tool.metadata.icon}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  color: '#fff',
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                {tool.metadata.name}
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                {tool.metadata.description}
              </Typography>
            </Box>
            <IconButton
              onClick={handleShare}
              sx={{
                color: 'rgba(255,255,255,0.7)',
                '&:hover': {
                  color: '#ff4d4d',
                },
              }}
            >
              <ShareIcon />
            </IconButton>
          </Box>
        </motion.div>

        {/* Interaction Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Paper
            sx={{
              p: 4,
              bgcolor: 'rgba(255,255,255,0.05)',
              border: '2px solid rgba(255,255,255,0.1)',
              borderRadius: 3,
              mb: 4,
            }}
          >
            {tool.interaction.type === 'input' && (
              <TextField
                fullWidth
                label={tool.interaction.label}
                placeholder={tool.interaction.placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff4d4d',
                    },
                  },
                }}
              />
            )}

            {tool.interaction.type === 'textarea' && (
              <TextField
                fullWidth
                multiline
                rows={4}
                label={tool.interaction.label}
                placeholder={tool.interaction.placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                  },
                }}
              />
            )}

            {tool.interaction.type === 'select' && (
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  {tool.interaction.label}
                </InputLabel>
                <Select
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  sx={{
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#ff4d4d',
                    },
                  }}
                >
                  {tool.interaction.options?.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!inputValue.trim() || loading}
              variant="contained"
              fullWidth
              sx={{
                bgcolor: '#ff0000',
                color: '#fff',
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                '&:hover': {
                  bgcolor: '#cc0000',
                },
                '&:disabled': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.3)',
                },
              }}
            >
              {loading ? 'Processing...' : 'Generate Result'}
            </Button>
          </Paper>
        </motion.div>

        {/* Result Display */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Paper
                sx={{
                  p: 4,
                  bgcolor: 'rgba(255,77,77,0.1)',
                  border: '2px solid rgba(255,77,77,0.3)',
                  borderRadius: 3,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    color: '#ff4d4d',
                    fontWeight: 600,
                    mb: 3,
                  }}
                >
                  {tool.surprise.message.replace(/{[^}]+}/g, (match) => {
                    const key = match.slice(1, -1);
                    return result[key]?.toString() || match;
                  })}
                </Typography>

                {/* Render result based on tool type */}
                {tool.metadata.id === 'bill-negotiator' && result.script && (
                  <Box>
                    <Typography sx={{ color: '#fff', mb: 2, fontWeight: 600 }}>
                      Your Negotiation Script:
                    </Typography>
                    <Typography
                      sx={{
                        color: 'rgba(255,255,255,0.9)',
                        p: 2,
                        bgcolor: 'rgba(0,0,0,0.3)',
                        borderRadius: 2,
                        lineHeight: 1.8,
                      }}
                    >
                      {result.script}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#ff4d4d',
                        mt: 2,
                        fontWeight: 600,
                      }}
                    >
                      Potential Savings: ₹{result.savings?.toLocaleString()}
                    </Typography>
                  </Box>
                )}

                {tool.metadata.id === 'website-speed' && result.score && (
                  <Box>
                    <Box
                      sx={{
                        width: 120,
                        height: 120,
                        borderRadius: '50%',
                        border: '8px solid',
                        borderColor: result.score >= 80 ? '#4caf50' : result.score >= 60 ? '#ff9800' : '#f44336',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                      }}
                    >
                      <Typography
                        variant="h3"
                        sx={{
                          color: '#fff',
                          fontWeight: 700,
                        }}
                      >
                        {result.score}
                      </Typography>
                    </Box>
                    <Typography sx={{ color: '#fff', mb: 2, fontWeight: 600 }}>
                      Improvement Tips:
                    </Typography>
                    {result.tips?.map((tip: string, idx: number) => (
                      <Typography key={idx} sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                        • {tip}
                      </Typography>
                    ))}
                  </Box>
                )}

                {tool.metadata.id === 'career-automation' && result.percentage && (
                  <Box>
                    <Box
                      sx={{
                        width: '100%',
                        height: 40,
                        bgcolor: 'rgba(0,0,0,0.3)',
                        borderRadius: 2,
                        position: 'relative',
                        overflow: 'hidden',
                        mb: 3,
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.percentage}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{
                          height: '100%',
                          background: 'linear-gradient(90deg, #ff0000, #ff4d4d)',
                          borderRadius: 2,
                        }}
                      />
                      <Typography
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          color: '#fff',
                          fontWeight: 600,
                        }}
                      >
                        {result.percentage}%
                      </Typography>
                    </Box>
                    <Typography sx={{ color: '#fff', mb: 2, fontWeight: 600 }}>
                      Career Tips:
                    </Typography>
                    {result.tips?.map((tip: string, idx: number) => (
                      <Typography key={idx} sx={{ color: 'rgba(255,255,255,0.8)', mb: 1 }}>
                        • {tip}
                      </Typography>
                    ))}
                  </Box>
                )}

                {tool.metadata.id === 'city-risk' && result.level && (
                  <Box>
                    <Typography
                      sx={{
                        color: result.level === 'Low' ? '#4caf50' : result.level === 'Medium' ? '#ff9800' : '#f44336',
                        fontSize: '2rem',
                        fontWeight: 700,
                        mb: 3,
                        textAlign: 'center',
                      }}
                    >
                      {result.level} Risk
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
                          Cyber Risk
                        </Typography>
                        <Typography sx={{ color: '#fff', fontSize: '1.5rem', fontWeight: 600 }}>
                          {result.heatmap?.cyber}%
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
                          Physical Risk
                        </Typography>
                        <Typography sx={{ color: '#fff', fontSize: '1.5rem', fontWeight: 600 }}>
                          {result.heatmap?.physical}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}

                {tool.metadata.id === 'idea-booster' && result.ideas && (
                  <Box>
                    {result.ideas.map((idea: string, idx: number) => (
                      <Paper
                        key={idx}
                        sx={{
                          p: 2,
                          mb: 2,
                          bgcolor: 'rgba(0,0,0,0.3)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 2,
                        }}
                      >
                        <Typography sx={{ color: '#fff', fontWeight: 500 }}>
                          💡 {idea}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                )}

                {tool.metadata.id === 'color-predictor' && result.vibe && (
                  <Box>
                    <Typography
                      sx={{
                        color: '#ff4d4d',
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        mb: 3,
                        textAlign: 'center',
                      }}
                    >
                      {result.vibe}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                      {result.palette?.map((color: string, idx: number) => (
                        <Box
                          key={idx}
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 2,
                            bgcolor: color,
                            border: '2px solid rgba(255,255,255,0.3)',
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>

      <Footer variant="simple" />
    </Box>
  );
}

