'use client';

import { useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '../../../components/MainLayout';
import { navSections } from '../../../components/Sidebar';

export default function ConventionalPage() {
  const [activeCategory, setActiveCategory] = useState('Product Discovery');
  const [activeTab, setActiveTab] = useState('nlp');

  const handleTabSelect = (key: string) => {
    setActiveTab(key);
    // Find category for the selected tab
    navSections.forEach(section => {
      if (section.items.some(item => item.key === key)) {
        setActiveCategory(section.title);
      }
    });
  };

  return (
    <MainLayout>
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
          position: 'relative',
          pb: 4
        }}
      >
        <Container 
          maxWidth="xl"
          sx={{
            p: 4,
            position: 'relative',
            minHeight: '100%',
            '& .MuiPaper-root': {
              bgcolor: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 2
            }
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: '#fff',
              mb: 4,
              fontWeight: 600,
              '&::after': {
                content: '""',
                display: 'block',
                width: 60,
                height: 4,
                bgcolor: '#ff0000',
                borderRadius: 2,
                mt: 1
              }
            }}
          >
            {activeCategory}
          </Typography>
          
          <Box
            sx={{
              pt: { xs: 2, md: 4 },
              pl: { xs: 2, md: '280px' }, // Adjust based on sidebar width
              pr: { xs: 2, md: 4 },
              py: 4
            }}
          >
            {/* Content Area */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Your feature-specific content here */}
                <Box sx={{ 
                  bgcolor: 'rgba(255,255,255,0.05)',
                  borderRadius: 2,
                  p: 4,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  {/* Feature content will be rendered here */}
                </Box>
              </motion.div>
            </AnimatePresence>
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
}