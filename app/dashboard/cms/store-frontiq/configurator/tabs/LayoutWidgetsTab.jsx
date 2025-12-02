import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Grid,
  Card,
  CardMedia,
  CardContent,
  TextareaAutosize,
  Alert,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Modal,
  Paper,
  Snackbar,
  CardActionArea,
  Badge
} from '@mui/material';
import { grey } from '@mui/material/colors';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const API_BASE_URL = 'http://localhost:5000/api/v1/cms/storefront/config';

// Designer-created layouts (static data for now)
const designerLayouts = [
  {
    id: 'modern-minimalist',
    name: 'Modern Minimalist',
    description: 'A clean and simple layout with a focus on usability.',
    thumbnail: 'https://via.placeholder.com/300x200?text=Modern+Minimalist',
    previewImage: 'https://via.placeholder.com/800x600?text=Modern+Minimalist+Preview',
  },
  {
    id: 'ecommerce-classic',
    name: 'E-Commerce Classic',
    description: 'A traditional e-commerce layout with a sidebar and grid view.',
    thumbnail: 'https://via.placeholder.com/300x200?text=E-Commerce+Classic',
    previewImage: 'https://via.placeholder.com/800x600?text=E-Commerce+Classic+Preview',
  },
  {
    id: 'bold-visuals',
    name: 'Bold Visuals',
    description: 'A visually striking layout with large images and bold colors.',
    thumbnail: 'https://via.placeholder.com/300x200?text=Bold+Visuals',
    previewImage: 'https://via.placeholder.com/800x600?text=Bold+Visuals+Preview',
  },
];

const availableWidgets = [
  'trending-products',
  'ai-chat-widget',
  'recently-viewed',
  'product-recommendations',
  'promotional-banner',
];

