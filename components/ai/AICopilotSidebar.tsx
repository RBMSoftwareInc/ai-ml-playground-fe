'use client';

import { Box, Typography, Chip, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { industries, categories } from '../../data/ai/catalog';
import { CopilotContext } from '../../lib/mockCopilotEngine';

interface AICopilotSidebarProps {
  context: CopilotContext;
  onIndustrySelect?: (industry: string) => void;
  onCategorySelect?: (category: string) => void;
}

export default function AICopilotSidebar({ 
  context, 
  onIndustrySelect,
  onCategorySelect 
}: AICopilotSidebarProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(5,5,5,0.95) 0%, rgba(0,0,0,0.95) 100%)',
        borderRight: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {/* Current Context */}
      <Box
        sx={{
          p: 2.5,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: 'linear-gradient(135deg, rgba(255,0,0,0.1) 0%, transparent 100%)',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#fff',
            mb: 2,
            background: 'linear-gradient(135deg, #ffffff 0%, #ff4d4d 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Current Context
        </Typography>
        
        {context.industries && context.industries.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                mb: 1,
                display: 'block',
              }}
            >
              Industries
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {context.industries.map((industryId) => {
                const industry = industries.find(i => i.id === industryId);
                return (
                  <Chip
                    key={industryId}
                    label={industry?.name || industryId}
                    size="small"
                    icon={<span>{industry?.icon || '🏢'}</span>}
                    sx={{
                      bgcolor: alpha('#ff4d4d', 0.2),
                      color: '#ff4d4d',
                      border: '1px solid rgba(255,77,77,0.4)',
                      fontSize: '0.7rem',
                      height: 24,
                    }}
                  />
                );
              })}
            </Box>
          </Box>
        )}

        {context.categories && context.categories.length > 0 && (
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                mb: 1,
                display: 'block',
              }}
            >
              Categories
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {context.categories.map((categoryId) => {
                const category = categories.find(c => c.id === categoryId);
                return (
                  <Chip
                    key={categoryId}
                    label={category?.name || categoryId}
                    size="small"
                    icon={<span>{category?.icon || '📦'}</span>}
                    sx={{
                      bgcolor: alpha('#ff4d4d', 0.15),
                      color: 'rgba(255,255,255,0.7)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      fontSize: '0.7rem',
                      height: 24,
                    }}
                  />
                );
              })}
            </Box>
          </Box>
        )}

        {(!context.industries || context.industries.length === 0) && 
         (!context.categories || context.categories.length === 0) && (
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.8rem',
              fontStyle: 'italic',
            }}
          >
            Context will update as you chat
          </Typography>
        )}
      </Box>

      {/* Industries */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5 }}>
        <Typography
          variant="subtitle2"
          sx={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.85rem',
            fontWeight: 600,
            mb: 1.5,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Industries
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {industries.map((industry) => {
            const isActive = context.industries?.includes(industry.id);
            return (
              <motion.div
                key={industry.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Chip
                  label={`${industry.icon} ${industry.name}`}
                  onClick={() => onIndustrySelect?.(industry.id)}
                  sx={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    bgcolor: isActive 
                      ? alpha('#ff4d4d', 0.2) 
                      : 'rgba(255,255,255,0.05)',
                    color: isActive ? '#ff4d4d' : 'rgba(255,255,255,0.7)',
                    border: `1px solid ${isActive 
                      ? 'rgba(255,77,77,0.4)' 
                      : 'rgba(255,255,255,0.1)'}`,
                    fontSize: '0.8rem',
                    height: 36,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: alpha('#ff4d4d', 0.15),
                      borderColor: 'rgba(255,77,77,0.3)',
                    },
                  }}
                />
              </motion.div>
            );
          })}
        </Box>
      </Box>

      {/* Categories */}
      <Box sx={{ p: 2.5, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography
          variant="subtitle2"
          sx={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.85rem',
            fontWeight: 600,
            mb: 1.5,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Categories
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {categories.map((category) => {
            const isActive = context.categories?.includes(category.id);
            return (
              <motion.div
                key={category.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Chip
                  label={`${category.icon} ${category.name}`}
                  onClick={() => onCategorySelect?.(category.id)}
                  sx={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    bgcolor: isActive 
                      ? alpha('#ff4d4d', 0.15) 
                      : 'rgba(255,255,255,0.05)',
                    color: isActive ? '#ff4d4d' : 'rgba(255,255,255,0.7)',
                    border: `1px solid ${isActive 
                      ? 'rgba(255,77,77,0.4)' 
                      : 'rgba(255,255,255,0.1)'}`,
                    fontSize: '0.75rem',
                    height: 32,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: alpha('#ff4d4d', 0.1),
                      borderColor: 'rgba(255,77,77,0.3)',
                    },
                  }}
                />
              </motion.div>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

