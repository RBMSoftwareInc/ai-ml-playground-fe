'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, styled, Button, CircularProgress } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
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

// Define interfaces for TypeScript
interface PageType {
  type: string;
}

interface Layout {
  id: string;
  structure: any[];
  pageType: string;
  isCustom?: boolean;
}

interface Fragment {
  id: string;
  name: string;
  pageType: string;
  layoutId: number;
  style: any;
  widgetId?: number | null;
  widgetConfig?: any;
  isUserDefined: boolean;
  thumbnail?: string;
}

interface WidgetConfig {
  [key: string]: { type: string; id: string | null };
}

const API_BASE_URL = 'http://localhost:5000/api/v1/cms/layout';

// Styled Components for Page.tsx
const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#F5F5F5',
}));

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

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(4),
  backgroundColor: '#F5F5F5',
  paddingTop: theme.spacing(2),
  width: `calc(100% - ${drawerWidth || 300}px)`,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  [theme.breakpoints.down('md')]: {
    width: '100%',
    padding: theme.spacing(2),
  },
}));

export default function Page() {
  const router = useRouter();
  const [selectedPage, setSelectedPage] = useState<PageType | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [fragments, setFragments] = useState<Fragment[]>([]);
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [layout, setLayout] = useState<Layout>({ id: '', structure: [], pageType: 'Home' });
  const [isCustomLayout, setIsCustomLayout] = useState<boolean>(false);
  const [designTone, setDesignTone] = useState<string>('Minimal');
  const [storeType, setStoreType] = useState<string>('Fashion');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDesigningFragment, setIsDesigningFragment] = useState<boolean>(false);
  const [selectedFragment, setSelectedFragment] = useState<Fragment | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig>({});

  // Fetch layouts and fragments when the page loads or selectedPage changes
  useEffect(() => {
    const fetchLayouts = async () => {
      try {
        setLoading(true);
        setError(null);
        const pageType = selectedPage?.type || 'Home';
        const layoutsResponse = await axios.get(`${API_BASE_URL}/layout-by-page-type`, {
          params: { pageType },
        });
        const layoutsData: Layout[] = layoutsResponse.data;
        console.log('Fetched layouts:', layoutsData); // Debug: Log layouts
        setLayouts(layoutsData);

        if (layoutsData.length > 0) {
          const newLayout = {
            id: layoutsData[0].id,
            structure: layoutsData[0].structure,
            pageType: layoutsData[0].pageType,
          };
          setLayout(newLayout);
          console.log('Set layout:', newLayout); // Debug: Log layout state
          setIsCustomLayout(layoutsData[0].isCustom || false);
        } else {
          const defaultLayout = {
            id: '',
            structure: [],
            pageType: pageType,
          };
          setLayout(defaultLayout);
          console.log('Set default layout:', defaultLayout);
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
        const layoutId = layout.id || '1'; // Fallback to '1' if layout.id is empty
        console.log('Fetching fragments for layoutId:', layoutId); // Debug: Log layoutId
        const fragmentsResponse = await axios.get(`${API_BASE_URL}/get/${layoutId}/fragments`);
        const fragmentsData: Fragment[] = fragmentsResponse.data;
        console.log('Fetched fragments:', fragmentsData); // Debug: Log fragments
        setFragments(fragmentsData);
      } catch (err) {
        console.error('Error fetching fragments:', err);
        setError('Failed to load fragments. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchLayouts();
    fetchFragments();
  }, [selectedPage, layout.id]);

  const handlePageSelect = (pageType: PageType) => {
    console.log('Page.tsx received pageType:', pageType);
    setSelectedPage(pageType);
    setSelectedFragment(null);
    setIsCreatingNew(false);
    setIsDesigningFragment(false);
  };

  const handleFragmentSelect = (fragment: Fragment) => {
    console.log('Selected fragment:', fragment);
    setSelectedFragment(fragment);
    setIsCreatingNew(false);
    setIsDesigningFragment(true);
  };

  const handleCreateNewFragment = () => {
    console.log('Creating new fragment');
    setSelectedFragment(null);
    setIsCreatingNew(true);
    setIsDesigningFragment(true);
  };

  const handleSaveFragment = (updatedFragment: Fragment, isNew: boolean = false) => {
    console.log('Saving fragment:', updatedFragment, 'isNew:', isNew);
    if (isNew) {
      setFragments((prev) => [...prev, updatedFragment]);
    } else {
      setFragments((prev) =>
        prev.map((f) => (f.id === updatedFragment.id ? updatedFragment : f))
      );
    }
    setSelectedFragment(null);
    setIsCreatingNew(false);
    setIsDesigningFragment(false);
  };

  const handleCancelFragmentDesign = () => {
    console.log('Canceling fragment edit');
    setSelectedFragment(null);
    setIsCreatingNew(false);
    setIsDesigningFragment(false);
  };

  // Ensure layout updates are reflected in LayoutCanvas
  const handleLayoutUpdate = (newLayout: Layout, isCustom: boolean) => {
    console.log('Updating layout:', newLayout, 'isCustom:', isCustom); // Debug: Log layout update
    setLayout(newLayout);
    setIsCustomLayout(isCustom);
  };

  // Debug: Log selectedFragment before passing to FragmentDesignerCanvas
  useEffect(() => {
    console.log('Passing selectedFragment to FragmentDesignerCanvas:', selectedFragment);
  }, [selectedFragment]);

  return (
    <PageContainer>
      <Header onLogout={() => router.push('/dashboard/cms/login')} />

      {isDesigningFragment ? (
        <FragmentDesignerCanvas
          pageType={selectedPage?.type || 'Home'}
          layoutId={layout.id ? parseInt(layout.id) : 1}
          fragment={selectedFragment}
          onSave={(updatedFragment) => handleSaveFragment(updatedFragment, isCreatingNew)}
          onCancel={handleCancelFragmentDesign}
          fragments={fragments}
          setFragments={setFragments}
          handleFragmentSelect={handleFragmentSelect}
          handleCreateNewFragment={handleCreateNewFragment}
        />
      ) : (
        <>
          <PromptBar
            onPrompt={(text: string) => {
              console.log('Prompt submitted:', text);
            }}
          />
          <Typography variant="h4" gutterBottom>
            LayoutIQ
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'row', flex: 2 }}>
            <SidebarContainer>
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
                onClick={() => setIsDesigningFragment(true)}
                sx={{ mt: 2, textTransform: 'none', color: '#A9A9A9', borderColor: '#C0C0C0' }}
              >
                Fragments
              </Button>
            </SidebarContainer>

            <MainContent>
              <LayoutControlsPanel
                pageType={selectedPage?.type || 'Home'}
                designTone={designTone}
                storeType={storeType}
                setDesignTone={setDesignTone}
                setStoreType={setStoreType}
                setLayout={handleLayoutUpdate}
                setIsCustomLayout={setIsCustomLayout}
                layout={layout}
                selectedStoreId={selectedStoreId}
                setSelectedStoreId={setSelectedStoreId}
              />
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
        </>
      )}

      <Footer />
    </PageContainer>
  );
}