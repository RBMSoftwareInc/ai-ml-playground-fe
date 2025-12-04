'use client';

import { Box, Button } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import BusinessIcon from '@mui/icons-material/Business';
import ChatIcon from '@mui/icons-material/Chat';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CodeIcon from '@mui/icons-material/Code';
import DiscoveryLauncher from './DiscoveryLauncher';

export default function TopNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isIndustries = pathname?.startsWith('/industries') || pathname === '/';
  const isAIMode = pathname?.startsWith('/dashboard/ai');
  const isInteractive = pathname?.startsWith('/interactive-ai');
  const isDevLab = pathname?.startsWith('/devlab');

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: 2,
        py: 1.5,
        bgcolor: 'rgba(0,0,0,0.8)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Mode Buttons */}
      <Box sx={{ display: 'flex', gap: 1.5, flex: 1 }}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => router.push('/')}
            startIcon={<BusinessIcon />}
            sx={{
              bgcolor: isIndustries ? 'rgba(255,77,77,0.2)' : 'rgba(255,255,255,0.05)',
              color: isIndustries ? '#ff4d4d' : 'rgba(255,255,255,0.7)',
              border: isIndustries ? '1px solid #ff4d4d' : '1px solid rgba(255,255,255,0.1)',
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              '&:hover': {
                bgcolor: 'rgba(255,77,77,0.15)',
                borderColor: 'rgba(255,77,77,0.4)',
              },
            }}
          >
            Industries
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => router.push('/dashboard/ai')}
            startIcon={<ChatIcon />}
            sx={{
              bgcolor: isAIMode ? 'rgba(255,77,77,0.2)' : 'rgba(255,255,255,0.05)',
              color: isAIMode ? '#ff4d4d' : 'rgba(255,255,255,0.7)',
              border: isAIMode ? '1px solid #ff4d4d' : '1px solid rgba(255,255,255,0.1)',
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              '&:hover': {
                bgcolor: 'rgba(255,77,77,0.15)',
                borderColor: 'rgba(255,77,77,0.4)',
              },
            }}
          >
            AI Advisor
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => router.push('/interactive-ai')}
            startIcon={<PlayCircleOutlineIcon />}
            sx={{
              bgcolor: isInteractive ? 'rgba(255,77,77,0.2)' : 'rgba(255,255,255,0.05)',
              color: isInteractive ? '#ff4d4d' : 'rgba(255,255,255,0.7)',
              border: isInteractive ? '1px solid #ff4d4d' : '1px solid rgba(255,255,255,0.1)',
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              '&:hover': {
                bgcolor: 'rgba(255,77,77,0.15)',
                borderColor: 'rgba(255,77,77,0.4)',
              },
            }}
          >
            Interactive
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => router.push('/devlab')}
            startIcon={<CodeIcon />}
            sx={{
              bgcolor: isDevLab ? 'rgba(255,77,77,0.2)' : 'rgba(255,255,255,0.05)',
              color: isDevLab ? '#ff4d4d' : 'rgba(255,255,255,0.7)',
              border: isDevLab ? '1px solid #ff4d4d' : '1px solid rgba(255,255,255,0.1)',
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              '&:hover': {
                bgcolor: 'rgba(255,77,77,0.15)',
                borderColor: 'rgba(255,77,77,0.4)',
              },
            }}
          >
            DevLab
          </Button>
        </motion.div>
      </Box>

      {/* Discovery Launcher */}
      <DiscoveryLauncher />
    </Box>
  );
}

