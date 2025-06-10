'use client';

import React, { useState, useEffect, ChangeEvent, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Box,
  Typography,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CssBaseline,
  Tooltip,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import GridViewIcon from '@mui/icons-material/GridView';
import PersonIcon from '@mui/icons-material/Person';
import Header from './Header';
import Footer from './Footer';
import './discover.css';

import { useDroppable } from '@dnd-kit/core';

// Types
interface WidgetConfig {
  id: string;
  type: string;
  content?: string;
  settings?: Record<string, any>;
}

interface PageLayout {
  [section: string]: WidgetConfig[];
}

interface LayoutConfig {
  categoryLanding: PageLayout;
  pdp: PageLayout;
  userProfile: PageLayout;
}

interface WorkspaceDetails {
  name: string;
  description: string;
}

// Props for the Footer component
interface FooterProps {
  onSave: () => void;
  onPreview: () => void;
}

// Page type to layout type mapping
const pageToLayoutTypes: Record<string, string[]> = {
  categoryLanding: ['two-column', 'three-column', 'tiled'],
  pdp: ['two-column', 'three-column'],
  userProfile: ['two-column', 'menu-row'],
};

// Page type to widget mapping
const pageToWidgets: Record<string, string[]> = {
  categoryLanding: [
    'hero-banner',
    'featured-categories',
    'promotional-banner',
    'offers',
    'coupon-holder',
    'notification-widget',
  ],
  pdp: [
    'product-images',
    'product-details',
    'reviews',
    'add-to-cart',
    'related-products',
    'offers',
    'notification-widget',
  ],
  userProfile: [
    'profile-summary',
    'order-history',
    'saved-items',
    'account-settings',
    'notification-widget',
  ],
};

// Page type to sections mapping (based on layout type)
const pageToSections: Record<string, Record<string, string[]>> = {
  categoryLanding: {
    'two-column': ['header', 'mainLeft', 'mainRight', 'footer'],
    'three-column': ['header', 'mainLeft', 'mainCenter', 'mainRight', 'footer'],
    tiled: ['tiles'],
  },
  pdp: {
    'two-column': ['hero', 'mainLeft', 'mainRight', 'bottom'],
    'three-column': ['hero', 'mainLeft', 'mainCenter', 'mainRight', 'bottom'],
  },
  userProfile: {
    'two-column': ['sidebar', 'main'],
    'menu-row': ['menu', 'content'],
  },
};

// Widget descriptions for tooltips
const widgetDescriptions: Record<string, string> = {
  'hero-banner': 'A large banner to showcase promotions or featured content.',
  'featured-categories': 'Display highlighted categories for easy navigation.',
  'promotional-banner': 'A banner for special promotions or events.',
  offers: 'Show current offers or discounts.',
  'coupon-holder': 'Display available coupons for users.',
  'notification-widget': 'Show important notifications or alerts.',
  'product-images': 'Gallery of product images.',
  'product-details': 'Detailed information about the product.',
  reviews: 'User reviews and ratings.',
  'add-to-cart': 'Button to add the product to the cart.',
  'related-products': 'Suggestions for related products.',
  'profile-summary': 'Summary of user profile information.',
  'order-history': 'List of past orders.',
  'saved-items': 'Items saved for later.',
  'account-settings': 'Options to manage account settings.',
};

const DiscoverAILayoutStudio: React.FC = () => {
  const router = useRouter();

  // State for workspace details
  const [workspaceDetails, setWorkspaceDetails] = useState<WorkspaceDetails>({
    name: '',
    description: '',
  });
  const [showWorkspaceModal, setShowWorkspaceModal] = useState<boolean>(true);

  // State for layout configuration
  const [layout, setLayout] = useState<LayoutConfig>({
    categoryLanding: { header: [], mainLeft: [], mainRight: [], footer: [] },
    pdp: { hero: [], mainLeft: [], mainRight: [], bottom: [] },
    userProfile: { sidebar: [], main: [] },
  });

  // State for selected page and layout type
  const [selectedPage, setSelectedPage] = useState<keyof LayoutConfig>('categoryLanding');
  const [layoutType, setLayoutType] = useState<string>('two-column');
  const [previewPrice, setPreviewPrice] = useState<number>(0);
  const [previewFragment, setPreviewFragment] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  // State for widget configuration modal
  const [openWidgetModal, setOpenWidgetModal] = useState<boolean>(false);
  const [selectedWidget, setSelectedWidget] = useState<WidgetConfig | null>(null);
  const [widgetContent, setWidgetContent] = useState<string>('');
  const [widgetSettings, setWidgetSettings] = useState<Record<string, any>>({});

  // Memoize available widgets to prevent re-renders
  const availableWidgets = useMemo(() => 
    pageToWidgets[selectedPage].map((type, index) => ({
      id: `available-${type}-${index}`,
      type,
    })), 
    [selectedPage]
  );

  // Get sections based on page type and layout type
  const sections = pageToSections[selectedPage][layoutType] || [];

  // Setup sensors for @dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1, // Lowered to make drag more responsive
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initialize layout sections dynamically
  useEffect(() => {
    const newLayout = { ...layout };
    newLayout[selectedPage] = sections.reduce((acc: PageLayout, section: string) => {
      acc[section] = layout[selectedPage][section] || [];
      return acc;
    }, {});
    setLayout(newLayout);
  }, [selectedPage, layoutType]);

  const handleDragStart = (event: DragEndEvent) => {
    console.log('Drag started:', event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log('Drag ended:', { activeId: active?.id, overId: over?.id });

    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    // Extract source and destination
    const sourceContainer = activeId.startsWith('available-') ? 'available' : activeId.split('-widget-')[0];
    const destContainer = overId.startsWith('available-') ? 'available' : overId.split('-widget-')[0];

    // Prevent dropping back into available widgets
    if (destContainer === 'available') return;

    const newLayout = { ...layout };
    const pageLayout = newLayout[selectedPage];

    let widget: WidgetConfig;
    if (sourceContainer === 'available') {
      // Dragging from available widgets
      const [, type, index] = activeId.split('-');
      widget = { id: `${type}-${Date.now()}`, type };
    } else {
      // Dragging within or between sections
      const sourceSection = sourceContainer;
      const sourceIndex = pageLayout[sourceSection].findIndex(
        (w: WidgetConfig) => `${sourceSection}-widget-${w.id}` === activeId
      );
      widget = pageLayout[sourceSection][sourceIndex];

      // Remove from source section
      pageLayout[sourceSection] = pageLayout[sourceSection].filter(
        (_: WidgetConfig, idx: number) => idx !== sourceIndex
      );
    }

    // Add to destination section
    const destSection = destContainer;
    let destIndex: number;
    if (overId === destSection) {
      // Dropped on the section itself (empty section)
      destIndex = pageLayout[destSection].length;
    } else {
      // Dropped on a widget in the section
      destIndex = pageLayout[destSection].findIndex(
        (w: WidgetConfig) => `${destSection}-widget-${w.id}` === overId
      );
      // If dropped on a widget, insert at that position
      if (destIndex < 0) destIndex = pageLayout[destSection].length;
    }

    pageLayout[destSection] = [
      ...pageLayout[destSection].slice(0, destIndex),
      widget,
      ...pageLayout[destSection].slice(destIndex),
    ];

    setLayout(newLayout);

    // Calculate preview price
    const totalWidgets = Object.values(pageLayout).reduce(
      (sum: number, widgets: WidgetConfig[]) => sum + widgets.length,
      0
    );
    setPreviewPrice(totalWidgets * 10);
  };

  const handleSaveLayout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/cms/storefront/layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspace: workspaceDetails, layoutConfig: layout }),
      });
      if (!response.ok) throw new Error('Failed to save layout');
      const data = await response.json();
      alert('Layout saved successfully!');
    } catch (error) {
      console.error('Error saving layout:', error);
      alert('Failed to save layout. Please ensure the backend server is running.');
    }
  };

  const handleConfigureWidget = (widget: WidgetConfig) => {
    setSelectedWidget(widget);
    setWidgetContent(widget.content || '');
    setWidgetSettings(widget.settings || {});
    setOpenWidgetModal(true);
  };

  const handleSaveWidgetConfig = () => {
    if (!selectedWidget) return;

    const newLayout = { ...layout };
    const pageLayout = newLayout[selectedPage];

    Object.keys(pageLayout).forEach((section) => {
      pageLayout[section] = pageLayout[section].map((w: WidgetConfig) =>
        w.id === selectedWidget.id
          ? { ...w, content: widgetContent, settings: widgetSettings }
          : w
      );
    });

    setLayout(newLayout);
    setOpenWidgetModal(false);
    setSelectedWidget(null);
    setWidgetContent('');
    setWidgetSettings({});
  };

  const DraggableWidget = ({ widget, index, section }: { widget: WidgetConfig; index: number; section: string }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
    id: `${section}-widget-${widget.id}`, // This should match the one passed to SortableContext
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: 'transform 0.2s ease',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Tooltip title={widgetDescriptions[widget.type] || 'Widget'} placement="top">
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="widget">
        <Typography variant="body2" sx={{ color: '#616161' }}>
          {widget.type.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
        </Typography>
        <IconButton size="small" onClick={() => handleConfigureWidget(widget)}>
          <EditIcon fontSize="small" sx={{ color: '#616161' }} />
        </IconButton>
      </div>
    </Tooltip>
  );
};

  const AvailableWidget = ({ widget }: { widget: WidgetConfig }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({
      id: widget.id,
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition: 'transform 0.2s ease',
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <Tooltip title={widgetDescriptions[widget.type] || 'Available Widget'} placement="right">
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="widget">
          <Typography variant="body2" sx={{ color: '#616161' }}>
            {widget.type.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
          </Typography>
        </div>
      </Tooltip>
    );
  };

  const DroppableSection = ({ section, widgets }: { section: string; widgets: WidgetConfig[] }) => {
    const { setNodeRef, isOver } = useDroppable({
      id: section,
    });
  
    return (
      <div className="section-container">
        <Typography variant="subtitle1" className="section-header">
          <ViewColumnIcon sx={{ mr: 1, verticalAlign: 'middle', color: '#616161' }} />
          {section.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
        </Typography>
        <SortableContext
          id={section}
          items={widgets.map((widget) => `${section}-widget-${widget.id}`)}
        >
          <div
            ref={setNodeRef}
            className={`droppable-section ${isOver ? 'droppable-section-active' : ''}`}
          >
            {widgets.length === 0 && (
              <Typography variant="body2" sx={{ color: '#616161' }}>
                Drop widgets here
              </Typography>
            )}
            {widgets.map((widget, index) => (
              <DraggableWidget key={`${section}-widget-${widget.id}`} widget={widget} index={index} section={section} />
            ))}
          </div>
        </SortableContext>
      </div>
    );
  };

  const renderPreview = () => {
    const pageLayout = layout[selectedPage];
    const sections = Object.keys(pageLayout);

    let gridClass = 'grid grid-cols-1 gap-6';
    if (layoutType === 'two-column') {
      gridClass = 'grid grid-cols-2 gap-6';
    } else if (layoutType === 'three-column') {
      gridClass = 'grid grid-cols-3 gap-6';
    } else if (layoutType === 'tiled') {
      gridClass = 'grid grid-cols-2 md:grid-cols-4 gap-4';
    } else if (layoutType === 'menu-row') {
      gridClass = 'flex flex-col gap-4';
    }

    return (
      <div className="preview-section">
        {previewFragment ? (
          <div>
            <Typography variant="subtitle2" sx={{ color: '#616161' }}>
              {previewFragment}
            </Typography>
            {pageLayout[previewFragment].map((widget: WidgetConfig, index: number) => (
              <div key={index} className="p-2 bg-gray-100">
                {widget.type.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                {widget.content && (
                  <Typography variant="body2" sx={{ color: '#616161' }}>
                    {widget.content}
                  </Typography>
                )}
              </div>
            ))}
          </div>
        ) : (
          sections.map((section) => (
            <div key={section} className={layoutType === 'menu-row' ? 'w-full' : ''}>
              <Typography variant="subtitle2" sx={{ color: '#616161' }}>
                {section.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
              </Typography>
              <div className={gridClass}>
                {pageLayout[section].map((widget: WidgetConfig, index: number) => (
                  <div key={index} className="p-2 bg-gray-100">
                    {widget.type.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                    {widget.content && (
                      <Typography variant="body2" sx={{ color: '#616161' }}>
                        {widget.content}
                      </Typography>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />

      {/* Dedicated Header Component */}
      <Header onLogout={() => router.push('/dashboard/cms/login')} />

      {/* Title: Enhanced LayoutIQ - Left Aligned, No Background */}
      <Typography
        variant="h4"
        sx={{
          textAlign: 'left',
          ml: 2,
          mt: 2,
          mb: 4,
          fontWeight: 'bold',
          color: '#616161', // Gray
        }}
      >
        Enhanced LayoutIQ
      </Typography>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flexGrow: 1, pt: 4, pb: 4, bgcolor: '#e0e0e0', position: 'relative' }}>
        {/* Back Button - Top Right Below Header */}
        <Box sx={{ position: 'absolute', top: 80, right: 16 }}>
          <Button
            startIcon={<ArrowBackIcon sx={{ color: '#616161' }} />}
            onClick={() => router.push('/storefront-configurator')}
            sx={{
              bgcolor: '#e0e0e0', // Light silver
              color: '#616161', // Gray
              border: '1px solid #d32f2f', // Red border
              borderRadius: 0, // Rectangular
              '&:hover': { bgcolor: '#d5d5d5' },
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            Back
          </Button>
        </Box>

        {/* Left Panel: Available Widgets */}
        <Box sx={{ width: '200px', mr: 2, mt: 4 }}>
          <Typography variant="h6" sx={{ color: '#616161', fontWeight: 'medium', mb: 2 }}>
            Available Widgets
          </Typography>
          <SortableContext
            id="available"
            items={availableWidgets.map((widget) => widget.id)}
          >
            <div className="droppable-section">
              {availableWidgets.map((widget) => (
                <AvailableWidget key={widget.id} widget={widget} />
              ))}
            </div>
          </SortableContext>
        </Box>

        {/* Right Panel: Workspace and Preview */}
        <Box sx={{ flexGrow: 1, position: 'relative', mt: 4 }}>
          {/* Workspace Name - Top Right */}
          <Box sx={{ position: 'absolute', top: 0, right: 0, bgcolor: '#e0e0e0', p: 1 }}>
            <Typography variant="subtitle1" sx={{ color: '#616161', fontWeight: 'medium' }}>
              Workspace: {workspaceDetails.name || 'Unnamed'}
            </Typography>
          </Box>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {/* Page Type and Layout Type Selection - Horizontal Layout */}
            <Box display="flex" gap={2} mb={4} mt={4}>
              {/* Page Type Selection */}
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium', color: '#616161' }}>
                  Page Type
                </Typography>
                <ToggleButtonGroup
                  value={selectedPage}
                  exclusive
                  onChange={(e, newPage) => {
                    if (newPage) {
                      setSelectedPage(newPage);
                      setPreviewFragment(null);
                      setLayoutType(pageToLayoutTypes[newPage][0]);
                    }
                  }}
                  sx={{ bgcolor: '#e0e0e0', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
                >
                  <ToggleButton value="categoryLanding" sx={{ textTransform: 'none', px: 3 }}>
                    <GridViewIcon sx={{ mr: 1, color: '#616161' }} />
                    Category Landing
                  </ToggleButton>
                  <ToggleButton value="pdp" sx={{ textTransform: 'none', px: 3 }}>
                    <ViewColumnIcon sx={{ mr: 1, color: '#616161' }} />
                    PDP
                  </ToggleButton>
                  <ToggleButton value="userProfile" sx={{ textTransform: 'none', px: 3 }}>
                    <PersonIcon sx={{ mr: 1, color: '#616161' }} />
                    User Profile
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Layout Type Selection - To the Right */}
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium', color: '#616161' }}>
                  Layout Type
                </Typography>
                <ToggleButtonGroup
                  value={layoutType}
                  exclusive
                  onChange={(e, newLayoutType) => {
                    if (newLayoutType) setLayoutType(newLayoutType);
                  }}
                  sx={{ bgcolor: '#e0e0e0', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
                >
                  {pageToLayoutTypes[selectedPage].map((type) => (
                    <ToggleButton key={type} value={type} sx={{ textTransform: 'none', px: 3 }}>
                      {type.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>
            </Box>

            {/* Preview Fragment Selection (PDP only) */}
            {selectedPage === 'pdp' && (
              <Box mb={4}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'medium', color: '#616161' }}>
                  Preview Fragment
                </Typography>
                <ToggleButtonGroup
                  value={previewFragment || ''}
                  exclusive
                  onChange={(e, newFragment) => setPreviewFragment(newFragment || null)}
                  sx={{ bgcolor: '#e0e0e0', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
                >
                  <ToggleButton value="" sx={{ textTransform: 'none', px: 3 }}>
                    Full PDP
                  </ToggleButton>
                  {sections.map((section) => (
                    <ToggleButton key={section} value={section} sx={{ textTransform: 'none', px: 3 }}>
                      {section.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>
            )}

            {/* Workspace with Rulers */}
            <Box sx={{ position: 'relative', border: '1px solid #616161', p: 2, minHeight: '500px', bgcolor: '#fff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              {/* Horizontal Ruler (Top) */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '20px',
                  bgcolor: '#e0e0e0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  px: 1,
                }}
              >
                {Array.from({ length: 10 }).map((_, i) => (
                  <Typography key={i} variant="caption" sx={{ color: '#616161' }}>
                    {i * 100}px
                  </Typography>
                ))}
              </Box>

              {/* Vertical Ruler (Left) */}
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 20,
                  height: 'calc(100% - 20px)',
                  width: '20px',
                  bgcolor: '#e0e0e0',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  py: 1,
                }}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Typography key={i} variant="caption" sx={{ transform: 'rotate(-90deg)', color: '#616161' }}>
                    {i * 100}px
                  </Typography>
                ))}
              </Box>

              {/* Workspace Content */}
              <Box sx={{ ml: 3, mt: 3 }}>
                <Typography variant="h6" sx={{ color: '#616161', fontWeight: 'medium', mb: 2 }}>
                  Workspace
                </Typography>
                {sections.map((section) => (
                  <DroppableSection
                    key={section}
                    section={section}
                    widgets={layout[selectedPage][section]}
                  />
                ))}
              </Box>
            </Box>

            {/* Preview Section */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ color: '#616161', fontWeight: 'medium', mb: 2 }}>
                Preview (Price: ${previewPrice})
              </Typography>
              {renderPreview()}
            </Box>
          </DndContext>
        </Box>
      </Box>

      {/* Dedicated Footer Component */}
      <Footer onSave={handleSaveLayout} onPreview={() => setShowPreviewModal(true)} />

      {/* Workspace Details Modal */}
      <Dialog open={showWorkspaceModal} onClose={() => {}}>
        <DialogTitle sx={{ bgcolor: '#e0e0e0', color: '#616161' }}>Setup Workspace</DialogTitle>
        <DialogContent className="modal-content">
          <TextField
            fullWidth
            label="Workspace Name"
            value={workspaceDetails.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setWorkspaceDetails({ ...workspaceDetails, name: e.target.value })
            }
            margin="normal"
            required
            InputLabelProps={{ style: { color: '#616161' } }}
            sx={{ '& .MuiOutlinedInput-root': { borderColor: '#616161' } }}
          />
          <TextField
            fullWidth
            label="Description"
            value={workspaceDetails.description}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setWorkspaceDetails({ ...workspaceDetails, description: e.target.value })
            }
            margin="normal"
            multiline
            rows={3}
            InputLabelProps={{ style: { color: '#616161' } }}
            sx={{ '& .MuiOutlinedInput-root': { borderColor: '#616161' } }}
          />
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#e0e0e0' }}>
          <Button
            onClick={() => {
              if (workspaceDetails.name) setShowWorkspaceModal(false);
              else alert('Workspace name is required');
            }}
            sx={{
              bgcolor: '#e0e0e0',
              color: '#616161',
              border: '1px solid #d32f2f',
              borderRadius: 0,
              '&:hover': { bgcolor: '#d5d5d5' },
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Widget Configuration Modal */}
      <Dialog open={openWidgetModal} onClose={() => setOpenWidgetModal(false)}>
        <DialogTitle sx={{ bgcolor: '#e0e0e0', color: '#616161' }}>
          Configure Widget:{' '}
          {selectedWidget?.type.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}
        </DialogTitle>
        <DialogContent className="modal-content">
          <TextField
            fullWidth
            label="Content"
            value={widgetContent}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setWidgetContent(e.target.value)}
            margin="normal"
            multiline
            rows={4}
            placeholder="Enter widget content (e.g., banner text, notification message)"
            InputLabelProps={{ style: { color: '#616161' } }}
            sx={{ '& .MuiOutlinedInput-root': { borderColor: '#616161' } }}
          />
          {selectedWidget?.type === 'hero-banner' && (
            <TextField
              fullWidth
              label="Image URL"
              value={widgetSettings.imageUrl || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setWidgetSettings({ ...widgetSettings, imageUrl: e.target.value })
              }
              margin="normal"
              placeholder="Enter image URL for hero banner"
              InputLabelProps={{ style: { color: '#616161' } }}
              sx={{ '& .MuiOutlinedInput-root': { borderColor: '#616161' } }}
            />
          )}
          {selectedWidget?.type === 'offers' && (
            <TextField
              fullWidth
              label="Discount Percentage"
              type="number"
              value={widgetSettings.discount || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setWidgetSettings({ ...widgetSettings, discount: e.target.value })
              }
              margin="normal"
              placeholder="Enter discount percentage"
              InputLabelProps={{ style: { color: '#616161' } }}
              sx={{ '& .MuiOutlinedInput-root': { borderColor: '#616161' } }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: '#e0e0e0' }}>
          <Button
            onClick={() => setOpenWidgetModal(false)}
            sx={{
              bgcolor: '#e0e0e0',
              color: '#616161',
              border: '1px solid #d32f2f',
              borderRadius: 0,
              '&:hover': { bgcolor: '#d5d5d5' },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveWidgetConfig}
            sx={{
              bgcolor: '#e0e0e0',
              color: '#616161',
              border: '1px solid #d32f2f',
              borderRadius: 0,
              '&:hover': { bgcolor: '#d5d5d5' },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={showPreviewModal} onClose={() => setShowPreviewModal(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#e0e0e0', color: '#616161' }}>Layout Preview</DialogTitle>
        <DialogContent>{renderPreview()}</DialogContent>
        <DialogActions sx={{ bgcolor: '#e0e0e0' }}>
          <Button
            onClick={() => setShowPreviewModal(false)}
            sx={{
              bgcolor: '#e0e0e0',
              color: '#616161',
              border: '1px solid #d32f2f',
              borderRadius: 0,
              '&:hover': { bgcolor: '#d5d5d5' },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DiscoverAILayoutStudio;