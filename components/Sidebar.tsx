'use client';

import {
  Drawer, List, ListSubheader, ListItem, ListItemText
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
      { key: 'spin', label: 'Gamified Spin-to-Win' },
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
          mt: '113px',
          boxSizing: 'border-box',
          backgroundColor: '#fff',
          borderRight: '1px solid #eee',
        },
      }}
    >
      <List
        subheader={
          <ListSubheader sx={{ fontWeight: 'bold', color: '#000', display: 'flex', alignItems: 'center' }}>
            {section.icon}
            <span style={{ marginLeft: 8 }}>{section.title}</span>
          </ListSubheader>
        }
      >
        {section.items.map((item) => (
          <ListItem
            key={item.key}
            button
            selected={activeTab === item.key}
            onClick={() => onSelectTab(item.key)}
            sx={{
              color: activeTab === item.key ? 'red' : '#333',
              fontWeight: activeTab === item.key ? 'bold' : 'normal',
            }}
          >
            <ListItemText primary={item.label} sx={{ pl: 2 }} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
