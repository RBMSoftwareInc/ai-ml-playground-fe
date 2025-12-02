import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ArrowUpward as ArrowUpIcon, ArrowDownward as ArrowDownIcon } from '@mui/icons-material';

interface LayerPanelProps {
  canvas: Canvas | null;
  layerOrder: string[];
  selectedLayer: string | null;
  setSelectedLayer: (id: string | null) => void;
  moveLayerUp: () => void;
  moveLayerDown: () => void;
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

interface Slot {
  id: string;
  content: any | null;
  order: number;
  position?: { row: number; col: number };
  dimensions?: { width: string; height: string };
  slot_type?: string;
}

const LayerPanel: React.FC<LayerPanelProps> = ({ canvas, layerOrder, selectedLayer, setSelectedLayer, moveLayerUp, moveLayerDown }) => {
  return (
    <Box sx={{ position: 'fixed', top: '350px', left: '20px', zIndex: 1002, width: '200px', bgcolor: '#FFFFFF', p: 1, borderRadius: 1, boxShadow: 2 }}>
      <Typography variant="h6">Layers</Typography>
      {layerOrder.map((id) => {
        const isSelected = selectedLayer === id;
        const section = canvas?.sections.find((s) => s.id === id);
        return (
          <Box
            key={id}
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, cursor: 'pointer', fontWeight: isSelected ? 'bold' : 'normal' }}
            onClick={() => setSelectedLayer(id)}
          >
            <Typography>{section?.type || 'Unknown'}</Typography>
            <Box>
              <IconButton onClick={moveLayerUp} disabled={layerOrder.indexOf(id) === layerOrder.length - 1} size="small">
                <ArrowUpIcon sx={{ color: '#000000' }} />
              </IconButton>
              <IconButton onClick={moveLayerDown} disabled={layerOrder.indexOf(id) === 0} size="small">
                <ArrowDownIcon sx={{ color: '#000000' }} />
              </IconButton>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default LayerPanel;