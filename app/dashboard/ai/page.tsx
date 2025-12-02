'use client';

import { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import BoltIcon from '@mui/icons-material/Bolt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ShieldIcon from '@mui/icons-material/Shield';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import { useRouter } from 'next/navigation';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  pending?: boolean;
  error?: boolean;
};

const AI_ENDPOINT = process.env.NEXT_PUBLIC_QA_AI_ENDPOINT;

const suggestionPrompts = [
  'Give me a GTM plan for launching a premium athleisure line in Q2.',
  'Which AI use-cases should I prioritize for logistics this quarter?',
  'Summarize customer complaints around payment failures in under 200 chars.',
  'Draft a personalized email to win back lapsed high-value shoppers.'
];

const insightHighlights = [
  { label: 'Live Signals', value: '24', icon: <BoltIcon fontSize="small" /> },
  { label: 'Playbooks Ready', value: '11', icon: <AutoAwesomeIcon fontSize="small" /> },
  { label: 'Data Sources', value: '08', icon: <ShieldIcon fontSize="small" /> },
  { label: 'Experiments', value: '05', icon: <TroubleshootIcon fontSize="small" /> }
];

const initialAssistantMessage: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Welcome to RBM's AI mission control. Drop a prompt and I'll stitch together insights, playbooks, and experiments across your commerce stack."
};

const randomId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

const mockInsights = [
  'Demand is peaking for premium basics in West Coast metros; consider accelerating the drop window.',
  'Logistics interruptions are tied to two carriers — rerouting through the Mumbai hub trims ETA variance by 18%.',
  'Retention uplift is highest when journeys mix price anchoring with concierge chat for high-value cohorts.',
];

async function fetchAssistantResponse(prompt: string) {
  if (!AI_ENDPOINT) {
    return generateMockResponse(prompt);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`AI endpoint failed with ${response.status}`);
    }

    const data = await response.json();
    return (
      data?.answer ||
      data?.response ||
      data?.message ||
      'I processed your request, but the backend did not return a message.'
    );
  } catch (error) {
    console.error('AI chat error', error);
    return generateMockResponse(prompt, true);
  } finally {
    clearTimeout(timeoutId);
  }
}

