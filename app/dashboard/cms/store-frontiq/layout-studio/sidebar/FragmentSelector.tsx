'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, styled } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';

const SidebarBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

const FragmentButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  color: '#616161',
  backgroundColor: '#F5F5F5',
  borderColor: '#C0C0C0',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1, 2),
  display: 'flex',
  justifyContent: 'space-between',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#E0E0E0',
    borderColor: '#A9A9A9',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  '&.Mui-selected': {
    backgroundColor: '#C0C0C0',
    color: '#FFFFFF',
    borderColor: '#A9A9A9',
  },
}));

export default function FragmentSelector({ layoutId, fragments, selectedFragment, onFragmentSelect, selectedPage }) {
  const router = useRouter();

  // Handle fragment selection
  const handleFragmentSelect = (fragment) => {
    onFragmentSelect(fragment);
  };

  return (
    <SidebarBox>
      <Typography variant="h6" sx={{ color: '#616161', fontWeight: 'bold' }}>
        Fragment Selector (Layout ID: {layoutId})
      </Typography>

      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ color: '#616161' }}>
            Fragments
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => router.push(`/dashboard/cms/store-frontiq/layout-studio/fragment-designer?pageType=${selectedPage}&layoutId=${layoutId}`)}
            sx={{ textTransform: 'none', color: '#A9A9A9', borderColor: '#C0C0C0' }}
            disabled={!selectedPage || !layoutId}
          >
            Design New Fragment
          </Button>
        </Box>
        <List>
          {fragments.map((fragment) => (
            <ListItem key={fragment.id} disablePadding>
              <FragmentButton
                fullWidth
                variant="outlined"
                onClick={() => handleFragmentSelect(fragment)}
                className={selectedFragment?.id === fragment.id ? 'Mui-selected' : ''}
              >
                <ListItemText primary={fragment.name} />
                {fragment.isUserDefined && (
                  <Typography variant="caption" sx={{ color: '#A9A9A9' }}>
                    (Custom)
                  </Typography>
                )}
              </FragmentButton>
              {fragment.children && fragment.children.length > 0 && (
                <List sx={{ pl: 2 }}>
                  {fragment.children.map((child) => (
                    <ListItem key={child.id} disablePadding>
                      <FragmentButton
                        fullWidth
                        variant="outlined"
                        onClick={() => handleFragmentSelect(child)}
                        className={selectedFragment?.id === child.id ? 'Mui-selected' : ''}
                      >
                        <ListItemText primary={`- ${child.name}`} />
                        {child.isUserDefined && (
                          <Typography variant="caption" sx={{ color: '#A9A9A9' }}>
                            (Custom)
                          </Typography>
                        )}
                      </FragmentButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </ListItem>
          ))}
        </List>
      </Box>
    </SidebarBox>
  );
}