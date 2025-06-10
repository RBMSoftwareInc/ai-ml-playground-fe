'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
  Stack,
  Fade,
  Grow,
  Divider,
  FormControl,
  InputLabel,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import PaletteIcon from '@mui/icons-material/Palette';
import WidgetsIcon from '@mui/icons-material/Widgets';
import HeightIcon from '@mui/icons-material/Height';
import StraightenIcon from '@mui/icons-material/Straighten';
import BorderOuterIcon from '@mui/icons-material/BorderOuter';
import PaddingIcon from '@mui/icons-material/Padding';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import GridOnIcon from '@mui/icons-material/GridOn';
import GapIcon from '@mui/icons-material/SpaceBar';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import WidgetMap from '../fragments/WidgetMap';



const API_BASE_URL = 'http://localhost:5000/api/v1/cms/layout';

// Styled Components (unchanged)
const CanvasContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(145deg, #f7fafc 0%, #e2e8f0 100%)',
  padding: theme.spacing(3),
  overflow: 'auto',
}));

const ControlPanel = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: '#ffffff',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.03)',
  marginBottom: theme.spacing(3),
  border: '1px solid #e2e8f0',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.08), 0 3px 10px rgba(0, 0, 0, 0.05)',
    transform: 'translateY(-2px)',
  },
  width: '100%',
}));

const FragmentPreview = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'fragmentStyle',
})<{ fragmentStyle: any }>(({ theme, fragmentStyle }) => ({
  ...fragmentStyle,
  borderRadius: theme.shape.borderRadius * 2,
  border: `2px dashed #94a3b8`,
  background: fragmentStyle.backgroundColor || '#f7fafc',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
  display: fragmentStyle.display || 'flex',
  flexDirection: fragmentStyle.flexDirection || 'column',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'auto',
  transition: 'all 0.3s ease',
  width: fragmentStyle.width || '100%',
  minHeight: fragmentStyle.minHeight || '300px',
  height: fragmentStyle.height || 'auto',
  padding: fragmentStyle.padding || theme.spacing(2),
  gap: fragmentStyle.gap || theme.spacing(2),
  '&:hover': {
    borderColor: '#4b5563',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
    transform: 'scale(1.005)',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.03)',
    transition: 'all 0.3s ease',
    '&:hover fieldset': {
      borderColor: '#94a3b8',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#4b5563',
      boxShadow: '0 0 5px rgba(75, 85, 99, 0.2)',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#6b7280',
    '&.Mui-focused': {
      color: '#4b5563',
    },
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.03)',
  '& .MuiSelect-select': {
    padding: theme.spacing(1.5),
    color: '#4b5563',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e2e8f0',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#94a3b8',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#4b5563',
    boxShadow: '0 0 5px rgba(75, 85, 99, 0.2)',
  },
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
  },
}));

const PropertyBox = styled(Box)(({ theme }) => ({
  background: '#f7fafc',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
  border: '1px solid #e2e8f0',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
  },
}));

const dimensionsByDevice = {
  mobile: ['450x667', '500x896'],
  tablet: ['900x1024', '1000x1112'],
  desktop: ['1600x768', '1680x900', '2200x1080'],
};

const dimensionDetails = {
  '450x667': { width: 450, height: 667 },
  '500x896': { width: 500, height: 896 },
  '900x1024': { width: 900, height: 1024 },
  '1000x1112': { width: 1000, height: 1112 },
  '1600x768': { width: 1600, height: 768 },
  '1680x900': { width: 1680, height: 900 },
  '2200x1080': { width: 2200, height: 1080 },
};

interface Widget {
  id: number;
  type: string;
  config: any;
  page_types: string[];
  layout_ids: number[];
}

interface FragmentDesignerCanvasProps {
  pageType: string;
  layoutId: number;
  fragment?: {
    id?: string;
    name: string;
    style: any;
    widget?: string;
    allowedWidgets?: string[];
  };
  onSave: (fragment: any) => void;
  onCancel: () => void;
}