function generateMockResponse(prompt: string, isFallback = false) {
  const base = mockInsights[Math.floor(Math.random() * mockInsights.length)];
  const fallbackNote = isFallback
    ? '\n\n(Realtime endpoint not reachable — responding with RBM knowledge base.)'
    : '';

  if (prompt.toLowerCase().includes('plan')) {
    return `Here is the blueprint:\n• Frame the objective in terms of revenue + experience lift.\n• Map data sources and the ML asset to reuse.\n• Sequence launch into 14-day sprints with signal checks at T+3, T+7, T+14.\n\n${base}${fallbackNote}`;
  }

  if (prompt.toLowerCase().includes('summarize') || prompt.toLowerCase().includes('summary')) {
    return `Summary → ${base.split('.')[0]}.\nSignal strength: High confidence based on fresh telemetry.${fallbackNote}`;
  }

  return `${base}${fallbackNote}`;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([initialAssistantMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handlePromptSend = async (value?: string) => {
    const prompt = (value ?? input).trim();
    if (!prompt) return;

    const userMessage: Message = { id: randomId(), role: 'user', content: prompt };
    const placeholderId = randomId();

    setMessages(prev => [...prev, userMessage, { id: placeholderId, role: 'assistant', content: '', pending: true }]);
    setInput('');
    setError(null);
    setIsLoading(true);

    const response = await fetchAssistantResponse(prompt);

    setMessages(prev =>
      prev.map(message =>
        message.id === placeholderId
          ? { ...message, content: response, pending: false, error: !response }
          : message
      )
    );

    setIsLoading(false);
  };

  const canSubmit = input.trim().length > 0 && !isLoading;

  const gradientBorder = useMemo(
    () => ({
      border: '1px solid rgba(255,255,255,0.08)',
      background: 'linear-gradient(135deg, rgba(12,12,12,0.85), rgba(20,20,20,0.95))',
      boxShadow: '0 20px 45px rgba(0,0,0,0.55)',
    }),
    []
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#050505',
        backgroundImage:
          'radial-gradient(circle at 20% 20%, rgba(255,0,0,0.15), transparent 45%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.06), transparent 35%)',
        color: '#fff',
        py: 6,
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={4}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => router.push('/dashboard/conventional')}
              sx={{
                borderColor: 'rgba(255,255,255,0.35)',
                color: '#fff',
                borderRadius: 3,
                px: 3,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#ff1f3d',
                  color: '#ff9aa8',
                },
              }}
            >
              Switch to Conventional Mode
            </Button>
          </Box>
          <Box>
            <Typography
              variant="overline"
              sx={{ letterSpacing: '0.4em', color: 'rgba(255,255,255,0.6)' }}
            >
              RBM AI CONTROL
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 1,
                letterSpacing: '-0.03em',
                textShadow: '0 8px 25px rgba(0,0,0,0.45)',
              }}
            >
              Commerce-grade AI copilot
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.75)', maxWidth: 620 }}>
              Ask follow-up questions, stitch playbooks, or debug signals. This workspace mirrors the
              qa.rbmsoft.com experience inside the dashboard so you never leave the command center.
            </Typography>
          </Box>

          <GridLayout gradientBorder={gradientBorder} onSuggestionClick={handlePromptSend} />

          <Paper
            sx={{
              ...gradientBorder,
              minHeight: '60vh',
              borderRadius: 4,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                opacity: 0.5,
                background:
                  'radial-gradient(circle at top, rgba(255,0,0,0.12), transparent 55%), linear-gradient(180deg, rgba(255,255,255,0.02), transparent)',
              }}
            />

            <Box
              sx={{
                position: 'relative',
                flex: 1,
                overflowY: 'auto',
                p: { xs: 3, md: 5 },
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              {messages.map(message => (
                <MessageBubble key={message.id} message={message} />
              ))}

              {isLoading && (
                <LinearProgress
                  sx={{
                    height: 2,
                    borderRadius: 999,
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#ff1f3d',
                    },
                  }}
                />
              )}
            </Box>

            <Divider
              sx={{
                borderColor: 'rgba(255,255,255,0.08)',
                position: 'relative',
              }}
            />

            <Box
              sx={{
                position: 'relative',
                p: { xs: 2, md: 3 },
                display: 'flex',
                gap: 2,
                alignItems: 'center',
              }}
            >
              <TextField
                fullWidth
                placeholder="Drop a prompt — e.g. “Compare bundle attach rate between Tier A & Tier B stores”"
                value={input}
                onChange={event => setInput(event.target.value)}
                onKeyDown={event => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    handlePromptSend();
                  }
                }}
                multiline
                maxRows={4}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    borderRadius: 3,
                    borderColor: 'rgba(255,255,255,0.08)',
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.15)',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#fff',
                  },
                }}
              />
              <IconButton
                color="primary"
                onClick={() => handlePromptSend()}
                disabled={!canSubmit}
                sx={{
                  bgcolor: canSubmit ? '#ff1f3d' : 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  borderRadius: 2,
                  width: 56,
                  height: 56,
                  '&:hover': {
                    bgcolor: '#ff4052',
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Paper>

          {error && (
            <Typography color="error" sx={{ textAlign: 'center' }}>
              {error}
            </Typography>
          )}
        </Stack>
      </Container>
    </Box>
  );
}

function GridLayout({
  gradientBorder,
  onSuggestionClick,
}: {
  gradientBorder: Record<string, any>;
  onSuggestionClick: (prompt: string) => void;
}) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={3}
      sx={{
        '& > *': {
          flex: 1,
        },
      }}
    >
      <Paper
        sx={{
          ...gradientBorder,
          borderRadius: 4,
          p: 3,
        }}
      >
        <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>
          PRE-BUILT PROMPTS
        </Typography>
        <Stack spacing={2}>
          {suggestionPrompts.map(prompt => (
            <Chip
              key={prompt}
              label={prompt}
              onClick={() => onSuggestionClick(prompt)}
              sx={{
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff',
                fontSize: '0.95rem',
                py: 2,
                px: 1,
                textAlign: 'left',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.08)',
                },
              }}
            />
          ))}
        </Stack>
      </Paper>

      <Paper
        sx={{
          ...gradientBorder,
          borderRadius: 4,
          p: 3,
        }}
      >
        <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 2 }}>
          SESSION SNAPSHOT
        </Typography>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            {insightHighlights.map(item => (
              <Paper
                key={item.label}
                sx={{
                  flex: '1 1 140px',
                  p: 2.5,
                  borderRadius: 3,
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.5,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  {item.icon}
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    {item.label}
                  </Typography>
                </Stack>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {item.value}
                </Typography>
              </Paper>
            ))}
          </Stack>

          <Button
            variant="contained"
            color="primary"
            sx={{
              alignSelf: 'flex-start',
              mt: 1,
              borderRadius: 999,
              px: 3,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: '0 10px 35px rgba(255,31,61,0.35)',
            }}
          >
            Sync latest telemetry
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="flex-start"
      sx={{
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}
    >
      <Avatar
        sx={{
          bgcolor: isUser ? '#2a2a2a' : '#ff1f3d',
          width: 40,
          height: 40,
          boxShadow: isUser ? 'none' : '0 10px 30px rgba(255,31,61,0.35)',
        }}
      >
        {isUser ? 'You' : 'AI'}
      </Avatar>

      <Paper
        sx={{
          maxWidth: '75%',
          p: 2.5,
          borderRadius: 3,
          backgroundColor: isUser ? 'rgba(255,255,255,0.05)' : 'rgba(255,31,61,0.08)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: '#fff',
          fontSize: '0.95rem',
          lineHeight: 1.6,
          whiteSpace: 'pre-line',
          position: 'relative',
        }}
      >
        <Typography component="span">{message.content || 'Thinking...'}</Typography>
        {message.pending && (
          <Box
            sx={{
              mt: 1,
              height: 2,
              width: 120,
              background:
                'linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,31,61,0.5), rgba(255,255,255,0.05))',
              animation: 'pulse 1.5s ease-in-out infinite',
              '@keyframes pulse': {
                '0%': { transform: 'translateX(-20%)', opacity: 0.6 },
                '50%': { transform: 'translateX(20%)', opacity: 1 },
                '100%': { transform: 'translateX(-20%)', opacity: 0.6 },
              },
            }}
          />
        )}
      </Paper>
    </Stack>
  );
}

