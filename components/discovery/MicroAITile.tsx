'use client';

import { Box, Typography, Paper, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import ShareIcon from '@mui/icons-material/Share';
import { DiscoveryTool } from '../../lib/discoveryLoader';
import { useRouter } from 'next/navigation';

interface MicroAITileProps {
  tool: DiscoveryTool;
  onShare?: (toolId: string) => void;
}

export default function MicroAITile({ tool, onShare }: MicroAITileProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/discovery/${tool.metadata.id}`);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShare) {
      onShare(tool.metadata.id);
    } else {
      // Default share behavior
      const url = `${window.location.origin}/discovery/${tool.metadata.id}`;
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Paper
        onClick={handleClick}
        sx={{
          p: 3,
          bgcolor: 'rgba(255,255,255,0.05)',
          border: '2px solid rgba(255,255,255,0.1)',
          borderRadius: 3,
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.08)',
            borderColor: 'rgba(255,77,77,0.5)',
            boxShadow: '0 8px 24px rgba(255,77,77,0.3)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #ff0000, #ff4d4d, transparent)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
          '&:hover::before': {
            opacity: 1,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: 'rgba(255,77,77,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(255,77,77,0.3)',
                fontSize: '1.5rem',
              }}
            >
              {tool.metadata.icon}
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  mb: 0.5,
                }}
              >
                {tool.metadata.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.8rem',
                }}
              >
                {tool.metadata.description}
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleShare}
            size="small"
            sx={{
              color: 'rgba(255,255,255,0.6)',
              '&:hover': {
                color: '#ff4d4d',
                bgcolor: 'rgba(255,77,77,0.1)',
              },
            }}
          >
            <ShareIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: 'rgba(255,77,77,0.05)',
            border: '1px solid rgba(255,77,77,0.2)',
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: '#ff4d4d',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            ⚡ 5-20 sec interaction
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );
}

