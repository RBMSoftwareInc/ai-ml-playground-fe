'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, styled, Button, List, ListItem, ListItemText, Drawer, IconButton, Paper, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PromptBar from './fragments/PromptBar';
import LayoutCanvas from './canvas/LayoutCanvas';
import FragmentDesignerCanvas from './canvas/FragmentDesignerCanvas';
import LayoutControlsPanel from './fragments/LayoutControlsPanel';
import Header from '../../../../../components/cms/Header';
import Footer from '../../../../../components/cms/Footer';
import { useRouter } from 'next/navigation';
import { drawerWidth } from '../../../../../components/Sidebar';
import PageSelector from './sidebar/PageSelector';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1/cms/layout';

// Styled Components for Page.tsx
const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#F5F5F5',
}));

interface WidgetConfig {
  [key: string]: { type: string; id: string | null };
}

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: drawerWidth || 300,
  backgroundColor: '#E0E0E0',
  padding: theme.spacing(3),
  borderRight: `1px solid #C0C0C0`,
  boxShadow: '3px 0 10px rgba(0, 0, 0, 0.05)',
  height: 'calc(100vh - 64px)',
  position: 'sticky',
  top: 64,
  minWidth: '250px',
  display: 'flex',
  flexDirection: 'column',
}));

const MainContent = styled(Box)(({ theme, drawerOpen }) => ({
  flexGrow: 1,
  padding: theme.spacing(4),
  backgroundColor: '#F5F5F5',
  paddingTop: theme.spacing(2),
  width: drawerOpen ? `calc(100% - ${drawerWidth || 300}px - 30%)` : `calc(100% - ${drawerWidth || 300}px)`,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  [theme.breakpoints.down('md')]: {
    width: '100%',
    padding: theme.spacing(2),
  },
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: '30%',
    backgroundColor: '#FFFFFF',
    padding: theme.spacing(3),
    borderLeft: `1px solid #C0C0C0`,
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '0 8px 8px 0',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      borderRadius: 0,
    },
  },
}));

const FragmentButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: '#616161',
  backgroundColor: '#F5F5F5',
  borderColor: '#C0C0C0',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1, 2),
  display: 'flex',
  justifyContent: 'space-between',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#E0E0E0',
    borderColor: '#A9A9A9',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  '&.Mui-selected': {
    backgroundColor: '#C0C0C0',
    color: '#FFFFFF',
    borderColor: '#A9A9A9',
  },
}));

const FragmentsListContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  border: `1px solid #C0C0C0`,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
  },
  width: '100%',
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const TitleTypography = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 'bold',
  letterSpacing: '1px',
  background: 'linear-gradient(90deg, #616161, #C0C0C0)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: theme.spacing(4),
  paddingLeft: theme.spacing(2),
  paddingTop: theme.spacing(8),
  position: 'relative',
  '&:before': {
    content: '""',
    position: 'absolute',
    left: 0,
    bottom: -4,
    width: '60px',
    height: '4px',
    backgroundColor: '#C0C0C0',
    borderRadius: '2px',
  },
}));

