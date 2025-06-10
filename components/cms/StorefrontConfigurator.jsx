'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Grid,
  Card,
  CardMedia,
  CardContent,
  TextareaAutosize,
  Alert,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Modal,
  Paper,
  Snackbar,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import Header from './Header';
import Footer from './Footer';
import Link from 'next/link';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css'; // Choose a theme for JSON beautification

const drawerWidth = 240;
const headerHeight = 80;
const footerHeight = 40;

// Fallback dummy data for catalogs
const dummyCatalogs = [
  { id: 1, name: "Electronics", description: "Gadgets and devices", image: "https://via.placeholder.com/150" },
  { id: 2, name: "Clothing", description: "Fashion and apparel", image: "https://via.placeholder.com/150" },
  { id: 3, name: "Home Decor", description: "Furniture and decor", image: "https://via.placeholder.com/150" },
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function StorefrontConfigurator() {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  const [catalogs, setCatalogs] = useState([]);
  const [selectedCatalogs, setSelectedCatalogs] = useState([]);
  const [theme, setTheme] = useState({
    storeName: '',
    faviconUrl: '',
    logoUrl: '',
    bannerImage: '',
    primaryColor: '#1D4ED8',
    secondaryColor: '#10B981',
    font: 'Roboto',
    backgroundImage: '',
    customCss: '',
  });
  const [layoutConfig, setLayoutConfig] = useState({
    selectedLayout: 'modern-minimalist',
    enableSidebar: true,
    mainContentColumns: 2,
    headerWidgets: [],
    sidebarWidgets: [],
    mainContentWidgets: [],
    footerWidgets: [],
  });
  const [cartConfig, setCartConfig] = useState({
    showImages: true,
    allowQuantityEdit: true,
    upsells: true,
    singleClickOrder: false,
    fastCheckout: false,
    aiAssistedPurchasing: false,
  });
  const [checkoutConfig, setCheckoutConfig] = useState({
    shippingMethods: [],
    shippingCosts: {},
    shippingAddress: { name: '', street: '', city: '', state: '', zip: '', country: '' },
    shippingApis: [{ key: '', value: '' }],
    billingAddress: { name: '', street: '', city: '', state: '', zip: '', country: '' },
    sameAsShipping: false,
    paymentMethods: [],
    paymentApis: [{ key: '', value: '' }],
    paymentReversalMethods: [],
    paymentReversalApis: [{ key: '', value: '' }],
    orderReviewLayout: 'compact',
    buttonColor: '#1D4ED8',
    allowReturns: false,
    returnWindow: 30,
    returnConditions: '',
    returnShippingResponsibility: 'store',
    restockingFee: 0,
    returnMethod: 'mail',
    guestCheckout: true,
    sendOrderConfirmationEmail: true,
    enableCheckout2FA: false,
    showEstimatedDelivery: false,
  });
  const [seoConfig, setSeoConfig] = useState({
    metaTitle: '',
    metaDescription: '',
    schema: '',
    googleSearchConsoleVerification: '',
    googleAnalyticsTrackingId: '',
    googleTagManagerId: '',
    googleSiteVerification: '',
    seoApis: [{ key: '', value: '' }],
    enableStoreLocator: false,
    googleMapsApiKey: '',
    storeLatitude: '',
    storeLongitude: '',
    enableABTesting: false,
    abTestingTool: 'google-optimize',
    abTestingApiKey: '',
    enableSitemap: false,
    sitemapUrl: '',
    sitemapUpdateFrequency: 'daily',
    sitemapPriorityHomepage: 1.0,
    sitemapPriorityProductPages: 0.8,
    enableAnalytics: false,
    analyticsTool: 'google-analytics',
    analyticsApiKey: '',
  });
  const [catalogConfig, setCatalogConfig] = useState({
    categoryListingStyle: 'grid',
    enableRankings: false,
    enableRatings: false,
    sortByRanking: false,
    pdpLayout: 'compact',
    productGrouping: 'category',
    itemsPerPage: 10,
    paginationStyle: 'numeric',
    searchEngine: 'default',
    aiSuggestions: false,
    aiRecommendations: false,
  });
  const [profileConfig, setProfileConfig] = useState({
    enableAccounts: true,
    allowSavedConfigs: true,
    enable2FA: false,
    passwordMinLength: 8,
    emailNotifications: true,
    smsAlerts: false,
    marketingEmails: false,
    promotionalOffers: false,
    wishlistEnabled: true,
    wishlistPublic: false,
    shareWishlist: false,
    collectPersonalData: false,
    shareSocialMedia: false,
    saveAddresses: false,
    savePaymentInfo: false,
    linkFamilyProfiles: false,
    parentGuidedCheckouts: false,
  });
  const [miscConfig, setMiscConfig] = useState({
    aboutUsDescription: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    supportHours: '',
    socialMediaLinks: [{ platform: '', url: '' }],
    privacyPolicy: '',
    termsOfService: '',
    faqs: [{ question: '', answer: '' }],
  });
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState({ catalogs: false, save: false });
  const [error, setError] = useState({ catalogs: null, save: null });
  const [openModal, setOpenModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchCatalogs = async () => {
      setLoading(prev => ({ ...prev, catalogs: true }));
      setError(prev => ({ ...prev, catalogs: null }));
      try {
        const response = await fetch('http://localhost:5000/api/v1/cms/catalogs');
        if (!response.ok) throw new Error('Failed to fetch catalogs');
        const data = await response.json();
        setCatalogs(data.length ? data : dummyCatalogs);
      } catch (err) {
        console.error('Error fetching catalogs:', err);
        setError(prev => ({ ...prev, catalogs: err.message }));
        setCatalogs(dummyCatalogs);
      } finally {
        setLoading(prev => ({ ...prev, catalogs: false }));
      }
    };

    fetchCatalogs();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCatalogToggle = (catalogId) => {
    setSelectedCatalogs(prev =>
      prev.includes(catalogId) ? prev.filter(id => id !== catalogId) : [...prev, catalogId]
    );
  };

  const handleThemeChange = (key, value) => {
    const updatedTheme = { ...theme, [key]: value };
    setTheme(updatedTheme);
    fetch('http://localhost:5000/api/v1/cms/storefront/config/theme', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: updatedTheme }),
    })
      .then(response => response.json())
      .then(data => setPrice(data.previewPrice || 0))
      .catch(error => console.error('Error updating theme:', error));
  };

  const handleLayoutConfigChange = (key, value) => {
    setLayoutConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleWidgetChange = (section, value) => {
    setLayoutConfig(prev => ({ ...prev, [section]: value }));
  };

  const handleCartConfigChange = (key, value) => {
    setCartConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckoutConfigChange = (key, value) => {
    setCheckoutConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleShippingAddressChange = (field, value) => {
    setCheckoutConfig(prev => ({
      ...prev,
      shippingAddress: { ...prev.shippingAddress, [field]: value },
    }));
  };

  const handleBillingAddressChange = (field, value) => {
    setCheckoutConfig(prev => ({
      ...prev,
      billingAddress: { ...prev.billingAddress, [field]: value },
    }));
  };

  const handleShippingApiChange = (index, field, value) => {
    setCheckoutConfig(prev => {
      const updatedApis = [...prev.shippingApis];
      updatedApis[index] = { ...updatedApis[index], [field]: value };
      return { ...prev, shippingApis: updatedApis };
    });
  };

  const addShippingApi = () => {
    setCheckoutConfig(prev => ({
      ...prev,
      shippingApis: [...prev.shippingApis, { key: '', value: '' }],
    }));
  };

  const removeShippingApi = (index) => {
    setCheckoutConfig(prev => ({
      ...prev,
      shippingApis: prev.shippingApis.filter((_, i) => i !== index),
    }));
  };

  const handlePaymentApiChange = (index, field, value) => {
    setCheckoutConfig(prev => {
      const updatedApis = [...prev.paymentApis];
      updatedApis[index] = { ...updatedApis[index], [field]: value };
      return { ...prev, paymentApis: updatedApis };
    });
  };

  const addPaymentApi = () => {
    setCheckoutConfig(prev => ({
      ...prev,
      paymentApis: [...prev.paymentApis, { key: '', value: '' }],
    }));
  };

  const removePaymentApi = (index) => {
    setCheckoutConfig(prev => ({
      ...prev,
      paymentApis: prev.paymentApis.filter((_, i) => i !== index),
    }));
  };

  const handlePaymentReversalApiChange = (index, field, value) => {
    setCheckoutConfig(prev => {
      const updatedApis = [...prev.paymentReversalApis];
      updatedApis[index] = { ...updatedApis[index], [field]: value };
      return { ...prev, paymentReversalApis: updatedApis };
    });
  };

  const addPaymentReversalApi = () => {
    setCheckoutConfig(prev => ({
      ...prev,
      paymentReversalApis: [...prev.paymentReversalApis, { key: '', value: '' }],
    }));
  };

  const removePaymentReversalApi = (index) => {
    setCheckoutConfig(prev => ({
      ...prev,
      paymentReversalApis: prev.paymentReversalApis.filter((_, i) => i !== index),
    }));
  };

  const handleSeoConfigChange = (key, value) => {
    setSeoConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSeoApiChange = (index, field, value) => {
    setSeoConfig(prev => {
      const updatedApis = [...prev.seoApis];
      updatedApis[index] = { ...updatedApis[index], [field]: value };
      return { ...prev, seoApis: updatedApis };
    });
  };

  const addSeoApi = () => {
    setSeoConfig(prev => ({
      ...prev,
      seoApis: [...prev.seoApis, { key: '', value: '' }],
    }));
  };

  const removeSeoApi = (index) => {
    setSeoConfig(prev => ({
      ...prev,
      seoApis: prev.seoApis.filter((_, i) => i !== index),
    }));
  };

  const handleCatalogConfigChange = (key, value) => {
    setCatalogConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleProfileConfigChange = (key, value) => {
    setProfileConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleMiscConfigChange = (key, value) => {
    setMiscConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSocialMediaLinkChange = (index, field, value) => {
    setMiscConfig(prev => {
      const updatedLinks = [...prev.socialMediaLinks];
      updatedLinks[index] = { ...updatedLinks[index], [field]: value };
      return { ...prev, socialMediaLinks: updatedLinks };
    });
  };

  const addSocialMediaLink = () => {
    setMiscConfig(prev => ({
      ...prev,
      socialMediaLinks: [...prev.socialMediaLinks, { platform: '', url: '' }],
    }));
  };

  const removeSocialMediaLink = (index) => {
    setMiscConfig(prev => ({
      ...prev,
      socialMediaLinks: prev.socialMediaLinks.filter((_, i) => i !== index),
    }));
  };

  const handleFaqChange = (index, field, value) => {
    setMiscConfig(prev => {
      const updatedFaqs = [...prev.faqs];
      updatedFaqs[index] = { ...updatedFaqs[index], [field]: value };
      return { ...prev, faqs: updatedFaqs };
    });
  };

  const addFaq = () => {
    setMiscConfig(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }],
    }));
  };

  const removeFaq = (index) => {
    setMiscConfig(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  const consolidateConfig = () => {
    return {
      catalogs: selectedCatalogs,
      theme,
      layoutConfig,
      cartConfig,
      checkoutConfig,
      seoConfig,
      catalogConfig,
      profileConfig,
      miscConfig,
    };
  };

  const handleReviewAndSave = () => {
    setOpenModal(true);
  };

  const handleSaveConfig = async () => {
    setLoading(prev => ({ ...prev, save: true }));
    setError(prev => ({ ...prev, save: null }));
    const config = consolidateConfig();
    try {
      const response = await fetch('http://localhost:5000/api/v1/cms/storefront/config/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      if (!response.ok) throw new Error('Failed to save configuration');
      setSnackbar({ open: true, message: 'Configuration saved successfully!', severity: 'success' });
      setOpenModal(false);
    } catch (error) {
      setError(prev => ({ ...prev, save: error.message }));
      setSnackbar({ open: true, message: 'Error saving configuration: ' + error.message, severity: 'error' });
    } finally {
      setLoading(prev => ({ ...prev, save: false }));
    }
  };

  const calculateProgress = () => {
    const configs = [
      theme,
      layoutConfig,
      cartConfig,
      checkoutConfig,
      seoConfig,
      catalogConfig,
      profileConfig,
      miscConfig,
    ];

    let totalFields = 0;
    let filledFields = 0;

    const countFields = (obj) => {
      Object.entries(obj).forEach(([key, value]) => {
        if (key === 'shippingAddress' || key === 'billingAddress') {
          totalFields += Object.keys(value).length;
          filledFields += Object.values(value).filter(v => v !== '').length;
        } else if (Array.isArray(value)) {
          if (value.length > 0 && typeof value[0] === 'object') {
            totalFields += value.length * Object.keys(value[0]).length;
            value.forEach(item => {
              filledFields += Object.values(item).filter(v => v !== '').length;
            });
          } else {
            totalFields += 1;
            if (value.length > 0) filledFields += 1;
          }
        } else if (typeof value === 'object' && value !== null) {
          countFields(value);
        } else {
          totalFields += 1;
          if (typeof value === 'string' && value !== '') filledFields += 1;
          if (typeof value === 'boolean' && value === true) filledFields += 1;
          if (typeof value === 'number' && value !== 0) filledFields += 1;
        }
      });
    };

    configs.forEach(config => countFields(config));
    return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
  };

  const progress = calculateProgress();

  const availableWidgets = [
    'trending-products',
    'ai-chat-widget',
    'recently-viewed',
    'product-recommendations',
    'promotional-banner',
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onLogout={() => router.push('/dashboard/cms/login')} />
      <Box sx={{ display: 'flex', flexGrow: 1, minHeight: `calc(100vh - ${headerHeight + footerHeight}px)`, overflow: 'hidden' }}>
        {/* Left Drawer */}
        <Box sx={{
          width: drawerWidth,
          bgcolor: '#f3f3f3',
          p: 3,
          borderRight: '1px solid #d1d5db',
          boxShadow: '2px 0 5px rgba(0,0,0,0.05)',
        }}>
          <Typography
            variant="h6"
            sx={{
              mb: 3,
              fontWeight: 'bold',
              color: grey[900],
              letterSpacing: '0.5px',
            }}
          >
            Store-Front Configurator
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              mb: 2,
              color: grey[700],
              fontWeight: 'medium',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Current Store Type
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: 'primary.main',
              fontWeight: 'bold',
            }}
          >
            Business to Consumer
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              mb: 2,
              color: grey[700],
              fontWeight: 'medium',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Available Store Types
          </Typography>
          <List dense sx={{ mb: 3 }}>
            {[
              'Business to Consumer',
              'Business to Business',
              'Direct to Consumer',
              'Consumer to Consumer',
              'Business to Government',
              'Consumer to Business',
            ].map(type => (
              <ListItem
                key={type}
                sx={{
                  py: 1,
                  borderRadius: '4px',
                  transition: 'background-color 0.2s',
                  '&:hover': { bgcolor: grey[200] },
                }}
              >
                <ListItemText
                  primary={type}
                  primaryTypographyProps={{
                    color: type === 'Business to Consumer' ? 'primary.main' : grey[700],
                    fontWeight: type === 'Business to Consumer' ? 'bold' : 'medium',
                  }}
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 3, borderColor: grey[300] }} />
          <Typography
            variant="subtitle2"
            sx={{
              mb: 2,
              color: grey[700],
              fontWeight: 'medium',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Explore Features
          </Typography>
          <List dense>
            <ListItem
              sx={{
                py: 1,
                borderRadius: '4px',
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: grey[200] },
              }}
            >
              <ListItemText
                primary="Explore AR/VR"
                primaryTypographyProps={{
                  color: grey[800],
                  fontWeight: 'medium',
                  '&:hover': { color: 'primary.main' },
                }}
              />
            </ListItem>
            <ListItem
              sx={{
                py: 1,
                borderRadius: '4px',
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: grey[200] },
              }}
            >
              <Link href="/dashboard/cms/store-frontiq/shopforge-builder" passHref legacyBehavior>
                <ListItemText
                  primary="ShopForge Builder"
                  primaryTypographyProps={{
                    color: grey[800],
                    fontWeight: 'medium',
                    '&:hover': { color: 'primary.main' },
                    component: 'a',
                  }}
                />
              </Link>
            </ListItem>

            <ListItem
              sx={{
                py: 1,
                borderRadius: '4px',
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: grey[200] },
              }}
            >
              <Link href="/dashboard/cms/store-frontiq/layout-studio" passHref legacyBehavior>
                <ListItemText
                  primary="Discover AI Layout Studio"
                  primaryTypographyProps={{
                    color: grey[800],
                    fontWeight: 'medium',
                    '&:hover': { color: 'primary.main' },
                    component: 'a',
                  }}
                />
              </Link>
            </ListItem>
          </List>
        </Box>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#ffffff' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" sx={{ color: grey[800], fontWeight: 'bold' }}>
              Storefront Configurator
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress variant="determinate" value={progress} size={40} thickness={4} />
              <Typography variant="body2" sx={{ color: grey[700] }}>
                {progress}% Complete
              </Typography>
              <Button variant="contained" onClick={handleReviewAndSave} startIcon={<SaveIcon />}>
                Review & Save
              </Button>
            </Box>
          </Box>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="storefront tabs"
            sx={{
              mb: 2,
              bgcolor: '#f5f5f5',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 'medium',
                color: grey[600],
                '&:hover': { bgcolor: grey[100] },
              },
              '& .MuiTab-root.Mui-selected': {
                color: 'primary.main',
                fontWeight: 'bold',
                bgcolor: 'white',
                borderBottom: 'none',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'primary.main',
                height: '3px',
              },
            }}
          >
            <Tab label="Styling & Branding" />
            <Tab label="Layout & Widgets" />
            <Tab label="Catalog & Browse" disabled={!selectedCatalogs.length} />
            <Tab label="User Profiles" disabled={!selectedCatalogs.length} />
            <Tab label="Cart & Checkout" disabled={!selectedCatalogs.length} />
            <Tab label="SEO & Analytics" disabled={!selectedCatalogs.length} />
            <Tab label="Miscellaneous" disabled={!selectedCatalogs.length} />
          </Tabs>

          {/* Tab 0: Styling & Branding */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h5" gutterBottom sx={{ color: grey[800], fontWeight: 'bold', mb: 3 }}>
              Styling & Branding
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Store/Brand Name"
                  value={theme.storeName}
                  onChange={(e) => handleThemeChange('storeName', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Favicon URL"
                  value={theme.faviconUrl}
                  onChange={(e) => handleThemeChange('faviconUrl', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Logo URL"
                  value={theme.logoUrl}
                  onChange={(e) => handleThemeChange('logoUrl', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Banner Image URL"
                  value={theme.bannerImage}
                  onChange={(e) => handleThemeChange('bannerImage', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Primary Color"
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Secondary Color"
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Font Family</InputLabel>
                  <Select value={theme.font} onChange={(e) => handleThemeChange('font', e.target.value)} label="Font Family">
                    <MenuItem value="Roboto">Roboto</MenuItem>
                    <MenuItem value="Open Sans">Open Sans</MenuItem>
                    <MenuItem value="Lato">Lato</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Background Image URL"
                  value={theme.backgroundImage || ''}
                  onChange={(e) => handleThemeChange('backgroundImage', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextareaAutosize
                  minRows={4}
                  placeholder="Custom CSS"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
                  value={theme.customCss}
                  onChange={(e) => handleThemeChange('customCss', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1">Preview Price: ${price}</Typography>
              </Grid>
            </Grid>
            <Button variant="contained" sx={{ mt: 3 }} onClick={() => setTabValue(1)}>
              Next: Layout & Widgets
            </Button>
          </TabPanel>

          {/* Tab 1: Layout & Widgets */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h5" gutterBottom sx={{ color: grey[800], fontWeight: 'bold', mb: 3 }}>
              Layout & Widgets
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              Select AI-Suggested Layout
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Store Layout</InputLabel>
              <Select
                value={layoutConfig.selectedLayout}
                onChange={(e) => handleLayoutConfigChange('selectedLayout', e.target.value)}
                label="Store Layout"
              >
                <MenuItem value="modern-minimalist">Modern Minimalist</MenuItem>
                <MenuItem value="ecommerce-classic">E-Commerce Classic</MenuItem>
                <MenuItem value="bold-visuals">Bold Visuals</MenuItem>
              </Select>
            </FormControl>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              Widget Placement
            </Typography>
            <Typography variant="subtitle1" sx={{ color: grey[700], mb: 1 }}>
              Header Widgets
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Widgets for Header</InputLabel>
              <Select
                multiple
                value={layoutConfig.headerWidgets}
                onChange={(e) => handleWidgetChange('headerWidgets', e.target.value)}
                label="Select Widgets for Header"
              >
                {availableWidgets.map(widget => (
                  <MenuItem key={widget} value={widget}>
                    {widget.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="subtitle1" sx={{ color: grey[700], mb: 1 }}>
              Sidebar Widgets
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={layoutConfig.enableSidebar}
                  onChange={(e) => handleLayoutConfigChange('enableSidebar', e.target.checked)}
                />
              }
              label="Enable Sidebar"
              sx={{ mb: 1 }}
            />
            {layoutConfig.enableSidebar && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Widgets for Sidebar</InputLabel>
                <Select
                  multiple
                  value={layoutConfig.sidebarWidgets}
                  onChange={(e) => handleWidgetChange('sidebarWidgets', e.target.value)}
                  label="Select Widgets for Sidebar"
                >
                  {availableWidgets.map(widget => (
                    <MenuItem key={widget} value={widget}>
                      {widget.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <Typography variant="subtitle1" sx={{ color: grey[700], mb: 1 }}>
              Main Content Widgets
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Widgets for Main Content</InputLabel>
              <Select
                multiple
                value={layoutConfig.mainContentWidgets}
                onChange={(e) => handleWidgetChange('mainContentWidgets', e.target.value)}
                label="Select Widgets for Main Content"
              >
                {availableWidgets.map(widget => (
                  <MenuItem key={widget} value={widget}>
                    {widget.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Number of Columns in Main Content"
              type="number"
              value={layoutConfig.mainContentColumns}
              onChange={(e) => handleLayoutConfigChange('mainContentColumns', Math.max(1, Math.min(3, e.target.value)))}
              sx={{ mb: 2 }}
              inputProps={{ min: 1, max: 3 }}
            />
            <Typography variant="subtitle1" sx={{ color: grey[700], mb: 1 }}>
              Footer Widgets
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Widgets for Footer</InputLabel>
              <Select
                multiple
                value={layoutConfig.footerWidgets}
                onChange={(e) => handleWidgetChange('footerWidgets', e.target.value)}
                label="Select Widgets for Footer"
              >
                {availableWidgets.map(widget => (
                  <MenuItem key={widget} value={widget}>
                    {widget.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" sx={{ mt: 3 }} onClick={() => setTabValue(2)}>
              Next: Catalog & Browse
            </Button>
          </TabPanel>

          {/* Tab 2: Catalog & Browse */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h5" gutterBottom sx={{ color: grey[800], fontWeight: 'bold', mb: 3 }}>
              Catalog & Browse
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              Catalog Selection
            </Typography>
            {loading.catalogs && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress />
              </Box>
            )}
            {error.catalogs && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error.catalogs}. Using fallback data.
              </Alert>
            )}
            <Grid container spacing={2}>
              {catalogs.map(catalog => (
                <Grid item xs={12} sm={6} md={3} key={catalog.id}>
                  <Card sx={{ cursor: 'pointer', '&:hover': { bgcolor: grey[100] } }}>
                    <CardMedia component="img" height="100" image={catalog.image} alt={catalog.name} />
                    <CardContent>
                      <FormControlLabel
                        control={<Checkbox checked={selectedCatalogs.includes(catalog.id)} onChange={() => handleCatalogToggle(catalog.id)} />}
                        label={catalog.name}
                      />
                      <Typography variant="body2" color={grey[600]}>{catalog.description}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              Category Listing
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category Listing Style</InputLabel>
              <Select
                value={catalogConfig.categoryListingStyle}
                onChange={(e) => handleCatalogConfigChange('categoryListingStyle', e.target.value)}
                label="Category Listing Style"
              >
                <MenuItem value="grid">Grid</MenuItem>
                <MenuItem value="tree">Tree-Style</MenuItem>
                <MenuItem value="guided">Guided Navigation</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={catalogConfig.enableRankings}
                  onChange={(e) => handleCatalogConfigChange('enableRankings', e.target.checked)}
                />
              }
              label="Enable Product Rankings"
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={catalogConfig.enableRatings}
                  onChange={(e) => handleCatalogConfigChange('enableRatings', e.target.checked)}
                />
              }
              label="Enable Product Ratings"
              sx={{ mb: 1 }}
            />
            {catalogConfig.enableRankings && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={catalogConfig.sortByRanking}
                    onChange={(e) => handleCatalogConfigChange('sortByRanking', e.target.checked)}
                  />
                }
                label="Sort Categories by Ranking"
                sx={{ mb: 1, ml: 4 }}
              />
            )}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              Product Display Page (PDP) Layout
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>PDP Layout Style</InputLabel>
              <Select
                value={catalogConfig.pdpLayout}
                onChange={(e) => handleCatalogConfigChange('pdpLayout', e.target.value)}
                label="PDP Layout Style"
              >
                <MenuItem value="compact">Compact</MenuItem>
                <MenuItem value="detailed">Detailed</MenuItem>
                <MenuItem value="full-width">Full-Width</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Product Grouping Style</InputLabel>
              <Select
                value={catalogConfig.productGrouping}
                onChange={(e) => handleCatalogConfigChange('productGrouping', e.target.value)}
                label="Product Grouping Style"
              >
                <MenuItem value="category">Group by Category</MenuItem>
                <MenuItem value="brand">Group by Brand</MenuItem>
                <MenuItem value="none">No Grouping</MenuItem>
              </Select>
            </FormControl>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              Catalog Browsing & Pagination
            </Typography>
            <TextField
              fullWidth
              label="Items Per Page"
              type="number"
              value={catalogConfig.itemsPerPage}
              onChange={(e) => handleCatalogConfigChange('itemsPerPage', e.target.value)}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Pagination Style</InputLabel>
              <Select
                value={catalogConfig.paginationStyle}
                onChange={(e) => handleCatalogConfigChange('paginationStyle', e.target.value)}
                label="Pagination Style"
              >
                <MenuItem value="numeric">Numeric Pagination</MenuItem>
                <MenuItem value="infinite">Infinite Scroll</MenuItem>
              </Select>
            </FormControl>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              Search Preferences
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Search Engine</InputLabel>
              <Select
                value={catalogConfig.searchEngine}
                onChange={(e) => handleCatalogConfigChange('searchEngine', e.target.value)}
                label="Search Engine"
              >
                <MenuItem value="default">Default</MenuItem>
                <MenuItem value="elasticsearch">Elasticsearch</MenuItem>
                <MenuItem value="algolia">Algolia</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={catalogConfig.aiSuggestions}
                  onChange={(e) => handleCatalogConfigChange('aiSuggestions', e.target.checked)}
                />
              }
              label="Enable AI-Based Search Suggestions"
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={catalogConfig.aiRecommendations}
                  onChange={(e) => handleCatalogConfigChange('aiRecommendations', e.target.checked)}
                />
              }
              label="Enable AI-Based Product Recommendations"
              sx={{ mb: 1 }}
            />
            <Button variant="contained" sx={{ mt: 3 }} onClick={() => setTabValue(3)} disabled={!selectedCatalogs.length}>
              Next: User Profiles
            </Button>
          </TabPanel>

          {/* Tab 3: User Profiles */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h5" gutterBottom sx={{ color: grey[800], fontWeight: 'bold', mb: 3 }}>
              User Profiles
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              General Settings
            </Typography>
            <FormControlLabel
              control={<Checkbox checked={profileConfig.enableAccounts} onChange={(e) => handleProfileConfigChange('enableAccounts', e.target.checked)} />}
              label="Enable User Accounts"
            />
            <FormControlLabel
              control={<Checkbox checked={profileConfig.allowSavedConfigs} onChange={(e) => handleProfileConfigChange('allowSavedConfigs', e.target.checked)} />}
              label="Allow Saved Configurations"
            />
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              Security Options
            </Typography>
            <FormControlLabel
              control={<Checkbox checked={profileConfig.enable2FA} onChange={(e) => handleProfileConfigChange('enable2FA', e.target.checked)} />}
              label="Enable Two-Factor Authentication (2FA)"
            />
            <TextField
              fullWidth
              label="Minimum Password Length"
              type="number"
              value={profileConfig.passwordMinLength}
              onChange={(e) => handleProfileConfigChange('passwordMinLength', e.target.value)}
              sx={{ mb: 2, mt: 2 }}
            />
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              Notification Settings
            </Typography>
            <FormControlLabel
              control={<Checkbox checked={profileConfig.emailNotifications} onChange={(e) => handleProfileConfigChange('emailNotifications', e.target.checked)} />}
              label="Enable Email Notifications"
            />
            <FormControlLabel
              control={<Checkbox checked={profileConfig.smsAlerts} onChange={(e) => handleProfileConfigChange('smsAlerts', e.target.checked)} />}
              label="Enable SMS Alerts"
            />
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              Marketing Preferences
            </Typography>
            <FormControlLabel
              control={<Checkbox checked={profileConfig.marketingEmails} onChange={(e) => handleProfileConfigChange('marketingEmails', e.target.checked)} />}
              label="Subscribe to Marketing Emails"
            />
            <FormControlLabel
              control={<Checkbox checked={profileConfig.promotionalOffers} onChange={(e) => handleProfileConfigChange('promotionalOffers', e.target.checked)} />}
              label="Receive Promotional Offers"
            />
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              Social Media Preferences
            </Typography>
            <FormControlLabel
              control={<Checkbox checked={profileConfig.shareSocialMedia} onChange={(e) => handleProfileConfigChange('shareSocialMedia', e.target.checked)} />}
              label="Enable Sharing Your Social Media Handles"
            />
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              Wishlist Settings
            </Typography>
            <FormControlLabel
              control={<Checkbox checked={profileConfig.wishlistEnabled} onChange={(e) => handleProfileConfigChange('wishlistEnabled', e.target.checked)} />}
              label="Enable Wishlist"
            />
            <FormControlLabel
              control={<Checkbox checked={profileConfig.wishlistPublic} onChange={(e) => handleProfileConfigChange('wishlistPublic', e.target.checked)} />}
              label="Make Wishlist Public"
            />
            <FormControlLabel
              control={<Checkbox checked={profileConfig.shareWishlist} onChange={(e) => handleProfileConfigChange('shareWishlist', e.target.checked)} />}
              label="Allow Sharing Wishlist with Friends"
            />
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              Personal Details
            </Typography>
            <FormControlLabel
              control={<Checkbox checked={profileConfig.collectPersonalData} onChange={(e) => handleProfileConfigChange('collectPersonalData', e.target.checked)} />}
              label="Enable Collection of Personal Data (e.g., DOB, Wedding Anniversary, Family Info)"
            />
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              Saved Addresses
            </Typography>
            <FormControlLabel
              control={<Checkbox checked={profileConfig.saveAddresses} onChange={(e) => handleProfileConfigChange('saveAddresses', e.target.checked)} />}
              label="Save Shipping & Payment Addresses as Default for Checkouts"
            />
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              Payment Information
            </Typography>
            <FormControlLabel
              control={<Checkbox checked={profileConfig.savePaymentInfo} onChange={(e) => handleProfileConfigChange('savePaymentInfo', e.target.checked)} />}
              label="Allow Store to Save Payment Information"
            />
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              Family Profiles
            </Typography>
            <FormControlLabel
              control={<Checkbox checked={profileConfig.linkFamilyProfiles} onChange={(e) => handleProfileConfigChange('linkFamilyProfiles', e.target.checked)} />}
              label="Enable Linking Family Profiles"
            />
            {profileConfig.linkFamilyProfiles && (
              <FormControlLabel
                control={<Checkbox checked={profileConfig.parentGuidedCheckouts} onChange={(e) => handleProfileConfigChange('parentGuidedCheckouts', e.target.checked)} />}
                label="Enable Parent-Guided/Approval Checkouts"
                sx={{ ml: 4 }}
              />
            )}
            <Button variant="contained" sx={{ mt: 3 }} onClick={() => setTabValue(4)}>
              Next: Cart & Checkout
            </Button>
          </TabPanel>

          {/* Tab 4: Cart & Checkout */}
          <TabPanel value={tabValue} index={4}>
            <Typography variant="h5" gutterBottom sx={{ color: grey[800], fontWeight: 'bold', mb: 3 }}>
              Cart & Checkout
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              Cart Configuration
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={cartConfig.showImages}
                  onChange={(e) => handleCartConfigChange('showImages', e.target.checked)}
                />
              }
              label="Show Product Images in Cart"
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={cartConfig.aiAssistedPurchasing}
                  onChange={(e) => handleCartConfigChange('aiAssistedPurchasing', e.target.checked)}
                />
              }
              label="Enable AI-Assisted Purchasing (Add Items & Place Orders via Voice)"
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={cartConfig.allowQuantityEdit}
                  onChange={(e) => handleCartConfigChange('allowQuantityEdit', e.target.checked)}
                />
              }
              label="Allow Quantity Editing in Cart"
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={cartConfig.upsells}
                  onChange={(e) => handleCartConfigChange('upsells', e.target.checked)}
                />
              }
              label="Enable AI-Driven Upsell Suggestions"
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={cartConfig.singleClickOrder}
                  onChange={(e) => handleCartConfigChange('singleClickOrder', e.target.checked)}
                />
              }
              label="Enable Single Click Place Order"
              sx={{ mb: 1 }}
            />
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              Checkout Configuration
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={cartConfig.fastCheckout}
                  onChange={(e) => handleCartConfigChange('fastCheckout', e.target.checked)}
                />
              }
              label="Enable Fast Checkout (Skip Non-Essential Steps)"
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkoutConfig.guestCheckout}
                  onChange={(e) => handleCheckoutConfigChange('guestCheckout', e.target.checked)}
                />
              }
              label="Allow Guest Checkout"
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkoutConfig.sendOrderConfirmationEmail}
                  onChange={(e) => handleCheckoutConfigChange('sendOrderConfirmationEmail', e.target.checked)}
                />
              }
              label="Send Order Confirmation Email"
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkoutConfig.enableCheckout2FA}
                  onChange={(e) => handleCheckoutConfigChange('enableCheckout2FA', e.target.checked)}
                />
              }
              label="Enable Two-Factor Authentication for Checkout"
              sx={{ mb: 1 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkoutConfig.showEstimatedDelivery}
                  onChange={(e) => handleCheckoutConfigChange('showEstimatedDelivery', e.target.checked)}
                />
              }
              label="Show Estimated Delivery Date in Checkout"
              sx={{ mb: 1 }}
            />
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              Shipping Configuration
            </Typography>
            <Typography variant="subtitle1" sx={{ color: grey[700] }}>
              Shipping Methods
            </Typography>
            {['Standard', 'Express', 'Overnight'].map(method => (
              <Box key={method} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checkoutConfig.shippingMethods.includes(method)}
                      onChange={(e) =>
                        handleCheckoutConfigChange(
                          'shippingMethods',
                          e.target.checked
                            ? [...checkoutConfig.shippingMethods, method]
                            : checkoutConfig.shippingMethods.filter(m => m !== method)
                        )
                      }
                    />
                  }
                  label={method}
                />
                {checkoutConfig.shippingMethods.includes(method) && (
                  <TextField
                    label={`${method} Cost ($)`}
                    type="number"
                    value={checkoutConfig.shippingCosts[method] || 0}
                    onChange={(e) =>
                      handleCheckoutConfigChange('shippingCosts', {
                        ...checkoutConfig.shippingCosts,
                        [method]: e.target.value,
                      })
                    }
                    sx={{ ml: 2, width: '150px' }}
                  />
                )}
              </Box>
            ))}
            <Typography variant="subtitle1" sx={{ mt: 2, color: grey[700] }}>
              Shipping Address
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={checkoutConfig.shippingAddress.name}
                  onChange={(e) => handleShippingAddressChange('name', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Street"
                  value={checkoutConfig.shippingAddress.street}
                  onChange={(e) => handleShippingAddressChange('street', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={checkoutConfig.shippingAddress.city}
                  onChange={(e) => handleShippingAddressChange('city', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  value={checkoutConfig.shippingAddress.state}
                  onChange={(e) => handleShippingAddressChange('state', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ZIP"
                  value={checkoutConfig.shippingAddress.zip}
                  onChange={(e) => handleShippingAddressChange('zip', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  value={checkoutConfig.shippingAddress.country}
                  onChange={(e) => handleShippingAddressChange('country', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
            <Typography variant="subtitle1" sx={{ mt: 2, color: grey[700] }}>
              Shipping API Keys and URLs
            </Typography>
            {checkoutConfig.shippingApis.map((api, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TextField
                  label="Key"
                  value={api.key}
                  onChange={(e) => handleShippingApiChange(index, 'key', e.target.value)}
                  sx={{ mr: 1, width: '200px' }}
                />
                <TextField
                  label="Value"
                  value={api.value}
                  onChange={(e) => handleShippingApiChange(index, 'value', e.target.value)}
                  sx={{ mr: 1, width: '300px' }}
                />
                <IconButton onClick={() => removeShippingApi(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button startIcon={<AddIcon />} onClick={addShippingApi} sx={{ mt: 1 }}>
              Add Shipping API
            </Button>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              Billing Configuration
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkoutConfig.sameAsShipping}
                  onChange={(e) => {
                    const sameAsShipping = e.target.checked;
                    handleCheckoutConfigChange('sameAsShipping', sameAsShipping);
                    if (sameAsShipping) {
                      handleCheckoutConfigChange('billingAddress', { ...checkoutConfig.shippingAddress });
                    }
                  }}
                />
              }
              label="Same as Shipping Address"
              sx={{ mb: 1 }}
            />
            {!checkoutConfig.sameAsShipping && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={checkoutConfig.billingAddress.name}
                    onChange={(e) => handleBillingAddressChange('name', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Street"
                    value={checkoutConfig.billingAddress.street}
                    onChange={(e) => handleBillingAddressChange('street', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    value={checkoutConfig.billingAddress.city}
                    onChange={(e) => handleBillingAddressChange('city', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State"
                    value={checkoutConfig.billingAddress.state}
                    onChange={(e) => handleBillingAddressChange('state', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="ZIP"
                    value={checkoutConfig.billingAddress.zip}
                    onChange={(e) => handleBillingAddressChange('zip', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    value={checkoutConfig.billingAddress.country}
                    onChange={(e) => handleBillingAddressChange('country', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
            )}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              Payment Configuration
            </Typography>
            <Typography variant="subtitle1" sx={{ color: grey[700] }}>
              Payment Methods
            </Typography>
            {['Credit Card', 'PayPal', 'Apple Pay', 'Google Pay'].map(method => (
              <FormControlLabel
                key={method}
                control={
                  <Checkbox
                    checked={checkoutConfig.paymentMethods.includes(method)}
                    onChange={(e) =>
                      handleCheckoutConfigChange(
                        'paymentMethods',
                        e.target.checked
                          ? [...checkoutConfig.paymentMethods, method]
                          : checkoutConfig.paymentMethods.filter(m => m !== method)
                      )
                    }
                  />
                }
                label={method}
                sx={{ mb: 1 }}
              />
            ))}
            <Typography variant="subtitle1" sx={{ mt: 2, color: grey[700] }}>
              Payment API Keys and URLs
            </Typography>
            {checkoutConfig.paymentApis.map((api, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TextField
                  label="Key"
                  value={api.key}
                  onChange={(e) => handlePaymentApiChange(index, 'key', e.target.value)}
                  sx={{ mr: 1, width: '200px' }}
                />
                <TextField
                  label="Value"
                  value={api.value}
                  onChange={(e) => handlePaymentApiChange(index, 'value', e.target.value)}
                  sx={{ mr: 1, width: '300px' }}
                />
                <IconButton onClick={() => removePaymentApi(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button startIcon={<AddIcon />} onClick={addPaymentApi} sx={{ mt: 1 }}>
              Add Payment API
            </Button>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              Order Review
            </Typography>
            <TextField
              fullWidth
              label="Order Review Button Color"
              type="color"
              value={checkoutConfig.buttonColor}
              onChange={(e) => handleCheckoutConfigChange('buttonColor', e.target.value)}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Order Review Layout</InputLabel>
              <Select
                value={checkoutConfig.orderReviewLayout}
                onChange={(e) => handleCheckoutConfigChange('orderReviewLayout', e.target.value)}
                label="Order Review Layout"
              >
                <MenuItem value="compact">Compact</MenuItem>
                <MenuItem value="detailed">Detailed</MenuItem>
              </Select>
            </FormControl>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              Returns Handling
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkoutConfig.allowReturns}
                  onChange={(e) => handleCheckoutConfigChange('allowReturns', e.target.checked)}
                />
              }
              label="Allow Returns"
              sx={{ mb: 1 }}
            />
            {checkoutConfig.allowReturns && (
              <>
                <TextField
                  fullWidth
                  label="Return Window (Days)"
                  type="number"
                  value={checkoutConfig.returnWindow}
                  onChange={(e) => handleCheckoutConfigChange('returnWindow', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextareaAutosize
                  minRows={3}
                  placeholder="Return Conditions (e.g., 'Must be unused, in original packaging')"
                  style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
                  value={checkoutConfig.returnConditions}
                  onChange={(e) => handleCheckoutConfigChange('returnConditions', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Return Shipping Responsibility</InputLabel>
                  <Select
                    value={checkoutConfig.returnShippingResponsibility}
                    onChange={(e) => handleCheckoutConfigChange('returnShippingResponsibility', e.target.value)}
                    label="Return Shipping Responsibility"
                  >
                    <MenuItem value="store">Store</MenuItem>
                    <MenuItem value="customer">Customer</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Restocking Fee (%)"
                  type="number"
                  value={checkoutConfig.restockingFee}
                  onChange={(e) => handleCheckoutConfigChange('restockingFee', e.target.value)}
                  sx={{ mb: 2 }}
                  inputProps={{ min: 0, max: 100 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Return Method</InputLabel>
                  <Select
                    value={checkoutConfig.returnMethod}
                    onChange={(e) => handleCheckoutConfigChange('returnMethod', e.target.value)}
                    label="Return Method"
                  >
                    <MenuItem value="in-store">In-Store</MenuItem>
                    <MenuItem value="mail">Mail</MenuItem>
                    <MenuItem value="both">Both</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              Payment Reversal Configuration
            </Typography>
            <Typography variant="subtitle1" sx={{ color: grey[700] }}>
              Payment Reversal Methods
            </Typography>
            {['Refund to Original Method', 'Store Credit', 'Manual Refund'].map(method => (
              <FormControlLabel
                key={method}
                control={
                  <Checkbox
                    checked={checkoutConfig.paymentReversalMethods.includes(method)}
                    onChange={(e) =>
                      handleCheckoutConfigChange(
                        'paymentReversalMethods',
                        e.target.checked
                          ? [...checkoutConfig.paymentReversalMethods, method]
                          : checkoutConfig.paymentReversalMethods.filter(m => m !== method)
                      )
                    }
                  />
                }
                label={method}
                sx={{ mb: 1 }}
              />
            ))}
            <Typography variant="subtitle1" sx={{ mt: 2, color: grey[700] }}>
              Payment Reversal API Keys and URLs
            </Typography>
            {checkoutConfig.paymentReversalApis.map((api, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TextField
                  label="Key"
                  value={api.key}
                  onChange={(e) => handlePaymentReversalApiChange(index, 'key', e.target.value)}
                  sx={{ mr: 1, width: '200px' }}
                />
                <TextField
                  label="Value"
                  value={api.value}
                  onChange={(e) => handlePaymentReversalApiChange(index, 'value', e.target.value)}
                  sx={{ mr: 1, width: '300px' }}
                />
                <IconButton onClick={() => removePaymentReversalApi(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button startIcon={<AddIcon />} onClick={addPaymentReversalApi} sx={{ mt: 1 }}>
              Add Payment Reversal API
            </Button>
            <Button variant="contained" sx={{ mt: 3 }} onClick={() => setTabValue(5)}>
              Next: SEO & Analytics
            </Button>
          </TabPanel>

          {/* Tab 5: SEO & Analytics */}
          <TabPanel value={tabValue} index={5}>
            <Typography variant="h5" gutterBottom sx={{ color: grey[800], fontWeight: 'bold', mb: 3 }}>
              SEO & Analytics
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              SEO Configuration
            </Typography>
            <TextField
              fullWidth
              label="Meta Title"
              variant="outlined"
              value={seoConfig.metaTitle}
              onChange={(e) => handleSeoConfigChange('metaTitle', e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Meta Description"
              variant="outlined"
              value={seoConfig.metaDescription}
              onChange={(e) => handleSeoConfigChange('metaDescription', e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextareaAutosize
              minRows={4}
              placeholder="Schema Markup (JSON-LD)"
              style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
              value={seoConfig.schema}
              onChange={(e) => handleSeoConfigChange('schema', e.target.value)}
              sx={{ mb: 2 }}
            />
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              Google SEO Settings
            </Typography>
            <TextField
              fullWidth
              label="Google Search Console Verification Code"
              value={seoConfig.googleSearchConsoleVerification}
              onChange={(e) => handleSeoConfigChange('googleSearchConsoleVerification', e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Google Analytics Tracking ID"
              value={seoConfig.googleAnalyticsTrackingId}
              onChange={(e) => handleSeoConfigChange('googleAnalyticsTrackingId', e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Google Tag Manager ID"
              value={seoConfig.googleTagManagerId}
              onChange={(e) => handleSeoConfigChange('googleTagManagerId', e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Google Site Verification Code"
              value={seoConfig.googleSiteVerification}
              onChange={(e) => handleSeoConfigChange('googleSiteVerification', e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle1" sx={{ mt: 2, color: grey[700] }}>
              SEO API Keys and URLs
            </Typography>
            {seoConfig.seoApis.map((api, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TextField
                  label="Key"
                  value={api.key}
                  onChange={(e) => handleSeoApiChange(index, 'key', e.target.value)}
                  sx={{ mr: 1, width: '200px' }}
                />
                <TextField
                  label="Value"
                  value={api.value}
                  onChange={(e) => handleSeoApiChange(index, 'value', e.target.value)}
                  sx={{ mr: 1, width: '300px' }}
                />
                <IconButton onClick={() => removeSeoApi(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button startIcon={<AddIcon />} onClick={addSeoApi} sx={{ mt: 1, mb: 2 }}>
              Add SEO API
            </Button>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              Store Locations & Maps
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={seoConfig.enableStoreLocator}
                  onChange={(e) => handleSeoConfigChange('enableStoreLocator', e.target.checked)}
                />
              }
              label="Enable Store Locator"
              sx={{ mb: 1 }}
            />
            {seoConfig.enableStoreLocator && (
              <>
                <TextField
                  fullWidth
                  label="Google Maps API Key"
                  value={seoConfig.googleMapsApiKey}
                  onChange={(e) => handleSeoConfigChange('googleMapsApiKey', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Default Store Latitude"
                  value={seoConfig.storeLatitude}
                  onChange={(e) => handleSeoConfigChange('storeLatitude', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Default Store Longitude"
                  value={seoConfig.storeLongitude}
                  onChange={(e) => handleSeoConfigChange('storeLongitude', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </>
            )}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              A/B Testing
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={seoConfig.enableABTesting}
                  onChange={(e) => handleSeoConfigChange('enableABTesting', e.target.checked)}
                />
              }
              label="Enable A/B Testing"
              sx={{ mb: 1 }}
            />
            {seoConfig.enableABTesting && (
              <>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>A/B Testing Tool</InputLabel>
                  <Select
                    value={seoConfig.abTestingTool}
                    onChange={(e) => handleSeoConfigChange('abTestingTool', e.target.value)}
                    label="A/B Testing Tool"
                  >
                    <MenuItem value="google-optimize">Google Optimize</MenuItem>
                    <MenuItem value="optimizely">Optimizely</MenuItem>
                    <MenuItem value="vwo">VWO</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="A/B Testing API Key"
                  value={seoConfig.abTestingApiKey}
                  onChange={(e) => handleSeoConfigChange('abTestingApiKey', e.target.value)}
                  sx={{ mb: 2 }}
                />
              </>
            )}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              Sitemap Configuration
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={seoConfig.enableSitemap}
                  onChange={(e) => handleSeoConfigChange('enableSitemap', e.target.checked)}
                />
              }
              label="Enable Sitemap Generation"
              sx={{ mb: 1 }}
            />
            {seoConfig.enableSitemap && (
              <>
                <TextField
                  fullWidth
                  label="Sitemap URL"
                  value={seoConfig.sitemapUrl}
                  onChange={(e) => handleSeoConfigChange('sitemapUrl', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Sitemap Update Frequency</InputLabel>
                  <Select
                    value={seoConfig.sitemapUpdateFrequency}
                    onChange={(e) => handleSeoConfigChange('sitemapUpdateFrequency', e.target.value)}
                    label="Sitemap Update Frequency"
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Homepage Priority (0.0 to 1.0)"
                  type="number"
                  value={seoConfig.sitemapPriorityHomepage}
                  onChange={(e) => handleSeoConfigChange('sitemapPriorityHomepage', Math.max(0, Math.min(1, e.target.value)))}
                  sx={{ mb: 2 }}
                  inputProps={{ step: 0.1, min: 0, max: 1 }}
                />
                <TextField
                  fullWidth
                  label="Product Pages Priority (0.0 to 1.0)"
                  type="number"
                  value={seoConfig.sitemapPriorityProductPages}
                  onChange={(e) => handleSeoConfigChange('sitemapPriorityProductPages', Math.max(0, Math.min(1, e.target.value)))}
                  sx={{ mb: 2 }}
                  inputProps={{ step: 0.1, min: 0, max: 1 }}
                />
              </>
            )}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
              Analytics Configuration
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={seoConfig.enableAnalytics}
                  onChange={(e) => handleSeoConfigChange('enableAnalytics', e.target.checked)}
                />
              }
              label="Enable Analytics Tracking"
              sx={{ mb: 2}}
              />
              {seoConfig.enableAnalytics && (
                <>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Analytics Tool</InputLabel>
                    <Select
                      value={seoConfig.analyticsTool}
                      onChange={(e) => handleSeoConfigChange('analyticsTool', e.target.value)}
                      label="Analytics Tool"
                    >
                      <MenuItem value="google-analytics">Google Analytics</MenuItem>
                      <MenuItem value="mixpanel">Mixpanel</MenuItem>
                      <MenuItem value="amplitude">Amplitude</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    label="Analytics API Key"
                    value={seoConfig.analyticsApiKey}
                    onChange={(e) => handleSeoConfigChange('analyticsApiKey', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </>
              )}
              <Button variant="contained" sx={{ mt: 3 }} onClick={() => setTabValue(6)}>
                Next: Miscellaneous
              </Button>
            </TabPanel>
  
            {/* Tab 6: Miscellaneous */}
            <TabPanel value={tabValue} index={6}>
              <Typography variant="h5" gutterBottom sx={{ color: grey[800], fontWeight: 'bold', mb: 3 }}>
                Miscellaneous
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
                Store Information
              </Typography>
              <TextareaAutosize
                minRows={4}
                placeholder="About Us Description"
                style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
                value={miscConfig.aboutUsDescription}
                onChange={(e) => handleMiscConfigChange('aboutUsDescription', e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Contact Email"
                value={miscConfig.contactEmail}
                onChange={(e) => handleMiscConfigChange('contactEmail', e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Contact Phone"
                value={miscConfig.contactPhone}
                onChange={(e) => handleMiscConfigChange('contactPhone', e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Contact Address"
                value={miscConfig.contactAddress}
                onChange={(e) => handleMiscConfigChange('contactAddress', e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Support Hours"
                value={miscConfig.supportHours}
                onChange={(e) => handleMiscConfigChange('supportHours', e.target.value)}
                sx={{ mb: 2 }}
              />
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
                Social Media Links
              </Typography>
              {miscConfig.socialMediaLinks.map((link, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TextField
                    label="Platform"
                    value={link.platform}
                    onChange={(e) => handleSocialMediaLinkChange(index, 'platform', e.target.value)}
                    sx={{ mr: 1, width: '150px' }}
                  />
                  <TextField
                    label="URL"
                    value={link.url}
                    onChange={(e) => handleSocialMediaLinkChange(index, 'url', e.target.value)}
                    sx={{ mr: 1, width: '300px' }}
                  />
                  <IconButton onClick={() => removeSocialMediaLink(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button startIcon={<AddIcon />} onClick={addSocialMediaLink} sx={{ mt: 1, mb: 2 }}>
                Add Social Media Link
              </Button>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
                Legal Information
              </Typography>
              <TextareaAutosize
                minRows={4}
                placeholder="Privacy Policy"
                style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
                value={miscConfig.privacyPolicy}
                onChange={(e) => handleMiscConfigChange('privacyPolicy', e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextareaAutosize
                minRows={4}
                placeholder="Terms of Service"
                style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
                value={miscConfig.termsOfService}
                onChange={(e) => handleMiscConfigChange('termsOfService', e.target.value)}
                sx={{ mb: 2 }}
              />
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
                FAQs
              </Typography>
              {miscConfig.faqs.map((faq, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Question"
                    value={faq.question}
                    onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                    sx={{ mb: 1 }}
                  />
                  <TextareaAutosize
                    minRows={3}
                    placeholder="Answer"
                    style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
                    value={faq.answer}
                    onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                  />
                  <IconButton onClick={() => removeFaq(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button startIcon={<AddIcon />} onClick={addFaq} sx={{ mt: 1, mb: 2 }}>
                Add FAQ
              </Button>
              <Button variant="contained" sx={{ mt: 3 }} onClick={handleReviewAndSave}>
                Review & Save
              </Button>
            </TabPanel>
          </Box>
        </Box>
  
        {/* Modal for JSON Preview */}
        <Modal open={openModal} onClose={() => setOpenModal(false)} aria-labelledby="config-preview-modal">
          <Paper
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              maxWidth: 800,
              maxHeight: '80vh',
              overflowY: 'auto',
              p: 4,
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography id="config-preview-modal" variant="h6">
                Configuration Preview
              </Typography>
              <IconButton onClick={() => setOpenModal(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <JSONPretty id="json-pretty" data={consolidateConfig()} theme="monikai" />
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" onClick={() => setOpenModal(false)}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveConfig}
                disabled={loading.save}
                startIcon={loading.save ? <CircularProgress size={20} /> : <SaveIcon />}
              >
                Save Configuration
              </Button>
            </Box>
          </Paper>
        </Modal>
  
        {/* Snackbar for Feedback */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
  
        <Footer />
      </Box>
    );
  }