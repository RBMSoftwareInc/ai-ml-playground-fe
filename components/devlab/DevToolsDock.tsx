'use client';

import { Box, Tooltip, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const languages = [
  { id: 'java', label: 'Java', icon: '☕' },
  { id: 'python', label: 'Python', icon: '🐍' },
  { id: 'go', label: 'Go', icon: '🐹' },
  { id: 'node', label: 'Node', icon: '📦' },
  { id: 'sql', label: 'SQL', icon: '🗄️' },
  { id: 'docker', label: 'Docker', icon: '🐳' },
  { id: 'kubernetes', label: 'K8s', icon: '☸️' },
];

export default function DevToolsDock() {
  const router = useRouter();

  const handleLanguageClick = (langId: string) => {
    router.push(`/devlab/sandbox?lang=${langId}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        p: 2,
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        overflowX: 'auto',
      }}
    >
      {languages.map((lang) => (
        <Tooltip key={lang.id} title={lang.label} arrow>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton
              onClick={() => handleLanguageClick(lang.id)}
              sx={{
                width: 48,
                height: 48,
                bgcolor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '1.5rem',
                '&:hover': {
                  bgcolor: 'rgba(255,0,0,0.1)',
                  borderColor: '#ff0000',
                },
              }}
            >
              {lang.icon}
            </IconButton>
          </motion.div>
        </Tooltip>
      ))}
    </Box>
  );
}

