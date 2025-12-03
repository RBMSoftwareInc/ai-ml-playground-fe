'use client';

import {
  Drawer, List, ListSubheader, ListItem, ListItemButton, ListItemText,
  Box
} from '@mui/material';

import {
  Category, LocalShipping, Search, Person,
  HeadsetMic, MonetizationOn, TrendingUp,
  Brush, Quiz, BarChart
} from '@mui/icons-material';

export const drawerWidth = 260;

export const navSections = [
  {
    title: 'Product Discovery',
    icon: <Search />,
    items: [
      { key: 'nlp', label: 'Smart Search (NLP)' },
      { key: 'vss', label: 'Visual Similarity Search' },
      { key: 'bundle', label: 'Bundle & Outfit Suggestions' },
    ],
  },
  {
    title: 'Logistics & Operations',
    icon: <LocalShipping />,
    items: [
      { key: 'eta', label: 'ETA Prediction' },
      { key: 'delay', label: 'Order Delay Forecast' },
      { key: 'inventory', label: 'Inventory Reordering' },
    ],
  },
  {
    title: 'Personalization',
    icon: <Person />,
    items: [
      { key: 'personalization', label: 'Real-Time Personalization' },
      { key: 'chat', label: 'AI Chat Assistant' },
      { key: 'voice', label: 'Voice Search' },
    ],
  },
  {
    title: 'Pricing & Fraud',
    icon: <MonetizationOn />,
    items: [
      { key: 'pricing', label: 'Dynamic Pricing' },
      { key: 'fraud', label: 'Fraud Detection' },
      { key: 'coupon', label: 'Coupon Abuse Detection' },
    ],
  },
  {
    title: 'Marketing Intelligence',
    icon: <TrendingUp />,
    items: [
      { key: 'churn', label: 'Churn Prediction' },
      { key: 'segmentation', label: 'Customer Segmentation' },
      { key: 'subject', label: 'Email Subject Line Generator' },
      { key: 'leadgen', label: 'Lead Gen Blueprint' },
    ],
  },
  {
    title: 'Product Intelligence',
    icon: <Category />,
    items: [
      { key: 'variant', label: 'Variant Assignment' },
      { key: 'categorization', label: 'Auto Categorization' },
      { key: 'sentiment', label: 'Review Sentiment Analysis' },
      { key: 'descriptions', label: 'Title & Description Generator' },
    ],
  },
  {
    title: 'Creative & AR Tools',
    icon: <Brush />,
    items: [
      { key: 'remover', label: 'AI Background Remover' },
      { key: 'upscaler', label: 'Image Enhancer/Upscaler' },
      { key: 'tryon', label: 'AI Try-On (AR)' },
    ],
  },
  {
    title: 'Gamification',
    icon: <Quiz />,
    items: [
      { key: 'quiz', label: 'Product Match Quiz' },
      { key: 'spin', label: 'Spin-to-Win' },
      { key: 'iq', label: 'IQ Game Suite' },
    ],
  },
  {
    title: 'Analytics & Insights',
    icon: <BarChart />,
    items: [
      { key: 'forecast', label: 'Sales Forecasting' },
      { key: 'timing', label: 'Best Launch Timing' },
      { key: 'abtest', label: 'A/B Test Analyzer' },
    ],
  },
];

interface SidebarProps {
  activeCategory: string;
  activeTab: string;
  onSelectTab: (key: string) => void;
}

export default function Sidebar({ activeCategory, activeTab, onSelectTab }: SidebarProps) {
  const section = navSections.find((s) => s.title === activeCategory);
  if (!section) return null;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          mt: '64px', // Adjusted for header height
          boxSizing: 'border-box',
          background: 'rgba(0,0,0,0.9)',
          borderRight: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '3px',
          }
        },
      }}
    >
      <List
        subheader={
          <ListSubheader 
            sx={{ 
              bgcolor: 'transparent',
              color: '#ff0000',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              p: 2,
              fontFamily: '"Roboto", sans-serif',
              letterSpacing: '0.5px'
            }}
          >
            <Box sx={{ mr: 2, color: '#ff0000' }}>{section.icon}</Box>
            {section.title}
          </ListSubheader>
        }
      >
        {section.items.map((item) => (
          <ListItemButton
            key={item.key}
            selected={activeTab === item.key}
            onClick={() => onSelectTab(item.key)}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 1,
              color: activeTab === item.key ? '#ff0000' : 'rgba(255,255,255,0.7)',
              bgcolor: activeTab === item.key ? 'rgba(255,0,0,0.1)' : 'transparent',
              '&:hover': {
                bgcolor: 'rgba(255,0,0,0.05)',
              },
              transition: 'all 0.3s ease',
              '& .MuiListItemText-primary': {
                fontFamily: '"Roboto", sans-serif',
                fontWeight: activeTab === item.key ? 600 : 400,
                fontSize: '0.9rem',
              }
            }}
          >
            <ListItemText primary={item.label} sx={{ pl: 1 }} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
