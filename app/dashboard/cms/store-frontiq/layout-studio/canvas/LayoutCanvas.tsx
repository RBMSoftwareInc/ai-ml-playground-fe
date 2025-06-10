'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  IconButton,
  Fab,
  Tooltip,
  Divider,
  Chip,
  Fade,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DownloadIcon from '@mui/icons-material/Download';
import GridOnIcon from '@mui/icons-material/GridOn';
import GridOffIcon from '@mui/icons-material/GridOff';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import SettingsIcon from '@mui/icons-material/Settings';
import StoreIcon from '@mui/icons-material/Store';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PercentIcon from '@mui/icons-material/Percent';
import InfoIcon from '@mui/icons-material/Info';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import WidgetPicker from '../fragments/WidgetPicker';

// Styled Components
const CanvasContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(145deg, #F5F5F5 0%, #E0E0E0 100%)',
  padding: theme.spacing(3),
  overflow: 'auto',
}));

const ControlPanel = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: '#FFFFFF',
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  marginBottom: theme.spacing(2),
  border: `1px solid #C0C0C0`,
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
  },
  width: '100%',
}));

const CanvasPaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid #C0C0C0`,
  background: '#FFFFFF',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100%',
}));

const SlotPaper = styled(Paper)(({ theme, showGrid }) => ({
  minHeight: 300,
  height: 'auto',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  border: showGrid ? `2px dashed #A9A9A9` : `1px solid #C0C0C0`,
  background: '#F5F5F5',
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease',
  width: '100%',
  boxSizing: 'border-box',
  position: 'relative',
  '&:hover': {
    background: '#E0E0E0',
    borderColor: '#616161',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    transform: 'scale(1.02)',
  },
}));

const StyledFab = styled(Fab)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': { boxShadow: `0 0 0 0 rgba(169, 169, 169, 0.5)` },
    '70%': { boxShadow: `0 0 0 10px rgba(169, 169, 169, 0)` },
    '100%': { boxShadow: `0 0 0 0 rgba(169, 169, 169, 0)` },
  },
  '&:hover': {
    transform: 'scale(1.1)',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  zIndex: 1400,
}));

const RowContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  width: '100%',
  marginBottom: theme.spacing(4),
  padding: 0,
  position: 'relative',
}));

const HeaderFooterBox = styled(Box)(({ theme, isFooter }) => ({
  width: '100%',
  padding: theme.spacing(2),
  backgroundColor: '#E0E0E0',
  border: '1px solid #C0C0C0',
  borderRadius: theme.shape.borderRadius,
  boxSizing: 'border-box',
  ...(isFooter && {
    position: 'sticky',
    bottom: 0,
    zIndex: 1000,
    borderTop: '1px solid #C0C0C0',
  }),
}));

const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: '#A9A9A9',
  backgroundColor: 'white',
  borderColor: '#C0C0C0',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  margin: theme.spacing(0.5),
  boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#E0E0E0',
    borderColor: '#616161',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
    transform: 'scale(1.05)',
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
  id: string;
  name: string;
  type: string;
}

interface WidgetConfig {
  [key: string]: { type: string; id: string | null };
}

interface LayoutCanvasProps {
  layout: { structure: { columns: number[] }[] };
  setLayout: React.Dispatch<React.SetStateAction<{ structure: { columns: number[] }[] }>>;
  widgetConfig: WidgetConfig;
  setWidgetConfig: React.Dispatch<React.SetStateAction<WidgetConfig>>;
  isCustomLayout: boolean;
  setIsCustomLayout: React.Dispatch<React.SetStateAction<boolean>>;
  selectedStoreId: string | ''; // Added to receive selected store ID from parent
}