export default function Page({ pageData }) {
  const router = useRouter();
  const [selectedPage, setSelectedPage] = useState(null);
  const [selectedFragment, setSelectedFragment] = useState(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string | ''>('');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [fragments, setFragments] = useState([]);
  const [layouts, setLayouts] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig>({});
  const [layout, setLayout] = useState({ layoutId: '', structure: [], pageType: 'Home' });
  const [isCustomLayout, setIsCustomLayout] = useState(false);
  const [designTone, setDesignTone] = useState('Minimal');
  const [storeType, setStoreType] = useState('Fashion');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch layouts and fragments when the page loads or selectedPage changes
  useEffect(() => {
    const fetchLayouts = async () => {
      try {
        setLoading(true);
        setError(null);
        const pageType = selectedPage?.type || 'Home';
        const layoutsResponse = await axios.get(`${API_BASE_URL}/layout-by-page-type`, {
          params: { pageType }
        });
        const layoutsData = layoutsResponse.data;
        setLayouts(layoutsData);

        if (layoutsData.length > 0) {
          setLayout({
            layoutId: layoutsData[0].id,
            structure: layoutsData[0].structure,
            pageType: layoutsData[0].pageType,
          });
          setIsCustomLayout(layoutsData[0].isCustom || false);
        } else {
          setLayout({
            layoutId: '',
            structure: [],
            pageType: pageType,
          });
          setIsCustomLayout(false);
        }
      } catch (err) {
        console.error('Error fetching layouts:', err);
        setError('Failed to load layouts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    const fetchFragments = async () => {
      try {
        setLoading(true);
        setError(null);
        const layoutId = layout.layoutId || 1; // Use the current layoutId
        const fragmentsResponse = await axios.get(`${API_BASE_URL}/get/${layoutId}/fragments`);
        setFragments(fragmentsResponse.data);
      } catch (err) {
        console.error('Error fetching fragments:', err);
        setError('Failed to load fragments. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchLayouts();
    fetchFragments();
  }, [selectedPage]);

  const pageFragments = Array.isArray(fragments)
  ? fragments.filter((fragment) => fragment.pageType === (selectedPage?.type || 'Home'))
  : [];

  const handlePageSelect = (pageType) => {
    console.log('Page.tsx received pageType:', pageType);
    setSelectedPage(pageType);
    setSelectedFragment(null);
    setIsCreatingNew(false);
    setDrawerOpen(false);
  };

  const handleFragmentSelect = (fragment) => {
    setSelectedFragment(fragment);
    setIsCreatingNew(false);
    setDrawerOpen(true);
  };

  const handleCreateNewFragment = () => {
    setSelectedFragment(null);
    setIsCreatingNew(true);
    setDrawerOpen(true);
  };

  const handleSaveFragment = (updatedFragment, isNew = false) => {
    if (isNew) {
      setFragments((prev) => [...prev, updatedFragment]);
    } else {
      setFragments((prev) =>
        prev.map((f) => (f.id === updatedFragment.id ? updatedFragment : f))
      );
    }
    setSelectedFragment(null);
    setIsCreatingNew(false);
    setDrawerOpen(false);
  };

  const handleCancel = () => {
    setSelectedFragment(null);
    setIsCreatingNew(false);
    setDrawerOpen(false);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
    if (drawerOpen) {
      setSelectedFragment(null);
      setIsCreatingNew(false);
    }
  };

  const renderFragmentsList = () => (
    <FragmentsListContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ color: '#616161' }}>
          Fragments for {selectedPage?.type || 'Home'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleCreateNewFragment}
          sx={{ textTransform: 'none', color: '#A9A9A9', borderColor: '#C0C0C0' }}
        >
          Design New Fragment
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      ) : fragments.length > 0 ? (
        <List>
          {fragments.map((fragment) => (
            <ListItem key={fragment.id} disablePadding>
              <FragmentButton
                fullWidth
                variant="outlined"
                onClick={() => handleFragmentSelect(fragment)}
                className={selectedFragment && selectedFragment.id === fragment.id ? 'Mui-selected' : ''}
              >
                <ListItemText primary={fragment.name} />
                {fragment.isUserDefined && (
                  <Typography variant="caption" sx={{ color: '#A9A9A9' }}>
                    (Custom)
                  </Typography>
                )}
              </FragmentButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" sx={{ color: '#616161', mt: 2 }}>
          No fragments available for this page type.
        </Typography>
      )}
    </FragmentsListContainer>
  );

  return (
    <PageContainer>
      <Header onLogout={() => router.push('/dashboard/cms/login')} />

      <PromptBar
        onPrompt={(text) => {
          console.log('Prompt submitted:', text);
        }}
      />
      <Typography variant="h4" gutterBottom>
        LayoutIQ
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'row', flex: 2 }}>
        <Paper sx={{ p: 1, flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom>
            Page Selector
          </Typography>
          <PageSelector
            selected={selectedPage?.type || 'Home'}
            onSelect={handlePageSelect}
          />

          <Button
            variant="outlined"
            startIcon={<MenuIcon />}
            onClick={toggleDrawer}
            sx={{ mt: 2, textTransform: 'none', color: '#A9A9A9', borderColor: '#C0C0C0' }}
          >
            Fragments
          </Button>
        </Paper>

        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: drawerOpen ? `calc(100% - ${drawerWidth || 300}px - 30%)` : `calc(100% - ${drawerWidth || 300}px)` }}>
          <LayoutControlsPanel
            pageType={selectedPage?.type || 'Home'}
            designTone={designTone}
            storeType={storeType}
            setDesignTone={setDesignTone}
            setStoreType={setStoreType}
            setLayout={setLayout}
            setIsCustomLayout={setIsCustomLayout}
            layout={layout}
            selectedStoreId={selectedStoreId}
            setSelectedStoreId={setSelectedStoreId}
          />
          <MainContent drawerOpen={drawerOpen}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            ) : (
              <LayoutCanvas
                layout={layout}
                setLayout={setLayout}
                widgetConfig={widgetConfig}
                setWidgetConfig={setWidgetConfig}
                isCustomLayout={isCustomLayout}
                setIsCustomLayout={setIsCustomLayout}
                selectedStoreId={selectedStoreId}
              />
            )}
          </MainContent>
        </Box>

        <StyledDrawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer}
          variant="temporary"
          ModalProps={{
            BackdropProps: {
              sx: { backgroundColor: 'rgba(0, 0, 0, 0.2)' },
            },
          }}
        >
          <DrawerHeader>
            <Typography variant="h6" sx={{ color: '#616161' }}>
              Fragments for {selectedPage?.type || 'Home'}
            </Typography>
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </DrawerHeader>

          {(selectedFragment || isCreatingNew) ? (
            <FragmentDesignerCanvas
              pageType={selectedPage?.type || 'Home'}
              layoutId={layout.layoutId ? parseInt(layout.layoutId) : 1}
              fragment={selectedFragment}
              onSave={(updatedFragment) => handleSaveFragment(updatedFragment, isCreatingNew)}
              onCancel={handleCancel}
            />
          ) : (
            renderFragmentsList()
          )}
        </StyledDrawer>
      </Box>

      <Footer />
    </PageContainer>
  );
}