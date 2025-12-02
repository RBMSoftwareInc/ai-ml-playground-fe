"use client";

import React from 'react';
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import { Dashboard } from '@mui/icons-material'; // Corrected import for DashboardIcon

interface SidebarMainProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  storeId: string;
  setStoreId: (id: string) => void;
  pageTypeId: string;
  setPageTypeId: (id: string) => void;
  stores: { id: string; name: string }[];
  pageTypes: { id: string; name: string }[];
  pageSectionMapping: { [key: string]: string[] };
  sectionTemplates: SectionTemplate[];
  sectionContentMapping: { [key: string]: { allowedWidgets: string[]; allowedFragments: string[] } };
  handleAddSection: (sectionType: string, templateId?: string, width?: string) => void;
}

interface SectionTemplate {
  id: string;
  name: string;
  type: string;
  slots: { id: string; content: null; order: number }[];
  layoutType: 'row' | 'column' | 'grid' | 'custom';
  layoutConfig?: { columns?: number };
}

const SidebarMain: React.FC<SidebarMainProps> = ({
  isOpen,
  toggleSidebar,
  storeId,
  setStoreId,
  pageTypeId,
  setPageTypeId,
  stores,
  pageTypes,
  pageSectionMapping,
  sectionTemplates,
  handleAddSection,
}) => {
  const currentPageTypeName = pageTypes.find((pt) => pt.id === pageTypeId)?.name || '';

  return (
    <Box sx={{ width: isOpen ? '350px' : '0', flexShrink: 0, transition: 'width 0.3s ease', overflow: 'hidden', zIndex: 1000 }}>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Blueprint Studio</Typography>
          <IconButton onClick={toggleSidebar}>
            <Dashboard sx={{ color: '#000000' }} />
          </IconButton>
        </Box>
        <FormControl size="small" sx={{ mb: 2, minWidth: 200 }}>
          <InputLabel>Select Store</InputLabel>
               <Select
                  value={storeId || ""}
                  onChange={(e) => setStoreId(e.target.value as string)}
                  sx={{ mb: 2, width: "100%" }}
                >
                  <MenuItem value="">Select Store</MenuItem>
                  {stores.map((store) => (
                    <MenuItem key={store.id} value={store.id}>
                      {store.name}
                    </MenuItem>
                  ))}
                </Select>
        </FormControl>
        <FormControl size="small" sx={{ mb: 2, minWidth: 200 }}>
          <InputLabel>Select Page Type</InputLabel>

          <Select
                  value={pageTypeId || ""}
                  onChange={(e) => setPageTypeId(e.target.value as string)}
                  sx={{ mb: 2, width: "100%" }}
                >
                  <MenuItem value="">Select Pagetype</MenuItem>
                  {pageTypes.map((pageType) => (
                    <MenuItem key={pageType.id} value={pageType.id}>
                      {pageType.name}
                    </MenuItem>
                  ))}
                </Select>
        </FormControl>
        <Box sx={{ mb: 2 }}>
          <Typography>Sections</Typography>
          {pageSectionMapping[currentPageTypeName]?.map((sectionType) => (
            <Button
              key={sectionType}
              variant="outlined"
              onClick={() => handleAddSection(sectionType)}
              sx={{ display: 'block', mb: 1, borderColor: '#000000', color: '#000000' }}
            >
              {sectionType}
            </Button>
          ))}
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography>Section Templates</Typography>
          {sectionTemplates.map((template) => (
            <Button
              key={template.id}
              variant="outlined"
              onClick={() => handleAddSection(template.type, template.id)}
              sx={{ display: 'block', mb: 1, borderColor: '#000000', color: '#000000' }}
            >
              {template.name}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SidebarMain; // Ensure default export is present