export default function LayoutCanvas({
  layout,
  setLayout,
  widgetConfig,
  setWidgetConfig,
  isCustomLayout,
  setIsCustomLayout,
  selectedStoreId,
}: LayoutCanvasProps) {
  const theme = useTheme();
  const [dataWidgets, setDataWidgets] = useState<Widget[]>([]);
  const [selectedDevice, setSelectedDevice] = useState('desktop');
  const [selectedSize, setSelectedSize] = useState('1600x768');
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [openPicker, setOpenPicker] = useState(false);
  const [currentSlot, setCurrentSlot] = useState('');
  const [loading, setLoading] = useState({ widgets: false, save: false, delete: false });
  const [error, setError] = useState({ widgets: null, save: null, delete: null });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const API_BASE_URL = 'http://localhost:5000/api/v1/cms/layout';

  const { width, height } = dimensionDetails[selectedSize];
  const scaledWidth = width * zoom;

  // Fetch data widgets for WidgetPicker
  useEffect(() => {
    const fetchDataWidgets = async () => {
      setLoading(prev => ({ ...prev, widgets: true }));
      setError(prev => ({ ...prev, widgets: null }));
      try {
        const response = await axios.get(`${API_BASE_URL}/data_widgets`);
        setDataWidgets(response.data.widgets || []);
      } catch (err) {
        setError(prev => ({ ...prev, widgets: err.message }));
        setSnackbar({ open: true, message: 'Failed to fetch data widgets', severity: 'error' });
      } finally {
        setLoading(prev => ({ ...prev, widgets: false }));
      }
    };
    fetchDataWidgets();
  }, []);

  const handleOpenPicker = (slotKey: string) => {
    setCurrentSlot(slotKey);
    setOpenPicker(true);
  };

  const handleWidgetSelect = (widget: string) => {
    setWidgetConfig((prev) => ({
      ...prev,
      [currentSlot]: { type: widget, id: null }, // ID will be set after saving
    }));
    setOpenPicker(false);
  };

  const handleRemoveWidget = (slotKey: string) => {
    setWidgetConfig((prev) => {
      const updated = { ...prev };
      delete updated[slotKey];
      return updated;
    });
  };

  const handleAddRow = (structure: number[]) => {
    setLayout({ ...layout, structure: [...layout.structure, { columns: structure }] });
  };

  const handleRemoveRow = (rowIdx: number) => {
    setLayout({ ...layout, structure: layout.structure.filter((_: any, idx: number) => idx !== rowIdx) });
  };

  const handleAddColumn = (rowIdx: number) => {
    const updated = [...layout.structure];
    const newCols = updated[rowIdx].columns.length + 1;
    const baseWidth = Math.floor(100 / newCols);
    const remainder = 100 - baseWidth * newCols;
    const adjustedColumns = Array(newCols).fill(baseWidth);
    for (let i = 0; i < remainder; i++) {
      adjustedColumns[i]++;
    }
    updated[rowIdx].columns = adjustedColumns;
    setLayout({ ...layout, structure: updated });
  };

  const handleRemoveColumn = (rowIdx: number, colIdx: number) => {
    const updated = [...layout.structure];
    if (updated[rowIdx].columns.length <= 1) return;
    updated[rowIdx].columns.splice(colIdx, 1);
    const newCols = updated[rowIdx].columns.length;
    const baseWidth = Math.floor(100 / newCols);
    const remainder = 100 - baseWidth * newCols;
    const adjustedColumns = Array(newCols).fill(baseWidth);
    for (let i = 0; i < remainder; i++) {
      adjustedColumns[i]++;
    }
    updated[rowIdx].columns = adjustedColumns;
    setLayout({ ...layout, structure: updated });
  };

  const exportLayoutJSON = () => {
    const data = JSON.stringify({ layout, widgetConfig }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'layout.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveLayout = async () => {
    if (!selectedStoreId) {
      setSnackbar({ open: true, message: 'Please select a store in the controls panel', severity: 'error' });
      return;
    }

    setLoading(prev => ({ ...prev, save: true }));
    setError(prev => ({ ...prev, save: null }));
    try {
      // Map layout structure to backend format
      const sections = layout.structure.map((row, rowIdx) => ({
        id: `section${rowIdx}`,
        fragment_ids: row.columns.map((_, colIdx) => {
          const slotKey = `slot_${rowIdx}_${colIdx}`;
          return widgetConfig[slotKey]?.id || null;
        }).filter(id => id), // Only include slots with fragments
      }));

      // Map widgetConfig to fragments
      const fragments = Object.keys(widgetConfig).map((slotKey, idx) => {
        const [_, rowIdx, colIdx] = slotKey.split('_').map(Number);
        return {
          id: widgetConfig[slotKey].id || undefined, // Include ID if editing an existing fragment
          name: widgetConfig[slotKey].type,
          style: { background: '#FFFFFF', padding: '16px' }, // Default style
          widget_id: widgetConfig[slotKey].id || undefined,
          order_num: idx,
          version: 1,
          status: 'Active',
          is_user_defined: true,
        };
      });

      const layoutData = {
        store_id: selectedStoreId,
        page_type: layout.pageType || 'homepage', // Use pageType from layout
        name: `Layout for ${selectedStoreId} - ${layout.pageType || 'homepage'}`,
        is_custom: isCustomLayout,
        structure: { type: 'custom', sections },
        fragments,
      };

      let response;
      // Since we're not tracking layouts in LayoutCanvas anymore, we'll always create a new layout
      // If you need to update existing layouts, this logic will need to be moved to the parent
      response = await axios.post(`${API_BASE_URL}/layouts`, layoutData);

      setSnackbar({ open: true, message: 'Layout saved successfully', severity: 'success' });
    } catch (err) {
      setError(prev => ({ ...prev, save: err.message }));
      setSnackbar({ open: true, message: 'Failed to save layout: ' + err.message, severity: 'error' });
    } finally {
      setLoading(prev => ({ ...prev, save: false }));
    }
  };

  const handleDeleteLayout = async () => {
    // Since we removed layout selection, we'll just clear the canvas
    setLayout({ structure: [] });
    setWidgetConfig({} as WidgetConfig);
    setSnackbar({ open: true, message: 'Canvas cleared', severity: 'success' });
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));

  const renderRow = (row: any, rowIdx: number) => (
    <Fade in key={rowIdx}>
      <RowContainer>
        <Box sx={{ width: '100%', position: 'absolute', top: -30 }}>
          <RowContainer>
            {row.columns.map((col: number, colIdx: number) => (
              <Box key={colIdx} flex={col / 100} textAlign="center">
                <Tooltip title={`Column width: ${col}%`}>
                  <Chip
                    label={`${col}%`}
                    size="small"
                    icon={<PercentIcon fontSize="small" sx={{ color: '#616161' }} />}
                    sx={{ bgcolor: '#E0E0E0', color: '#616161', fontWeight: 'bold' }}
                  />
                </Tooltip>
              </Box>
            ))}
          </RowContainer>
        </Box>

        {row.columns.map((col: number, colIdx: number) => {
          const key = `slot_${rowIdx}_${colIdx}`;
          return (
            <Box key={key} flex={col / 100} sx={{ minHeight: 300, position: 'relative' }}>
              <SlotPaper showGrid={showGrid}>
                {widgetConfig?.[key] ? (
                  <>
                    <Typography variant="body1">{widgetConfig[key]?.type || 'Widget'}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Tooltip title="Replace this widget">
                        <ActionButton size="small" onClick={() => handleOpenPicker(key)} startIcon={<SwapHorizIcon />}>
                          Replace
                        </ActionButton>
                      </Tooltip>
                      <Tooltip title="Remove this widget">
                        <ActionButton size="small" onClick={() => handleRemoveWidget(key)} startIcon={<DeleteIcon />}>
                          Remove
                        </ActionButton>
                      </Tooltip>
                    </Box>
                  </>
                ) : (
                  <Tooltip title="Add a widget">
                    <Button
                      variant="contained"
                      onClick={() => handleOpenPicker(key)}
                      startIcon={<AddCircleOutlineIcon />}
                      sx={{ backgroundColor: '#A9A9A9', color: 'white', '&:hover': { backgroundColor: '#616161' } }}
                    >
                      Add Widget
                    </Button>
                  </Tooltip>
                )}

                {isCustomLayout && (
                  <>
                    <StyledFab size="small" onClick={() => handleAddColumn(rowIdx)} sx={{ position: 'absolute', right: -20, top: 10 }}>
                      <AddIcon fontSize="small" />
                    </StyledFab>
                    <StyledFab
                      size="small"
                      onClick={() => handleRemoveColumn(rowIdx, colIdx)}
                      disabled={row.columns.length <= 1}
                      sx={{ position: 'absolute', left: -20, top: 10 }}
                    >
                      <RemoveIcon fontSize="small" />
                    </StyledFab>
                  </>
                )}
              </SlotPaper>
            </Box>
          );
        })}

        {isCustomLayout && (
          <>
            <StyledFab size="medium" onClick={() => handleRemoveRow(rowIdx)} sx={{ position: 'absolute', left: -60, bottom: -30 }}>
              <RemoveIcon fontSize="medium" />
            </StyledFab>
            <StyledFab size="medium" onClick={() => handleAddRow(row.columns)} sx={{ position: 'absolute', right: -60, bottom: -30 }}>
              <AddIcon fontSize="medium" />
            </StyledFab>
          </>
        )}
      </RowContainer>
    </Fade>
  );

  return (
    <CanvasContainer>
      <ControlPanel>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ color: '#616161', fontWeight: 'bold' }}>
            🎨 Layout Studio
          </Typography>
          <Tooltip title="Current mode">
            <Chip
              label={isCustomLayout ? 'Custom Mode' : 'View Mode'}
              icon={<SettingsIcon />}
              sx={{ bgcolor: '#E0E0E0', color: '#616161' }}
              onClick={() => setIsCustomLayout(!isCustomLayout)}
            />
          </Tooltip>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Device type">
            <Select
              size="small"
              value={selectedDevice}
              onChange={(e) => {
                setSelectedDevice(e.target.value);
                setSelectedSize(dimensionsByDevice[e.target.value][0]);
              }}
            >
              <MenuItem value="mobile">📱 Mobile</MenuItem>
              <MenuItem value="tablet">📲 Tablet</MenuItem>
              <MenuItem value="desktop">🖥️ Desktop</MenuItem>
            </Select>
          </Tooltip>
          <Tooltip title="Resolution">
            <Select size="small" value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
              {dimensionsByDevice[selectedDevice].map((size) => (
                <MenuItem key={size} value={size}>{size}</MenuItem>
              ))}
            </Select>
          </Tooltip>
          <Tooltip title="Zoom In">
            <IconButton onClick={handleZoomIn}>
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out">
            <IconButton onClick={handleZoomOut}>
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle Grid">
            <IconButton onClick={() => setShowGrid(!showGrid)}>
              {showGrid ? <GridOnIcon /> : <GridOffIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Export">
            <IconButton onClick={exportLayoutJSON}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Clear Canvas">
            <IconButton onClick={handleDeleteLayout} disabled={loading.delete}>
              {loading.delete ? <CircularProgress size={24} /> : <DeleteIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Save Layout">
            <IconButton onClick={handleSaveLayout} disabled={loading.save || !selectedStoreId}>
              {loading.save ? <CircularProgress size={24} /> : <SaveIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </ControlPanel>

      {error.widgets && <Alert severity="error" sx={{ mb: 2 }}>{error.widgets}</Alert>}

      <Box sx={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <CanvasPaper sx={{ width: scaledWidth, maxWidth: '100%' }}>
          <HeaderFooterBox>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="subtitle2">
                <StoreIcon /> Your Brand
              </Typography>
              <Typography variant="subtitle2">
                Welcome, Admin <EmojiPeopleIcon />
              </Typography>
            </Box>
          </HeaderFooterBox>

          <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
            {layout.structure.length > 0 ? (
              layout.structure.map((row: any, rowIdx: number) => renderRow(row, rowIdx))
            ) : (
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight={300}>
                <Typography variant="h6" color="#616161">
                  <InfoIcon sx={{ mr: 1 }} /> No Rows Added
                </Typography>
                <Button onClick={() => handleAddRow([100])} startIcon={<AddIcon />} variant="contained">
                  Add First Row
                </Button>
              </Box>
            )}
          </Box>

          <Divider sx={{ borderColor: '#C0C0C0' }} />
          <HeaderFooterBox isFooter>
            <Box display="flex" justifyContent="center">
              <Typography variant="caption">© 2025 Your Store Footer</Typography>
            </Box>
          </HeaderFooterBox>
        </CanvasPaper>
      </Box>

      <WidgetPicker
        open={openPicker}
        onClose={() => setOpenPicker(false)}
        onSelect={handleWidgetSelect}
        fragmentId={''}
        widgets={dataWidgets.map(widget => widget.name)} // Pass widget names to WidgetPicker
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </CanvasContainer>
  );
}