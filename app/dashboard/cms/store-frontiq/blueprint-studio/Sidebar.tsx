'use client';

import React from 'react';
import { Box, Typography, Button, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
  ViewQuilt as ViewQuiltIcon,
  Dashboard as DashboardIcon,
  Widgets as WidgetsIcon,
  Extension as ExtensionIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTags, faAd, faFilter } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

// Styled components
const SidebarContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  color: '#000000',
  height: '100%',
  position: 'relative',
  overflowY: 'auto',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  borderRadius: '0 8px 8px 0',
  padding: theme.spacing(2),
}));

const ComponentOption = styled(Button)(({ theme }) => ({
  justifyContent: 'flex-start',
  textTransform: 'none',
  marginBottom: theme.spacing(1),
  color: '#000000',
  padding: theme.spacing(1, 2),
  borderRadius: '8px',
  transition: 'background-color 0.3s ease, transform 0.2s ease',
  '&:hover': {
    backgroundColor: alpha('#000000', 0.05),
    transform: 'translateX(5px)',
  },
}));

const ImagePreview = styled(motion.img)(({ theme }) => ({
  width: '40px',
  height: '40px',
  borderRadius: theme.shape.borderRadius,
  marginRight: theme.spacing(1),
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
}));

const Notch = styled(motion.div)(({ theme, isOpen }) => ({
  position: 'absolute',
  top: '50%',
  right: isOpen ? '-12px' : '100%',
  transform: 'translateY(-50%)',
  width: '24px',
  height: '40px',
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  cursor: 'pointer',
  zIndex: 1000,
  '&:after': {
    content: '""',
    display: 'block',
    width: 0,
    height: 0,
    borderTop: '8px solid transparent',
    borderBottom: '8px solid transparent',
    borderLeft: isOpen ? '8px solid #000000' : 'none',
    borderRight: isOpen ? 'none' : '8px solid #000000',
  },
}));

// Mock fragment library with e-commerce focus
const fragmentLibrary = [
  { id: 'fragment-1', name: 'Header Logo', type: 'Fragment', content: { url: 'https://picsum.photos/200/100' }, config: {}, category: 'Header', image: 'https://picsum.photos/40/40?random=1' },
  { id: 'fragment-2', name: 'Product Carousel', type: 'Fragment', content: { products: [] }, config: { api: '/api/products' }, category: 'Product', image: 'https://picsum.photos/40/40?random=2' },
  { id: 'fragment-3', name: 'Footer Links', type: 'Fragment', content: { items: [{ label: 'About', url: '/about' }] }, config: {}, category: 'Footer', image: 'https://picsum.photos/40/40?random=3' },
  { id: 'fragment-4', name: 'Category Filter', type: 'Fragment', content: { categories: [] }, config: {}, category: 'Category', image: 'https://picsum.photos/40/40?random=4' },
  { id: 'fragment-5', name: 'Promo Banner', type: 'Fragment', content: { text: 'Sale 50% Off!' }, config: {}, category: 'Promo', image: 'https://picsum.photos/40/40?random=5' },
];

// Mock section templates with e-commerce focus
const sectionTemplates = [
  { id: 'template-1', name: 'Hero Banner', type: 'Content', slots: [{ id: 'slot-1', content: null, order: 0 }], layoutType: 'row' },
  { id: 'template-2', name: 'Product Grid', type: 'Product', slots: [{ id: 'slot-1', content: null, order: 0 }], layoutType: 'grid', layoutConfig: { columns: 3 } },
  { id: 'template-3', name: 'Category Sidebar', type: 'Category', slots: [{ id: 'slot-1', content: null, order: 0 }], layoutType: 'column' },
];

// Define mappings for e-commerce page types
const pageSectionMapping = {
  Home: ['Header', 'Content', 'Product', 'Promo', 'Footer'],
  PLP: ['Header', 'Product', 'Category', 'Footer'],
  PDP: ['Header', 'Product', 'Sidebar', 'Footer'],
  Category: ['Header', 'Category', 'Product', 'Footer'],
};

const sectionContentMapping = {
  Header: { allowedWidgets: ['logo', 'nav-menu', 'search-bar'], allowedFragments: ['Header Logo'] },
  Content: { allowedWidgets: ['text', 'image', 'hero-banner'], allowedFragments: [] },
  Product: { allowedWidgets: ['product-card', 'product-grid'], allowedFragments: ['Product Carousel'] },
  Promo: { allowedWidgets: ['text', 'image'], allowedFragments: ['Promo Banner'] },
  Footer: { allowedWidgets: ['text', 'nav-menu'], allowedFragments: ['Footer Links'] },
  Sidebar: { allowedWidgets: ['text', 'product-card'], allowedFragments: [] },
  Category: { allowedWidgets: ['text', 'category-grid'], allowedFragments: ['Category Filter'] },
};

