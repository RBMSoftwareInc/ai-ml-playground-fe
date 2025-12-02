'use client';

import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

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
}));

interface Props {
  sectionId: string;
  slotId: string;
  onSave: (sectionId: string, slotId: string, content: any) => void;
  onClose: () => void;
}

export default function WidgetConfigPanel({ sectionId, slotId, onSave, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [apiConfig, setApiConfig] = useState('');

  const handleSave = () => {
    onSave(sectionId, slotId, {
      type: 'Widget',
      id: `widget-${Date.now()}`,
      title,
      description,
      style: { backgroundColor },
      config: { api: apiConfig },
    });
    onClose();
  };

  return (
    <Modal open={true} onClose={onClose}>
      <ModalContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Configure Widget</Typography>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          size="small"
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Background Color"
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        />
        <TextField
          label="API Endpoint"
          value={apiConfig}
          onChange={(e) => setApiConfig(e.target.value)}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </Box>
      </ModalContent>
    </Modal>
  );
}