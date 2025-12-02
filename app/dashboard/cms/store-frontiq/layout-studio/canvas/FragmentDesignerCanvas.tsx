'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Stack,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  TextField,
  useTheme,
  Switch,
  alpha,
  Tooltip,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from '@mui/material';
import { styled, createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/system';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import WidgetsIcon from '@mui/icons-material/Widgets';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { DndContext, closestCenter, useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChromePicker } from 'react-color';
import useUndo from 'use-undo';
import { useRouter } from 'next/navigation';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';

const API_BASE_URL = 'http://localhost:5000/api/v1/cms/layout';

// Theme Configuration
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#F3F4F6', paper: '#FFFFFF' },
    primary: { main: '#C0C0C0' }, // Silver
    secondary: { main: '#4B5563' }, // Dark Gray
    text: { primary: '#1F2937', secondary: '#6B7280' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: { fontWeight: 600 },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
  },
  shape: { borderRadius: 8 },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#1F2937', paper: '#374151' },
    primary: { main: '#C0C0C0' }, // Silver
    secondary: { main: '#6B7280' }, // Lighter Gray
    text: { primary: '#F9FAFB', secondary: '#9CA3AF' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: { fontWeight: 600 },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem' },
  },
  shape: { borderRadius: 8 },
});

// Styled Components
const DesignerContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: 'calc(100vh - 128px)', // Adjust for Header and Footer
  backgroundColor: '#F5F5F5',
  padding: theme.spacing(4),
}));

const CanvasSection = styled(Box)(({ theme }) => ({
  flex: 2,
  display: 'flex',
  flexDirection: 'column',
  paddingRight: theme.spacing(3),
  borderRight: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
}));

const ControlsPanel = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: theme.palette.background.paper,
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  marginBottom: theme.spacing(2),
}));

const FragmentSelectorPanel = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: theme.palette.background.paper,
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  marginBottom: theme.spacing(2),
}));

const CanvasArea = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  background: alpha(theme.palette.background.paper, 0.5),
  borderRadius: theme.shape.borderRadius,
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.primary.main,
    borderRadius: '3px',
  },
}));

const SidePanel = styled(Box)(({ theme }) => ({
  flex: 1,
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  boxShadow: '0 2px 15px rgba(0, 0, 0, 0.05)',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.primary.main,
    borderRadius: '3px',
  },
}));

const FragmentPreview = styled(Box, {
  shouldForwardProp: (prop) => !['fragmentStyle', 'isDesignMode'].includes(prop as string),
})<{ fragmentStyle: any; isDesignMode: boolean }>(({ theme, fragmentStyle, isDesignMode }) => ({
  ...fragmentStyle,
  borderRadius: theme.shape.borderRadius,
  border: isDesignMode ? `2px dashed ${theme.palette.secondary.main}` : 'none',
  background: fragmentStyle.backgroundColor || theme.palette.background.paper,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  display: fragmentStyle.display || 'flex',
  flexDirection: fragmentStyle.flexDirection || 'column',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'auto',
  transition: 'all 0.3s ease',
  padding: fragmentStyle.padding || theme.spacing(2),
  gap: fragmentStyle.gap || theme.spacing(2),
  '&:hover': isDesignMode
    ? {
        borderColor: theme.palette.primary.main,
        boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
      }
    : {},
}));

const WidgetCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  cursor: 'pointer',
  background: theme.palette.background.default,
  border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
  borderRadius: theme.shape.borderRadius,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: alpha(theme.palette.primary.main, 0.1),
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },
}));

const WidgetProperties = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: alpha(theme.palette.background.default, 0.5),
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(1),
  border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
}));

const TabPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  paddingTop: theme.spacing(2),
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.primary.main,
    borderRadius: '3px',
  },
}));

const ElegantDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(3),
    background: theme.palette.background.paper,
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
    width: '500px',
    maxWidth: '90vw',
  },
}));

const ElegantDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  paddingBottom: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const ElegantDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
  '& > *': {
    marginBottom: theme.spacing(2),
  },
}));

const ElegantDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  marginTop: theme.spacing(2),
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

