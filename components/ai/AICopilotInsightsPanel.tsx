'use client';

import { Box, Typography, Button, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { UseCaseCatalogItem } from '../../data/ai/catalog';
import UseCaseMiniCard from './UseCaseMiniCard';

interface AICopilotInsightsPanelProps {
  recommendedUseCases: UseCaseCatalogItem[];
  onClear?: () => void;
}

export default function AICopilotInsightsPanel({ 
  recommendedUseCases, 
  onClear 
}: AICopilotInsightsPanelProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(5,5,5,0.95) 0%, rgba(0,0,0,0.95) 100%)',
        borderLeft: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <Box
        sx={{
          p: 2.5,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: 'linear-gradient(135deg, rgba(255,0,0,0.1) 0%, transparent 100%)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#fff',
              background: 'linear-gradient(135deg, #ffffff 0%, #ff4d4d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Recommended Solutions
          </Typography>
          {recommendedUseCases.length > 0 && onClear && (
            <Button
              size="small"
              onClick={onClear}
              sx={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.75rem',
                textTransform: 'none',
                minWidth: 'auto',
                '&:hover': {
                  color: '#ff4d4d',
                },
              }}
            >
              Clear
            </Button>
          )}
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '0.8rem',
          }}
        >
          {recommendedUseCases.length > 0 
            ? `${recommendedUseCases.length} solution${recommendedUseCases.length > 1 ? 's' : ''} found`
            : 'Start a conversation to see recommendations'}
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2.5,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255,77,77,0.3)',
            borderRadius: '3px',
          },
        }}
      >
        {recommendedUseCases.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              p: 3,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.4)',
                fontSize: '0.85rem',
                lineHeight: 1.6,
              }}
            >
              AI recommendations will appear here as you chat
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {recommendedUseCases.map((useCase) => (
              <UseCaseMiniCard key={useCase.id} useCase={useCase} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

