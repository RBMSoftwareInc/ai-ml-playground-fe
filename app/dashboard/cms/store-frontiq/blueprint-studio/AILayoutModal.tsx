import React from 'react';
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, Modal } from '@mui/material';
import { AutoAwesomeOutlined as AIIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

interface AILayoutModalProps {
  showAILayoutModal: boolean;
  setShowAILayoutModal: (show: boolean) => void;
  aiPageType: string;
  setAIPageType: (type: string) => void;
  desiredSections: string;
  setDesiredSections: (sections: string) => void;
  layoutStyle: string;
  setLayoutStyle: (style: string) => void;
  contentFocus: string;
  setContentFocus: (focus: string) => void;
  generatedPrompt: string;
  setGeneratedPrompt: (prompt: string) => void;
  generatedLayout: string;
  setGeneratedLayout: (layout: string) => void;
  handleGenerateLayout: () => void;
  handleApplyLayout: () => void;
}

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  backgroundColor: '#FFFFFF',
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(4),
}));

const AILayoutModal: React.FC<AILayoutModalProps> = ({
  showAILayoutModal,
  setShowAILayoutModal,
  aiPageType,
  setAIPageType,
  desiredSections,
  setDesiredSections,
  layoutStyle,
  setLayoutStyle,
  contentFocus,
  setContentFocus,
  generatedPrompt,
  setGeneratedPrompt,
  generatedLayout,
  setGeneratedLayout,
  handleGenerateLayout,
  handleApplyLayout,
}) => {
  return (
    <Modal open={showAILayoutModal} onClose={() => setShowAILayoutModal(false)}>
      <ModalContent>
        <Typography variant="h6">AI-Suggested Layouts</Typography>
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Page Type</InputLabel>
          <Select value={aiPageType} onChange={(e) => setAIPageType(e.target.value as string)}>
            <MenuItem value="Home">Home</MenuItem>
            <MenuItem value="PLP">Product Listing</MenuItem>
            <MenuItem value="PDP">Product Detail</MenuItem>
            <MenuItem value="Blog">Blog</MenuItem>
            <MenuItem value="Category">Category</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Desired Sections (e.g., Header, Content, Footer)"
          value={desiredSections}
          onChange={(e) => setDesiredSections(e.target.value)}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Layout Style</InputLabel>
          <Select value={layoutStyle} onChange={(e) => setLayoutStyle(e.target.value as string)}>
            <MenuItem value="row">Row</MenuItem>
            <MenuItem value="column">Column</MenuItem>
            <MenuItem value="grid">Grid</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Content Focus (e.g., Products, Blog Posts)"
          value={contentFocus}
          onChange={(e) => setContentFocus(e.target.value)}
          fullWidth
          size="small"
          sx={{ mb: 2 }}
        />
        <Button variant="contained" startIcon={<AIIcon />} onClick={handleGenerateLayout} sx={{ mb: 2 }}>
          Generate Layout
        </Button>
        {generatedPrompt && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Generated Prompt:</Typography>
            <Typography variant="body2">{generatedPrompt}</Typography>
          </Box>
        )}
        {generatedLayout && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Generated Layout:</Typography>
            <Typography variant="body2" component="pre">{generatedLayout}</Typography>
            <Button variant="contained" onClick={handleApplyLayout}>Apply Layout</Button>
          </Box>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AILayoutModal;