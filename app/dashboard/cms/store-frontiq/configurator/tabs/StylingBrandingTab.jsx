import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardMedia,
  CardContent,
  TextareaAutosize,
  Avatar,
  CardHeader,
  CircularProgress,
  Divider,
  IconButton,
  Modal,
  Paper,
  Menu,
  Chip,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import PaletteIcon from '@mui/icons-material/Palette';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import ImageIcon from '@mui/icons-material/Image';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';

const API_BASE_URL = 'http://localhost:5000/api/v1/cms/storefront/config';

// Professional fonts list (still needed for manual selection)
const professionalFonts = [
  "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins",
  "Raleway", "Inter", "Source Sans Pro", "Noto Sans", "Playfair Display",
];

// Design tones (still needed for selection)
const designTones = ["Minimalist", "Bold", "Elegant", "Playful"];

export default function StylingBrandingTab({
  theme,
  setTheme,
  price,
  setTabValue,
  setSnackbar,
  designTone,
  setDesignTone,
}) {
  const [storeDescription, setStoreDescription] = useState('');
  const [aiFaviconPrompt, setAiFaviconPrompt] = useState('');
  const [aiLogoPrompt, setAiLogoPrompt] = useState('');
  const [aiCssPrompt, setAiCssPrompt] = useState('');
  const [aiGeneratedFavicon, setAiGeneratedFavicon] = useState(null);
  const [aiGeneratedLogo, setAiGeneratedLogo] = useState(null);
  const [aiSuggestedPalettes, setAiSuggestedPalettes] = useState([]);
  const [aiSuggestedFontList, setAiSuggestedFontList] = useState([]);
  const [aiSuggestedCssSnippet, setAiSuggestedCssSnippet] = useState('');
  const [preBuiltThemes, setPreBuiltThemes] = useState([]);
  const [selectedPalette, setSelectedPalette] = useState(null);
  const [elementStyles, setElementStyles] = useState({
    button: { borderRadius: "4px", padding: "8px 16px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", hoverBg: "#10B981" },
    form: { borderRadius: "4px", padding: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" },
    modal: { borderRadius: "8px", padding: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.15)" },
    menu: { borderRadius: "4px", padding: "5px", boxShadow: "0 1px 5px rgba(0,0,0,0.1)" },
  });
  const [loading, setLoading] = useState({ aiImage: false, aiColors: false, aiFonts: false, aiCss: false, aiElements: false, aiThemes: false });
  const [error, setError] = useState({ aiImage: null, aiColors: null, aiFonts: null, aiCss: null, aiElements: null, aiThemes: null });
  const [figmaImportModalOpen, setFigmaImportModalOpen] = useState(false);
  const [figmaFileId, setFigmaFileId] = useState('');
  const [themeType, setThemeType] = useState("Custom");
  const [selectedTheme, setSelectedTheme] = useState(null);

  // Fetch pre-built themes on component mount
  useEffect(() => {
    const fetchPreBuiltThemes = async () => {
      setLoading(prev => ({ ...prev, aiThemes: true }));
      setError(prev => ({ ...prev, aiThemes: null }));
      try {
        const response = await fetch(`${API_BASE_URL}/ai/prebuilt-themes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ store_description: storeDescription || "default store", design_tone: designTone }),
        });
        const data = await response.json();
        if (data.themes) {
          setPreBuiltThemes(data.themes);
        } else {
          throw new Error(data.error || 'Failed to fetch pre-built themes');
        }
      } catch (err) {
        setError(prev => ({ ...prev, aiThemes: err.message }));
        setSnackbar({ open: true, message: 'Error fetching pre-built themes', severity: 'error' });
      } finally {
        setLoading(prev => ({ ...prev, aiThemes: false }));
      }
    };
    fetchPreBuiltThemes();
  }, [storeDescription, designTone, setSnackbar]);

  // Apply pre-built theme
  const applyPreBuiltTheme = (theme) => {
    setSelectedTheme(theme);
    setThemeType("Pre-Built");
    setDesignTone(theme.designTone);
    setElementStyles(theme.elementStyles);
    setSelectedPalette(theme.colors);
    setTheme({
      ...theme,
      storeName: theme.storeName || "Your Store Name",
      faviconUrl: theme.faviconUrl || "https://via.placeholder.com/32",
      logoUrl: theme.logoUrl || "https://via.placeholder.com/48",
      bannerImage: theme.bannerImage || "https://via.placeholder.com/150",
      primaryColor: theme.colors.palette[0].color,
      secondaryColor: theme.colors.palette[1].color,
      font: theme.font,
      backgroundImage: theme.colors.useGradient ? "" : theme.backgroundImage || "",
      customCss: theme.customCss,
    });
    setSnackbar({ open: true, message: `Applied ${theme.name} theme!`, severity: 'success' });
  };

  // Apply custom palette
  const applyPalette = (palette) => {
    setSelectedPalette(palette);
    setTheme(prev => ({
      ...prev,
      primaryColor: palette.palette[0].color,
      secondaryColor: palette.palette[1].color,
      backgroundImage: palette.useGradient ? "" : prev.backgroundImage,
      customCss: palette.useGradient ? `
        body {
          background: ${palette.gradient};
        }
        ${prev.customCss || ""}
      ` : prev.customCss,
    }));
  };

  // Generate AI-driven favicon/logo
  const generateAIImage = async (prompt, type) => {
    setLoading(prev => ({ ...prev, aiImage: true }));
    setError(prev => ({ ...prev, aiImage: null }));
    try {
      const response = await fetch(`${API_BASE_URL}/ai/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, type }),
      });
      const data = await response.json();
      if (data.image_url) {
        if (type === 'favicon') {
          setAiGeneratedFavicon(data.image_url);
          setTheme(prev => ({ ...prev, faviconUrl: data.image_url }));
        } else {
          setAiGeneratedLogo(data.image_url);
          setTheme(prev => ({ ...prev, logoUrl: data.image_url }));
        }
        setSnackbar({ open: true, message: `${type} generated successfully!`, severity: 'success' });
      } else {
        throw new Error(data.error || 'Failed to generate image');
      }
    } catch (err) {
      setError(prev => ({ ...prev, aiImage: err.message }));
      setSnackbar({ open: true, message: 'Error generating image', severity: 'error' });
    } finally {
      setLoading(prev => ({ ...prev, aiImage: false }));
    }
  };

  // Generate AI-driven color palettes
  const generateAIColors = async () => {
    setLoading(prev => ({ ...prev, aiColors: true }));
    setError(prev => ({ ...prev, aiColors: null }));
    try {
      const response = await fetch(`${API_BASE_URL}/ai/generate-colors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store_description: storeDescription, design_tone: designTone }),
      });
      const data = await response.json();
      if (data.palettes) {
        setAiSuggestedPalettes(data.palettes);
        setSnackbar({ open: true, message: 'Color palettes generated successfully!', severity: 'success' });
      } else {
        throw new Error(data.error || 'Failed to generate color palettes');
      }
    } catch (err) {
      setError(prev => ({ ...prev, aiColors: err.message }));
      setSnackbar({ open: true, message: 'Error generating color palettes', severity: 'error' });
    } finally {
      setLoading(prev => ({ ...prev, aiColors: false }));
    }
  };

  // Suggest AI-driven fonts
  const suggestAIFonts = async () => {
    setLoading(prev => ({ ...prev, aiFonts: true }));
    setError(prev => ({ ...prev, aiFonts: null }));
    try {
      const response = await fetch(`${API_BASE_URL}/ai/suggest-fonts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store_description: storeDescription, design_tone: designTone }),
      });
      const data = await response.json();
      if (data.fonts) {
        setAiSuggestedFontList(data.fonts);
        setSnackbar({ open: true, message: 'Font suggestions generated successfully!', severity: 'success' });
      } else {
        throw new Error(data.error || 'Failed to suggest fonts');
      }
    } catch (err) {
      setError(prev => ({ ...prev, aiFonts: err.message }));
      setSnackbar({ open: true, message: 'Error suggesting fonts', severity: 'error' });
    } finally {
      setLoading(prev => ({ ...prev, aiFonts: false }));
    }
  };

  // Generate AI-driven CSS
  const generateAICss = async () => {
    setLoading(prev => ({ ...prev, aiCss: true }));
    setError(prev => ({ ...prev, aiCss: null }));
    try {
      const response = await fetch(`${API_BASE_URL}/ai/generate-css`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiCssPrompt }),
      });
      const data = await response.json();
      if (data.css) {
        setAiSuggestedCssSnippet(data.css);
        setTheme(prev => ({ ...prev, customCss: data.css }));
        setSnackbar({ open: true, message: 'CSS generated successfully!', severity: 'success' });
      } else {
        throw new Error(data.error || 'Failed to generate CSS');
      }
    } catch (err) {
      setError(prev => ({ ...prev, aiCss: err.message }));
      setSnackbar({ open: true, message: 'Error generating CSS', severity: 'error' });
    } finally {
      setLoading(prev => ({ ...prev, aiCss: false }));
    }
  };

  // Suggest AI-driven element styles
  const suggestAIElementStyles = async () => {
    setLoading(prev => ({ ...prev, aiElements: true }));
    setError(prev => ({ ...prev, aiElements: null }));
    try {
      const response = await fetch(`${API_BASE_URL}/ai/suggest-element-styles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ design_tone: designTone }),
      });
      const data = await response.json();
      if (data.styles) {
        setElementStyles(data.styles);
        setSnackbar({ open: true, message: 'Element styles suggested successfully!', severity: 'success' });
      } else {
        throw new Error(data.error || 'Failed to suggest element styles');
      }
    } catch (err) {
      setError(prev => ({ ...prev, aiElements: err.message }));
      setSnackbar({ open: true, message: 'Error suggesting element styles', severity: 'error' });
    } finally {
      setLoading(prev => ({ ...prev, aiElements: false }));
    }
  };

  const handleThemeChange = (key, value) => {
    const updatedTheme = { ...theme, [key]: value };
    setTheme(updatedTheme);
    fetch(`${API_BASE_URL}/theme`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: updatedTheme }),
    })
      .then(response => response.json())
      .then(data => setPrice(data.previewPrice || 0))
      .catch(error => console.error('Error updating theme:', error));
  };

  const handleElementStyleChange = (element, key, value) => {
    setElementStyles(prev => ({
      ...prev,
      [element]: { ...prev[element], [key]: value },
    }));
  };

  // Export to Figma (client-side, no change needed)
  const exportToFigma = () => {
    const figmaDesign = {
      storeName: theme.storeName,
      faviconUrl: theme.faviconUrl,
      logoUrl: theme.logoUrl,
      bannerImage: theme.bannerImage,
      primaryColor: theme.primaryColor,
      secondaryColor: theme.secondaryColor,
      font: theme.font,
      backgroundImage: theme.backgroundImage,
      customCss: theme.customCss,
      elementStyles,
      designTone,
      storeDescription,
    };
    const blob = new Blob([JSON.stringify(figmaDesign, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'storefront-design.json';
    link.click();
    URL.revokeObjectURL(url);
    setSnackbar({ open: true, message: 'Design exported as JSON (simulated Figma export)!', severity: 'success' });
  };

  // Import from Figma
  const importFromFigma = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/figma/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_id: figmaFileId }),
      });
      const data = await response.json();
      if (data.theme) {
        setTheme({
          storeName: data.theme.store_name,
          faviconUrl: data.theme.favicon_url,
          logoUrl: data.theme.logo_url,
          bannerImage: data.theme.banner_image,
          primaryColor: data.theme.primary_color,
          secondaryColor: data.theme.secondary_color,
          font: data.theme.font,
          backgroundImage: data.theme.background_image,
          customCss: data.theme.custom_css,
        });
        setElementStyles(data.theme.element_styles);
        setStoreDescription("Imported from Figma");
        setDesignTone("Elegant");
        setFigmaImportModalOpen(false);
        setThemeType("Custom");
        setSelectedTheme(null);
        setSnackbar({ open: true, message: 'Design imported from Figma (simulated)!', severity: 'success' });
      } else {
        throw new Error(data.error || 'Failed to import from Figma');
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Error importing from Figma', severity: 'error' });
    }
  };

  // The rest of the JSX remains the same as in your original file
  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: grey[800], fontWeight: 'bold', mb: 3 }}>
        Styling & Branding
      </Typography>
      <Grid container spacing={2}>
        {/* Left Side: Inputs */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Store/Brand Name"
            value={theme.storeName}
            onChange={(e) => handleThemeChange('storeName', e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Store Description (for AI Suggestions)"
            value={storeDescription}
            onChange={(e) => setStoreDescription(e.target.value)}
            multiline
            rows={2}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Design Tone</InputLabel>
            <Select
              value={designTone}
              onChange={(e) => setDesignTone(e.target.value)}
              label="Design Tone"
            >
              {designTones.map(tone => (
                <MenuItem key={tone} value={tone}>{tone}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="subtitle1" sx={{ color: grey[700], mb: 1 }}>
            Favicon
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              fullWidth
              label="Favicon URL"
              value={theme.faviconUrl}
              onChange={(e) => handleThemeChange('faviconUrl', e.target.value)}
              sx={{ mr: 1 }}
            />
            <Avatar src={theme.faviconUrl} sx={{ width: 32, height: 32, ml: 1 }} variant="square" />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="AI Favicon Prompt (e.g., 'A blue star icon')"
              value={aiFaviconPrompt}
              onChange={(e) => setAiFaviconPrompt(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Button
              variant="outlined"
              startIcon={loading.aiImage ? <CircularProgress size={20} /> : <ImageIcon />}
              onClick={() => generateAIImage(aiFaviconPrompt, 'favicon')}
              disabled={loading.aiImage || !aiFaviconPrompt}
            >
              Generate Favicon with AI
            </Button>
            {aiGeneratedFavicon && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="success.main">
                  AI-Generated Favicon Ready!
                </Typography>
              </Box>
            )}
            {error.aiImage && (
              <Typography variant="body2" color="error.main">
                {error.aiImage}
              </Typography>
            )}
          </Box>
          <Typography variant="subtitle1" sx={{ color: grey[700], mb: 1 }}>
            Logo
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              fullWidth
              label="Logo URL"
              value={theme.logoUrl}
              onChange={(e) => handleThemeChange('logoUrl', e.target.value)}
              sx={{ mr: 1 }}
            />
            <Avatar src={theme.logoUrl} sx={{ width: 48, height: 48, ml: 1 }} variant="square" />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="AI Logo Prompt (e.g., 'A modern tech logo in blue')"
              value={aiLogoPrompt}
              onChange={(e) => setAiLogoPrompt(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Button
              variant="outlined"
              startIcon={loading.aiImage ? <CircularProgress size={20} /> : <ImageIcon />}
              onClick={() => generateAIImage(aiLogoPrompt, 'logo')}
              disabled={loading.aiImage || !aiLogoPrompt}
            >
              Generate Logo with AI
            </Button>
            {aiGeneratedLogo && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="success.main">
                  AI-Generated Logo Ready!
                </Typography>
              </Box>
            )}
            {error.aiImage && (
              <Typography variant="body2" color="error.main">
                {error.aiImage}
              </Typography>
            )}
          </Box>
          <TextField
            fullWidth
            label="Banner Image URL"
            value={theme.bannerImage}
            onChange={(e) => handleThemeChange('bannerImage', e.target.value)}
            sx={{ mb: 2 }}
          />
          <Typography variant="subtitle1" sx={{ color: grey[700], mb: 1 }}>
            Color Palette
          </Typography>
          <Box sx={{ mb: 1 }}>
            <Button
              variant="outlined"
              startIcon={loading.aiColors ? <CircularProgress size={20} /> : <PaletteIcon />}
              onClick={generateAIColors}
              disabled={loading.aiColors || !storeDescription}
            >
              Generate Color Palettes with AI
            </Button>
          </Box>
          {aiSuggestedPalettes.length > 0 && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: grey[700], mb: 1 }}>
                AI-Suggested Palettes
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {aiSuggestedPalettes.map((palette, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    onClick={() => applyPalette(palette)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      bgcolor: palette.palette[0].color,
                      color: '#fff',
                      '&:hover': { bgcolor: palette.palette[0].color, opacity: 0.9 },
                    }}
                  >
                    {palette.palette.map((color, idx) => (
                      <Box key={idx} sx={{ width: 20, height: 20, bgcolor: color.color, border: '1px solid #fff' }} />
                    ))}
                    <Typography variant="body2">Palette {index + 1}</Typography>
                    {palette.useGradient && <Chip label="Gradient" size="small" sx={{ ml: 1, bgcolor: '#fff', color: palette.palette[0].color }} />}
                  </Button>
                ))}
              </Box>
            </Box>
          )}
          {selectedPalette && themeType === "Custom" && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: grey[700], mb: 1 }}>
                Remix Selected Palette
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {selectedPalette.palette.map((color, idx) => (
                  <TextField
                    key={idx}
                    label={color.name}
                    type="color"
                    value={color.color}
                    onChange={(e) => {
                      const newPalette = { ...selectedPalette };
                      newPalette.palette[idx].color = e.target.value;
                      applyPalette(newPalette);
                    }}
                    sx={{ width: '150px' }}
                  />
                ))}
              </Box>
            </Box>
          )}
          {error.aiColors && (
            <Typography variant="body2" color="error.main">
              {error.aiColors}
            </Typography>
          )}
          <Typography variant="subtitle1" sx={{ color: grey[700], mb: 1 }}>
            Font Family
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <FormControl fullWidth sx={{ mr: 2 }}>
              <InputLabel>Font Family</InputLabel>
              <Select
                value={theme.font}
                onChange={(e) => handleThemeChange('font', e.target.value)}
                label="Font Family"
              >
                {professionalFonts.map(font => (
                  <MenuItem key={font} value={font} sx={{ fontFamily: font }}>
                    {font}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={loading.aiFonts ? <CircularProgress size={20} /> : <FontDownloadIcon />}
              onClick={suggestAIFonts}
              disabled={loading.aiFonts || !storeDescription}
            >
              Suggest Fonts with AI
            </Button>
          </Box>
          {aiSuggestedFontList.length > 0 && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: grey[700], mb: 1 }}>
                AI-Suggested Fonts
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {aiSuggestedFontList.map((font, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    onClick={() => handleThemeChange('font', font)}
                    sx={{ fontFamily: font }}
                  >
                    {font}
                  </Button>
                ))}
              </Box>
            </Box>
          )}
          {error.aiFonts && (
            <Typography variant="body2" color="error.main">
              {error.aiFonts}
            </Typography>
          )}
          {!selectedPalette?.useGradient && (
            <TextField
              fullWidth
              label="Background Image URL"
              value={theme.backgroundImage || ''}
              onChange={(e) => handleThemeChange('backgroundImage', e.target.value)}
              sx={{ mb: 2 }}
            />
          )}
          <Typography variant="subtitle1" sx={{ color: grey[700], mb: 1 }}>
            Custom CSS
          </Typography>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="AI CSS Prompt (e.g., 'Modern tech store with sleek look')"
              value={aiCssPrompt}
              onChange={(e) => setAiCssPrompt(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Button
              variant="outlined"
              onClick={generateAICss}
              disabled={loading.aiCss || !aiCssPrompt}
              startIcon={loading.aiCss ? <CircularProgress size={20} /> : null}
            >
              Generate CSS with AI
            </Button>
            {aiSuggestedCssSnippet && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="success.main">
                  AI-Generated CSS Ready!
                </Typography>
              </Box>
            )}
            {error.aiCss && (
              <Typography variant="body2" color="error.main">
                {error.aiCss}
              </Typography>
            )}
          </Box>
          <TextareaAutosize
            minRows={4}
            placeholder="Custom CSS"
            style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
            value={theme.customCss}
            onChange={(e) => handleThemeChange('customCss', e.target.value)}
            sx={{ mb: 2 }}
          />
          {themeType === "Custom" && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ color: grey[700], mb: 1 }}>
                Element Styling
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: grey[700], mb: 1 }}>
                  Button Styling
                </Typography>
                <TextField
                  fullWidth
                  label="Button Border Radius (px)"
                  value={elementStyles.button.borderRadius.replace('px', '')}
                  onChange={(e) => handleElementStyleChange('button', 'borderRadius', `${e.target.value}px`)}
                  sx={{ mb: 1 }}
                  type="number"
                />
                <TextField
                  fullWidth
                  label="Button Padding (e.g., '8px 16px')"
                  value={elementStyles.button.padding}
                  onChange={(e) => handleElementStyleChange('button', 'padding', e.target.value)}
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  label="Button Box Shadow"
                  value={elementStyles.button.boxShadow}
                  onChange={(e) => handleElementStyleChange('button', 'boxShadow', e.target.value)}
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  label="Button Hover Background Color"
                  type="color"
                  value={elementStyles.button.hoverBg}
                  onChange={(e) => handleElementStyleChange('button', 'hoverBg', e.target.value)}
                  sx={{ mb: 1 }}
                />
                <Typography variant="subtitle2" sx={{ color: grey[700], mb: 1, mt: 2 }}>
                  Form Styling
                </Typography>
                <TextField
                  fullWidth
                  label="Form Border Radius (px)"
                  value={elementStyles.form.borderRadius.replace('px', '')}
                  onChange={(e) => handleElementStyleChange('form', 'borderRadius', `${e.target.value}px`)}
                  sx={{ mb: 1 }}
                  type="number"
                />
                <TextField
                  fullWidth
                  label="Form Padding (e.g., '10px')"
                  value={elementStyles.form.padding}
                  onChange={(e) => handleElementStyleChange('form', 'padding', e.target.value)}
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  label="Form Box Shadow"
                  value={elementStyles.form.boxShadow}
                  onChange={(e) => handleElementStyleChange('form', 'boxShadow', e.target.value)}
                  sx={{ mb: 1 }}
                />
                <Typography variant="subtitle2" sx={{ color: grey[700], mb: 1, mt: 2 }}>
                  Modal Styling
                </Typography>
                <TextField
                  fullWidth
                  label="Modal Border Radius (px)"
                  value={elementStyles.modal.borderRadius.replace('px', '')}
                  onChange={(e) => handleElementStyleChange('modal', 'borderRadius', `${e.target.value}px`)}
                  sx={{ mb: 1 }}
                  type="number"
                />
                <TextField
                  fullWidth
                  label="Modal Padding (e.g., '20px')"
                  value={elementStyles.modal.padding}
                  onChange={(e) => handleElementStyleChange('modal', 'padding', e.target.value)}
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  label="Modal Box Shadow"
                  value={elementStyles.modal.boxShadow}
                  onChange={(e) => handleElementStyleChange('modal', 'boxShadow', e.target.value)}
                  sx={{ mb: 1 }}
                />
                <Typography variant="subtitle2" sx={{ color: grey[700], mb: 1, mt: 2 }}>
                  Menu/Navigation Styling
                </Typography>
                <TextField
                  fullWidth
                  label="Menu Border Radius (px)"
                  value={elementStyles.menu.borderRadius.replace('px', '')}
                  onChange={(e) => handleElementStyleChange('menu', 'borderRadius', `${e.target.value}px`)}
                  sx={{ mb: 1 }}
                  type="number"
                />
                <TextField
                  fullWidth
                  label="Menu Padding (e.g., '5px')"
                  value={elementStyles.menu.padding}
                  onChange={(e) => handleElementStyleChange('menu', 'padding', e.target.value)}
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  label="Menu Box Shadow"
                  value={elementStyles.menu.boxShadow}
                  onChange={(e) => handleElementStyleChange('menu', 'boxShadow', e.target.value)}
                  sx={{ mb: 1 }}
                />
                <Button
                  variant="outlined"
                  onClick={suggestAIElementStyles}
                  disabled={loading.aiElements || !designTone}
                  startIcon={loading.aiElements ? <CircularProgress size={20} /> : null}
                  sx={{ mt: 2 }}
                >
                  Suggest Element Styles with AI
                </Button>
                {error.aiElements && (
                  <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                    {error.aiElements}
                  </Typography>
                )}
              </Box>
            </>
          )}
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ color: grey[700], mb: 1 }}>
            Export/Import Design
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={exportToFigma}
            >
              Export to Figma
            </Button>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={() => setFigmaImportModalOpen(true)}
            >
              Import from Figma
            </Button>
          </Box>
        </Grid>
        {/* Right Side: Preview */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom sx={{ color: grey[800], fontWeight: 'medium' }}>
            Live Preview
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ color: grey[700], mb: 1 }}>
              Select a Pre-Built Theme
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant={themeType === "Custom" ? "contained" : "outlined"}
                onClick={() => {
                  setThemeType("Custom");
                  setSelectedTheme(null);
                }}
              >
                Custom Theme
              </Button>
              {preBuiltThemes.map((theme, index) => (
                <Button
                  key={index}
                  variant={selectedTheme?.name === theme.name ? "contained" : "outlined"}
                  onClick={() => applyPreBuiltTheme(theme)}
                >
                  {theme.name}
                </Button>
              ))}
            </Box>
            {error.aiThemes && (
              <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                {error.aiThemes}
              </Typography>
            )}
          </Box>
          <Card sx={{ bgcolor: theme.backgroundImage ? 'transparent' : '#fff', boxShadow: 3, minHeight: '500px' }}>
            {theme.backgroundImage && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${theme.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.2,
                  zIndex: 0,
                }}
              />
            )}
            {/* Header */}
            <Box sx={{ bgcolor: theme.primaryColor, p: 2, position: 'relative', zIndex: 1 }}>
              <CardHeader
                avatar={
                  theme.logoUrl ? (
                    <Avatar src={theme.logoUrl} sx={{ width: 48, height: 48 }} variant="square" />
                  ) : (
                    <Avatar sx={{ bgcolor: theme.primaryColor, width: 48, height: 48 }}>
                      {theme.storeName.charAt(0) || 'S'}
                    </Avatar>
                  )
                }
                title={
                  <Typography variant="h6" sx={{ color: '#fff', fontFamily: theme.font }}>
                    {theme.storeName || 'Your Store Name'}
                  </Typography>
                }
                sx={{ p: 0 }}
              />
              <Box sx={{ mt: 1 }}>
                <Menu
                  sx={{
                    '& .MuiPaper-root': {
                      borderRadius: elementStyles.menu.borderRadius,
                      padding: elementStyles.menu.padding,
                      boxShadow: elementStyles.menu.boxShadow,
                    },
                  }}
                  open={false}
                >
                  <MenuItem sx={{ fontFamily: theme.font, color: theme.secondaryColor }}>Home</MenuItem>
                  <MenuItem sx={{ fontFamily: theme.font, color: theme.secondaryColor }}>Shop</MenuItem>
                  <MenuItem sx={{ fontFamily: theme.font, color: theme.secondaryColor }}>About</MenuItem>
                </Menu>
              </Box>
            </Box>
            {theme.bannerImage && (
              <CardMedia
                component="img"
                height="200"
                image={theme.bannerImage}
                alt="Banner"
                sx={{ position: 'relative', zIndex: 1 }}
              />
            )}
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: theme.primaryColor,
                    color: '#fff',
                    fontFamily: theme.font,
                    borderRadius: elementStyles.button.borderRadius,
                    padding: elementStyles.button.padding,
                    boxShadow: elementStyles.button.boxShadow,
                    '&:hover': { bgcolor: elementStyles.button.hoverBg },
                  }}
                >
                  Shop Now
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: theme.secondaryColor,
                    color: theme.secondaryColor,
                    fontFamily: theme.font,
                    borderRadius: elementStyles.button.borderRadius,
                    padding: elementStyles.button.padding,
                    boxShadow: elementStyles.button.boxShadow,
                    '&:hover': { bgcolor: elementStyles.button.hoverBg, color: '#fff', borderColor: elementStyles.button.hoverBg },
                  }}
                >
                  Learn More
                </Button>
              </Box>
              <Box
                sx={{
                  borderRadius: elementStyles.form.borderRadius,
                  padding: elementStyles.form.padding,
                  boxShadow: elementStyles.form.boxShadow,
                  bgcolor: '#fff',
                  p: 2,
                  mb: 2,
                }}
              >
                <Typography variant="body1" sx={{ fontFamily: theme.font, color: theme.primaryColor, mb: 1 }}>
                  Sample Form
                </Typography>
                <TextField
                  label="Name"
                  fullWidth
                  sx={{
                    '& .MuiInputBase-root': { fontFamily: theme.font },
                    '& .MuiInputLabel-root': { fontFamily: theme.font, color: theme.secondaryColor },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: theme.secondaryColor },
                      '&:hover fieldset': { borderColor: theme.primaryColor },
                    },
                  }}
                />
              </Box>
              <Modal open={false} sx={{ position: 'relative', zIndex: 1 }}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: '#fff',
                    borderRadius: elementStyles.modal.borderRadius,
                    padding: elementStyles.modal.padding,
                    boxShadow: elementStyles.modal.boxShadow,
                    width: 300,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h6" sx={{ fontFamily: theme.font, color: theme.primaryColor }}>
                    Sample Modal
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: theme.font, color: theme.secondaryColor, mt: 1 }}>
                    This is a preview modal.
                  </Typography>
                </Box>
              </Modal>
            </CardContent>
            {/* Footer */}
            <Box sx={{ bgcolor: theme.primaryColor, p: 2, position: 'relative', zIndex: 1 }}>
              <Typography variant="body2" sx={{ color: '#fff', fontFamily: theme.font, textAlign: 'center' }}>
                © {new Date().getFullYear()} {theme.storeName || 'Your Store Name'}. All rights reserved.
              </Typography>
            </Box>
          </Card>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Preview Price: ${price}
          </Typography>
        </Grid>
      </Grid>
      <Button variant="contained" sx={{ mt: 3 }} onClick={() => setTabValue(1)}>
        Next: Layout & Widgets
      </Button>

      {/* Figma Import Modal */}
      <Modal
        open={figmaImportModalOpen}
        onClose={() => setFigmaImportModalOpen(false)}
      >
        <Paper sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', p: 4, width: 400 }}>
          <Typography variant="h6" gutterBottom>
            Import from Figma
          </Typography>
          <TextField
            fullWidth
            label="Figma File ID"
            value={figmaFileId}
            onChange={(e) => setFigmaFileId(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={importFromFigma}
            disabled={!figmaFileId}
            sx={{ mr: 2 }}
          >
            Import
          </Button>
          <Button
            variant="outlined"
            onClick={() => setFigmaImportModalOpen(false)}
          >
            Cancel
          </Button>
        </Paper>
      </Modal>
    </Box>
  );
}