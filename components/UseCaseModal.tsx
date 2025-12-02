'use client';

import { useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  alpha,
  Backdrop,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

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
  onLaunch: (route: string) => void;
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
  onLaunch,
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

  const details = useCase.details || {
    duration: '5-10 min',
    difficulty: 'Beginner',
    benefits: [
      'Real-time AI predictions',
      'Interactive demo environment',
      'Production-ready code samples',
    ],
    howItWorks: 'This AI model processes your input data through our ML pipeline, delivering instant predictions with explainable results.',
    techStack: ['Python', 'TensorFlow', 'FastAPI', 'React'],
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <Backdrop
            component={motion.div}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            open={open}
            onClick={onClose}
            sx={{
              zIndex: 1300,
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(8px)',
            }}
          />

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
              style={{ pointerEvents: 'auto' }}
            >
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 600,
                  maxHeight: '90vh',
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

                {/* Content */}
                <Box sx={{ p: 4, position: 'relative' }}>
                  {/* Header */}
                  <motion.div variants={contentVariants}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3, pr: 5 }}>
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
                      <Box>
                        <Typography
                          variant="h4"
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
                          variant="body1"
                          sx={{
                            color: 'rgba(255,255,255,0.6)',
                            mt: 1,
                          }}
                        >
                          {useCase.description}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>

                  {/* Meta chips */}
                  <motion.div variants={contentVariants}>
                    <Box sx={{ display: 'flex', gap: 1.5, mb: 4, flexWrap: 'wrap' }}>
                      <Chip
                        icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
                        label={details.duration}
                        size="small"
                        sx={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#fff',
                          fontWeight: 600,
                          '& .MuiChip-icon': { color: categoryColor },
                        }}
                      />
                      <Chip
                        icon={<AutoGraphIcon sx={{ fontSize: 16 }} />}
                        label={details.difficulty}
                        size="small"
                        sx={{
                          background: alpha(categoryColor, 0.1),
                          border: `1px solid ${alpha(categoryColor, 0.3)}`,
                          color: categoryColor,
                          fontWeight: 600,
                          '& .MuiChip-icon': { color: categoryColor },
                        }}
                      />
                    </Box>
                  </motion.div>

                  {/* How it works */}
                  <motion.div variants={contentVariants}>
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: 'rgba(255,255,255,0.4)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          fontSize: '0.7rem',
                          mb: 1.5,
                        }}
                      >
                        How It Works
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255,255,255,0.75)',
                          lineHeight: 1.8,
                          fontFamily: '"Inter", sans-serif',
                        }}
                      >
                        {details.howItWorks}
                      </Typography>
                    </Box>
                  </motion.div>

                  {/* Benefits */}
                  <motion.div variants={contentVariants}>
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: 'rgba(255,255,255,0.4)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          fontSize: '0.7rem',
                          mb: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <TipsAndUpdatesIcon sx={{ fontSize: 14 }} />
                        Key Benefits
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {details.benefits.map((benefit, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                            }}
                          >
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: categoryColor,
                                boxShadow: `0 0 10px ${categoryColor}`,
                              }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ color: 'rgba(255,255,255,0.7)' }}
                            >
                              {benefit}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </motion.div>

                  {/* Tech Stack */}
                  <motion.div variants={contentVariants}>
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: 'rgba(255,255,255,0.4)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          fontSize: '0.7rem',
                          mb: 1.5,
                        }}
                      >
                        Tech Stack
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {details.techStack.map((tech) => (
                          <Chip
                            key={tech}
                            label={tech}
                            size="small"
                            sx={{
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              color: 'rgba(255,255,255,0.6)',
                              fontSize: '0.75rem',
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </motion.div>

                  {/* Launch Button */}
                  <motion.div variants={contentVariants}>
                    <Box
                      component={motion.button}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onLaunch(useCase.route)}
                      sx={{
                        width: '100%',
                        py: 2,
                        px: 4,
                        border: 'none',
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${categoryColor} 0%, ${alpha(categoryColor, 0.8)} 100%)`,
                        color: '#fff',
                        fontSize: '1rem',
                        fontWeight: 700,
                        fontFamily: '"Inter", sans-serif',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        boxShadow: `0 10px 40px ${alpha(categoryColor, 0.4)}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: `0 15px 50px ${alpha(categoryColor, 0.5)}`,
                        },
                      }}
                    >
                      <PlayArrowIcon />
                      Launch Demo
                    </Box>
                  </motion.div>
                </Box>
              </Box>
            </motion.div>
          </Box>
        </>
      )}
    </AnimatePresence>
  );
}

