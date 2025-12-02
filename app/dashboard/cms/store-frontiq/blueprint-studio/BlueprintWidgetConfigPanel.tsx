'use client';

import { Box, Typography, TextField, Divider, Button, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

export default function BlueprintWidgetConfigPanel({ open, onClose, widgetData, onSave }) {
  const [localData, setLocalData] = useState(widgetData || { title: '', description: '' });

  const handleChange = (key: string, value: string) => {
    setLocalData({ ...localData, [key]: value });
  };

  const handleSave = () => {
    onSave(localData);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Configure Widget</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <TextField
          label="Title"
          value={localData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          label="Description"
          value={localData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />

        <Button variant="contained" fullWidth onClick={handleSave}>
          Save Widget
        </Button>
      </Box>
    </Modal>
  );
}
