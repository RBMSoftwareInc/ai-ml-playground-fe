'use client';

import { Box, Button, Card, CardContent, Chip, Typography, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { UseCaseCatalogItem } from '../../data/ai/catalog';

interface UseCaseMiniCardProps {
  useCase: UseCaseCatalogItem;
  onViewDemo?: () => void;
  onLearnMore?: () => void;
}

export default function UseCaseMiniCard({ useCase, onViewDemo, onLearnMore }: UseCaseMiniCardProps) {
  const router = useRouter();

  const handleViewDemo = () => {
    if (useCase.interactiveRoute) {
      router.push(useCase.interactiveRoute);
    } else if (onViewDemo) {
      onViewDemo();
    }
  };

  const handleLearnMore = () => {
    router.push(useCase.industryRoute);
    if (onLearnMore) {
      onLearnMore();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card
        sx={{
          background: 'linear-gradient(135deg, rgba(20,20,20,0.95) 0%, rgba(10,10,10,0.95) 100%)',
          border: '1px solid rgba(255,77,77,0.2)',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'rgba(255,77,77,0.5)',
            boxShadow: '0 8px 24px rgba(255,0,0,0.2)',
            '& .card-glow': {
              opacity: 0.3,
            },
          },
        }}
      >
        <Box
          className="card-glow"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #ff0000, transparent)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          }}
        />
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#fff',
                  mb: 0.5,
                  lineHeight: 1.2,
                }}
              >
                {useCase.displayName}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.8rem',
                  lineHeight: 1.4,
                  mb: 1.5,
                }}
              >
                {useCase.shortDescription}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              label={useCase.industry}
              size="small"
              sx={{
                bgcolor: alpha('#ff4d4d', 0.15),
                color: '#ff4d4d',
                border: '1px solid rgba(255,77,77,0.3)',
                fontSize: '0.7rem',
                height: 20,
              }}
            />
            <Chip
              label={useCase.category.replace('-', ' ')}
              size="small"
              sx={{
                bgcolor: alpha('#ff4d4d', 0.1),
                color: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.1)',
                fontSize: '0.7rem',
                height: 20,
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {useCase.interactiveRoute && (
              <Button
                variant="contained"
                size="small"
                endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                onClick={handleViewDemo}
                sx={{
                  bgcolor: '#ff0000',
                  color: '#fff',
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: '#cc0000',
                    boxShadow: '0 4px 12px rgba(255,0,0,0.3)',
                  },
                }}
              >
                View Demo
              </Button>
            )}
            <Button
              variant="outlined"
              size="small"
              onClick={handleLearnMore}
              sx={{
                borderColor: 'rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.8)',
                textTransform: 'none',
                fontSize: '0.75rem',
                px: 2,
                py: 0.5,
                borderRadius: 2,
                '&:hover': {
                  borderColor: 'rgba(255,77,77,0.5)',
                  bgcolor: 'rgba(255,77,77,0.1)',
                },
              }}
            >
              Learn More
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

