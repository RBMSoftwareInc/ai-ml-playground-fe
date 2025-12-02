'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  TextField,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { AutoAwesomeOutlined as AIIcon, ArrowBack as BackIcon } from '@mui/icons-material';

// Define a static theme (consistent with BlueprintStudio.tsx)
const theme = createTheme({
  palette: {
    primary: { main: '#666', light: '#999', contrastText: '#FFF' },
    background: { default: '#F5F5F5', paper: '#E5E5E5' },
    text: { primary: '#333', secondary: '#666' },
    divider: '#999',
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    body1: { fontSize: '0.95rem' },
    body2: { fontSize: '0.85rem' },
  },
});

const PageContainer = styled(Box)({
  padding: theme.spacing(4),
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
});

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(4),
}));

// Mock AI Layout Suggestions (same as in BlueprintStudio.tsx)
const aiLayoutSuggestions = {
  Home: {
    sections: [
      {
        id: 'section-ai-home-1',
        type: 'Header',
        slots: [
          { id: 'slot-ai-home-1', content: { type: 'Fragment', id: 'fragment-1', title: 'Header Logo', content: { url: 'https://picsum.photos/200/100' } }, order: 0 },
        ],
        allowedContentTypes: ['logo', 'nav-menu', 'search-bar'],
        dimensions: { width: '100%', height: '64px' },
        order: 0,
        layoutType: 'row',
        width: 'full',
      },
      {
        id: 'section-ai-home-2',
        type: 'Content',
        slots: [
          { id: 'slot-ai-home-2', content: { type: 'Widget', title: 'Hero Banner', content: { text: 'Welcome to Our Store!' }, style: { backgroundColor: '#FFF' } }, order: 0 },
        ],
        allowedContentTypes: ['text', 'image', 'product-card'],
        dimensions: { width: '100%', height: 'auto' },
        order: 1,
        layoutType: 'row',
        width: 'full',
      },
    ],
  },
  PLP: {
    sections: [
      {
        id: 'section-ai-plp-1',
        type: 'Content',
        slots: [
          { id: 'slot-ai-plp-1', content: { type: 'Fragment', id: 'fragment-2', title: 'Product Carousel', content: { products: [] }, config: { api: '/api/products' } }, order: 0 },
        ],
        allowedContentTypes: ['product-grid', 'product-card'],
        dimensions: { width: '100%', height: 'auto' },
        order: 0,
        layoutType: 'grid',
        layoutConfig: { columns: 3 },
        width: 'full',
      },
    ],
  },
  PDP: {
    sections: [
      {
        id: 'section-ai-pdp-1',
        type: 'Content',
        slots: [
          { id: 'slot-ai-pdp-1', content: { type: 'Widget', title: 'Product Details', content: { text: 'Product Description' }, style: { backgroundColor: '#FFF' } }, order: 0 },
        ],
        allowedContentTypes: ['text', 'image', 'product-card'],
        dimensions: { width: '70%', height: 'auto' },
        order: 0,
        layoutType: 'row',
        width: '70%',
      },
      {
        id: 'section-ai-pdp-2',
        type: 'Sidebar',
        slots: [
          { id: 'slot-ai-pdp-2', content: { type: 'Widget', title: 'Related Products', content: { text: 'Related Items' }, style: { backgroundColor: '#FFF' } }, order: 0 },
        ],
        allowedContentTypes: ['text', 'product-card'],
        dimensions: { width: '30%', height: 'auto' },
        order: 1,
        layoutType: 'column',
        width: '30%',
      },
    ],
  },
  Blog: {
    sections: [
      {
        id: 'section-ai-blog-1',
        type: 'Blog',
        slots: [
          { id: 'slot-ai-blog-1', content: { type: 'Fragment', id: 'fragment-4', title: 'Blog Post List', content: { posts: [] }, config: { api: '/api/posts' } }, order: 0 },
        ],
        allowedContentTypes: ['text', 'image'],
        dimensions: { width: '100%', height: 'auto' },
        order: 0,
        layoutType: 'row',
        width: 'full',
      },
    ],
  },
  Category: {
    sections: [
      {
        id: 'section-ai-category-1',
        type: 'Category',
        slots: [
          { id: 'slot-ai-category-1', content: { type: 'Fragment', id: 'fragment-5', title: 'Category Filter', content: { categories: [] }, config: {} }, order: 0 },
        ],
        allowedContentTypes: ['text', 'product-grid'],
        dimensions: { width: '100%', height: 'auto' },
        order: 0,
        layoutType: 'grid',
        layoutConfig: { columns: 3 },
        width: 'full',
      },
    ],
  },
};

