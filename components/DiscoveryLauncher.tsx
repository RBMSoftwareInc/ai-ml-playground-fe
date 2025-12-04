'use client';

import { Box, Tooltip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export default function DiscoveryLauncher() {
  const router = useRouter();

  return (
    <Tooltip title="Try a mini AI trick 🎯" arrow placement="left">
      <Box
        onClick={() => router.push('/discovery')}
        sx={{ cursor: 'pointer' }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Box
            sx={{
              position: 'relative',
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff0000 0%, #ff4d4d 50%, #ff0000 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(255,0,0,0.6), 0 0 40px rgba(255,77,77,0.4)',
              border: '2px solid rgba(255,255,255,0.3)',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: -4,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ff0000, #ff4d4d)',
                opacity: 0.5,
                filter: 'blur(8px)',
                zIndex: -1,
              },
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <AutoAwesomeIcon sx={{ color: '#fff', fontSize: 28 }} />
            </motion.div>
          </Box>
        </motion.div>
      </Box>
    </Tooltip>
  );
}

