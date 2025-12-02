import React from 'react';
import { Box, Typography, Tabs, Tab, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { ArrowBack as BackIcon } from '@mui/icons-material';
import { AlignLeftIcon, AlignCenterIcon, AlignRightIcon, BoldIcon, ItalicIcon, UnderlineIcon } from '@mui/icons-material';

interface SidebarEditProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  selectedSectionId: string | null;
  section: Section | null;
  handleSectionUpdate: (sectionId: string, updates: Partial<Section>) => void;
  sectionEditorTab: number;
  setSectionEditorTab: (tab: number) => void;
}

const SidebarEdit: React.FC<SidebarEditProps> = ({
  isOpen,
  toggleSidebar,
  selectedSectionId,
  section,
  handleSectionUpdate,
  sectionEditorTab,
  setSectionEditorTab,
}) => {
  const handleLayoutChange = (field: string, value: any) => {
    if (field === 'layoutType' && value === 'grid' && !section?.layoutConfig) {
      handleSectionUpdate(selectedSectionId!, {
        layoutType: value,
        layoutConfig: { columns: 2, rows: 1 },
      });
    } else {
      handleSectionUpdate(selectedSectionId!, { [field]: value });
    }
  };

  const handleStyleChange = (field: string, value: string) => {
    handleSectionUpdate(selectedSectionId!, {
      style: { ...section?.style, [field]: value },
    });
  };

  const handleAdvancedChange = (field: string, value: string | boolean) => {
    handleSectionUpdate(selectedSectionId!, {
      advanced: { ...section?.advanced, [field]: value },
    });
  };

  if (!selectedSectionId || !section) return null;

  return (
    <Box sx={{ width: isOpen ? '300px' : '0', flexShrink: 0, transition: 'width 0.3s ease', overflow: 'hidden', zIndex: 1000, backgroundColor: '#F9F9F9' }}>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={toggleSidebar} sx={{ mr: 1 }}>
            <BackIcon />
          </IconButton>
          <Typography variant="h6">Edit Section</Typography>
        </Box>
        <Tabs value={sectionEditorTab} onChange={(e, newValue) => setSectionEditorTab(newValue)} sx={{ mb: 2 }}>
          <Tab label="Layout" />
          <Tab label="Style" />
          <Tab label="Advanced" />
        </Tabs>
        {sectionEditorTab === 0 && (
          <Box>
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Layout Type</InputLabel>
                <Select
                  value={section.layoutType}
                  onChange={(e) => handleLayoutChange('layoutType', e.target.value)}
                >
                  <MenuItem value="row">Row</MenuItem>
                  <MenuItem value="column">Column</MenuItem>
                  <MenuItem value="grid">Grid</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {section.layoutType === 'grid' && (
              <>
                <Box sx={{ mb: 2 }}>
                  <TextField
                    label="Columns"
                    type="number"
                    value={section.layoutConfig?.columns || 2}
                    onChange={(e) =>
                      handleLayoutChange('layoutConfig', {
                        ...section.layoutConfig,
                        columns: parseInt(e.target.value),
                      })
                    }
                    fullWidth
                    size="small"
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <TextField
                    label="Rows"
                    type="number"
                    value={section.layoutConfig?.rows || 1}
                    onChange={(e) =>
                      handleLayoutChange('layoutConfig', {
                        ...section.layoutConfig,
                        rows: parseInt(e.target.value),
                      })
                    }
                    fullWidth
                    size="small"
                  />
                </Box>
              </>
            )}
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Width"
                value={section.width || 'full'}
                onChange={(e) => handleLayoutChange('width', e.target.value)}
                fullWidth
                size="small"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Height"
                value={section.dimensions.height}
                onChange={(e) =>
                  handleLayoutChange('dimensions', {
                    ...section.dimensions,
                    height: e.target.value,
                  })
                }
                fullWidth
                size="small"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Alignment</InputLabel>
                <Select value={alignment} onChange={(e) => setAlignment(e.target.value as any)}>
                  <MenuItem value="left"><AlignLeftIcon /> Left</MenuItem>
                  <MenuItem value="center"><AlignCenterIcon /> Center</MenuItem>
                  <MenuItem value="right"><AlignRightIcon /> Right</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        )}
        {sectionEditorTab === 1 && (
          <Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Background Color"
                value={section.style?.backgroundColor || '#FFFFFF'}
                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                fullWidth
                size="small"
                type="color"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Padding"
                value={section.style?.padding || '16px'}
                onChange={(e) => handleStyleChange('padding', e.target.value)}
                fullWidth
                size="small"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Margin"
                value={section.style?.margin || '0px'}
                onChange={(e) => handleStyleChange('margin', e.target.value)}
                fullWidth
                size="small"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Border"
                value={section.style?.border || 'none'}
                onChange={(e) => handleStyleChange('border', e.target.value)}
                fullWidth
                size="small"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Font Size"
                value={section.style?.fontSize || '16px'}
                onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                fullWidth
                size="small"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton onClick={() => handleStyleChange('fontWeight', 'bold')}>
                  <BoldIcon sx={{ color: '#000000' }} />
                </IconButton>
                <IconButton onClick={() => handleStyleChange('fontStyle', 'italic')}>
                  <ItalicIcon sx={{ color: '#000000' }} />
                </IconButton>
                <IconButton onClick={() => handleStyleChange('textDecoration', 'underline')}>
                  <UnderlineIcon sx={{ color: '#000000' }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        )}
        {sectionEditorTab === 2 && (
          <Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="CSS Class"
                value={section.advanced?.cssClass || ''}
                onChange={(e) => handleAdvancedChange('cssClass', e.target.value)}
                fullWidth
                size="small"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Custom ID"
                value={section.advanced?.customId || ''}
                onChange={(e) => handleAdvancedChange('customId', e.target.value)}
                fullWidth
                size="small"
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Visibility</InputLabel>
                <Select
                  value={section.advanced?.visibility || 'visible'}
                  onChange={(e) => handleAdvancedChange('visibility', e.target.value)}
                >
                  <MenuItem value="visible">Visible</MenuItem>
                  <MenuItem value="hidden">Hidden</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Animation</InputLabel>
                <Select
                  value={section.advanced?.animation || 'none'}
                  onChange={(e) => handleAdvancedChange('animation', e.target.value)}
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="fadeIn">Fade In</MenuItem>
                  <MenuItem value="slideIn">Slide In</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SidebarEdit;