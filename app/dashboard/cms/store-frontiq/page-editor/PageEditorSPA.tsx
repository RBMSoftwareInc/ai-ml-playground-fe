'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Select,
  MenuItem,
  Drawer,
  Divider,
  TextField,
  Popover,
  Modal,
  FormControl,
  InputLabel,
} from '@mui/material';
import { styled, createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import {
  AddBox as AddBoxIcon,
  DragIndicator as DragIndicatorIcon,
  DeleteOutline as DeleteIcon,
  SettingsOutlined as SettingsIcon,
  SaveOutlined as SaveIcon,
  ContentCopyOutlined as ContentCopyIcon,
  ZoomInOutlined as ZoomInIcon,
  ZoomOutOutlined as ZoomOutIcon,
  StraightenOutlined as StraightenIcon,
  FormatAlignLeftOutlined as FormatParagraphIcon,
  FormatSizeOutlined as FormatH1Icon,
  ImageOutlined as ImageIcon,
  LinkOutlined as LinkIcon,
  FormatListBulletedOutlined as FormatListBulletedIcon,
  GridOnOutlined as GridIcon,
  AutoAwesomeOutlined as AIIcon,
  UndoOutlined as UndoIcon,
  RedoOutlined as RedoIcon,
  RemoveCircleOutline as RemoveIcon,
  CheckCircleOutline as MarkCompleteIcon,
} from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import axios from 'axios';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import debounce from 'lodash/debounce';

// Define a custom theme with a light silver palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#666', // Dark gray for primary elements
      light: '#999',
      contrastText: '#FFF',
    },
    background: {
      default: '#F5F5F5', // Light silver background
      paper: '#E5E5E5', // Slightly darker silver for paper elements
    },
    text: {
      primary: '#333',
      secondary: '#666',
    },
    divider: '#999',
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    body1: { fontSize: '0.95rem' },
    body2: { fontSize: '0.85rem' },
  },
});

const AceEditor = dynamic(() => import('react-ace'), { ssr: false });

ace.config.set('basePath', '/ace');
ace.config.set('modePath', '/ace');
ace.config.set('themePath', '/ace');
ace.config.set('workerPath', '/ace');

const API_BASE_URL = 'http://localhost:5000/api/v1';

const EditorContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
});

const MainContent = styled(Box)({
  display: 'flex',
  flex: 1,
  overflow: 'hidden',
  marginTop: '64px',
  marginBottom: '64px',
});

const PreviewArea = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(4),
  overflowY: 'auto',
  position: 'relative',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.palette.primary.main,
    borderRadius: '3px',
  },
}));

const ZoneWrapper = styled(motion.div)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  border: `1px dotted ${theme.palette.divider}`, // Dotted border for grid representation
  borderRadius: theme.shape.borderRadius,
  background: alpha(theme.palette.background.paper, 0.9),
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  width: (props: { dimensions: Zone['dimensions'] }) => props.dimensions.width,
  height: (props: { dimensions: Zone['dimensions'] }) => props.dimensions.height,
  minWidth: (props: { dimensions: Zone['dimensions'] }) => props.dimensions.minWidth,
  minHeight: (props: { dimensions: Zone['dimensions'] }) => props.dimensions.minHeight,
  padding: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
  },
}));

const ComponentWrapper = styled(motion.div)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  border: `1px dotted ${theme.palette.divider}`, // Dotted border for grid representation
  borderRadius: theme.shape.borderRadius,
  background: alpha(theme.palette.background.paper, 0.95),
  boxShadow: '0 1px 5px rgba(0, 0, 0, 0.03)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.08)',
  },
}));

const ComponentControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  opacity: 0,
  transition: 'opacity 0.2s ease',
  '&:hover': {
    opacity: 1,
  },
}));

const Sidebar = styled(Drawer)(({ theme }) => ({
  width: 350,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 350,
    padding: theme.spacing(2),
    background: theme.palette.background.paper,
    borderRight: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
    position: 'fixed',
    height: 'calc(100vh - 128px)',
    top: '64px',
    overflowY: 'auto',
    transition: 'width 0.3s ease',
  },
}));

const ComponentOption = styled(Button)(({ theme }) => ({
  justifyContent: 'flex-start',
  textTransform: 'none',
  padding: theme.spacing(1),
  border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
  borderRadius: theme.shape.borderRadius,
  background: alpha(theme.palette.background.default, 0.5),
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(0.5),
  fontSize: '0.85rem',
  '&:hover': {
    background: alpha(theme.palette.primary.light, 0.1),
    borderColor: theme.palette.primary.main,
    transform: 'scale(1.02)',
    transition: 'all 0.2s ease',
  },
}));

const Header = styled(Box)(({ theme }) => ({
  height: '64px',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: theme.zIndex.appBar,
}));

const Footer = styled(Box)(({ theme }) => ({
  height: '64px',
  backgroundColor: theme.palette.grey[200],
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: theme.zIndex.appBar,
}));

const PageHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: alpha(theme.palette.primary.light, 0.1),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  marginBottom: theme.spacing(2),
}));

const DesignerInfoBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: alpha(theme.palette.background.paper, 0.8),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(2),
  boxShadow: '0 1px 5px rgba(0, 0, 0, 0.05)',
}));

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(4),
  outline: 'none',
}));

const SetButton = styled(motion.Button)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  padding: theme.spacing(0.5, 1),
  fontSize: '0.75rem',
  borderRadius: '16px',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.8),
  },
}));

interface ComponentStyle {
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
  margin?: string;
  textAlign?: string;
  width?: string;
  height?: string;
  fontSize?: string;
  color?: string;
  border?: string;
  [key: string]: any;
}

interface ComponentContent {
  [key: string]: any;
}

interface Component {
  id: string;
  type: string;
  content: ComponentContent;
  style: ComponentStyle;
  order: number;
  isCustom: boolean;
  props?: {
    apiInfo?: string;
    context?: string;
    description?: string;
    usageDetails?: string;
    externalApiUrl?: string;
    externalApiKey?: string;
    fetchInterval?: string;
  };
}

interface Zone {
  id: string;
  type: string;
  components: Component[];
  allowedComponents: string[];
  dimensions: { width: string; height: string; minWidth?: string; minHeight?: string };
  order: number;
  layoutType: 'row' | 'column' | 'grid' | 'custom';
  layoutConfig?: { columns?: number; rows?: number };
}

interface Canvas {
  id: string;
  title: string;
  type: string;
  zones: Zone[];
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  description: string;
  stock: number;
  tags: string[];
}

interface Category {
  id: string;
  name: string;
  url: string;
  parentId?: string;
}

interface DesignerInfo {
  name: string;
  email: string;
  designName: string;
  description: string;
}

