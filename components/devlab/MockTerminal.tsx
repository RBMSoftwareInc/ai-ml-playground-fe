'use client';

import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface TerminalOutput {
  exitCode: number;
  stdout: string;
  stderr: string;
  runtime: string;
  memory: string;
}

interface MockTerminalProps {
  output: TerminalOutput | null;
  loading?: boolean;
}

export default function MockTerminal({ output, loading }: MockTerminalProps) {
  return (
    <Box
      sx={{
        height: '100%',
        bgcolor: '#000',
        color: '#0f0',
        fontFamily: '"Courier New", monospace',
        fontSize: '0.85rem',
        p: 2,
        overflow: 'auto',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {loading ? (
        <Typography sx={{ color: 'rgba(0,255,0,0.5)' }}>Running...</Typography>
      ) : output ? (
        <Box>
          {output.stderr && (
            <Box sx={{ color: '#f00', mb: 1 }}>
              <Typography component="pre" sx={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {output.stderr}
              </Typography>
            </Box>
          )}
          {output.stdout && (
            <Box sx={{ color: '#0f0', mb: 1 }}>
              <Typography component="pre" sx={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {output.stdout}
              </Typography>
            </Box>
          )}
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography sx={{ color: 'rgba(0,255,0,0.7)', fontSize: '0.75rem' }}>
              Exit code: {output.exitCode} | Runtime: {output.runtime} | Memory: {output.memory}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Typography sx={{ color: 'rgba(0,255,0,0.3)' }}>
          Terminal ready. Run code to see output.
        </Typography>
      )}
    </Box>
  );
}

