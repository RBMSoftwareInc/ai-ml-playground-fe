'use client';

import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import DiscoveryLauncher from './DiscoveryLauncher';

export default function FloatingDiscoveryLauncher() {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1200,
        display: { xs: 'none', md: 'block' },
      }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5, type: 'spring' }}
      >
        <DiscoveryLauncher />
      </motion.div>
    </Box>
  );
}

