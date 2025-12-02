import React from 'react';
import { Box, IconButton, Slider, Select, MenuItem } from '@mui/material';
import {
  SaveOutlined as SaveIcon,
  CheckCircleOutline as MarkCompleteIcon,
  Publish as PublishIcon,
  FileDownload as ExportIcon,
  UndoOutlined as UndoIcon,
  RedoOutlined as RedoIcon,
  GridOnOutlined as GridIcon,
  ZoomInOutlined as ZoomInIcon,
  ZoomOutOutlined as ZoomOutIcon,
  StraightenOutlined as StraightenIcon,
  SettingsOutlined as SettingsIcon,
  SwapHoriz as SwapHorizIcon,
  AutoAwesomeOutlined as AIIcon,
} from '@mui/icons-material';

interface ControlsProps {
  handleSave: () => void;
  handleMarkComplete: () => void;
  handlePublish: () => void;
  handleExport: () => void;
  handleExportPDF: () => void;
  handleUndo: () => void;
  handleRedo: () => void;
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
  deviceMode: string;
  setDeviceMode: (mode: string) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  showRulers: boolean;
  setShowRulers: (show: boolean) => void;
  previewMode: boolean;
  setPreviewMode: (mode: boolean) => void;
  showAILayoutModal: boolean;
  setShowAILayoutModal: (show: boolean) => void;
  sidebarPosition: string;
  setSidebarPosition: (position: string) => void;
  isCompleted: boolean;
  historyIndex: number; // Added historyIndex prop
  historyLength: number; // Added historyLength prop for redo button
}

const Controls: React.FC<ControlsProps> = ({
  handleSave,
  handleMarkComplete,
  handlePublish,
  handleExport,
  handleExportPDF,
  handleUndo,
  handleRedo,
  zoomLevel,
  setZoomLevel,
  deviceMode,
  setDeviceMode,
  showGrid,
  setShowGrid,
  showRulers,
  setShowRulers,
  previewMode,
  setPreviewMode,
  showAILayoutModal,
  setShowAILayoutModal,
  sidebarPosition,
  setSidebarPosition,
  isCompleted,
  historyIndex,
  historyLength,
}) => {
  return (
    <Box sx={{ position: 'fixed', top: '80px', right: '20px', zIndex: 1002, display: 'flex', gap: 1, bgcolor: '#FFFFFF', p: 1, borderRadius: 1, boxShadow: 2 }}>
      <IconButton onClick={handleSave}>
        <SaveIcon sx={{ color: '#000000' }} />
      </IconButton>
      <IconButton onClick={handleMarkComplete} disabled={isCompleted}>
        <MarkCompleteIcon sx={{ color: '#000000' }} />
      </IconButton>
      <IconButton onClick={handlePublish} disabled={isCompleted}>
        <PublishIcon sx={{ color: '#000000' }} />
      </IconButton>
      <IconButton onClick={handleExport}>
        <ExportIcon sx={{ color: '#000000' }} />
      </IconButton>
      <IconButton onClick={handleExportPDF}>
        <ExportIcon sx={{ color: '#000000' }} />
      </IconButton>
      <IconButton onClick={handleUndo} disabled={historyIndex <= 0}>
        <UndoIcon sx={{ color: '#000000' }} />
      </IconButton>
      <IconButton onClick={handleRedo} disabled={historyIndex >= historyLength - 1}>
        <RedoIcon sx={{ color: '#000000' }} />
      </IconButton>
      <IconButton onClick={() => setShowGrid(!showGrid)} color={showGrid ? 'primary' : 'default'}>
        <GridIcon sx={{ color: '#000000' }} />
      </IconButton>
      <Slider
        value={zoomLevel}
        onChange={(e, newValue) => setZoomLevel(newValue as number)}
        min={0.5}
        max={2}
        step={0.1}
        sx={{ width: '100px', color: '#000000' }}
      />
      <Select value={deviceMode} onChange={(e) => setDeviceMode(e.target.value as string)} size="small">
        <MenuItem value="desktop">Desktop</MenuItem>
        <MenuItem value="tablet">Tablet</MenuItem>
        <MenuItem value="mobile">Mobile</MenuItem>
      </Select>
      <IconButton onClick={() => setShowRulers(!showRulers)}>
        <StraightenIcon sx={{ color: '#000000' }} />
      </IconButton>
      <IconButton onClick={() => setPreviewMode(!previewMode)}>
        <SettingsIcon sx={{ color: '#000000' }} />
      </IconButton>
      <IconButton onClick={() => setShowAILayoutModal(!showAILayoutModal)}>
        <AIIcon sx={{ color: '#000000' }} />
      </IconButton>
      <IconButton onClick={() => setSidebarPosition(sidebarPosition === 'left' ? 'right' : 'left')}>
        <SwapHorizIcon sx={{ color: '#000000' }} />
      </IconButton>
    </Box>
  );
};

export default Controls;