import React, { useState, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, Button, styled, Paper, Fade } from '@mui/material';
import axios from 'axios';
import LayersIcon from '@mui/icons-material/Layers';
import PaletteIcon from '@mui/icons-material/Palette';
import StoreIcon from '@mui/icons-material/Store';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';

// Styled Components for LayoutControlsPanel
const ControlsContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: '#FFFFFF',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  border: `1px solid #C0C0C0`,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.1)',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 'bold',
  color: '#616161',
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const LayoutButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: '#616161',
  backgroundColor: '#F5F5F5',
  borderColor: '#C0C0C0',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.5, 2),
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  minWidth: '120px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#E0E0E0',
    borderColor: '#A9A9A9',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    '& .MuiSvgIcon-root': {
      color: '#A9A9A9',
      transform: 'scale(1.1)',
    },
  },
  '&.Mui-selected': {
    backgroundColor: '#C0C0C0',
    color: '#FFFFFF',
    borderColor: '#A9A9A9',
    '& .MuiSvgIcon-root': {
      color: '#FFFFFF',
    },
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
  '& .MuiSelect-select': {
    padding: theme.spacing(1.5),
    color: '#616161',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#C0C0C0',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#A9A9A9',
  },
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
}));

const ControlBox = styled(Box)(({ theme }) => ({
  minWidth: '200px',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

// Define all possible tones and store types
const allTones = ['Minimal', 'Elegant', 'Vibrant'];
const allStoreTypes = [
  'apparel & fashion',
  'electronics & gadgets',
  'grocery & essentials',
  'furniture & home',
  'automotive & bikes',
  'beauty & wellness',
  'sports & outdoors',
  'baby & kids',
  'jewelry & accessories',
  'pet supplies'
];

// Map icon names to MUI icon components
const iconMap = {
  ViewColumnIcon: ViewColumnIcon,
  ViewModuleIcon: ViewModuleIcon,
  GridViewIcon: GridViewIcon,
  ViewCarouselIcon: ViewCarouselIcon,
  DashboardCustomizeIcon: DashboardCustomizeIcon,
};

interface Store {
  id: string;
  name: string;
  domain: string;
  config: {
    theme: string;
    currency: string;
    storeType: string;
  };
}

interface LayoutTemplate {
  id: string;
  name: string;
  structure: { columns: number[] }[];
  icon: string;
  tones: string[];
  storeTypes: string[];
  pageTypeIds: number[];
  isCustom?: boolean;
}

export default function LayoutControlsPanel({
  pageType,
  designTone,
  storeType,
  setDesignTone,
  setStoreType,
  setLayout,
  setIsCustomLayout,
  layout,
  selectedStoreId,
  setSelectedStoreId,
}) {
  const [stores, setStores] = useState<Store[]>([]);
  const [layouts, setLayouts] = useState<LayoutTemplate[]>([]);
  const [loadingStores, setLoadingStores] = useState(false);
  const [loadingLayouts, setLoadingLayouts] = useState(false);
  const [errorStores, setErrorStores] = useState<string | null>(null);
  const [errorLayouts, setErrorLayouts] = useState<string | null>(null);

  const API_BASE_URL = 'http://localhost:5000/api/v1/cms/layout';

  // Fetch stores on component mount
  useEffect(() => {
    const fetchStores = async () => {
      setLoadingStores(true);
      setErrorStores(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/stores/list`);
        console.log('Stores API Response:', response.data);
        const storesData = response.data.stores || response.data || [];
        setStores(storesData);
        if (storesData.length > 0 && !selectedStoreId) {
          setSelectedStoreId(storesData[0].id);
        }
      } catch (err) {
        setErrorStores(err.message);
      } finally {
        setLoadingStores(false);
      }
    };
    fetchStores();
  }, [selectedStoreId, setSelectedStoreId]);

  // Fetch layouts based on pageType
  useEffect(() => {
    const fetchLayouts = async () => {
      setLoadingLayouts(true);
      setErrorLayouts(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/layout-by-page-type`, {
          params: { pageType }
        });
        console.log('Layouts API Response:', response.data);
        const layoutsData = response.data.layouts || [];
        setLayouts(layoutsData);
      } catch (err) {
        setErrorLayouts(err.message);
      } finally {
        setLoadingLayouts(false);
      }
    };
    fetchLayouts();
  }, [pageType]);

  // Log the storeType of the selected store for debugging
  useEffect(() => {
    if (selectedStoreId) {
      const selectedStore = stores.find(store => store.id === selectedStoreId);
      if (selectedStore) {
        console.log(`Selected store "${selectedStore.name}" has storeType:`, selectedStore.config.storeType);
      }
    }
  }, [selectedStoreId, stores]);

  const handleLayoutChange = (template: LayoutTemplate) => {
    setLayout({ layoutId: template.id, structure: template.structure, pageType });
    setIsCustomLayout(template.isCustom || false);
  };

  // Filter layouts by designTone and storeType (client-side filtering)
  const filteredTemplates = layouts.filter((template) => {
    const matchesTone = template.tones.includes(designTone);
    const matchesStoreType = template.storeTypes.includes(storeType);
    return matchesTone && matchesStoreType;
  });

  // If no layouts match the tone/store type, fall back to showing all layouts for the pageType
  const layoutsToDisplay = filteredTemplates.length > 0 ? filteredTemplates : layouts;

  if (loadingLayouts) {
    return (
      <ControlsContainer elevation={0}>
        <Typography>Loading layouts...</Typography>
      </ControlsContainer>
    );
  }

  if (errorLayouts) {
    return (
      <ControlsContainer elevation={0}>
        <Typography color="error">
          Failed to load layouts: {errorLayouts}
        </Typography>
      </ControlsContainer>
    );
  }

  if (!layouts || layouts.length === 0) {
    return (
      <ControlsContainer elevation={0}>
        <Typography color="error">
          No layout templates available for the selected page type: {pageType}.
        </Typography>
      </ControlsContainer>
    );
  }

  return (
    <ControlsContainer elevation={0}>
      <Fade in timeout={500}>
        <Box>
          <SectionTitle>
            <LayersIcon sx={{ color: '#C0C0C0' }} />
            Choose Layout Structure
          </SectionTitle>
          {filteredTemplates.length === 0 && (
            <Typography color="textSecondary" sx={{ mb: 2 }}>
              No layouts match the selected tone and store type. Showing all layouts for this page type.
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            {layoutsToDisplay.map((template) => {
              const IconComponent = iconMap[template.icon] || DashboardCustomizeIcon;
              return (
                <LayoutButton
                  key={template.id}
                  variant="outlined"
                  onClick={() => handleLayoutChange(template)}
                  className={layout?.layoutId === template.id ? 'Mui-selected' : ''}
                >
                  <IconComponent sx={{ color: '#C0C0C0', fontSize: '2rem' }} />
                  <Typography variant="body2">{template.name}</Typography>
                </LayoutButton>
              );
            })}
          </Box>

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <ControlBox>
              <SectionTitle variant="subtitle1">
                <StoreIcon sx={{ color: '#C0C0C0', fontSize: '1.2rem' }} />
                Select Store
              </SectionTitle>
              {loadingStores ? (
                <Typography>Loading stores...</Typography>
              ) : errorStores ? (
                <Typography color="error">Failed to load stores: {errorStores}</Typography>
              ) : (
                <StyledSelect
                  value={selectedStoreId || ''}
                  onChange={(e) => setSelectedStoreId(e.target.value)}
                  fullWidth
                >
                  {stores.length === 0 ? (
                    <MenuItem value="" disabled>
                      No stores available
                    </MenuItem>
                  ) : (
                    stores.map((store) => (
                      <MenuItem key={store.id} value={store.id}>
                        {store.name} ({store.domain})
                      </MenuItem>
                    ))
                  )}
                </StyledSelect>
              )}
            </ControlBox>

            <ControlBox>
              <SectionTitle variant="subtitle1">
                <PaletteIcon sx={{ color: '#C0C0C0', fontSize: '1.2rem' }} />
                Design Tone
              </SectionTitle>
              <StyledSelect
                value={designTone}
                onChange={(e) => setDesignTone(e.target.value)}
                fullWidth
              >
                {allTones.map((tone) => (
                  <MenuItem key={tone} value={tone}>
                    {tone}
                  </MenuItem>
                ))}
              </StyledSelect>
            </ControlBox>

            <ControlBox>
              <SectionTitle variant="subtitle1">
                <StoreIcon sx={{ color: '#C0C0C0', fontSize: '1.2rem' }} />
                Store Type
              </SectionTitle>
              <StyledSelect
                value={storeType}
                onChange={(e) => setStoreType(e.target.value)}
                fullWidth
              >
                {allStoreTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </StyledSelect>
            </ControlBox>
          </Box>
        </Box>
      </Fade>
    </ControlsContainer>
  );
}