export default function LayoutWidgetsTab({ layoutConfig, setLayoutConfig, designTone, theme, setTabValue, setSnackbar }) {
  const [loading, setLoading] = useState({ aiLayouts: false });
  const [error, setError] = useState({ aiLayouts: null });
  const [previewModal, setPreviewModal] = useState({ open: false, layout: null });
  const [aiLayouts, setAiLayouts] = useState([]);

  useEffect(() => {
    const fetchAiLayouts = async () => {
      setLoading(prev => ({ ...prev, aiLayouts: true }));
      setError(prev => ({ ...prev, aiLayouts: null }));
      try {
        const response = await fetch(`${API_BASE_URL}/ai/prebuilt-themes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            store_description: theme.storeName || 'General e-commerce store',
            design_tone: designTone,
          }),
        });
        if (!response.ok) throw new Error('Failed to fetch AI-generated layouts');
        const data = await response.json();
        const transformedLayouts = data.themes.map((theme, index) => ({
          id: `ai-${index}`,
          name: theme.name || `AI Layout ${index + 1}`,
          description: theme.description || 'An AI-generated layout tailored to your preferences.',
          thumbnail: theme.thumbnail || 'https://via.placeholder.com/300x200?text=AI+Generated',
          previewImage: theme.previewImage || 'https://via.placeholder.com/800x600?text=AI+Generated+Preview',
        }));
        setAiLayouts(transformedLayouts);
      } catch (err) {
        console.error('Error fetching AI layouts:', err);
        setError(prev => ({ ...prev, aiLayouts: err.message }));
        setAiLayouts([]);
        setSnackbar({ open: true, message: 'Failed to load AI-generated layouts.', severity: 'error' });
      } finally {
        setLoading(prev => ({ ...prev, aiLayouts: false }));
      }
    };

    fetchAiLayouts();
  }, [designTone, theme.storeName, setSnackbar]);

  const handleLayoutConfigChange = (key, value) => {
    setLayoutConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleWidgetChange = (section, value) => {
    setLayoutConfig(prev => ({ ...prev, [section]: value }));
  };

  const handleSelectLayout = (layoutId) => {
    handleLayoutConfigChange('selectedLayout', layoutId);
    setSnackbar({ open: true, message: 'Layout selected successfully!', severity: 'success' });
    setPreviewModal({ open: false, layout: null });
  };

  const handlePreviewLayout = (layout) => {
    setPreviewModal({ open: true, layout });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: grey[800], fontWeight: 'bold', mb: 3 }}>
        Layout & Widgets
      </Typography>

      {/* Designer-Created Layouts */}
      <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
        Designer-Created Layouts
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {designerLayouts.map(layout => (
          <Grid item xs={12} sm={6} md={4} key={layout.id}>
            <Badge
              badgeContent={layoutConfig.selectedLayout === layout.id ? <CheckCircleIcon color="success" /> : null}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Card sx={{ position: 'relative', boxShadow: layoutConfig.selectedLayout === layout.id ? '0 0 0 2px #1976d2' : 'none' }}>
                <CardActionArea onClick={() => handlePreviewLayout(layout)}>
                  <CardMedia component="img" height="140" image={layout.thumbnail} alt={layout.name} />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {layout.name}
                    </Typography>
                    <Typography variant="body2" color={grey[600]} sx={{ mb: 2 }}>
                      {layout.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewLayout(layout);
                      }}
                    >
                      Preview
                    </Button>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Badge>
          </Grid>
        ))}
      </Grid>

      {/* AI-Generated Layouts */}
      <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
        AI-Generated Layouts (Based on Design Tone: {designTone})
      </Typography>
      {loading.aiLayouts && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      )}
      {error.aiLayouts && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.aiLayouts}
        </Alert>
      )}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {aiLayouts.map(layout => (
          <Grid item xs={12} sm={6} md={4} key={layout.id}>
            <Badge
              badgeContent={layoutConfig.selectedLayout === layout.id ? <CheckCircleIcon color="success" /> : null}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Card sx={{ position: 'relative', boxShadow: layoutConfig.selectedLayout === layout.id ? '0 0 0 2px #1976d2' : 'none' }}>
                <CardActionArea onClick={() => handlePreviewLayout(layout)}>
                  <CardMedia component="img" height="140" image={layout.thumbnail} alt={layout.name} />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {layout.name}
                    </Typography>
                    <Typography variant="body2" color={grey[600]} sx={{ mb: 2 }}>
                      {layout.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewLayout(layout);
                      }}
                    >
                      Preview
                    </Button>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Badge>
          </Grid>
        ))}
      </Grid>

      {/* Widget Placement */}
      <Divider sx={{ my: 2 }} />
      <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
        Widget Placement
      </Typography>
      <Typography variant="subtitle1" sx={{ color: grey[700], mb: 1 }}>
        Header Widgets
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Select Widgets for Header</InputLabel>
        <Select
          multiple
          value={layoutConfig.headerWidgets}
          onChange={(e) => handleWidgetChange('headerWidgets', e.target.value)}
          label="Select Widgets for Header"
        >
          {availableWidgets.map(widget => (
            <MenuItem key={widget} value={widget}>
              {widget.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography variant="subtitle1" sx={{ color: grey[700], mb: 1 }}>
        Sidebar Widgets
      </Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={layoutConfig.enableSidebar}
            onChange={(e) => handleLayoutConfigChange('enableSidebar', e.target.checked)}
          />
        }
        label="Enable Sidebar"
        sx={{ mb: 1 }}
      />
      {layoutConfig.enableSidebar && (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Widgets for Sidebar</InputLabel>
          <Select
            multiple
            value={layoutConfig.sidebarWidgets}
            onChange={(e) => handleWidgetChange('sidebarWidgets', e.target.value)}
            label="Select Widgets for Sidebar"
          >
            {availableWidgets.map(widget => (
              <MenuItem key={widget} value={widget}>
                {widget.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <Typography variant="subtitle1" sx={{ color: grey[700], mb: 1 }}>
        Main Content Widgets
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Select Widgets for Main Content</InputLabel>
        <Select
          multiple
          value={layoutConfig.mainContentWidgets}
          onChange={(e) => handleWidgetChange('mainContentWidgets', e.target.value)}
          label="Select Widgets for Main Content"
        >
          {availableWidgets.map(widget => (
            <MenuItem key={widget} value={widget}>
              {widget.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Number of Columns in Main Content"
        type="number"
        value={layoutConfig.mainContentColumns}
        onChange={(e) => handleLayoutConfigChange('mainContentColumns', Math.max(1, Math.min(3, e.target.value)))}
        sx={{ mb: 2 }}
        inputProps={{ min: 1, max: 3 }}
      />
      <Typography variant="subtitle1" sx={{ color: grey[700], mb: 1 }}>
        Footer Widgets
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Select Widgets for Footer</InputLabel>
        <Select
          multiple
          value={layoutConfig.footerWidgets}
          onChange={(e) => handleWidgetChange('footerWidgets', e.target.value)}
          label="Select Widgets for Footer"
        >
          {availableWidgets.map(widget => (
            <MenuItem key={widget} value={widget}>
              {widget.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" sx={{ mt: 3 }} onClick={() => setTabValue(2)}>
        Next: Catalog & Browse
      </Button>

      {/* Preview Modal */}
      <Modal open={previewModal.open} onClose={() => setPreviewModal({ open: false, layout: null })}>
        <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', maxWidth: '900px', p: 4 }}>
          {previewModal.layout && (
            <>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                {previewModal.layout.name}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <img src={previewModal.layout.previewImage} alt={previewModal.layout.name} style={{ width: '100%', borderRadius: '8px' }} />
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {previewModal.layout.description}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={() => setPreviewModal({ open: false, layout: null })}>
                  Close
                </Button>
                <Button variant="contained" onClick={() => handleSelectLayout(previewModal.layout.id)}>
                  Select Layout
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Modal>
    </Box>
  );
}