export default function PageEditorSPA() {
  const router = useRouter();
  const params = useParams();
  const canvasId = params.pageId as string;

  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [deviceMode, setDeviceMode] = useState('desktop');
  const [showRulers, setShowRulers] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [storeConfig, setStoreConfig] = useState<any>(null);
  const [history, setHistory] = useState<Canvas[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isFirstSave, setIsFirstSave] = useState(true);
  const [designerInfo, setDesignerInfo] = useState<DesignerInfo | null>(null);
  const [showDesignerModal, setShowDesignerModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [tempCanvasTitle, setTempCanvasTitle] = useState<string>('');

  const deviceDimensions = {
    desktop: { width: '100%', height: 'auto' },
    tablet: { width: '768px', height: 'auto' },
    mobile: { width: '375px', height: 'auto' },
  };

  useEffect(() => {
    const fetchStoreConfig = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/storefront/config`);
        setStoreConfig(response.data);
      } catch (error) {
        console.error('Error fetching storefront config:', error);
      }
    };

    const fetchCanvas = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/cms/pages/${canvasId}`);
        const canvasData: Canvas = response.data;
        setCanvas(canvasData);
        setTempCanvasTitle(canvasData.title);
        setHistory([canvasData]);
        setHistoryIndex(0);
      } catch (error) {
        console.error('Error fetching canvas:', error);
        const defaultCanvas: Canvas = {
          id: canvasId,
          title: 'New Canvas',
          type: 'product',
          zones: [
            { id: 'header-1', type: 'header', components: [], allowedComponents: ['logo', 'nav-menu', 'search-bar'], dimensions: { width: '100%', height: '64px' }, order: 0, layoutType: 'row' },
            { id: 'content-1', type: 'content', components: [], allowedComponents: ['text', 'image', 'custom-html'], dimensions: { width: '100%', height: 'auto' }, order: 1, layoutType: 'row' },
            { id: 'footer-1', type: 'footer', components: [], allowedComponents: ['text', 'nav-menu'], dimensions: { width: '100%', height: '64px' }, order: 2, layoutType: 'row' },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setCanvas(defaultCanvas);
        setTempCanvasTitle(defaultCanvas.title);
        setHistory([defaultCanvas]);
        setHistoryIndex(0);
      }
    };

    const fetchEcommerceData = async () => {
      try {
        const productsResponse = await axios.get(`${API_BASE_URL}/ecommerce/products`);
        setProducts(productsResponse.data || []);
        const categoriesResponse = await axios.get(`${API_BASE_URL}/ecommerce/categories`);
        setCategories(categoriesResponse.data || []);
      } catch (error) {
        console.error('Error fetching ecommerce data:', error);
        setProducts([]);
        setCategories([]);
      }
    };

    fetchStoreConfig();
    fetchCanvas();
    fetchEcommerceData();
  }, [canvasId]);

  const debouncedSave = useCallback(
    debounce(async (updatedCanvas: Canvas) => {
      try {
        await axios.put(`${API_BASE_URL}/cms/pages/${canvasId}`, updatedCanvas);
        console.log('Canvas auto-saved');
      } catch (error) {
        console.error('Error auto-saving canvas:', error);
      }
    }, 1000),
    [canvasId]
  );

  const updateCanvasWithHistory = (newCanvas: Canvas) => {
    const newHistory = [...history.slice(0, historyIndex + 1), newCanvas];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCanvas(newCanvas);
    debouncedSave(newCanvas);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setCanvas(history[historyIndex - 1]);
      setTempCanvasTitle(history[historyIndex - 1].title);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setCanvas(history[historyIndex + 1]);
      setTempCanvasTitle(history[historyIndex + 1].title);
    }
  };

  const handleSave = () => {
    if (isFirstSave) {
      setShowDesignerModal(true);
    } else {
      debouncedSave.flush();
    }
  };

  const handleMarkComplete = () => {
    setIsCompleted(true);
    debouncedSave.flush();
    alert('Design marked as complete!');
  };

  const handleDesignerInfoSubmit = (info: DesignerInfo) => {
    setDesignerInfo(info);
    setIsFirstSave(false);
    setShowDesignerModal(false);
    debouncedSave.flush();
  };

  const handleSetCanvasTitle = () => {
    if (tempCanvasTitle.trim()) {
      setCanvas((prev) => {
        if (!prev) return prev;
        const newCanvas = { ...prev, title: tempCanvasTitle };
        updateCanvasWithHistory(newCanvas);
        return newCanvas;
      });
    } else {
      alert('Canvas title cannot be empty.');
    }
  };

  const handleAddComponent = (zoneId: string, type: string, isCustom: boolean = false) => {
    const newComponent: Component = {
      id: `${type}-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      style: {
        backgroundColor: '#FFFFFF',
        padding: '16px',
        borderRadius: '8px',
        margin: '8px 0',
        textAlign: 'left',
        width: 'auto',
        height: 'auto',
      },
      order: 0,
      isCustom,
      props: {},
    };
    setCanvas((prev) => {
      if (!prev) return prev;
      const updatedZones = prev.zones.map((zone) => {
        if (zone.id !== zoneId) return zone;
        return { ...zone, components: [...zone.components, newComponent].map((comp, index) => ({ ...comp, order: index })) };
      });
      const newCanvas = { ...prev, zones: updatedZones };
      updateCanvasWithHistory(newCanvas);
      return newCanvas;
    });
  };

  const getDefaultContent = (type: string): ComponentContent => {
    switch (type) {
      case 'text':
        return { text: 'Enter your text here' };
      case 'image':
        return { url: 'https://picsum.photos/200/300', alt: 'Image' };
      case 'custom-html':
        return { html: '<div>Write your HTML here...</div>' };
      case 'product-card':
        return products[0] || { id: '1', title: 'Sample Product', price: '$99.99', imageUrl: 'https://picsum.photos/200/200', description: 'A great product.', stock: 10, tags: ['sample'] };
      case 'product-grid':
        return { products: products.slice(0, 4), columns: 4 };
      case 'category-list':
        return { title: 'Categories', categories: categories.slice(0, 3) };
      case 'nav-menu':
        return { items: [{ label: 'Home', url: '/' }, { label: 'Products', url: '/products' }] };
      case 'search-bar':
        return { placeholder: 'Search products...' };
      default:
        return {};
    }
  };

  const handleDragEnd = (event: any, zoneId: string) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setCanvas((prev) => {
        if (!prev) return prev;
        const updatedZones = prev.zones.map((zone) => {
          if (zone.id !== zoneId) return zone;
          const oldIndex = zone.components.findIndex((comp) => comp.id === active.id);
          const newIndex = zone.components.findIndex((comp) => comp.id === over.id);
          const reorderedComponents = arrayMove(zone.components, oldIndex, newIndex);
          return { ...zone, components: reorderedComponents.map((comp, index) => ({ ...comp, order: index })) };
        });
        const newCanvas = { ...prev, zones: updatedZones };
        updateCanvasWithHistory(newCanvas);
        return newCanvas;
      });
    }
  };

  const handleDeleteComponent = (zoneId: string, componentId: string) => {
    setCanvas((prev) => {
      if (!prev) return prev;
      const updatedZones = prev.zones.map((zone) => {
        if (zone.id !== zoneId) return zone;
        return { ...zone, components: zone.components.filter((comp) => comp.id !== componentId) };
      });
      const newCanvas = { ...prev, zones: updatedZones };
      updateCanvasWithHistory(newCanvas);
      return newCanvas;
    });
  };

  const handleDuplicateComponent = (zoneId: string, component: Component) => {
    const duplicatedComponent: Component = {
      ...component,
      id: `${component.type}-${Date.now()}`,
      order: 0,
    };
    setCanvas((prev) => {
      if (!prev) return prev;
      const updatedZones = prev.zones.map((zone) => {
        if (zone.id !== zoneId) return zone;
        return { ...zone, components: [...zone.components, duplicatedComponent].map((comp, index) => ({ ...comp, order: index })) };
      });
      const newCanvas = { ...prev, zones: updatedZones };
      updateCanvasWithHistory(newCanvas);
      return newCanvas;
    });
  };

  const handleUpdateContent = (zoneId: string, componentId: string, key: string, value: any) => {
    setCanvas((prev) => {
      if (!prev) return prev;
      const updatedZones = prev.zones.map((zone) => {
        if (zone.id !== zoneId) return zone;
        return {
          ...zone,
          components: zone.components.map((comp) =>
            comp.id === componentId ? { ...comp, content: { ...comp.content, [key]: value } } : comp
          ),
        };
      });
      const newCanvas = { ...prev, zones: updatedZones };
      updateCanvasWithHistory(newCanvas);
      return newCanvas;
    });
  };

  const handleUpdateStyle = (zoneId: string, componentId: string, key: string, value: string) => {
    setCanvas((prev) => {
      if (!prev) return prev;
      const updatedZones = prev.zones.map((zone) => {
        if (zone.id !== zoneId) return zone;
        return {
          ...zone,
          components: zone.components.map((comp) =>
            comp.id === componentId ? { ...comp, style: { ...comp.style, [key]: value } } : comp
          ),
        };
      });
      const newCanvas = { ...prev, zones: updatedZones };
      updateCanvasWithHistory(newCanvas);
      return newCanvas;
    });
  };

  const handleUpdateProps = (zoneId: string, componentId: string, key: string, value: string) => {
    setCanvas((prev) => {
      if (!prev) return prev;
      const updatedZones = prev.zones.map((zone) => {
        if (zone.id !== zoneId) return zone;
        return {
          ...zone,
          components: zone.components.map((comp) =>
            comp.id === componentId ? { ...comp, props: { ...comp.props, [key]: value } } : comp
          ),
        };
      });
      const newCanvas = { ...prev, zones: updatedZones };
      updateCanvasWithHistory(newCanvas);
      return newCanvas;
    });
  };

  const HtmlToolbar = ({ onInsert }: { onInsert: (html: string) => void }) => (
    <Box sx={{ display: 'flex', gap: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1, mb: 1 }}>
      <Tooltip title="Add Paragraph">
        <IconButton onClick={() => onInsert('<p>Paragraph</p>')}>
          <FormatParagraphIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Add Heading 1">
        <IconButton onClick={() => onInsert('<h1>Heading 1</h1>')}>
          <FormatH1Icon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Add Image">
        <IconButton onClick={() => onInsert('<img src="https://picsum.photos/200/200" alt="Image" />')}>
          <ImageIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Add Link">
        <IconButton onClick={() => onInsert('<a href="#">Link</a>')}>
          <LinkIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Add List">
        <IconButton onClick={() => onInsert('<ul><li>Item 1</li></ul>')}>
          <FormatListBulletedIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );

  const ComponentConfigPanel = ({ component, zoneId }: { component: Component; zoneId: string }) => {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
      setAnchorEl(null);
    };

    const renderDynamicAttributes = () => {
      const commonStyles = (
        <>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Styling</Typography>
          <TextField
            label="Width"
            value={component.style.width || 'auto'}
            onChange={(e) => handleUpdateStyle(zoneId, component.id, 'width', e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
          />
          <TextField
            label="Height"
            value={component.style.height || 'auto'}
            onChange={(e) => handleUpdateStyle(zoneId, component.id, 'height', e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
          />
          <TextField
            label="Background Color"
            value={component.style.backgroundColor || '#FFFFFF'}
            onChange={(e) => handleUpdateStyle(zoneId, component.id, 'backgroundColor', e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
          />
          <TextField
            label="Padding"
            value={component.style.padding || '16px'}
            onChange={(e) => handleUpdateStyle(zoneId, component.id, 'padding', e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
          />
          <TextField
            label="Border Radius"
            value={component.style.borderRadius || '8px'}
            onChange={(e) => handleUpdateStyle(zoneId, component.id, 'borderRadius', e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
          />
          <TextField
            label="Margin"
            value={component.style.margin || '8px 0'}
            onChange={(e) => handleUpdateStyle(zoneId, component.id, 'margin', e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
          />
          <TextField
            label="Text Align"
            value={component.style.textAlign || 'left'}
            onChange={(e) => handleUpdateStyle(zoneId, component.id, 'textAlign', e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
          />
        </>
      );

      const commonDataFetching = (
        <>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Data Fetching (Internal API)</Typography>
          <TextField
            label="API Info"
            value={component.props?.apiInfo || ''}
            onChange={(e) => handleUpdateProps(zoneId, component.id, 'apiInfo', e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
          />
          <TextField
            label="Context"
            value={component.props?.context || ''}
            onChange={(e) => handleUpdateProps(zoneId, component.id, 'context', e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
          />
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>External API</Typography>
          <TextField
            label="External API URL"
            value={component.props?.externalApiUrl || ''}
            onChange={(e) => handleUpdateProps(zoneId, component.id, 'externalApiUrl', e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
          />
          <TextField
            label="External API Key"
            value={component.props?.externalApiKey || ''}
            onChange={(e) => handleUpdateProps(zoneId, component.id, 'externalApiKey', e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
          />
          <TextField
            label="Fetch Interval (ms)"
            value={component.props?.fetchInterval || '0'}
            onChange={(e) => handleUpdateProps(zoneId, component.id, 'fetchInterval', e.target.value)}
            fullWidth
            size="small"
            sx={{ mb: 1 }}
            type="number"
          />
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Metadata</Typography>
          <TextField
            label="Description"
            value={component.props?.description || ''}
            onChange={(e) => handleUpdateProps(zoneId, component.id, 'description', e.target.value)}
            fullWidth
            size="small"
            multiline
            sx={{ mb: 1 }}
          />
          <TextField
            label="Usage Details"
            value={component.props?.usageDetails || ''}
            onChange={(e) => handleUpdateProps(zoneId, component.id, 'usageDetails', e.target.value)}
            fullWidth
            size="small"
            multiline
            sx={{ mb: 1 }}
          />
        </>
      );

      switch (component.type) {
        case 'text':
          return (
            <>
              {commonStyles}
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Text Properties</Typography>
              <TextField
                label="Font Size"
                value={component.style.fontSize || '16px'}
                onChange={(e) => handleUpdateStyle(zoneId, component.id, 'fontSize', e.target.value)}
                fullWidth
                size="small"
                sx={{ mb: 1 }}
              />
              <TextField
                label="Color"
                value={component.style.color || '#333'}
                onChange={(e) => handleUpdateStyle(zoneId, component.id, 'color', e.target.value)}
                fullWidth
                size="small"
                sx={{ mb: 1 }}
              />
              {commonDataFetching}
            </>
          );
        case 'image':
          return (
            <>
              {commonStyles}
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Image Properties</Typography>
              <TextField
                label="Image URL"
                value={component.content.url || 'https://picsum.photos/200/300'}
                onChange={(e) => handleUpdateContent(zoneId, component.id, 'url', e.target.value)}
                fullWidth
                size="small"
                sx={{ mb: 1 }}
              />
              <TextField
                label="Alt Text"
                value={component.content.alt || 'Image'}
                onChange={(e) => handleUpdateContent(zoneId, component.id, 'alt', e.target.value)}
                fullWidth
                size="small"
                sx={{ mb: 1 }}
              />
              {commonDataFetching}
            </>
          );
        case 'custom-html':
          return (
            <>
              {commonStyles}
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>HTML Properties</Typography>
              <TextField
                label="Custom Classes"
                value={component.content.classes || ''}
                onChange={(e) => handleUpdateContent(zoneId, component.id, 'classes', e.target.value)}
                fullWidth
                size="small"
                sx={{ mb: 1 }}
              />
              {commonDataFetching}
            </>
          );
        case 'product-card':
          return (
            <>
              {commonStyles}
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Product Card Properties</Typography>
              <TextField
                label="Product ID"
                value={component.content.id || ''}
                onChange={(e) => handleUpdateContent(zoneId, component.id, 'id', e.target.value)}
                fullWidth
                size="small"
                sx={{ mb: 1 }}
              />
              <TextField
                label="Border"
                value={component.style.border || '1px solid #E5E7EB'}
                onChange={(e) => handleUpdateStyle(zoneId, component.id, 'border', e.target.value)}
                fullWidth
                size="small"
                sx={{ mb: 1 }}
              />
              {commonDataFetching}
            </>
          );
        case 'nav-menu':
          return (
            <>
              {commonStyles}
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Nav Menu Properties</Typography>
              <TextField
                label="Item Spacing (gap)"
                value={component.style.gap || '16px'}
                onChange={(e) => handleUpdateStyle(zoneId, component.id, 'gap', e.target.value)}
                fullWidth
                size="small"
                sx={{ mb: 1 }}
              />
              {commonDataFetching}
            </>
          );
        case 'search-bar':
          return (
            <>
              {commonStyles}
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Search Bar Properties</Typography>
              <TextField
                label="Placeholder"
                value={component.content.placeholder || 'Search products...'}
                onChange={(e) => handleUpdateContent(zoneId, component.id, 'placeholder', e.target.value)}
                fullWidth
                size="small"
                sx={{ mb: 1 }}
              />
              {commonDataFetching}
            </>
          );
        default:
          return (
            <>
              {commonStyles}
              {commonDataFetching}
            </>
          );
      }
    };

    return (
      <>
        <Tooltip title="Configure Component">
          <IconButton onClick={handleOpen}>
            <SettingsIcon />
          </IconButton>
        </Tooltip>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
          transformOrigin={{ vertical: 'center', horizontal: 'left' }}
        >
          <Box sx={{ p: 2, width: 350, maxHeight: '500px', overflowY: 'auto' }}>
            <Typography variant="h6">Configure {component.type}</Typography>
            <Divider sx={{ my: 1 }} />
            {renderDynamicAttributes()}
          </Box>
        </Popover>
      </>
    );
  };

  const ComponentRenderer = ({ component, zoneId, layoutType }: { component: Component; zoneId: string; layoutType: string }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: component.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      ...component.style,
    };

    const renderComponent = () => {
      switch (component.type) {
        case 'text':
          return (
            <Typography
              variant="body1"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleUpdateContent(zoneId, component.id, 'text', e.target.innerText)}
              sx={{ minHeight: '20px', outline: 'none' }}
            >
              {component.content.text || 'Enter your text here'}
            </Typography>
          );
        case 'image':
          return (
            <img
              src={component.content.url || 'https://picsum.photos/200/300'}
              alt={component.content.alt || 'Image'}
              style={{ maxWidth: '100%', borderRadius: component.style.borderRadius }}
              onError={(e) => (e.currentTarget.src = 'https://picsum.photos/200/300')}
            />
          );
        case 'custom-html':
          return (
            <>
              <Box dangerouslySetInnerHTML={{ __html: component.content.html || '<div>Write your HTML here...</div>' }} />
              <HtmlToolbar onInsert={(html) => handleUpdateContent(zoneId, component.id, 'html', component.content.html + html)} />
              <AceEditor
                mode="html"
                theme="monokai"
                value={component.content.html || '<div>Write your HTML here...</div>'}
                onChange={(value) => handleUpdateContent(zoneId, component.id, 'html', value)}
                name={`html-editor-${component.id}`}
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
        case 'product-card':
          return (
            <Box sx={{ border: component.style.border || '1px solid #E5E7EB', borderRadius: component.style.borderRadius, p: 2 }}>
              <img
                src={component.content.imageUrl || 'https://picsum.photos/200/200'}
                alt={component.content.title || 'Product'}
                style={{ maxWidth: '100%' }}
                onError={(e) => (e.currentTarget.src = 'https://picsum.photos/200/200')}
              />
              <Typography variant="h6">{component.content.title || 'Product Title'}</Typography>
              <Typography variant="body2">{component.content.price || '$99.99'}</Typography>
            </Box>
          );
        case 'nav-menu':
          return (
            <Box sx={{ display: 'flex', gap: component.style.gap || 2 }}>
              {(component.content.items || []).map((item: { label: string; url: string }) => (
                <a key={item.label} href={item.url} style={{ color: theme.palette.primary.main }}>
                  {item.label}
                </a>
              ))}
            </Box>
          );
        case 'search-bar':
          return (
            <TextField
              fullWidth
              variant="outlined"
              placeholder={component.content.placeholder || 'Search products...'}
              sx={{ borderRadius: component.style.borderRadius }}
            />
          );
        default:
          return <Typography variant="body2">Unsupported component type: {component.type}</Typography>;
      }
    };

    return (
      <ComponentWrapper
        ref={setNodeRef}
        style={style}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        <ComponentControls sx={{ opacity: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DragIndicatorIcon {...attributes} {...listeners} sx={{ cursor: 'grab' }} />
            <Typography variant="body2">{component.type.replace('-', ' ').toUpperCase()}</Typography>
          </Box>
          <Box>
            <ComponentConfigPanel component={component} zoneId={zoneId} />
            <Tooltip title="Duplicate Component">
              <IconButton onClick={() => handleDuplicateComponent(zoneId, component)} sx={{ color: theme.palette.primary.main }}>
                <ContentCopyIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Component">
              <IconButton onClick={() => handleDeleteComponent(zoneId, component.id)} sx={{ color: theme.palette.text.secondary }}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </ComponentControls>
        {renderComponent()}
      </ComponentWrapper>
    );
  };

  const AIRecommendations = ({ zone }: { zone: Zone }) => {
    const getSuggestions = () => {
      switch (zone.type) {
        case 'header':
          return ['Add a Nav Menu for easy navigation', 'Include a Search Bar for user convenience'];
        case 'content':
          return ['Try a Product Grid to showcase items', 'Add a Banner for promotions'];
        case 'footer':
          return ['Add Social Links for engagement', 'Include a Newsletter Signup'];
        default:
          return ['Experiment with different layouts', 'Use Custom HTML for flexibility'];
      }
    };

    return (
      <Box sx={{ p: 2, bgcolor: alpha(theme.palette.info.light, 0.1), borderRadius: 1, mb: 2 }}>
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <AIIcon fontSize="small" /> AI Suggestions
        </Typography>
        {getSuggestions().map((suggestion, index) => (
          <Typography key={index} variant="body2" color="text.secondary">
            - {suggestion}
          </Typography>
        ))}
      </Box>
    );
  };

  const AIPromptArea = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');

    const handleSubmit = async () => {
      setResponse(`Generated layout: Add a 2-column grid with a Product Card and a Banner.`);
    };

    return (
      <Box sx={{ p: 2, bgcolor: alpha(theme.palette.grey[100], 0.5), borderRadius: 1, mb: 2 }}>
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <AIIcon fontSize="small" /> AI Prompt
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="e.g., Suggest a layout for a product page"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          sx={{ mb: 1 }}
        />
        <Button variant="contained" startIcon={<AIIcon />} onClick={handleSubmit}>
          Generate
        </Button>
        {response && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            {response}
          </Typography>
        )}
      </Box>
    );
  };

  const ZoneRenderer = ({ zone }: { zone: Zone }) => {
    const [layoutType, setLayoutType] = useState(zone.layoutType || 'row');

    const handleAddColumn = () => {
      setCanvas((prev) => {
        if (!prev) return prev;
        const updatedZones = prev.zones.map((z) => {
          if (z.id !== zone.id) return z;
          return {
            ...z,
            layoutType: 'grid',
            layoutConfig: { ...z.layoutConfig, columns: (z.layoutConfig?.columns || 1) + 1 },
          };
        });
        const newCanvas = { ...prev, zones: updatedZones };
        updateCanvasWithHistory(newCanvas);
        return newCanvas;
      });
    };

    const handleRemoveColumn = () => {
      setCanvas((prev) => {
        if (!prev) return prev;
        const updatedZones = prev.zones.map((z) => {
          if (z.id !== zone.id) return z;
          const newColumns = Math.max((z.layoutConfig?.columns || 1) - 1, 1);
          return {
            ...z,
            layoutType: newColumns === 1 ? 'row' : 'grid',
            layoutConfig: { ...z.layoutConfig, columns: newColumns },
          };
        });
        const newCanvas = { ...prev, zones: updatedZones };
        updateCanvasWithHistory(newCanvas);
        return newCanvas;
      });
    };

    const getLayoutStyle = () => {
      switch (layoutType) {
        case 'row':
          return { display: 'flex', flexDirection: 'row', gap: 2 };
        case 'column':
          return { display: 'flex', flexDirection: 'column', gap: 2 };
        case 'grid':
          return {
            display: 'grid',
            gridTemplateColumns: `repeat(${zone.layoutConfig?.columns || 2}, 1fr)`,
            gap: 2,
          };
        case 'custom':
          return { display: 'flex', flexDirection: 'column', gap: 2 };
        default:
          return {};
      }
    };

    return (
      <ZoneWrapper
        dimensions={zone.dimensions}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <AIRecommendations zone={zone} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">{zone.type.charAt(0).toUpperCase() + zone.type.slice(1)} Zone</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Select value={layoutType} onChange={(e) => setLayoutType(e.target.value as any)} size="small">
              <MenuItem value="row">Row</MenuItem>
              <MenuItem value="column">Column</MenuItem>
              <MenuItem value="grid">Grid</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
            {layoutType === 'grid' && (
              <>
                <Tooltip title="Add Column">
                  <IconButton onClick={handleAddColumn}>
                    <AddBoxIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Remove Column">
                  <IconButton onClick={handleRemoveColumn}>
                    <RemoveIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        </Box>
        <Box sx={getLayoutStyle()}>
          {zone.components.length > 0 ? (
            <DndContext collisionDetection={closestCenter} onDragEnd={(event) => handleDragEnd(event, zone.id)}>
              <SortableContext items={zone.components.map((comp) => comp.id)}>
                {zone.components
                  .sort((a, b) => a.order - b.order)
                  .map((component) => (
                    <ComponentRenderer key={component.id} component={component} zoneId={zone.id} layoutType={layoutType} />
                  ))}
              </SortableContext>
            </DndContext>
          ) : (
            <Typography variant="body2" sx={{ textAlign: 'center', color: theme.palette.text.secondary }}>
              Add components to this zone from the sidebar.
            </Typography>
          )}
        </Box>
      </ZoneWrapper>
    );
  };

  const CanvasControls = () => (
    <Box sx={{ position: 'fixed', top: '70px', right: '20px', zIndex: 1000, display: 'flex', gap: 1, bgcolor: 'white', p: 1, borderRadius: 1, boxShadow: 2 }}>
      <Tooltip title="Save Canvas">
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{ bgcolor: theme.palette.primary.main, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.8) } }}
        >
          Save
        </Button>
      </Tooltip>
      <Tooltip title="Mark as Complete">
        <Button
          variant="contained"
          startIcon={<MarkCompleteIcon />}
          onClick={handleMarkComplete}
          disabled={isCompleted}
          sx={{ bgcolor: theme.palette.primary.main, '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.8) } }}
        >
          Mark Complete
        </Button>
      </Tooltip>
      <Tooltip title="Undo">
        <IconButton onClick={handleUndo} disabled={historyIndex <= 0}>
          <UndoIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Redo">
        <IconButton onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
          <RedoIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Toggle Grid">
        <IconButton onClick={() => setShowGrid(!showGrid)}>
          <GridIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Zoom In">
        <IconButton onClick={() => setZoomLevel((prev) => Math.min(prev + 0.1, 2))}>
          <ZoomInIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Zoom Out">
        <IconButton onClick={() => setZoomLevel((prev) => Math.max(prev - 0.1, 0.5))}>
          <ZoomOutIcon />
        </IconButton>
      </Tooltip>
      <Select value={deviceMode} onChange={(e) => setDeviceMode(e.target.value)} size="small">
        <MenuItem value="desktop">Desktop</MenuItem>
        <MenuItem value="tablet">Tablet</MenuItem>
        <MenuItem value="mobile">Mobile</MenuItem>
      </Select>
      <Tooltip title="Show Rulers">
        <IconButton onClick={() => setShowRulers(!showRulers)}>
          <StraightenIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );

  const GridOverlay = () => (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `linear-gradient(to right, ${alpha(theme.palette.grey[300], 0.2)} 1px, transparent 1px),
                         linear-gradient(to bottom, ${alpha(theme.palette.grey[300], 0.2)} 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
        pointerEvents: 'none',
        display: showGrid ? 'block' : 'none',
      }}
    />
  );

  const Ruler = ({ orientation }: { orientation: 'horizontal' | 'vertical' }) => (
    <Box
      sx={{
        position: 'fixed',
        bgcolor: 'grey.300',
        ...(orientation === 'horizontal' ? { top: '64px', left: 0, right: 0, height: '20px' } : { top: '64px', left: 0, bottom: 0, width: '20px' }),
        zIndex: 999,
        display: showRulers ? 'block' : 'none',
      }}
    >
      {Array.from({ length: orientation === 'horizontal' ? 100 : 50 }).map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            bgcolor: 'grey.600',
            ...(orientation === 'horizontal'
              ? { width: '1px', height: i % 5 === 0 ? '20px' : '10px', left: `${i * 50}px` }
              : { height: '1px', width: i % 5 === 0 ? '20px' : '10px', top: `${i * 50}px` }),
          }}
        />
      ))}
    </Box>
  );

  const DesignerInfoModal = () => {
    const [info, setInfo] = useState<DesignerInfo>({ name: '', email: '', designName: '', description: '' });

    const handleSubmit = () => {
      if (info.name && info.email && info.designName) {
        handleDesignerInfoSubmit(info);
      } else {
        alert('Please fill in all required fields.');
      }
    };

    return (
      <Modal open={showDesignerModal} onClose={() => setShowDesignerModal(false)}>
        <ModalContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Designer Information</Typography>
          <TextField
            label="Designer Name *"
            value={info.name}
            onChange={(e) => setInfo({ ...info, name: e.target.value })}
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email *"
            value={info.email}
            onChange={(e) => setInfo({ ...info, email: e.target.value })}
            fullWidth
            size="small"
            type="email"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Design Name *"
            value={info.designName}
            onChange={(e) => setInfo({ ...info, designName: e.target.value })}
            fullWidth
            size="small"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            value={info.description}
            onChange={(e) => setInfo({ ...info, description: e.target.value })}
            fullWidth
            size="small"
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: theme.palette.primary.main }}>
            Submit
          </Button>
        </ModalContent>
      </Modal>
    );
  };

  const SidebarContent = () => (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Canvas Editor
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <TextField
          label="Canvas Title"
          value={tempCanvasTitle}
          onChange={(e) => setTempCanvasTitle(e.target.value)}
          fullWidth
          size="small"
          variant="outlined"
        />
        <SetButton
          onClick={handleSetCanvasTitle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          Set
        </SetButton>
      </Box>
      <AIPromptArea />
      <Divider sx={{ my: 2 }} />
      <Typography variant="body1" sx={{ mb: 1 }}>
        Add Component to Zone
      </Typography>
      {canvas?.zones.map((zone) => (
        <Box key={zone.id} sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
            {zone.type.charAt(0).toUpperCase() + zone.type.slice(1)} Zone
          </Typography>
          {zone.allowedComponents.map((type) => (
            <Tooltip key={type} title={`Add a ${type.replace('-', ' ')} component`}>
              <ComponentOption startIcon={<AddBoxIcon />} onClick={() => handleAddComponent(zone.id, type)}>
                {type.replace('-', ' ')}
              </ComponentOption>
            </Tooltip>
          ))}
          <Tooltip title="Add a custom HTML component">
            <ComponentOption startIcon={<AddBoxIcon />} onClick={() => handleAddComponent(zone.id, 'custom-html', true)}>
              Custom HTML
            </ComponentOption>
          </Tooltip>
        </Box>
      ))}
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <EditorContainer>
       
        <MainContent>
          <motion.div
            initial={{ x: -350 }}
            animate={{ x: isSidebarOpen ? 0 : -350 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <Sidebar variant="persistent" anchor="left" open={isSidebarOpen}>
              <SidebarContent />
            </Sidebar>
          </motion.div>
          <PreviewArea sx={{ marginLeft: isSidebarOpen ? '260px' : 0, transition: 'margin-left 0.3s ease' }}>
            <PageHeader>
              <Typography variant="h5">Page Editor</Typography>
              <Typography variant="body2" color="text.secondary">
                Design your store pages by adding zones and components. Use the sidebar to add components, drag them to rearrange, and configure their properties.
                Explore AI recommendations for layout and content suggestions.
              </Typography>
            </PageHeader>
            {designerInfo && (
              <DesignerInfoBox>
                <Typography variant="body2">
                  <strong>Designer:</strong> {designerInfo.name} ({designerInfo.email})
                </Typography>
                <Typography variant="body2">
                  <strong>Design:</strong> {designerInfo.designName}
                </Typography>
                <Typography variant="body2">
                  <strong>Description:</strong> {designerInfo.description || 'No description provided.'}
                </Typography>
                {isCompleted && (
                  <Typography variant="body2" sx={{ mt: 1, color: theme.palette.primary.main }}>
                    <strong>Status:</strong> Completed
                  </Typography>
                )}
              </DesignerInfoBox>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4">{canvas?.title || 'Untitled Canvas'}</Typography>
              <Tooltip title="Toggle Sidebar">
                <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left', width: deviceDimensions[deviceMode].width, margin: '0 auto' }}>
              <GridOverlay />
              {canvas?.zones
                .sort((a, b) => a.order - b.order)
                .map((zone) => (
                  <ZoneRenderer key={zone.id} zone={zone} />
                ))}
            </Box>
          </PreviewArea>
        </MainContent>
        
        <CanvasControls />
        <Ruler orientation="horizontal" />
        <Ruler orientation="vertical" />
        <DesignerInfoModal />
      </EditorContainer>
    </ThemeProvider>
  );
}