interface Section {
  id: string;
  type: string;
  slots: Slot[];
  allowedContentTypes: string[];
  dimensions: { width: string; height: string; minWidth?: string; minHeight?: string };
  order: number;
  layoutType: 'row' | 'column' | 'grid' | 'custom';
  layoutConfig?: { columns?: number; rows?: number };
  width?: string;
}

interface SlotContent {
  type: 'Widget' | 'Fragment';
  id: string;
  title?: string;
  description?: string;
  content?: any;
  style?: { [key: string]: string };
  config?: any;
  translations?: { [lang: string]: { title: string; description: string } };
}

interface Slot {
  id: string;
  content: SlotContent | null;
  order: number;
  position?: { row: number; col: number };
  dimensions?: { width: string; height: string };
}

export default function AISuggestedLayouts() {
  const router = useRouter();
  const [pageType, setPageType] = useState('Home');
  const [desiredSections, setDesiredSections] = useState('');
  const [layoutStyle, setLayoutStyle] = useState('grid');
  const [contentFocus, setContentFocus] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [generatedLayout, setGeneratedLayout] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerateLayout = () => {
    const prompt = `Generate a layout for a ${pageType} page with the following requirements:
- Desired sections: ${desiredSections || 'Header, Content, Footer'}
- Layout style: ${layoutStyle}
- Content focus: ${contentFocus || 'General content'}`;
    setGeneratedPrompt(prompt);

    // Mock AI response
    const suggestion = aiLayoutSuggestions[pageType as keyof typeof aiLayoutSuggestions] || aiLayoutSuggestions.Home;
    setGeneratedLayout(JSON.stringify(suggestion, null, 2));
  };

  const handleApplyLayout = () => {
    const suggestion = aiLayoutSuggestions[pageType as keyof typeof aiLayoutSuggestions] || aiLayoutSuggestions.Home;
    // Store the layout in localStorage to pass it back to BlueprintStudio
    localStorage.setItem('aiSuggestedLayout', JSON.stringify(suggestion.sections));
    setErrorMessage('Layout applied! Returning to editor...');
    setTimeout(() => {
      router.push(`/editor/${localStorage.getItem('canvasId') || 'default-canvas'}`);
    }, 2000);
  };

  return (
    <ThemeProvider theme={theme}>
      <PageContainer>
        {errorMessage && (
          <Alert
            severity={errorMessage.includes('Failed') ? 'error' : 'success'}
            onClose={() => setErrorMessage(null)}
            sx={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}
          >
            {errorMessage}
          </Alert>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">AI-Suggested Layouts</Typography>
          <Button
            variant="outlined"
            startIcon={<BackIcon />}
            onClick={() => router.push(`/editor/${localStorage.getItem('canvasId') || 'default-canvas'}`)}
          >
            Back to Editor
          </Button>
        </Box>
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Page Type</InputLabel>
            <Select value={pageType} onChange={(e) => setPageType(e.target.value)}>
              <MenuItem value="Home">Home</MenuItem>
              <MenuItem value="PLP">Product Listing</MenuItem>
              <MenuItem value="PDP">Product Detail</MenuItem>
              <MenuItem value="Blog">Blog</MenuItem>
              <MenuItem value="Category">Category</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Desired Sections (e.g., Header, Content, Footer)"
            value={desiredSections}
            
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Layout Style</InputLabel>
            <Select value={layoutStyle} onChange={(e) => setLayoutStyle(e.target.value)}>
              <MenuItem value="row">Row</MenuItem>
              <MenuItem value="column">Column</MenuItem>
              <MenuItem value="grid">Grid</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Content Focus (e.g., Products, Blog Posts)"
            value={contentFocus}
         
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          />
          <Button variant="contained" startIcon={<AIIcon />} onClick={handleGenerateLayout} sx={{ mb: 2 }}>
            Generate Layout
          </Button>
          {generatedPrompt && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Generated Prompt:</Typography>
              <Typography variant="body2">{generatedPrompt}</Typography>
            </Box>
          )}
          {generatedLayout && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Generated Layout:</Typography>
              <Typography variant="body2" component="pre">{generatedLayout}</Typography>
              <Button variant="contained" onClick={handleApplyLayout}>Apply Layout</Button>
            </Box>
          )}
        </Box>
      </PageContainer>
    </ThemeProvider>
  );
}