'use client';

import React, { useMemo, useState } from 'react';
import { Box, Tabs, Tab, Divider, Typography, Stack, alpha } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

const tabMap = {
  form: '📝 Form',
  result: '📊 Result',
  theory: '🧠 Theory',
  dataset: '📁 Dataset',
  insights: '📈 Insights',
  ask: '🤖 Copilot',
  demo: '🎥 Demo',
};

type TabKey = keyof typeof tabMap;

interface FormWrapperProps {
  children: Partial<Record<TabKey, React.ReactNode>>;
  defaultTab?: TabKey;
  title?: string;
  subtitle?: string;
  metaLabel?: string;
}

export default function FormWrapper({
  children,
  defaultTab = 'form',
  title = 'AI Module',
  subtitle = 'Explore the power of prediction',
  metaLabel = 'RBM PLAYGROUND',
}: FormWrapperProps) {
  const [activeTab, setActiveTab] = useState<TabKey>(defaultTab);
  const keys = useMemo(() => Object.keys(children) as TabKey[], [children]);

  return (
    <Box>
      <Stack spacing={1} mb={4}>
        <Typography
          variant="overline"
          sx={{
            letterSpacing: '0.45em',
            color: 'rgba(255,255,255,0.4)',
          }}
        >
          {metaLabel}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 640 }}>
          {subtitle}
        </Typography>
      </Stack>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 2,
          minHeight: 48,
          '& .MuiTabs-flexContainer': {
            gap: 1,
          },
          '& .MuiTab-root': {
            textTransform: 'uppercase',
            fontSize: '0.85rem',
            letterSpacing: '0.08em',
            color: 'rgba(255,255,255,0.55)',
          },
          '& .Mui-selected': {
            color: '#bb86fc',
          },
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: 999,
            background: 'linear-gradient(90deg, #bb86fc, #ff1744)',
          },
        }}
      >
        {keys.map((key) => (
          <Tab key={key} value={key} label={tabMap[key]} />
        ))}
      </Tabs>

      <Divider sx={{ borderColor: alpha('#ffffff', 0.08), mb: 3 }} />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >
          {children[activeTab]}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}
