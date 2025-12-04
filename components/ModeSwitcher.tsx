'use client';

import { Box, Button, Tooltip } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import ChatIcon from '@mui/icons-material/Chat';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import HomeIcon from '@mui/icons-material/Home';
import { motion } from 'framer-motion';

export default function ModeSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isConvoMode = pathname?.startsWith('/dashboard/ai');
  const isInteractiveMode = pathname?.startsWith('/interactive-ai');

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        alignItems: 'center',
        bgcolor: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 3,
        p: 0.5,
      }}
    >
      <Tooltip title="Home" arrow>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => router.push('/')}
            sx={{
              minWidth: 40,
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: isHome ? 'rgba(255,77,77,0.2)' : 'transparent',
              color: isHome ? '#ff4d4d' : 'rgba(255,255,255,0.7)',
              border: isHome ? '1px solid #ff4d4d' : '1px solid transparent',
              '&:hover': {
                bgcolor: 'rgba(255,77,77,0.1)',
                borderColor: 'rgba(255,77,77,0.3)',
              },
            }}
          >
            <HomeIcon fontSize="small" />
          </Button>
        </motion.div>
      </Tooltip>

      <Tooltip title="Conversational AI Mode" arrow>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => router.push('/dashboard/ai')}
            sx={{
              minWidth: 40,
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: isConvoMode ? 'rgba(255,77,77,0.2)' : 'transparent',
              color: isConvoMode ? '#ff4d4d' : 'rgba(255,255,255,0.7)',
              border: isConvoMode ? '1px solid #ff4d4d' : '1px solid transparent',
              '&:hover': {
                bgcolor: 'rgba(255,77,77,0.1)',
                borderColor: 'rgba(255,77,77,0.3)',
              },
            }}
          >
            <ChatIcon fontSize="small" />
          </Button>
        </motion.div>
      </Tooltip>

      <Tooltip title="Interactive AI Mode" arrow>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => router.push('/interactive-ai')}
            sx={{
              minWidth: 40,
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: isInteractiveMode ? 'rgba(255,77,77,0.2)' : 'transparent',
              color: isInteractiveMode ? '#ff4d4d' : 'rgba(255,255,255,0.7)',
              border: isInteractiveMode ? '1px solid #ff4d4d' : '1px solid transparent',
              '&:hover': {
                bgcolor: 'rgba(255,77,77,0.1)',
                borderColor: 'rgba(255,77,77,0.3)',
              },
            }}
          >
            <PlayCircleOutlineIcon fontSize="small" />
          </Button>
        </motion.div>
      </Tooltip>
    </Box>
  );
}

