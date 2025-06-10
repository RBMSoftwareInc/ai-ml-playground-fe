'use client';

import React, { useState, useEffect } from 'react';
import { 
  Accordion, AccordionSummary, AccordionDetails, 
  List, ListItem, ListItemButton, ListItemText, ListItemIcon, 
  CircularProgress, Box, Typography, 
  Icon
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import DescriptionIcon from '@mui/icons-material/Description';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StoreIcon from '@mui/icons-material/Store';
import HelpIcon from '@mui/icons-material/Help';
import PolicyIcon from '@mui/icons-material/Policy';
import GavelIcon from '@mui/icons-material/Gavel';
import ReceiptIcon from '@mui/icons-material/Receipt';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import CategoryIcon from '@mui/icons-material/Category';
import CampaignIcon from '@mui/icons-material/Campaign';
import BlogIcon from '@mui/icons-material/Article';
import ReviewsIcon from '@mui/icons-material/RateReview';
import SupportIcon from '@mui/icons-material/SupportAgent';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import RecommendIcon from '@mui/icons-material/Recommend';
import StraightenIcon from '@mui/icons-material/Straighten';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { IconBase } from 'react-icons';

// Map page types to icons based on type
const typeIconMap = {
  'Home': <HomeIcon sx={{ color: '#C0C0C0' }} />,
  'PLP': <ListIcon sx={{ color: '#C0C0C0' }} />,
  'PDP': <DescriptionIcon sx={{ color: '#C0C0C0' }} />,
  'Search': <SearchIcon sx={{ color: '#C0C0C0' }} />,
  'Advanced Search': <SearchIcon sx={{ color: '#C0C0C0' }} />,
  'Search Suggestions': <SearchIcon sx={{ color: '#C0C0C0' }} />,
  'Filter Page': <SearchIcon sx={{ color: '#C0C0C0' }} />,
  'Cart': <ShoppingCartIcon sx={{ color: '#C0C0C0' }} />,
  'Checkout': <PaymentIcon sx={{ color: '#C0C0C0' }} />,
  'Gift Card': <CreditCardIcon sx={{ color: '#C0C0C0' }} />,
  'Shipping Address': <LocalShippingIcon sx={{ color: '#C0C0C0' }} />,
  'Payment Address': <AccountBalanceWalletIcon sx={{ color: '#C0C0C0' }} />,
  'Order Review': <AssignmentTurnedInIcon sx={{ color: '#C0C0C0' }} />,
  'Payment Method': <PaymentIcon sx={{ color: '#C0C0C0' }} />,
  'Order Confirmation': <CheckCircleIcon sx={{ color: '#C0C0C0' }} />,
  'Shipping Method': <LocalShippingIcon sx={{ color: '#C0C0C0' }} />,
  'About Us': <InfoIcon sx={{ color: '#C0C0C0' }} />,
  'Contact Us': <ContactMailIcon sx={{ color: '#C0C0C0' }} />,
  'Login': <LoginIcon sx={{ color: '#C0C0C0' }} />,
  'Sign Up': <PersonAddIcon sx={{ color: '#C0C0C0' }} />,
  'Account': <AccountCircleIcon sx={{ color: '#C0C0C0' }} />,
  'Wishlist': <FavoriteIcon sx={{ color: '#C0C0C0' }} />,
  'Compare': <CompareArrowsIcon sx={{ color: '#C0C0C0' }} />,
  'Offers': <LocalOfferIcon sx={{ color: '#C0C0C0' }} />,
  'Store Locator': <StoreIcon sx={{ color: '#C0C0C0' }} />,
  'FAQ': <HelpIcon sx={{ color: '#C0C0C0' }} />,
  'Privacy Policy': <PolicyIcon sx={{ color: '#C0C0C0' }} />,
  'Terms of Service': <GavelIcon sx={{ color: '#C0C0C0' }} />,
  'Order History': <ReceiptIcon sx={{ color: '#C0C0C0' }} />,
  'Order Tracking': <TrackChangesIcon sx={{ color: '#C0C0C0' }} />,
  'Category': <CategoryIcon sx={{ color: '#C0C0C0' }} />,
  'Promotions': <CampaignIcon sx={{ color: '#C0C0C0' }} />,
  'Blog': <BlogIcon sx={{ color: '#C0C0C0' }} />,
  'Blog Post': <BlogIcon sx={{ color: '#C0C0C0' }} />,
  'Lookbook': <BlogIcon sx={{ color: '#C0C0C0' }} />,
  'Reviews': <ReviewsIcon sx={{ color: '#C0C0C0' }} />,
  'Customer Support': <SupportIcon sx={{ color: '#C0C0C0' }} />,
  'Subscription': <SubscriptionsIcon sx={{ color: '#C0C0C0' }} />,
  'Shipping Info': <InfoIcon sx={{ color: '#C0C0C0' }} />,
  'Returns': <InfoIcon sx={{ color: '#C0C0C0' }} />,
  'Error': <InfoIcon sx={{ color: '#C0C0C0' }} />,
  'Maintenance': <InfoIcon sx={{ color: '#C0C0C0' }} />,
  'Profile': <AccountCircleIcon sx={{ color: '#C0C0C0' }} />,
  'Address Book': <AccountCircleIcon sx={{ color: '#C0C0C0' }} />,
  'Chatbot': <SmartToyIcon sx={{ color: '#C0C0C0' }} />,
  'AI Product Recommendations': <RecommendIcon sx={{ color: '#C0C0C0' }} />,
  'AI Size Assistant': <StraightenIcon sx={{ color: '#C0C0C0' }} />,
};

type Props = {
  selected: string;
  onSelect: (pageType: { id: string; type: string; category: string }) => void;
};

export default function PageSelector({ selected, onSelect }: Props) {
  const [pageTypes, setPageTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState<string | false>(false);
page_types
  useEffect(() => {
    const fetchPageTypes = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/v1/cms/layout/page_types');
        setPageTypes(response.data);
        // Expand the first category by default
        const categories = [...new Set(response.data.map(pt => pt.category))];
        setExpanded(categories[0] || false);
      } catch (err) {
        setError('Failed to fetch page types');
      } finally {
        setLoading(false);
      }
    };

    fetchPageTypes();
  }, []);

  // Group page types by category
  const groupedPageTypes = pageTypes.reduce((acc, pageType) => {
    const category = pageType.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(pageType);
    return acc;
  }, {});

  // Sort categories for consistent ordering
  const categories = Object.keys(groupedPageTypes).sort();

  const handleAccordionChange = (category: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? category : false);
  };

  // Add logging to debug onSelect
  const handleSelect = (pageType) => {
    console.log('Selected pageType:', pageType);
    onSelect(pageType);
  };

  if (loading) return <CircularProgress size={24} sx={{ m: 2 }} />;
  if (error) return <Box sx={{ color: 'red', p: 2 }}>{error}</Box>;

  return (
    <Box>
      {categories.map(category => (
        <Accordion
          key={category}
          expanded={expanded === category}
          onChange={handleAccordionChange(category)}
          sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ bgcolor: '#f5f5f5', color: '#616161' }}
          >
            <Typography variant="subtitle1">{category}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List dense>
              {groupedPageTypes[category].map(pageType => (
                <ListItem key={pageType.id} disablePadding>
                  <ListItemButton
                    selected={selected === pageType.type}
                    onClick={() => handleSelect(pageType)}  // Updated to use handleSelect
                    sx={{
                      pl: 4,
                      '&.Mui-selected': {
                        backgroundColor: '#E0E0E0',
                        '&:hover': {
                          backgroundColor: '#D3D3D3',
                        },
                      },
                    }}
                  >
                    <ListItemIcon>
                      {typeIconMap[pageType.type] || <HomeIcon sx={{ color: '#C0C0C0' }} />}
                    </ListItemIcon>
                    <ListItemText primary={pageType.type} primaryTypographyProps={{ color: '#616161' }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}