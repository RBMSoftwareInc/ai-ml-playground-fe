import React, { useState, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Box, Button, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

interface SlotRendererProps {
  slot: Slot;
  sectionId: string;
  layoutType: 'row' | 'column' | 'grid' | 'custom';
  handleAssignContent: (sectionId: string, slotId: string, content: SlotContent | null) => void;
  handleSlotResize: (sectionId: string, slotId: string, newSize: { width: string; height: string }) => void;
  showWidgetConfig: { sectionId: string; slotId: string } | null;
  setShowWidgetConfig: (config: { sectionId: string; slotId: string } | null) => void;
  showFragmentSelector: { sectionId: string; slotId: string } | null;
  setShowFragmentSelector: (selector: { sectionId: string; slotId: string } | null) => void;
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

const SlotWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  border: `1px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(1),
  background: '#F5F5F5',
  minHeight: '100px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  '&:hover': {
    background: '#E0E0E0',
  },
}));

const SlotRenderer: React.FC<SlotRendererProps> = ({
  slot,
  sectionId,
  layoutType,
  handleAssignContent,
  handleSlotResize,
  showWidgetConfig,
  setShowWidgetConfig,
  showFragmentSelector,
  setShowFragmentSelector,
}) => {
  const { setNodeRef } = useDroppable({
    id: slot.id,
    data: { sectionId, slotId: slot.id },
  });
  const [dimensions, setDimensions] = useState(slot.dimensions || { width: '100%', height: '100px' });

  useEffect(() => {
    if (slot.dimensions) {
      setDimensions(slot.dimensions);
    }
  }, [slot.dimensions]);

  const handleResize = (e: React.ChangeEvent<HTMLInputElement>, dimension: 'width' | 'height') => {
    const newValue = e.target.value;
    const newDimensions = { ...dimensions, [dimension]: newValue };
    setDimensions(newDimensions);
    handleSlotResize(sectionId, slot.id, newDimensions);
  };

  const handleDrop = (content: SlotContent | null) => {
    handleAssignContent(sectionId, slot.id, content);
  };

  return (
    <SlotWrapper
      ref={setNodeRef}
      style={{
        ...dimensions,
        position: layoutType === 'grid' && slot.position ? 'absolute' : 'relative',
        top: layoutType === 'grid' && slot.position?.row ? `${slot.position.row * 100}px` : 'auto',
        left: layoutType === 'grid' && slot.position?.col ? `${slot.position.col * 100}px` : 'auto',
      }}
      onClick={() => {
        if (showWidgetConfig?.sectionId === sectionId && showWidgetConfig?.slotId === slot.id) {
          setShowWidgetConfig(null);
        } else {
          setShowWidgetConfig({ sectionId, slotId: slot.id });
        }
      }}
    >
      {slot.content ? (
        <Typography>{slot.content.title || 'Content'}</Typography>
      ) : (
        <Typography sx={{ color: '#757575' }}>Drop content here</Typography>
      )}
      {!showWidgetConfig && (
        <Box sx={{ mt: 1 }}>
          <TextField
            label="Width"
            value={dimensions.width}
            onChange={(e) => handleResize(e, 'width')}
            size="small"
            sx={{ mr: 1 }}
          />
          <TextField
            label="Height"
            value={dimensions.height}
            onChange={(e) => handleResize(e, 'height')}
            size="small"
          />
        </Box>
      )}
      {showWidgetConfig?.slotId === slot.id && (
        <Button onClick={() => setShowFragmentSelector({ sectionId, slotId: slot.id })}>Add Fragment</Button>
      )}
    </SlotWrapper>
  );
};

export default SlotRenderer;