interface FragmentDesignerCanvasProps {
  pageType: string;
  layoutId: number;
  fragment: Fragment | null;
  onSave: (fragment: Fragment) => void;
  onCancel: () => void;
  fragments: Fragment[];
  setFragments: React.Dispatch<React.SetStateAction<Fragment[]>>;
  handleFragmentSelect: (fragment: Fragment) => void;
  handleCreateNewFragment: () => void;
}

const DroppablePreview = ({ children, fragmentStyle, isDesignMode }: { children: React.ReactNode; fragmentStyle: any; isDesignMode: boolean }) => {
  const { setNodeRef } = useDroppable({
    id: 'preview-droppable',
  });

  return (
    <FragmentPreview
      ref={setNodeRef}
      fragmentStyle={fragmentStyle}
      isDesignMode={isDesignMode}
      sx={{ width: '100%', height: '100%' }}
    >
      {children}
    </FragmentPreview>
  );
};

function TabPanelComponent(props: { children: React.ReactNode; value: number; index: number }) {
  const { children, value, index, ...other } = props;

  return (
    <TabPanel
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && children}
    </TabPanel>
  );
}

export default function FragmentDesignerCanvas({
  pageType,
  layoutId,
  fragment,
  onSave,
  onCancel,
  fragments,
  setFragments,
  handleFragmentSelect,
  handleCreateNewFragment,
}: FragmentDesignerCanvasProps) {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const theme = useTheme();
  const router = useRouter();
  const [selectedDevice, setSelectedDevice] = useState<string>('desktop');
  const [selectedSize, setSelectedSize] = useState<string>('1600x768');
  const [zoom, setZoom] = useState<number>(1);
  const [isDesignMode, setIsDesignMode] = useState<boolean>(true);
  const [fragmentStyleState, fragmentStyleActions] = useUndo({
    minHeight: '300px',
    width: '100%',
    padding: '16px',
    backgroundColor: themeMode === 'light' ? '#F3F4F6' : '#374151',
    border: '1px solid #E5E7EB',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  });
  const fragmentStyle = fragmentStyleState.present;
  const { set: setFragmentStyle, undo, redo, canUndo, canRedo } = fragmentStyleActions;
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedWidgetId, setSelectedWidgetId] = useState<number | null>(null);
  const [widgetConfig, setWidgetConfig] = useState<any>({});
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [fragmentName, setFragmentName] = useState<string>(fragment?.name || '');
  const [expandedWidgetId, setExpandedWidgetId] = useState<number | null>(null);
  const [openCreateWidgetDialog, setOpenCreateWidgetDialog] = useState<boolean>(false);
  const [newWidgetType, setNewWidgetType] = useState<string>('Text Widget');
  const [newWidgetName, setNewWidgetName] = useState<string>('');
  const [newWidgetConfig, setNewWidgetConfig] = useState<any>({});

  // Log the incoming fragment and fragments list for debugging
  useEffect(() => {
    console.log('FragmentDesignerCanvas received fragment:', fragment);
    console.log('Fragments list:', fragments);
    console.log('Current pageType:', pageType);
    console.log('Filtered fragments for dropdown:', fragments.filter((f) => f.pageType === pageType));
  }, [fragment, fragments, pageType]);

  // Log the layoutId
  useEffect(() => {
    console.log('FragmentDesignerCanvas layoutId:', layoutId);
  }, [layoutId]);

  // Log fragmentStyle updates
  useEffect(() => {
    console.log('Current fragmentStyle:', fragmentStyle);
  }, [fragmentStyle]);

  // Fetch widgets
  useEffect(() => {
    const fetchWidgets = async () => {
      try {
        const params = new URLSearchParams();
        params.append('page_type', pageType);
        params.append('layout_id', layoutId.toString());
        const response = await axios.get(`${API_BASE_URL}/data_widgets?${params.toString()}`);
        const widgetsData: Widget[] = response.data;
        console.log('Fetched widgets:', widgetsData); // Debug: Log widgets
        setWidgets(widgetsData);
      } catch (error) {
        console.error('Error fetching widgets:', error);
      }
    };

    fetchWidgets();
  }, [pageType, layoutId]);

  // Update fragment style and widget config when a fragment is selected
  useEffect(() => {
    if (fragment) {
      console.log('Initializing fragment properties:', fragment);
      setFragmentName(fragment.name || '');
      const newStyle = {
        minHeight: fragment.style?.minHeight || '300px',
        width: fragment.style?.width || '100%',
        padding: fragment.style?.padding || '16px',
        backgroundColor: fragment.style?.backgroundColor || (themeMode === 'light' ? '#F3F4F6' : '#374151'),
        border: fragment.style?.border || '1px solid #E5E7EB',
        display: fragment.style?.display || 'flex',
        flexDirection: fragment.style?.flexDirection || 'column',
        gap: fragment.style?.gap || '16px',
      };
      setFragmentStyle(newStyle);
      console.log('Set fragmentStyle:', newStyle);
      setSelectedWidgetId(fragment.widgetId || null);
      setWidgetConfig(fragment.widgetConfig || {});
    } else {
      console.log('No fragment selected, resetting to defaults');
      const defaultStyle = {
        minHeight: '300px',
        width: '100%',
        padding: '16px',
        backgroundColor: themeMode === 'light' ? '#F3F4F6' : '#374151',
        border: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      };
      setFragmentName('');
      setFragmentStyle(defaultStyle);
      console.log('Reset fragmentStyle to defaults:', defaultStyle);
      setSelectedWidgetId(null);
      setWidgetConfig({});
    }
  }, [fragment, themeMode, setFragmentStyle]);

  // Update widgetConfig when selectedWidgetId changes
  useEffect(() => {
    if (selectedWidgetId) {
      const widget = widgets.find((w) => w.id === selectedWidgetId);
      if (widget) {
        console.log('Setting widget config for widget:', widget); // Debug: Log widget config
        setWidgetConfig(widget.config || {});
      } else {
        setWidgetConfig({});
      }
    } else {
      setWidgetConfig({});
    }
  }, [selectedWidgetId, widgets]);

  // Hotkeys
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        handleSaveFragment();
      }
      if (event.key === 'Escape') {
        handleCancel();
      }
      if (event.ctrlKey && event.key === 'z') {
        event.preventDefault();
        if (canUndo) undo();
      }
      if (event.ctrlKey && event.key === 'y') {
        event.preventDefault();
        if (canRedo) redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo]);

  const { width } = dimensionDetails[selectedSize];
  const scaledWidth = width * zoom;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));

  const handleStyleChange = (property: string, value: any) => {
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

  const handleNewWidgetConfigChange = (key: string, value: string) => {
    setNewWidgetConfig((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveFragment = async () => {
    if (!fragmentName) {
      alert('Please enter a fragment name.');
      return;
    }

    const updatedFragment: Fragment = {
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
        await axios.post(`${API_BASE_URL}/fragments`, updatedFragment);
      } else {
        await axios.put(`${API_BASE_URL}/fragments/${fragment.id}`, {
          style: updatedFragment.style,
          widgetId: updatedFragment.widgetId,
          widgetConfig: updatedFragment.widgetConfig,
        });
      }
      onSave(updatedFragment);
      handleCancel();
    } catch (error) {
      console.error('Error saving fragment:', error);
      alert('Failed to save fragment. Please try again.');
    }
  };

  const handleCancel = () => {
    onCancel();
    const targetLayoutId = layoutId && !isNaN(layoutId) && layoutId > 0 ? layoutId : 1;
    console.log('Navigating back to layout editor with layoutId:', targetLayoutId);
    router.push(`/dashboard/cms/store-frontiq/layout-studio`);
  };

  const onDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || over.id !== 'preview-droppable') return;

    const widgetId = parseInt(active.id);
    setSelectedWidgetId(widgetId);
    setExpandedWidgetId(widgetId);
  };

  const handleCreateWidget = async () => {
    if (!newWidgetName) {
      alert('Please enter a widget name.');
      return;
    }

    const newWidget: Widget = {
      id: widgets.length + 1, // Temporary ID; ideally from backend
      type: newWidgetType,
      config: newWidgetConfig,
      page_types: [pageType],
      layout_ids: [layoutId],
    };

    try {
      setWidgets((prev) => [...prev, newWidget]);
      setOpenCreateWidgetDialog(false);
      setNewWidgetName('');
      setNewWidgetType('Text Widget');
      setNewWidgetConfig({});
    } catch (error) {
      console.error('Error creating widget:', error);
      alert('Failed to create widget. Please try again.');
    }
  };

  const WidgetItem = ({ widget }: { widget: Widget }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: widget.id.toString() });
    const isExpanded = expandedWidgetId === widget.id;

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const handleWidgetClick = () => {
      if (expandedWidgetId === widget.id) {
        setExpandedWidgetId(null);
        setSelectedWidgetId(null);
      } else {
        setExpandedWidgetId(widget.id);
        setSelectedWidgetId(widget.id);
      }
    };

    const renderWidgetProperties = () => {
      if (!isExpanded) return null;

      if (widget.type === 'HTML Widget') {
        return (
          <WidgetProperties>
            <Typography variant="body2" sx={{ mb: 2 }}>
              HTML Editor
            </Typography>
            <AceEditor
              mode="html"
              theme="monokai"
              value={widgetConfig.html || '<div>Write your HTML here...</div>'}
              onChange={(value) => handleWidgetConfigChange('html', value)}
              name={`html-editor-${widget.id}`}
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2,
              }}
              style={{ width: '100%', height: '200px', borderRadius: theme.shape.borderRadius }}
            />
          </WidgetProperties>
        );
      }

      return (
        <WidgetProperties>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {widget.type} Properties
          </Typography>
          {Object.keys(widgetConfig).length > 0 ? (
            <Box display="grid" gridTemplateColumns="1fr" gap={2}>
              {Object.entries(widgetConfig).map(([key, value]) => (
                <Tooltip
                  key={key}
                  title={
                    key === 'text' && widget.type === 'CTA Widget'
                      ? 'The text displayed on the CTA button (e.g., "Buy Now").'
                      : key === 'url' && widget.type === 'CTA Widget'
                      ? 'The URL the CTA button links to (e.g., "https://example.com").'
                      : key === 'backgroundColor' && widget.type === 'CTA Widget'
                      ? 'The background color of the CTA button (e.g., "#FFFFFF").'
                      : ''
                  }
                  placement="top"
                >
                  <TextField
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={value || ''}
                    onChange={(e) => handleWidgetConfigChange(key, e.target.value)}
                    fullWidth
                    size="small"
                    variant="outlined"
                    placeholder={
                      key === 'text' && widget.type === 'CTA Widget'
                        ? 'e.g., "Click Me"'
                        : key === 'url' && widget.type === 'CTA Widget'
                        ? 'e.g., "https://example.com"'
                        : ''
                    }
                    sx={{ bgcolor: alpha(theme.palette.background.default, 0.5) }}
                  />
                </Tooltip>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, textAlign: 'center', mt: 2 }}>
              No configurable properties for this widget.
            </Typography>
          )}
        </WidgetProperties>
      );
    };

    return (
      <Box>
        <WidgetCard
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          onClick={handleWidgetClick}
        >
          <WidgetsIcon color={selectedWidgetId === widget.id ? 'primary' : 'action'} />
          <Typography variant="body2" sx={{ flex: 1 }}>
            {widget.type}
          </Typography>
        </WidgetCard>
        <Collapse in={isExpanded}>{renderWidgetProperties()}</Collapse>
      </Box>
    );
  };

  const renderWidgetConfigForm = () => {
    switch (newWidgetType) {
      case 'Text Widget':
        return (
          <>
            <TextField
              label="Text Content"
              value={newWidgetConfig.text || ''}
              onChange={(e) => handleNewWidgetConfigChange('text', e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Enter text content"
            />
            <TextField
              label="Text Color"
              value={newWidgetConfig.color || '#000000'}
              onChange={(e) => handleNewWidgetConfigChange('color', e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              placeholder="#000000"
            />
            <FormControl fullWidth size="small">
              <InputLabel>Font Size</InputLabel>
              <Select
                value={newWidgetConfig.fontSize || '16px'}
                onChange={(e) => handleNewWidgetConfigChange('fontSize', e.target.value)}
                label="Font Size"
              >
                {['12px', '14px', '16px', '18px', '20px', '24px'].map((size) => (
                  <MenuItem key={size} value={size}>{size}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        );
      case 'Image Widget':
        return (
          <>
            <TextField
              label="Image URL"
              value={newWidgetConfig.url || ''}
              onChange={(e) => handleNewWidgetConfigChange('url', e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              placeholder="https://example.com/image.jpg"
            />
            <TextField
              label="Alt Text"
              value={newWidgetConfig.alt || ''}
              onChange={(e) => handleNewWidgetConfigChange('alt', e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Describe the image"
            />
            <TextField
              label="Width (px)"
              value={newWidgetConfig.width || '100%'}
              onChange={(e) => handleNewWidgetConfigChange('width', e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              placeholder="e.g., 100% or 200px"
            />
          </>
        );
      case 'CTA Widget':
        return (
          <>
            <TextField
              label="Button Text"
              value={newWidgetConfig.text || ''}
              onChange={(e) => handleNewWidgetConfigChange('text', e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              placeholder="e.g., Buy Now"
            />
            <TextField
              label="URL"
              value={newWidgetConfig.url || ''}
              onChange={(e) => handleNewWidgetConfigChange('url', e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              placeholder="https://example.com"
            />
            <TextField
              label="Background Color"
              value={newWidgetConfig.backgroundColor || '#C0C0C0'}
              onChange={(e) => handleNewWidgetConfigChange('backgroundColor', e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              placeholder="#C0C0C0"
            />
          </>
        );
      case 'HTML Widget':
        return (
          <>
            <Typography variant="body2" sx={{ mb: 1 }}>
              HTML Content
            </Typography>
            <AceEditor
              mode="html"
              theme="monokai"
              value={newWidgetConfig.html || '<div>Write your HTML here...</div>'}
              onChange={(value) => handleNewWidgetConfigChange('html', value)}
              name="html-editor-new-widget"
              editorProps={{ $blockScrolling: true }}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2,
              }}
              style={{ width: '100%', height: '200px', borderRadius: theme.shape.borderRadius }}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={themeMode === 'light' ? lightTheme : darkTheme}>
      <DesignerContainer>
        <Typography variant="h4" gutterBottom>
          Fragment Designer
        </Typography>

        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Canvas Section */}
          <CanvasSection>
            {/* Header with Back Button */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, px: 2 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleCancel}
                sx={{ color: theme.palette.text.primary }}
              >
                Back to Layout Editor
              </Button>
              <Stack direction="row" spacing={1}>
                <IconButton onClick={undo} disabled={!canUndo}>
                  <UndoIcon />
                </IconButton>
                <IconButton onClick={redo} disabled={!canRedo}>
                  <RedoIcon />
                </IconButton>
                <IconButton onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}>
                  {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
                <Button
                  variant="contained"
                  onClick={handleSaveFragment}
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.text.primary,
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.8) },
                  }}
                >
                  Save Fragment
                </Button>
              </Stack>
            </Box>

            {/* Fragment Selector and Actions */}
            <FragmentSelectorPanel>
              <Stack direction="row" spacing={2} alignItems="center">
                <FormControl sx={{ minWidth: '200px' }}>
                  <InputLabel>Select Fragment</InputLabel>
                  <Select
                    value={fragment?.id || ''}
                    onChange={(e) => {
                      const selected = fragments.find((f) => f.id === e.target.value);
                      if (selected) {
                        console.log('Fragment selected from dropdown:', selected);
                        handleFragmentSelect(selected);
                      } else {
                        console.log('No fragment found for ID:', e.target.value);
                      }
                    }}
                    label="Select Fragment"
                    sx={{ bgcolor: alpha(theme.palette.background.default, 0.5) }}
                  >
                    <MenuItem value="">
                      <em>Select a fragment</em>
                    </MenuItem>
                    {fragments.length > 0 ? (
                      fragments
                        .filter((f) => f.pageType === pageType)
                        .map((frag) => (
                          <MenuItem key={frag.id} value={frag.id}>
                            {frag.name} {frag.isUserDefined && '(Custom)'}
                          </MenuItem>
                        ))
                    ) : (
                      <MenuItem disabled>
                        <em>No fragments available</em>
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    console.log('Design New Fragment clicked');
                    handleCreateNewFragment();
                  }}
                  sx={{ textTransform: 'none', color: theme.palette.text.primary, borderColor: theme.palette.primary.main }}
                >
                  Design New Fragment
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => alert('Fragment arrangement functionality coming soon!')}
                  sx={{ textTransform: 'none', color: theme.palette.text.primary, borderColor: theme.palette.primary.main }}
                >
                  Arrange Fragments
                </Button>
              </Stack>
            </FragmentSelectorPanel>

            <ControlsPanel>
              <Stack direction="row" spacing={2} alignItems="center">
                <Select
                  size="small"
                  value={selectedDevice}
                  onChange={(e) => {
                    const device = e.target.value as string;
                    setSelectedDevice(device);
                    setSelectedSize(dimensionsByDevice[device][0]);
                  }}
                  sx={{ bgcolor: alpha(theme.palette.background.default, 0.5), minWidth: '150px' }}
                >
                  <MenuItem value="mobile">📱 Mobile</MenuItem>
                  <MenuItem value="tablet">📲 Tablet</MenuItem>
                  <MenuItem value="desktop">🖥️ Desktop</MenuItem>
                </Select>
                <Select
                  size="small"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value as string)}
                  sx={{ bgcolor: alpha(theme.palette.background.default, 0.5), minWidth: '150px' }}
                >
                  {dimensionsByDevice[selectedDevice].map((size) => (
                    <MenuItem key={size} value={size}>{size}</MenuItem>
                  ))}
                </Select>
                <IconButton onClick={handleZoomIn} sx={{ bgcolor: alpha(theme.palette.background.default, 0.5) }}>
                  <ZoomInIcon />
                </IconButton>
                <IconButton onClick={handleZoomOut} sx={{ bgcolor: alpha(theme.palette.background.default, 0.5) }}>
                  <ZoomOutIcon />
                </IconButton>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <VisibilityOffIcon color={isDesignMode ? 'disabled' : 'primary'} />
                <Switch
                  checked={isDesignMode}
                  onChange={(e) => setIsDesignMode(e.target.checked)}
                  color="primary"
                />
                <VisibilityIcon color={isDesignMode ? 'primary' : 'disabled'} />
              </Stack>
            </ControlsPanel>

            <CanvasArea>
              <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <ResizableBox
                  width={scaledWidth}
                  height={parseInt(fragmentStyle.minHeight) || 300}
                  minConstraints={[200, 200]}
                  maxConstraints={[1200, 1000]}
                  onResize={(e, { size }) => {
                    handleStyleChange('width', `${size.width}px`);
                    handleStyleChange('minHeight', `${size.height}px`);
                  }}
                  resizeHandles={['se']}
                >
                  <DroppablePreview fragmentStyle={fragmentStyle} isDesignMode={isDesignMode}>
                    {selectedWidgetId ? (
                      (() => {
                        const widget = widgets.find((w) => w.id === selectedWidgetId);
                        if (!widget) return null;
                        switch (widget.type) {
                          case 'Text Widget':
                            return (
                              <Typography variant="body1" style={{ color: widgetConfig.color || '#000' }}>
                                {widgetConfig.text || 'Text Widget'}
                              </Typography>
                            );
                          case 'Image Widget':
                            return (
                              <img
                                src={widgetConfig.url || 'https://picsum.photos/200/300'}
                                alt={widgetConfig.alt || 'Image'}
                                style={{ maxWidth: '100%' }}
                                onError={(e) => {
                                  console.error('Error loading image:', widgetConfig.url);
                                  e.currentTarget.src = 'https://picsum.photos/200/300'; // Fallback image
                                }}
                              />
                            );
                          case 'CTA Widget':
                            return (
                              <Button
                                href={widgetConfig.url || '#'}
                                sx={{
                                  bgcolor: widgetConfig.backgroundColor || theme.palette.primary.main,
                                  color: theme.palette.text.primary,
                                  px: 3,
                                  py: 1,
                                  borderRadius: theme.shape.borderRadius,
                                  '&:hover': { bgcolor: alpha(widgetConfig.backgroundColor || theme.palette.primary.main, 0.8) },
                                }}
                              >
                                {widgetConfig.text || 'Call to Action'}
                              </Button>
                            );
                          case 'HTML Widget':
                            return <Box dangerouslySetInnerHTML={{ __html: widgetConfig.html || '<div>Write your HTML here...</div>' }} />;
                          default:
                            return <Typography variant="body1">{widget.type}</Typography>;
                        }
                      })()
                    ) : (
                      <Typography variant="h6" color={theme.palette.primary.main}>
                        Drag or click a widget to add
                      </Typography>
                    )}
                  </DroppablePreview>
                </ResizableBox>
              </DndContext>
            </CanvasArea>
          </CanvasSection>

          {/* Side Panel with Tabs */}
          <SidePanel>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="fullWidth"
              sx={{
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                '& .MuiTab-root': { color: theme.palette.text.secondary },
                '& .Mui-selected': { color: theme.palette.text.primary },
                '& .MuiTabs-indicator': { backgroundColor: theme.palette.primary.main },
              }}
            >
              <Tab label="Fragment Properties" />
              <Tab label="Widgets" />
            </Tabs>

            {/* Fragment Properties Tab */}
            <TabPanelComponent value={activeTab} index={0}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Fragment Properties
              </Typography>
              <Box display="grid" gridTemplateColumns="1fr" gap={2}>
                <TextField
                  label="Fragment Name"
                  value={fragmentName}
                  onChange={(e) => setFragmentName(e.target.value)}
                  fullWidth
                  size="small"
                  variant="outlined"
                  sx={{ bgcolor: alpha(theme.palette.background.default, 0.5) }}
                />
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>Width (px)</Typography>
                  <Slider
                    value={parseInt(fragmentStyle.width) || 100}
                    onChange={(e, value) => handleStyleChange('width', `${value}px`)}
                    min={200}
                    max={1200}
                    step={10}
                    valueLabelDisplay="auto"
                  />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>Min Height (px)</Typography>
                  <Slider
                    value={parseInt(fragmentStyle.minHeight) || 300}
                    onChange={(e, value) => handleStyleChange('minHeight', `${value}px`)}
                    min={100}
                    max={1000}
                    step={10}
                    valueLabelDisplay="auto"
                  />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>Padding (px)</Typography>
                  <Slider
                    value={parseInt(fragmentStyle.padding) || 16}
                    onChange={(e, value) => handleStyleChange('padding', `${value}px`)}
                    min={0}
                    max={50}
                    step={1}
                    valueLabelDisplay="auto"
                  />
                </Box>
                <Box sx={{ position: 'relative' }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>Background Color</Typography>
                  <Button
                    variant="outlined"
                    onClick={() => setShowColorPicker(true)}
                    sx={{ width: '100%', textTransform: 'none', bgcolor: alpha(theme.palette.background.default, 0.5), color: theme.palette.text.primary, borderColor: alpha(theme.palette.divider, 0.5) }}
                  >
                    Pick Color
                  </Button>
                  {showColorPicker && (
                    <Box sx={{ mt: 1, position: 'absolute', zIndex: 2 }}>
                      <ChromePicker
                        color={fragmentStyle.backgroundColor || '#F3F4F6'}
                        onChange={(color) => handleStyleChange('backgroundColor', color.hex)}
                        disableAlpha
                      />
                      <Button onClick={() => setShowColorPicker(false)} sx={{ mt: 1, width: '100%', color: theme.palette.text.primary }}>
                        Close
                      </Button>
                    </Box>
                  )}
                </Box>
                <FormControl fullWidth size="small">
                  <InputLabel>Display</InputLabel>
                  <Select
                    value={fragmentStyle.display || 'flex'}
                    onChange={(e) => handleStyleChange('display', e.target.value)}
                    label="Display"
                    sx={{ bgcolor: alpha(theme.palette.background.default, 0.5) }}
                  >
                    <MenuItem value="flex">Flex</MenuItem>
                    <MenuItem value="grid">Grid</MenuItem>
                    <MenuItem value="block">Block</MenuItem>
                  </Select>
                </FormControl>
                {fragmentStyle.display === 'flex' && (
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>Flex Direction</Typography>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant={fragmentStyle.flexDirection === 'row' ? 'contained' : 'outlined'}
                        onClick={() => handleStyleChange('flexDirection', 'row')}
                        sx={{
                          flex: 1,
                          bgcolor: fragmentStyle.flexDirection === 'row' ? theme.palette.primary.main : 'transparent',
                          color: fragmentStyle.flexDirection === 'row' ? theme.palette.text.primary : theme.palette.text.secondary,
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.8) },
                        }}
                      >
                        Row
                      </Button>
                      <Button
                        variant={fragmentStyle.flexDirection === 'column' ? 'contained' : 'outlined'}
                        onClick={() => handleStyleChange('flexDirection', 'column')}
                        sx={{
                          flex: 1,
                          bgcolor: fragmentStyle.flexDirection === 'column' ? theme.palette.primary.main : 'transparent',
                          color: fragmentStyle.flexDirection === 'column' ? theme.palette.text.primary : theme.palette.text.secondary,
                          '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.8) },
                        }}
                      >
                        Column
                      </Button>
                    </Stack>
                  </Box>
                )}
                {fragmentStyle.display === 'grid' && (
                  <TextField
                    label="Grid Template Columns"
                    value={fragmentStyle.gridTemplateColumns || ''}
                    onChange={(e) => handleStyleChange('gridTemplateColumns', e.target.value)}
                    fullWidth
                    size="small"
                    variant="outlined"
                    sx={{ bgcolor: alpha(theme.palette.background.default, 0.5) }}
                  />
                )}
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>Gap (px)</Typography>
                  <Slider
                    value={parseInt(fragmentStyle.gap) || 16}
                    onChange={(e, value) => handleStyleChange('gap', `${value}px`)}
                    min={0}
                    max={50}
                    step={1}
                    valueLabelDisplay="auto"
                  />
                </Box>
              </Box>
            </TabPanelComponent>

            {/* Widgets Tab */}
            <TabPanelComponent value={activeTab} index={1}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Available Widgets
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setOpenCreateWidgetDialog(true)}
                sx={{ mb: 2, textTransform: 'none', color: theme.palette.text.primary, borderColor: theme.palette.primary.main }}
              >
                Create Widget
              </Button>
              <Box display="grid" gridTemplateColumns="1fr" gap={2}>
                <SortableContext items={widgets.map((w) => w.id.toString())}>
                  {widgets.map((widget) => (
                    <WidgetItem key={widget.id} widget={widget} />
                  ))}
                </SortableContext>
              </Box>
            </TabPanelComponent>
          </SidePanel>
        </Box>

        {/* Create Widget Dialog */}
        <ElegantDialog open={openCreateWidgetDialog} onClose={() => setOpenCreateWidgetDialog(false)}>
          <ElegantDialogTitle>Create New Widget</ElegantDialogTitle>
          <ElegantDialogContent>
            <TextField
              label="Widget Name"
              value={newWidgetName}
              onChange={(e) => setNewWidgetName(e.target.value)}
              fullWidth
              size="small"
              variant="outlined"
              placeholder="e.g., Hero Banner Text"
            />
            <FormControl fullWidth size="small">
              <InputLabel>Widget Type</InputLabel>
              <Select
                value={newWidgetType}
                onChange={(e) => {
                  setNewWidgetType(e.target.value);
                  setNewWidgetConfig({}); // Reset config when type changes
                }}
                label="Widget Type"
              >
                <MenuItem value="Text Widget">Text Widget</MenuItem>
                <MenuItem value="Image Widget">Image Widget</MenuItem>
                <MenuItem value="CTA Widget">CTA Widget</MenuItem>
                <MenuItem value="HTML Widget">HTML Widget</MenuItem>
              </Select>
            </FormControl>
            {renderWidgetConfigForm()}
          </ElegantDialogContent>
          <ElegantDialogActions>
            <Button onClick={() => setOpenCreateWidgetDialog(false)} sx={{ color: theme.palette.text.secondary }}>
              Cancel
            </Button>
            <Button onClick={handleCreateWidget} variant="contained" sx={{ bgcolor: theme.palette.primary.main, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.8) } }}>
              Create Widget
            </Button>
          </ElegantDialogActions>
        </ElegantDialog>
      </DesignerContainer>
    </ThemeProvider>
  );
}