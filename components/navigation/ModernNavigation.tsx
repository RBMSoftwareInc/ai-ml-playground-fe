import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Typography,
  alpha,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

interface ModernNavigationProps {
  sections: any[];
  activeCategory: string;
  activeTab: string;
  onCategoryChange: (category: string) => void;
  onTabChange: (tab: string) => void;
}

export default function ModernNavigation({
  sections,
  activeCategory,
  activeTab,
  onCategoryChange,
  onTabChange,
}: ModernNavigationProps) {
  return (
    <Box
      component="nav"
      sx={{
        width: 280,
        position: 'fixed',
        top: '80px',
        left: 0,
        bottom: 0,
        zIndex: 1100,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          px: 2,
          py: 3,
          bgcolor: 'rgba(5,5,5,0.85)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(16px)',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at top, rgba(255,0,0,0.25), transparent 60%)',
            opacity: 0.6,
            pointerEvents: 'none',
          },
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255,255,255,0.25)',
            borderRadius: '3px',
          },
        }}
      >
      <List component="nav" sx={{ px: 2 }}>
        {sections.map((section) => (
          <Box key={section.title} sx={{ mb: 1 }}>
            <ListItem
              button
              onClick={() => onCategoryChange(section.title)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                position: 'relative',
                bgcolor: activeCategory === section.title
                  ? alpha('#ff4d4d', 0.15)
                  : 'transparent',
                border: '1px solid',
                borderColor: activeCategory === section.title
                  ? alpha('#ff4d4d', 0.5)
                  : 'transparent',
                transition: 'all 0.25s ease',
                boxShadow: activeCategory === section.title ? '0 8px 20px rgba(255,0,0,0.15)' : 'none',
                '&:hover': {
                  bgcolor: alpha('#ff4d4d', 0.08),
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: activeCategory === section.title ? '#ff0000' : 'grey.400',
                minWidth: 40
              }}>
                {section.icon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: activeCategory === section.title ? 600 : 400,
                      color: activeCategory === section.title ? '#ff0000' : 'text.primary',
                    }}
                  >
                    {section.title}
                  </Typography>
                }
              />
              {activeCategory === section.title ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <Collapse in={activeCategory === section.title} timeout="auto">
              <List component="div" disablePadding>
                {section.items.map((item: any) => (
                  <ListItem
                    key={item.key}
                    button
                    onClick={() => onTabChange(item.key)}
                    sx={{
                      pl: 5,
                      borderRadius: 2,
                      mb: 0.5,
                      position: 'relative',
                      bgcolor: activeTab === item.key
                        ? alpha('#ff1f3d', 0.12)
                        : 'transparent',
                      border: '1px solid',
                      borderColor: activeTab === item.key
                        ? alpha('#ff1f3d', 0.4)
                        : 'transparent',
                      '&:hover': {
                        bgcolor: alpha('#ff1f3d', 0.08),
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: activeTab === item.key ? 500 : 400,
                            color: activeTab === item.key ? '#ff4d4d' : 'rgba(255,255,255,0.7)',
                          }}
                        >
                          {item.label}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </Box>
        ))}
      </List>
      </Box>
    </Box>
  );
}