'use client';

import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CodeIcon from '@mui/icons-material/Code';
import LinkIcon from '@mui/icons-material/Link';

interface UploadAreaProps {
  onUpload: () => void;
}

export default function UploadArea({ onUpload }: UploadAreaProps) {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 600,
        p: 4,
        border: '2px dashed rgba(255,255,255,0.2)',
        borderRadius: 3,
        textAlign: 'center',
        bgcolor: 'rgba(255,255,255,0.02)',
        cursor: 'pointer',
        '&:hover': {
          borderColor: '#ff0000',
          bgcolor: 'rgba(255,0,0,0.05)',
        },
      }}
      onClick={onUpload}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <CloudUploadIcon sx={{ fontSize: 64, color: 'rgba(255,255,255,0.4)', mb: 2 }} />
      </motion.div>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
        Upload Project
      </Typography>
      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
        Drag and drop a ZIP file, paste code, or enter a repository URL
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          startIcon={<CloudUploadIcon />}
          sx={{
            textTransform: 'none',
            color: 'rgba(255,255,255,0.8)',
            border: '1px solid rgba(255,255,255,0.2)',
            '&:hover': {
              bgcolor: 'rgba(255,0,0,0.1)',
              borderColor: '#ff0000',
            },
          }}
        >
          Upload ZIP
        </Button>
        <Button
          startIcon={<CodeIcon />}
          sx={{
            textTransform: 'none',
            color: 'rgba(255,255,255,0.8)',
            border: '1px solid rgba(255,255,255,0.2)',
            '&:hover': {
              bgcolor: 'rgba(255,0,0,0.1)',
              borderColor: '#ff0000',
            },
          }}
        >
          Paste Code
        </Button>
        <Button
          startIcon={<LinkIcon />}
          sx={{
            textTransform: 'none',
            color: 'rgba(255,255,255,0.8)',
            border: '1px solid rgba(255,255,255,0.2)',
            '&:hover': {
              bgcolor: 'rgba(255,0,0,0.1)',
              borderColor: '#ff0000',
            },
          }}
        >
          Repo URL
        </Button>
      </Box>
      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', mt: 2, display: 'block' }}>
        TODO (Phase 2): Implement real file upload and parsing
      </Typography>
    </Box>
  );
}

