import React, { useState, useEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Box, Typography, Button, TextField, IconButton, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import GridOverlay from './GridOverlay';
import SectionRenderer from './SectionRenderer';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface CanvasEditorProps {
  canvas: Canvas | null;
  setCanvas: (canvas: Canvas | null) => void;
  updateCanvasWithHistory: (newCanvas: Canvas) => void;
  fragments: Fragment[];
  sectionContentMapping: { [key: string]: { allowedWidgets: string[]; allowedFragments: string[] } };
  handleAddSlot: (sectionId: string, position?: { row: number; col: number }) => void;
  handleAssignContent: (sectionId: string, slotId: string, content: SlotContent | null) => void;
  handleSlotResize: (sectionId: string, slotId: string, newSize: { width: string; height: string }) => void;
  handleSectionUpdate: (sectionId: string, updates: Partial<Section>) => void;
  handleDragEnd: (event: any) => void;
  handleAddSection: (sectionType: string, templateId?: string, width?: string) => void;
  handleDeleteSection: (sectionId: string) => void;
  zoomLevel: number;
  deviceMode: string;
  setDeviceMode: (mode: string) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  showRulers: boolean;
  setShowRulers: (show: boolean) => void;
  previewMode: boolean;
  setPreviewMode: (mode: boolean) => void;
  selectedSectionId: string | null;
  setSelectedSectionId: (id: string | null) => void;
  alignment: 'left' | 'center' | 'right';
  setAlignment: (alignment: 'left' | 'center' | 'right') => void;
  layerOrder: string[];
  setLayerOrder: (order: string[]) => void;
  selectedLayer: string | null;
  setSelectedLayer: (id: string | null) => void;
  deviceDimensions: { [key: string]: { width: string; height: string } };
  setShowWidgetConfig: (config: { sectionId: string; slotId: string } | null) => void;
  setShowFragmentSelector: (selector: { sectionId: string; slotId: string } | null) => void;
  themeConfig: { header: { title: string; backgroundColor: string; textColor: string }; footer: { text: string; backgroundColor: string; textColor: string } };
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
  slot_type?: string;
}

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
  style?: { [key: string]: string };
  advanced?: { [key: string]: string | boolean };
  visibility_condition?: string;
}

interface Canvas {
  id: string;
  title: string;
  storeId: string;
  pageTypeId: string;
  status: 'draft' | 'published';
  sections: Section[];
  createdAt: string;
  updatedAt: string;
  themeId?: string;
  templateId?: string;
  canvasConfig?: any;
}

interface Fragment {
  id: string;
  name: string;
  type: 'Fragment';
  content: any;
  config: any;
  category: string;
}

const API_BASE_URL = 'http://localhost:5000/api/v1/cms/page/blueprint';

const CanvasWrapper = styled(Box)(({ theme }) => ({
  height: 'calc(100vh - 160px)',
  width: '100%',
  background: '#f0f0f0',
  position: 'relative',
  overflow: 'auto',
}));

const Header = styled(Box)(({ theme, config }) => ({
  backgroundColor: config.backgroundColor,
  color: config.textColor,
  padding: theme.spacing(2),
  textAlign: 'center',
  marginBottom: theme.spacing(2),
  position: 'sticky',
  top: 0,
  zIndex: 1000,
}));

const Footer = styled(Box)(({ theme, config }) => ({
  backgroundColor: config.backgroundColor,
  color: config.textColor,
  padding: theme.spacing(2),
  textAlign: 'center',
  marginTop: theme.spacing(2),
  position: 'sticky',
  bottom: 0,
  zIndex: 1000,
}));

