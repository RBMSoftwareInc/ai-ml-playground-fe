'use client';

import React, { useState } from 'react';
import {
  AppBar, Box, CssBaseline, ThemeProvider, Toolbar,
  Typography, createTheme, Tabs, Tab
} from '@mui/material';

import Sidebar, { navSections } from './Sidebar';
import Header from './Header';
import Footer from './Footer';

import ETAPredictPage from '../app/eta/page';
import VariantPage from '../app/variant/page';
import VisualSimilarityPage from '../app/vss/page';
import FraudPage from '../app/fruad/page'; // fix spelling if needed

const theme = createTheme({
  palette: {
    background: { default: '#ffffff' },
    primary: { main: '#ffffff' },
    secondary: { main: '#000000' },
  },
  typography: {
    fontFamily: 'Santhoshi',
  },
});

const Placeholder = ({ label }: { label: string }) => (
  <Typography variant="h5" textAlign="center" mt={4}>
    {label} – Coming soon...
  </Typography>
);

export default function MainLayout() {
  const [activeCategory, setActiveCategory] = useState(navSections[0].title);
  const [activeTab, setActiveTab] = useState(navSections[0].items[0].key);

  const renderContent = () => {
    switch (activeTab) {
      case 'eta':
        return <ETAPredictPage />;
      case 'variant':
        return <VariantPage />;
      case 'vss':
        return <VisualSimilarityPage />;
      case 'fraud':
        return <FraudPage />;
      default: {
        const selectedItem = navSections.flatMap((s) => s.items).find(i => i.key === activeTab);
        return <Placeholder label={selectedItem?.label || 'Welcome'} />;
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box display="flex" flexDirection="column" minHeight="100vh">
        {/* Header + Tabs */}
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #eee' }}>
          <Header />
        <Tabs
            value={navSections.findIndex(s => s.title === activeCategory)}
            onChange={(e, idx) => {
                setActiveCategory(navSections[idx].title);
                setActiveTab(navSections[idx].items[0].key);
            }}
            centered
            sx={{
                bgcolor: 'white',
                '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: '16px', // Rounded tabs
                mx: 0.5,
                px: 2,
                },
                '& .MuiTab-root.Mui-selected': {
                color: '#FF0000 !important', // 🔥 Force override the white
                backgroundColor: '#f0f0f0',
                borderRadius: '16px',
                },
                '& .MuiTabs-indicator': {
                backgroundColor: 'red',
                height: '3px',
                borderRadius: '2px',
                },
                '& .MuiTab-root:hover': {
                    backgroundColor: '#eee',
                }
            }}
            >
            {navSections.map((section) => (
                <Tab key={section.title} label={section.title} />
            ))}
            </Tabs>

        </AppBar>

        {/* Sidebar + Content */}
        <Box display="flex" flexGrow={1} minHeight="0">
          <Sidebar
            activeCategory={activeCategory}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
          />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 4,
            }}
          >
            <Box sx={{ flexGrow: 1 }}>{renderContent()}</Box>
            <Footer />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
