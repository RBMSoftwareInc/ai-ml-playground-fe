'use client';

import { Box, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import CodeIcon from '@mui/icons-material/Code';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import ApiIcon from '@mui/icons-material/Api';
import BuildIcon from '@mui/icons-material/Build';
import SecurityIcon from '@mui/icons-material/Security';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const actions = [
  { id: 'sandbox', label: 'Open Sandbox', icon: CodeIcon, route: '/devlab/sandbox', shortcut: 'Ctrl+S' },
  { id: 'reverse', label: 'Reverse Engineer', icon: ArchitectureIcon, route: '/devlab/reverse', shortcut: 'Ctrl+R' },
  { id: 'analyze', label: 'Analyze Architecture', icon: ArchitectureIcon, route: '/devlab/reverse', shortcut: 'Ctrl+A' },
  { id: 'api', label: 'Generate API', icon: ApiIcon, route: '/devlab/api', shortcut: 'Ctrl+G' },
  { id: 'refactor', label: 'Refactor', icon: BuildIcon, route: '/devlab/sandbox', shortcut: 'Ctrl+F' },
  { id: 'security', label: 'Security Scan', icon: SecurityIcon, route: '/devlab/reverse', shortcut: 'Ctrl+Shift+S' },
  { id: 'test', label: 'Run Tests', icon: PlayArrowIcon, route: '/devlab/testing', shortcut: 'Ctrl+T' },
];

export default function QuickActionsBar() {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        p: 2,
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          height: '4px',
        },
      }}
    >
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <motion.div key={action.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => router.push(action.route)}
              startIcon={<Icon />}
              sx={{
                bgcolor: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 2,
                px: 2,
                py: 1,
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                '&:hover': {
                  bgcolor: 'rgba(255,0,0,0.1)',
                  borderColor: '#ff0000',
                  color: '#ff0000',
                },
              }}
              title={`${action.label} (${action.shortcut})`}
            >
              {action.label}
            </Button>
          </motion.div>
        );
      })}
    </Box>
  );
}