const CanvasEditor: React.FC<CanvasEditorProps> = ({
  canvas,
  setCanvas,
  updateCanvasWithHistory,
  fragments,
  sectionContentMapping,
  handleAddSlot,
  handleAssignContent,
  handleSlotResize,
  handleSectionUpdate,
  handleDragEnd,
  handleAddSection,
  handleDeleteSection,
  zoomLevel,
  deviceMode,
  setDeviceMode,
  showGrid,
  setShowGrid,
  showRulers,
  setShowRulers,
  previewMode,
  setPreviewMode,
  selectedSectionId,
  setSelectedSectionId,
  alignment,
  setAlignment,
  layerOrder,
  setLayerOrder,
  selectedLayer,
  setSelectedLayer,
  deviceDimensions,
  setShowWidgetConfig,
  setShowFragmentSelector,
  themeConfig,
}) => {
  const [showRulerOverlay, setShowRulerOverlay] = useState(false);
  const [draggingSection, setDraggingSection] = useState<string | null>(null);

  useEffect(() => {
    setShowRulerOverlay(showRulers);
  }, [showRulers]);

  const handleAlignmentChange = (newAlignment: 'left' | 'center' | 'right') => {
    setAlignment(newAlignment);
  };

  const moveSection = (fromIndex: number, toIndex: number) => {
    if (!canvas) return;
    const newOrder = [...layerOrder];
    const [movedSection] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedSection);
    setLayerOrder(newOrder);
    const updatedSections = newOrder.map((id, index) => ({
      ...canvas.sections.find((s) => s.id === id)!,
      order: index,
    }));
    const newCanvas = { ...canvas, sections: updatedSections };
    updateCanvasWithHistory(newCanvas);
  };

  const handleDragStart = (sectionId: string, e: React.DragEvent) => {
    setDraggingSection(sectionId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    if (!canvas || !draggingSection) return;
    const fromIndex = layerOrder.indexOf(draggingSection);
    moveSection(fromIndex, targetIndex);
    setDraggingSection(null);
  };

  const handleDelete = (sectionId: string) => {
    handleDeleteSection(sectionId);
  };

  const renderSections = () => {
    if (!canvas) return null;
    return layerOrder.map((sectionId, index) => {
      const section = canvas.sections.find((s) => s.id === sectionId);
      if (!section) return null;
      return (
        <SectionRenderer
          key={section.id}
          section={section}
          index={index}
          handleAddSlot={handleAddSlot}
          handleAssignContent={handleAssignContent}
          handleSlotResize={handleSlotResize}
          handleSectionUpdate={handleSectionUpdate}
          showWidgetConfig={selectedSectionId === section.id ? { sectionId: section.id, slotId: '' } : null}
          setShowWidgetConfig={setShowWidgetConfig}
          showFragmentSelector={selectedSectionId === section.id ? { sectionId: section.id, slotId: '' } : null}
          setShowFragmentSelector={setShowFragmentSelector}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onDelete={handleDelete}
        />
      );
    });
  };

  if (!canvas) return <Typography>Loading...</Typography>;

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ height: '100%', width: '100%' }}>
        <Header config={themeConfig.header}>
          <Typography variant="h4">{themeConfig.header.title}</Typography>
        </Header>
        {showGrid && <GridOverlay />}
        {showRulerOverlay && (
          <>
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '10px', background: 'linear-gradient(to right, #ccc 1px, transparent 1px)', backgroundSize: '20px 1px' }} />
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '10px', height: '100%', background: 'linear-gradient(to bottom, #ccc 1px, transparent 1px)', backgroundSize: '1px 20px' }} />
          </>
        )}
        <CanvasWrapper style={{ width: deviceDimensions[deviceMode].width, height: deviceDimensions[deviceMode].height }}>
          <Grid container spacing={2} onDragOver={handleDragOver}>
            {renderSections()}
          </Grid>
          {!previewMode && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button variant="contained" onClick={() => handleAddSection('Hero Banner')} color="primary">
                Add Hero Banner
              </Button>
              <Button variant="contained" onClick={() => handleAddSection('Product Grid')} color="secondary">
                Add Product Grid
              </Button>
              <Button variant="contained" onClick={() => handleAddSection('Filter Sidebar')} color="success">
                Add Filter Sidebar
              </Button>
            </Box>
          )}
        </CanvasWrapper>
        <Footer config={themeConfig.footer}>
          <Typography variant="body2">{themeConfig.footer.text}</Typography>
        </Footer>
      </Box>
    </DndProvider>
  );
};

export default CanvasEditor;