interface SidebarProps {
  pageType: string;
  handleAddSection: (sectionType: string, templateId?: string, width?: string) => void;
  setShowWidgetConfig: (config: { sectionId: string; slotId: string } | null) => void;
  setShowFragmentSelector: (config: { sectionId: string; slotId: string } | null) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ pageType, handleAddSection, setShowWidgetConfig, setShowFragmentSelector, isOpen, toggleSidebar }: SidebarProps) {
  return (
    <SidebarContainer>
      {/* Notch for toggling the sidebar */}
      <Notch
        isOpen={isOpen}
        onClick={toggleSidebar}
        initial={{ x: isOpen ? 0 : -10 }}
        animate={{ x: isOpen ? 0 : -10 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Blueprint Studio</Typography>
      <Divider sx={{ my: 2, borderColor: alpha('#000000', 0.1) }} />

      {/* Sections */}
      <Accordion defaultExpanded sx={{ boxShadow: 'none', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#000000' }} />}>
          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500 }}>
            <ViewQuiltIcon sx={{ color: '#000000' }} /> Sections
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {pageSectionMapping[pageType as keyof typeof pageSectionMapping]?.map((type) => (
            <ComponentOption key={type} onClick={() => handleAddSection(type)}>
              <FontAwesomeIcon icon={type === 'Product' ? faShoppingCart : type === 'Category' ? faTags : faAd} style={{ marginRight: '8px', color: '#000000' }} />
              {type} Section
            </ComponentOption>
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Section Templates */}
      <Accordion defaultExpanded sx={{ boxShadow: 'none', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#000000' }} />}>
          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500 }}>
            <DashboardIcon sx={{ color: '#000000' }} /> Section Templates
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {sectionTemplates
            .filter((template) => pageSectionMapping[pageType as keyof typeof pageSectionMapping]?.includes(template.type))
            .map((template) => (
              <ComponentOption key={template.id} onClick={() => handleAddSection(template.type, template.id)}>
                <FontAwesomeIcon icon={template.type === 'Product' ? faShoppingCart : template.type === 'Category' ? faTags : faAd} style={{ marginRight: '8px', color: '#000000' }} />
                {template.name}
              </ComponentOption>
            ))}
        </AccordionDetails>
      </Accordion>

      {/* Add Items to Canvas */}
      <Accordion defaultExpanded sx={{ boxShadow: 'none', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#000000' }} />}>
          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500 }}>
            <WidgetsIcon sx={{ color: '#000000' }} /> Add Items to Canvas
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ComponentOption onClick={() => setShowWidgetConfig({ sectionId: '', slotId: '' })}>
            <FontAwesomeIcon icon={faAd} style={{ marginRight: '8px', color: '#000000' }} />
            Add New Widget
          </ComponentOption>
          <ComponentOption onClick={() => setShowFragmentSelector({ sectionId: '', slotId: '' })}>
            <FontAwesomeIcon icon={faFilter} style={{ marginRight: '8px', color: '#000000' }} />
            Add Fragment (Select)
          </ComponentOption>
        </AccordionDetails>
      </Accordion>

      {/* Fragment Library */}
      <Accordion defaultExpanded sx={{ boxShadow: 'none', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#000000' }} />}>
          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 500 }}>
            <ExtensionIcon sx={{ color: '#000000' }} /> Fragment Library (Drag to Slot)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {fragmentLibrary
            .filter((fragment) =>
              pageSectionMapping[pageType as keyof typeof pageSectionMapping]?.some((sectionType) =>
                sectionContentMapping[sectionType as keyof typeof sectionContentMapping]?.allowedFragments.includes(fragment.name)
              )
            )
            .map((fragment) => (
              <ComponentOption
                key={fragment.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('fragment', fragment.id);
                }}
              >
                <ImagePreview
                  src={fragment.image}
                  alt={fragment.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <FontAwesomeIcon icon={fragment.category === 'Product' ? faShoppingCart : fragment.category === 'Category' ? faTags : faAd} style={{ marginRight: '8px', color: '#000000' }} />
                {fragment.name}
              </ComponentOption>
            ))}
        </AccordionDetails>
      </Accordion>
    </SidebarContainer>
  );
}