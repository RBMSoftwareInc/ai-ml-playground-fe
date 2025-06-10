import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Grid, Typography, Box, Fade, Tooltip,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { defaultWidgets } from '../utils/layoutDefaults';
import fragments from '../utils/fragments';

// Icons for widgets
import ImageIcon from '@mui/icons-material/Image'; // For Banner
import GridOnIcon from '@mui/icons-material/GridOn'; // For ProductGrid
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel'; // For Carousel
import CallToActionIcon from '@mui/icons-material/CallToAction'; // For Footer
import CancelIcon from '@mui/icons-material/Cancel'; // For Cancel button

// Styled Components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius * 2,
    background: 'linear-gradient(145deg, #F5F5F5 0%, #E0E0E0 100%)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    border: `1px solid #C0C0C0`,
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: '#A9A9A9',
  color: 'white',
  fontWeight: 'bold',
  letterSpacing: '0.5px',
  padding: theme.spacing(2),
  borderTopLeftRadius: theme.shape.borderRadius * 2,
  borderTopRightRadius: theme.shape.borderRadius * 2,
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  backgroundColor: '#F5F5F5',
  padding: theme.spacing(3),
  borderTop: `1px solid #C0C0C0`,
  borderBottom: `1px solid #C0C0C0`,
}));

const WidgetButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: '#A9A9A9',
  backgroundColor: 'white',
  borderColor: '#C0C0C0',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.5),
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: theme.spacing(1),
  '&:hover': {
    backgroundColor: '#E0E0E0',
    borderColor: '#616161',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
    transform: 'scale(1.03)',
  },
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  backgroundColor: '#F5F5F5',
  padding: theme.spacing(2),
  borderBottomLeftRadius: theme.shape.borderRadius * 2,
  borderBottomRightRadius: theme.shape.borderRadius * 2,
}));

const CancelButton = styled(Button)(({ theme }) => ({
  color: '#A9A9A9',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#E0E0E0',
    transform: 'scale(1.05)',
  },
}));

interface WidgetPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (widget: string) => void;
  fragmentId: string;
}

// Widget metadata for tooltips and icons
const widgetMetadata = {
  Banner: {
    tooltip: 'Add a full-width banner image to showcase promotions or featured content.',
    icon: <ImageIcon sx={{ color: '#A9A9A9' }} />,
  },
  ProductGrid: {
    tooltip: 'Display a grid of products, ideal for showcasing multiple items.',
    icon: <GridOnIcon sx={{ color: '#A9A9A9' }} />,
  },
  Carousel: {
    tooltip: 'Add a sliding carousel to display featured products or images.',
    icon: <ViewCarouselIcon sx={{ color: '#A9A9A9' }} />,
  },
  Footer: {
    tooltip: 'Add a footer section with links and information.',
    icon: <CallToActionIcon sx={{ color: '#A9A9A9' }} />,
  },
};

export default function WidgetPicker({ open, onClose, onSelect, fragmentId }: WidgetPickerProps) {
  const theme = useTheme();

  // Find the fragment by ID to get allowed widgets
  const fragment = fragments.find((f) => f.id === fragmentId);
  const allowedWidgets = fragment ? fragment.allowedWidgets : defaultWidgets;

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Fade}
      transitionDuration={300}
    >
      <StyledDialogTitle>
        Select Widget for {fragment?.name || 'Fragment'}
      </StyledDialogTitle>
      <StyledDialogContent dividers>
        <Grid container spacing={2}>
          {defaultWidgets
            .filter((widget) => allowedWidgets.includes(widget))
            .map((widget) => (
              <Grid item xs={6} key={widget}>
                <Tooltip title={widgetMetadata[widget]?.tooltip || `Add a ${widget} widget`} placement="top">
                  <WidgetButton
                    variant="outlined"
                    fullWidth
                    onClick={() => onSelect(widget)}
                    startIcon={widgetMetadata[widget]?.icon}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 'medium', color: '#616161' }}>
                      {widget}
                    </Typography>
                  </WidgetButton>
                </Tooltip>
              </Grid>
            ))}
        </Grid>
      </StyledDialogContent>
      <StyledDialogActions>
        <Tooltip title="Close the widget picker" placement="top">
          <CancelButton onClick={onClose} startIcon={<CancelIcon sx={{ color: '#A9A9A9' }} />}>
            Cancel
          </CancelButton>
        </Tooltip>
      </StyledDialogActions>
    </StyledDialog>
  );
}