'use client';

import { Box, Typography } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';

interface MonacoPlaceholderProps {
  language?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function MonacoPlaceholder({ language = 'javascript', value = '', onChange }: MonacoPlaceholderProps) {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: '#1e1e1e',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Box sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
        <CodeIcon sx={{ fontSize: 48, mb: 2, opacity: 0.3 }} />
        <Typography variant="body2" sx={{ mb: 1 }}>
          Monaco Editor Placeholder
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>
          TODO (Phase 2): Integrate Monaco Editor
        </Typography>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', display: 'block', mt: 1 }}>
          Language: {language}
        </Typography>
        {value && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: 'rgba(0,0,0,0.3)',
              borderRadius: 1,
              maxWidth: 400,
              mx: 'auto',
            }}
          >
            <Typography
              variant="caption"
              component="pre"
              sx={{
                textAlign: 'left',
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.6)',
                whiteSpace: 'pre-wrap',
              }}
            >
              {value.substring(0, 200)}
              {value.length > 200 ? '...' : ''}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

