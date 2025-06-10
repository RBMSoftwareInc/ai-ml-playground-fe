"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FolderIcon from '@mui/icons-material/Folder';
import WebIcon from '@mui/icons-material/Web';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import LockIcon from '@mui/icons-material/Lock';
import DescriptionIcon from '@mui/icons-material/Description';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import ExploreIcon from '@mui/icons-material/Explore';
import BuildIcon from '@mui/icons-material/Build';
import CodeIcon from '@mui/icons-material/Code';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import CampaignIcon from '@mui/icons-material/Campaign';
import SegmentIcon from '@mui/icons-material/Segment';
import TargetIcon from '@mui/icons-material/Adjust';
import TimelineIcon from '@mui/icons-material/Timeline';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PaletteIcon from '@mui/icons-material/Palette';
import WidgetsIcon from '@mui/icons-material/Widgets';
import { grey } from '@mui/material/colors';

import Header from './Header';
import Footer from './Footer';
import AssetBrowserNG from "./AssetBrowser-ng";
import ProjectEditor from "./ProjectEditor";
import DeploymentManager from "./DeploymentManager";
import SmartFlipAssetBrowser from "./SmartFlipAssetBrowser";

const drawerWidth = 240;
const headerHeight = 80;
const footerHeight = 40;

const menuItems = [
  {
    module: 'ContentIQ',
    icon: <ContentCopyIcon />,
    items: [
      { text: 'Content', icon: <DescriptionIcon /> },
      { text: 'Feeds In', icon: <RssFeedIcon /> },
      { text: 'Feeds Out', icon: <RssFeedIcon /> },
      { text: 'Asset Explorer', icon: <ExploreIcon />, url: '/contentiq/asset-browser' },
    ],
  },
  {
    module: 'Project Center',
    icon: <FolderIcon />,
    items: [
      { text: 'Projects', icon: <FolderIcon /> },
      { text: 'Deployments', icon: <BuildIcon /> },
      { text: 'Version Control', icon: <CodeIcon /> },
    ],
  },
  {
    module: 'ExperienceIQ',
    icon: <WebIcon />,
    items: [
      { text: 'Facet Navigator', icon: <ExploreIcon /> },
      { text: 'Page Architect', icon: <DesignServicesIcon /> },
      { text: 'Smart Variants', icon: <ViewCarouselIcon /> },
      { text: 'Campaign Flow Designer', icon: <CampaignIcon /> },
    ],
  },
  {
    module: 'EngageIQ',
    icon: <PeopleIcon />,
    items: [
      { text: 'Segmentation', icon: <SegmentIcon /> },
      { text: 'Targeting', icon: <TargetIcon /> },
      { text: 'Scenarios', icon: <TimelineIcon /> },
      { text: 'Analytics', icon: <AnalyticsIcon /> },
    ],
  },
  {
    module: 'Ops Control',
    icon: <SettingsIcon />,
    items: [
      { text: 'Audit', icon: <DescriptionIcon /> },
      { text: 'Settings', icon: <SettingsIcon /> },
      { text: 'Configurations', icon: <BuildIcon /> },
    ],
  },
  {
    module: 'Access Center',
    icon: <LockIcon />,
    items: [
      { text: 'Internal Users', icon: <PeopleIcon /> },
      { text: 'External Users', icon: <PeopleIcon /> },
      { text: 'Roles', icon: <LockIcon /> },
    ],
  },
  {
    module: 'Store-Front Configurator',
    icon: <StorefrontIcon />,
    items: [
      { text: 'Configurator', icon: <StorefrontIcon /> , url: '/dashboard/cms/store-frontiq'}
    ],
  },
];

export default function CMSStudioLayout() {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleMenuClick = (text: string, url?: string) => {
    if (url) {
      router.push(url);
    } else {
      const slug = text.toLowerCase().replace(/\s+/g, '-');
      router.push(`/dashboard/cms/${slug}`);
    }
  };

  const handleAccordionChange = (module: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? module : false);
  };

  const handleLogout = () => {
    // Implement logout logic here, e.g., clear auth tokens and redirect
    router.push('/dashboard/cms/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <Header onLogout={handleLogout} />

      {/* Main Layout */}
      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          minHeight: `calc(100vh - ${headerHeight + footerHeight}px)`,
          overflow: 'hidden',
        }}
      >
        {/* Left Panel */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth + 32,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              top: headerHeight + 16,
              height: `calc(100% - ${headerHeight + 16 + footerHeight}px)`,
              width: drawerWidth,
              ml: 2,
              mr: 2,
              boxSizing: 'border-box',
              backgroundColor: '#f3f3f3',
              padding: 1,
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <Box sx={{ overflowY: 'auto', height: '100%' }}>
            {menuItems.map((section) => (
              <Accordion
                key={section.module}
                expanded={expanded === section.module}
                onChange={handleAccordionChange(section.module)}
                disableGutters
                elevation={0}
                sx={{
                  backgroundColor: 'transparent',
                  borderBottom: '1px solid #d1d5db',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: grey[100],
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ArrowDropDownIcon sx={{ color: grey[700], fontSize: '1.25rem' }} />}
                  sx={{
                    minHeight: 36,
                    '& .MuiAccordionSummary-content': {
                      margin: '4px 0',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: grey[800] }}>
                    {section.icon}
                  </ListItemIcon>
                  <Typography variant="subtitle2" fontWeight="bold" color={grey[800]}>
                    {section.module}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: 0 }}>
                  <List dense disablePadding>
                    {section.items.map((item) => (
                      <ListItem
                        button
                        key={item.text}
                        onClick={() => handleMenuClick(item.text, item.url)}
                        sx={{
                          pl: 6,
                          py: 0.25,
                          color: grey[700],
                          '&:hover': {
                            backgroundColor: grey[200],
                            color: grey[900],
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 28, color: grey[700] }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Drawer>

        {/* Right Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: '#ffffff',
            p: 3,
            overflowY: 'auto',
            minHeight: '400px',
          }}
        >
          <Box mt={4}>
            <Typography variant="h4" gutterBottom color={grey[800]}>
              Welcome to .comIQ Studio
            </Typography>
            <Typography variant="body1" color={grey[700]} paragraph>
              .comIQ Studio is a modern content orchestration and release engine tailored for dynamic eCommerce needs. It helps you manage, deploy, and optimize digital content across platforms with ease.
            </Typography>
            <Typography variant="body1" color={grey[700]} paragraph>
              With integrated modules like ExperienceIQ, EngageIQ, and Store-Front Configurator, you can design personalized user journeys, trigger campaigns, and publish storefront experiences powered by AI.
            </Typography>
            <Typography variant="h6" sx={{ mt: 5, mb: 2 }} color={grey[800]}>
              Recent Activities
            </Typography>
            <Typography variant="body2" color={grey[500]}>
              No recent activities to show.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}