export default function FragmentDesignerCanvas({ pageType, layoutId, fragment, onSave, onCancel }: FragmentDesignerCanvasProps) {
  const theme = useTheme();
  const [fragmentName, setFragmentName] = useState(fragment?.name || '');
  const [selectedDevice, setSelectedDevice] = useState('desktop');
  const [selectedSize, setSelectedSize] = useState('1600x768');
  const [zoom, setZoom] = useState(1);
  const [fragmentStyle, setFragmentStyle] = useState(
    fragment?.style || {
      minHeight: '300px',
      width: '100%',
      padding: '16px',
      backgroundColor: '#f7fafc',
      border: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }
  );
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedWidgetId, setSelectedWidgetId] = useState<number | null>(fragment?.widget ? parseInt(fragment.widget) : null);
  const [widgetConfig, setWidgetConfig] = useState<any>(null);

  // Fetch widgets from API based on fragment context
  useEffect(() => {
    const fetchWidgets = async () => {
      try {
        const params = new URLSearchParams();
        if (pageType) params.append('page_type', pageType);
        if (layoutId) params.append('layout_id', layoutId.toString());
        if (fragment?.allowedWidgets) {
          fragment.allowedWidgets.forEach((widgetType) => {
            params.append('allowed_widgets', widgetType);
          });
        }

        const response = await axios.get(`${API_BASE_URL}/data_widgets?${params.toString()}`);
        console.log('Fetched widgets:', response.data);
        setWidgets(response.data); // Fixed: Removed .widgets
        if (selectedWidgetId) {
          const widget = response.data.find((w: Widget) => w.id === selectedWidgetId);
          if (widget) {
            setWidgetConfig(widget.config);
          }
        }
      } catch (error) {
        console.error('Error fetching widgets:', error);
      }
    };
    fetchWidgets();
  }, [pageType, layoutId, fragment?.allowedWidgets]);

  useEffect(() => {
    if (selectedWidgetId) {
      const widget = widgets.find((w) => w.id === selectedWidgetId);
      if (widget) {
        setWidgetConfig(widget.config);
      }
    } else {
      setWidgetConfig(null);
    }
  }, [selectedWidgetId, widgets]);

  const { width } = dimensionDetails[selectedSize];
  const scaledWidth = width * zoom;

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleStyleChange = (property: string, value: string) => {
    setFragmentStyle((prev: any) => ({
      ...prev,
      [property]: value,
    }));
  };

  const handleWidgetConfigChange = (key: string, value: string) => {
    setWidgetConfig((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveFragment = async () => {
    if (!fragmentName) {
      alert('Please enter a fragment name.');
      return;
    }

    const updatedFragment = {
      id: fragment?.id || uuidv4(),
      name: fragmentName,
      pageType,
      layoutId,
      style: fragmentStyle,
      widgetId: selectedWidgetId,
      widgetConfig,
      isUserDefined: true,
    };

    try {
      if (!fragment?.id) {
        await axios.post('/fragment', updatedFragment);
      } else {
        await axios.put(`/fragment/${fragment.id}`, {
          style: updatedFragment.style,
          widgetId: updatedFragment.widgetId,
          widgetConfig: updatedFragment.widgetConfig,
        });
      }
      onSave(updatedFragment);
    } catch (error) {
      console.error('Error saving fragment:', error);
      alert('Failed to save fragment. Please try again.');
    }
  };

  const renderWidgetConfigForm = () => {
    if (!selectedWidgetId || !widgetConfig) return null;

    const widget = widgets.find((w) => w.id === selectedWidgetId);
    if (!widget) return null;

    return (
      <Fade in={true} timeout={500}>
        <PropertyBox>
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <WidgetsIcon sx={{ color: '#4b5563' }} />
            <Typography variant="subtitle1" sx={{ color: '#4b5563', fontWeight: 'medium' }}>
              Widget Configuration ({widget.type})
            </Typography>
          </Stack>
          <Divider sx={{ mb: 2, borderColor: '#e2e8f0' }} />
          <Stack spacing={2}>
            {Object.entries(widgetConfig).map(([key, value]) => (
              <StyledTextField
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                value={value || ''}
                onChange={(e) => handleWidgetConfigChange(key, e.target.value)}
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <Tooltip title={`Configure ${key}`}>
                      <PaletteIcon sx={{ color: '#94a3b8', mr: 1 }} />
                    </Tooltip>
                  ),
                }}
              />
            ))}
          </Stack>
        </PropertyBox>
      </Fade>
    );
  };

  return (
    <CanvasContainer>
      <Fade in={true} timeout={600}>
        <ControlPanel>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6" sx={{ color: '#4b5563', fontWeight: 'bold' }}>
              🎨 Fragment Designer
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Select device type">
              <StyledSelect
                size="small"
                value={selectedDevice}
                onChange={(e) => {
                  const device = e.target.value;
                  setSelectedDevice(device);
                  setSelectedSize(dimensionsByDevice[device][0]);
                }}
              >
                <MenuItem value="mobile">📱 Mobile</MenuItem>
                <MenuItem value="tablet">📲 Tablet</MenuItem>
                <MenuItem value="desktop">🖥️ Desktop</MenuItem>
              </StyledSelect>
            </Tooltip>
            <Tooltip title="Select device resolution">
              <StyledSelect
                size="small"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                {dimensionsByDevice[selectedDevice].map((size) => (
                  <MenuItem key={size} value={size}>{size}</MenuItem>
                ))}
              </StyledSelect>
            </Tooltip>
            <Tooltip title="Zoom In">
              <IconButton
                onClick={handleZoomIn}
                sx={{
                  bgcolor: 'white',
                  borderRadius: 1,
                  boxShadow: '0 1px 5px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #e2e8f0',
                  '&:hover': { bgcolor: '#f7fafc', transform: 'scale(1.05)' },
                }}
              >
                <ZoomInIcon sx={{ color: '#94a3b8' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Zoom Out">
              <IconButton
                onClick={handleZoomOut}
                sx={{
                  bgcolor: 'white',
                  borderRadius: 1,
                  boxShadow: '0 1px 5px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #e2e8f0',
                  '&:hover': { bgcolor: '#f7fafc', transform: 'scale(1.05)' },
                }}
              >
                <ZoomOutIcon sx={{ color: '#94a3b8' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Save Fragment">
              <IconButton
                onClick={handleSaveFragment}
                sx={{
                  bgcolor: 'white',
                  borderRadius: 1,
                  boxShadow: '0 1px 5px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #e2e8f0',
                  '&:hover': { bgcolor: '#f7fafc', transform: 'scale(1.05)' },
                }}
              >
                <SaveIcon sx={{ color: '#94a3b8' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel">
              <IconButton
                onClick={onCancel}
                sx={{
                  bgcolor: 'white',
                  borderRadius: 1,
                  boxShadow: '0 1px 5px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #e2e8f0',
                  '&:hover': { bgcolor: '#f7fafc', transform: 'scale(1.05)' },
                }}
              >
                <CancelIcon sx={{ color: '#94a3b8' }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </ControlPanel>
      </Fade>

      <Box sx={{ display: 'flex', gap: 3, flex: 1 }}>
        <Box sx={{ width: '300px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Fade in={true} timeout={600}>
            <PropertyBox>
              <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                <PaletteIcon sx={{ color: '#4b5563' }} />
                <Typography variant="subtitle1" sx={{ color: '#4b5563', fontWeight: 'medium' }}>
                  Fragment Properties
                </Typography>
              </Stack>
              <Divider sx={{ mb: 2, borderColor: '#e2e8f0' }} />
              <Stack spacing={2}>
                <StyledTextField
                  label="Fragment Name"
                  value={fragmentName}
                  onChange={(e) => setFragmentName(e.target.value)}
                  fullWidth
                  size="small"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <Tooltip title="Enter a unique name for the fragment">
                        <PaletteIcon sx={{ color: '#94a3b8', mr: 1 }} />
                      </Tooltip>
                    ),
                  }}
                />
                <StyledTextField
                  label="Min Height (e.g., 300px)"
                  value={fragmentStyle.minHeight || ''}
                  onChange={(e) => handleStyleChange('minHeight', e.target.value)}
                  fullWidth
                  size="small"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <Tooltip title="Set the minimum height of the fragment">
                        <HeightIcon sx={{ color: '#94a3b8', mr: 1 }} />
                      </Tooltip>
                    ),
                  }}
                />
                <StyledTextField
                  label="Width (e.g., 100%)"
                  value={fragmentStyle.width || ''}
                  onChange={(e) => handleStyleChange('width', e.target.value)}
                  fullWidth
                  size="small"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <Tooltip title="Set the width of the fragment">
                        <StraightenIcon sx={{ color: '#94a3b8', mr: 1 }} />
                      </Tooltip>
                    ),
                  }}
                />
                <StyledTextField
                  label="Padding (e.g., 16px)"
                  value={fragmentStyle.padding || ''}
                  onChange={(e) => handleStyleChange('padding', e.target.value)}
                  fullWidth
                  size="small"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <Tooltip title="Set the padding inside the fragment">
                        <PaddingIcon sx={{ color: '#94a3b8', mr: 1 }} />
                      </Tooltip>
                    ),
                  }}
                />
                <StyledTextField
                  label="Background Color (e.g., #f7fafc)"
                  value={fragmentStyle.backgroundColor || ''}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  fullWidth
                  size="small"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <Tooltip title="Set the background color of the fragment">
                        <PaletteIcon sx={{ color: '#94a3b8', mr: 1 }} />
                      </Tooltip>
                    ),
                  }}
                />
                <StyledTextField
                  label="Border (e.g., 1px solid #e2e8f0)"
                  value={fragmentStyle.border || ''}
                  onChange={(e) => handleStyleChange('border', e.target.value)}
                  fullWidth
                  size="small"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <Tooltip title="Set the border style of the fragment">
                        <BorderOuterIcon sx={{ color: '#94a3b8', mr: 1 }} />
                      </Tooltip>
                    ),
                  }}
                />
                <FormControl fullWidth size="small">
                  <InputLabel>Display</InputLabel>
                  <StyledSelect
                    value={fragmentStyle.display || 'flex'}
                    onChange={(e) => handleStyleChange('display', e.target.value)}
                    label="Display"
                    startAdornment={
                      <Tooltip title="Set the display type of the fragment">
                        <DisplaySettingsIcon sx={{ color: '#94a3b8', mr: 1 }} />
                      </Tooltip>
                    }
                  >
                    <MenuItem value="flex">Flex</MenuItem>
                    <MenuItem value="grid">Grid</MenuItem>
                    <MenuItem value="block">Block</MenuItem>
                  </StyledSelect>
                </FormControl>
                {fragmentStyle.display === 'flex' && (
                  <FormControl fullWidth size="small">
                    <InputLabel>Flex Direction</InputLabel>
                    <StyledSelect
                      value={fragmentStyle.flexDirection || 'column'}
                      onChange={(e) => handleStyleChange('flexDirection', e.target.value)}
                      label="Flex Direction"
                      startAdornment={
                        <Tooltip title="Set the flex direction for child elements">
                          <DisplaySettingsIcon sx={{ color: '#94a3b8', mr: 1 }} />
                        </Tooltip>
                      }
                    >
                      <MenuItem value="row">Row</MenuItem>
                      <MenuItem value="column">Column</MenuItem>
                    </StyledSelect>
                  </FormControl>
                )}
                {fragmentStyle.display === 'grid' && (
                  <StyledTextField
                    label="Grid Template Columns"
                    value={fragmentStyle.gridTemplateColumns || ''}
                    onChange={(e) => handleStyleChange('gridTemplateColumns', e.target.value)}
                    fullWidth
                    size="small"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <Tooltip title="Set the grid template columns (e.g., repeat(auto-fill, minmax(200px, 1fr)))">
                          <GridOnIcon sx={{ color: '#94a3b8', mr: 1 }} />
                        </Tooltip>
                      ),
                    }}
                  />
                )}
                <StyledTextField
                  label="Gap (e.g., 16px)"
                  value={fragmentStyle.gap || ''}
                  onChange={(e) => handleStyleChange('gap', e.target.value)}
                  fullWidth
                  size="small"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <Tooltip title="Set the gap between child elements">
                        <GapIcon sx={{ color: '#94a3b8', mr: 1 }} />
                      </Tooltip>
                    ),
                  }}
                />
                <FormControl fullWidth size="small">
                  <InputLabel>Select Widget</InputLabel>
                  <StyledSelect
                    value={selectedWidgetId ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedWidgetId(value === '' ? null : parseInt(value));
                    }}
                    label="Select Widget"
                    startAdornment={
                      <Tooltip title="Select a widget to display in the fragment">
                        <WidgetsIcon sx={{ color: '#94a3b8', mr: 1 }} />
                      </Tooltip>
                    }
                  >
                    <MenuItem value="">None</MenuItem>
                    {console.log('Widgets in dropdown:', widgets)}
                    {widgets.map((widget) => (
                      <MenuItem key={widget.id} value={widget.id}>
                        {widget.type}
                      </MenuItem>
                    ))}
                  </StyledSelect>
                </FormControl>
              </Stack>
            </PropertyBox>
          </Fade>
          {renderWidgetConfigForm()}
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          <Grow in={true} timeout={800}>
            <FragmentPreview fragmentStyle={fragmentStyle} sx={{ width: scaledWidth, maxWidth: '100%' }}>
              {selectedWidgetId ? (
                <WidgetMap type={widgets.find((w) => w.id === selectedWidgetId)?.type || ''} config={widgetConfig} />
              ) : (
                <Typography variant="h6" color="#4b5563">
                  Fragment Preview
                </Typography>
              )}
            </FragmentPreview>
          </Grow>
        </Box>
      </Box>
    </CanvasContainer>
  );
}