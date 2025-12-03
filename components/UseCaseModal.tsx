'use client';

import { useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  alpha,
  Backdrop,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import { getUseCase } from '../lib/useCases';

interface UseCaseModalProps {
  open: boolean;
  onClose: () => void;
  useCase: {
    key: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    route: string;
    details?: {
      duration: string;
      difficulty: string;
      benefits: string[];
      howItWorks: string;
      techStack: string[];
    };
  } | null;
  categoryColor: string;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    y: 50,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      staggerChildren: 0.1,
    },
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    y: 30,
    transition: {
      duration: 0.2,
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 },
  },
};

export default function UseCaseModal({
  open,
  onClose,
  useCase,
  categoryColor,
}: UseCaseModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  if (!useCase) return null;

  // Get the use case component
  const useCaseData = getUseCase(useCase.key);
  const UseCaseComponent = useCaseData?.component;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <div onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1300, cursor: 'pointer' }}>
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(8px)',
              }}
            />
          </div>

          {/* Modal */}
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1301,
              p: 2,
              pointerEvents: 'none',
            }}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ pointerEvents: 'auto', width: '100%', maxWidth: '95vw', height: '95vh' }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  maxHeight: '95vh',
                  overflow: 'auto',
                  background: 'linear-gradient(145deg, #1a1a1a 0%, #121212 100%)',
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: alpha(categoryColor, 0.3),
                  boxShadow: `
                    0 25px 80px rgba(0,0,0,0.5),
                    0 0 100px ${alpha(categoryColor, 0.15)},
                    inset 0 1px 0 rgba(255,255,255,0.05)
                  `,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: alpha(categoryColor, 0.3),
                    borderRadius: '3px',
                  },
                }}
              >
                {/* Glow effect */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -100,
                    right: -100,
                    width: 300,
                    height: 300,
                    background: `radial-gradient(circle, ${alpha(categoryColor, 0.2)} 0%, transparent 70%)`,
                    filter: 'blur(60px)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Close button */}
                <IconButton
                  onClick={onClose}
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    color: 'rgba(255,255,255,0.6)',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    zIndex: 10,
                    '&:hover': {
                      background: 'rgba(255,255,255,0.1)',
                      color: '#fff',
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>

                {/* Header Section */}
                <Box sx={{ p: 3, pb: 2, borderBottom: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
                  <motion.div variants={contentVariants}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, pr: 5 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 3,
                          background: alpha(categoryColor, 0.15),
                          color: categoryColor,
                          display: 'flex',
                          boxShadow: `0 0 30px ${alpha(categoryColor, 0.3)}`,
                          '& svg': { fontSize: 32 },
                        }}
                      >
                        {useCase.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 800,
                            color: '#fff',
                            fontFamily: '"Inter", "Roboto", sans-serif',
                            letterSpacing: '-0.02em',
                            lineHeight: 1.2,
                          }}
                        >
                          {useCase.label}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(255,255,255,0.6)',
                            mt: 0.5,
                          }}
                        >
                          {useCase.description}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                </Box>

                {/* Use Case Content */}
                <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
                  {UseCaseComponent ? (
                    <UseCaseComponent />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        Use case component not found
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </motion.div>
          </Box>
        </>
      )}
    </AnimatePresence>
  );
}

