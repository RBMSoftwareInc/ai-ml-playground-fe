'use client';

import React, { useState } from 'react';
import { Box, Tabs, Tab, Divider, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

const tabMap = {
  form: '📝 Form',
  result: '📊 Result',
  theory: '🧠 Theory',
  dataset: '📦 Dataset',
  insights: '📈 Insights',
  ask: '🧞‍♂️ Ask Gene',
  demo: '🎥 Demo',
};

type TabKey = keyof typeof tabMap;

interface FormWrapperProps {
  children: Partial<Record<TabKey, React.ReactNode>>;
  defaultTab?: TabKey;
  title?: string;
  subtitle?: string;
}

export default function FormWrapper({
  children,
  defaultTab = 'form',
  title = 'AI Module',
  subtitle = 'Explore the power of prediction',
}: FormWrapperProps) {
  const [activeTab, setActiveTab] = useState<TabKey>(defaultTab);

  const keys = Object.keys(children) as TabKey[];

  return (
    <Box className="max-w-5xl mx-auto mt-6 px-4 md:px-0">
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="subtitle1" color="gray">
          {subtitle}
        </Typography>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        indicatorColor="primary"
        textColor="inherit"
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 2,
          '& .Mui-selected': {
            color: '#b71c1c',
            fontWeight: 'bold',
          },
        }}
      >
        {keys.map((key) => (
          <Tab
            key={key}
            value={key}
            label={tabMap[key]}
            sx={{ textTransform: 'none' }}
          />
        ))}
      </Tabs>

      <Divider sx={{ mb: 3 }} />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {children[activeTab]}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}
