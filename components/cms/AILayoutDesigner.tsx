"use client";
import React, { useState } from "react";
import {
  Box, Button, Typography, Stepper, Step, StepLabel,
  TextField, Grid, Card, CardContent, Dialog, DialogTitle,
  DialogContent, DialogActions, Paper
} from "@mui/material";

import LogoutIcon from '@mui/icons-material/Logout';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import PolicyIcon from '@mui/icons-material/Policy';
import StorefrontIcon from '@mui/icons-material/Storefront';

import Header from "./Header";
import Footer from "./Footer";

const steps = ["Store Type", "Design Tone", "Page Type", "Generated Layout"];
const storeTypes = ["Fashion", "Electronics", "Grocery", "Furniture"];
const designTones = ["Luxury", "Minimalist", "Funky", "Professional"];
const pageTypes = ["Homepage", "Product Page", "About Us"];
const widgetOptions = ["Product Grid", "Banner", "Hero Image", "Reviews", "CTA Button", "Newsletter Signup"];

const layoutStructures = [
  {
    id: "layout_2col_3070",
    name: "2 Columns (30/70)",
    pageTypes: ["Homepage", "Product Page"],
    tags: ["minimalist", "professional"],
    structure: [{ columns: [30, 70] }],
    thumbnail: "/images/layouts/2col_3070.png"
  },
  {
    id: "layout_1_2_1",
    name: "1-2-1 Columns",
    pageTypes: ["Homepage"],
    tags: ["funky", "professional"],
    structure: [{ columns: [25, 50, 25] }],
    thumbnail: "/images/layouts/1_2_1.png"
  },
  {
    id: "layout_1col",
    name: "1 Column (Full Width)",
    pageTypes: ["About Us", "Homepage"],
    tags: ["luxury", "minimalist"],
    structure: [{ columns: [100] }],
    thumbnail: "/images/layouts/1col.png"
  },
  {
    id: "layout_3col_equal",
    name: "3 Columns Equal",
    pageTypes: ["Homepage"],
    tags: ["funky"],
    structure: [{ columns: [33, 34, 33] }],
    thumbnail: "/images/layouts/3col_equal.png"
  }
];

export default function AILayoutDesigner() {
  const [activeStep, setActiveStep] = useState(0);
  const [storeType, setStoreType] = useState("");
  const [tone, setTone] = useState("");
  const [pageType, setPageType] = useState("");
  const [selectedLayout, setSelectedLayout] = useState<any>(null);
  const [widgetConfig, setWidgetConfig] = useState<{ [key: string]: string }>({});
  const [selectedSlot, setSelectedSlot] = useState<{ row: number; col: number } | null>(null);
  const [openWidgetDialog, setOpenWidgetDialog] = useState(false);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [layoutName, setLayoutName] = useState("");
  const [layoutDescription, setLayoutDescription] = useState("");

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleWidgetSelect = (widget: string) => {
    if (selectedSlot) {
      const key = `slot_${selectedSlot.row}_${selectedSlot.col}`;
      setWidgetConfig((prev) => ({ ...prev, [key]: widget }));
      setSelectedSlot(null);
      setOpenWidgetDialog(false);
    }
  };

  const filteredLayouts = layoutStructures.filter(
    (layout) =>
      layout.pageTypes.includes(pageType) &&
      layout.tags.includes(tone.toLowerCase())
  );

  const handleSaveLayout = () => {
    console.log({ layoutName, layoutDescription, selectedLayout, widgetConfig });
    alert("Layout saved successfully!");
    setOpenSaveDialog(false);
  };

  const renderStructuredPreview = () => {
    if (!selectedLayout) return null;
  
    return (
      <Box mt={5}>
        <Typography variant="h6" gutterBottom>🔎 Live Layout Preview</Typography>
        <Paper
          variant="outlined"
          sx={{ p: 2, background: "#fafafa", borderRadius: 2 }}
        >
          {/* Header */}
                <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bgcolor="#e0e0e0"
                px={2}
                py={1}
                mb={2}
                borderRadius={1}
                >
                <Box display="flex" alignItems="center" gap={1}>
                    <StorefrontIcon />
                    <Typography fontWeight={600}>Your Brand</Typography>
                </Box>
                <Typography fontSize={14}>Welcome, Fella</Typography>
                <LogoutIcon color="action" />
                </Box>

  
          {/* Layout Rows */}
          {selectedLayout.structure.map((row: any, rIdx: number) => (
            <Box
              key={rIdx}
              display="flex"
              width="100%"
              gap={2}
              mb={2}
              flexWrap="nowrap"
            >
              {row.columns.map((width: number, cIdx: number) => {
                const slotKey = `slot_${rIdx}_${cIdx}`;
                return (
                  <Box
                    key={cIdx}
                    sx={{
                      flexBasis: `${width}%`,
                      maxWidth: `${width}%`,
                      minWidth: `${width}%`,
                      background: "#fff",
                      border: "1px dashed #ccc",
                      borderRadius: 1,
                      textAlign: "center",
                      minHeight: 100,
                      p: 1,
                    }}
                  >
                    {widgetConfig[slotKey] ? (
                      <Typography fontWeight={500}>
                        {widgetConfig[slotKey]}
                      </Typography>
                    ) : (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setSelectedSlot({ row: rIdx, col: cIdx });
                          setOpenWidgetDialog(true);
                        }}
                        sx={{ color: "red", borderColor: "red" }}
                      >
                        + ADD WIDGET
                      </Button>
                    )}
                  </Box>
                );
              })}
            </Box>
          ))}
  
          {/* Footer */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            bgcolor="#e0e0e0"
            px={2}
            py={1}
            mt={2}
            borderRadius={1}
            >
            <Typography fontSize={13}>&copy; 2025 .comIQ Studio</Typography>
            <Box display="flex" alignItems="center" gap={2}>
                <PolicyIcon fontSize="small" />
                <HelpOutlineIcon fontSize="small" />
                <ContactSupportIcon fontSize="small" />
            </Box>
            </Box>

        </Paper>
      </Box>
    );
  };
  

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Box p={4} flexGrow={1}>
        <Typography variant="h5" fontWeight={600} mb={3}>Layout Designer IQ</Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box mt={4}>
          {activeStep === 0 && (
            <Grid container spacing={2}>
              {storeTypes.map((type) => (
                <Grid item xs={6} sm={3} key={type}>
                  <Button
                    variant={storeType === type ? "contained" : "outlined"}
                    fullWidth
                    onClick={() => setStoreType(type)}
                  >
                    {type}
                  </Button>
                </Grid>
              ))}
            </Grid>
          )}

          {activeStep === 1 && (
            <Grid container spacing={2}>
              {designTones.map((toneOpt) => (
                <Grid item xs={6} sm={3} key={toneOpt}>
                  <Button
                    variant={tone === toneOpt ? "contained" : "outlined"}
                    fullWidth
                    onClick={() => setTone(toneOpt)}
                  >
                    {toneOpt}
                  </Button>
                </Grid>
              ))}
            </Grid>
          )}

          {activeStep === 2 && (
            <Grid container spacing={2}>
              {pageTypes.map((type) => (
                <Grid item xs={6} sm={4} key={type}>
                  <Button
                    variant={pageType === type ? "contained" : "outlined"}
                    fullWidth
                    onClick={() => setPageType(type)}
                  >
                    {type}
                  </Button>
                </Grid>
              ))}
            </Grid>
          )}

          {activeStep === 3 && (
            <>
              <Grid container spacing={3}>
                {filteredLayouts.map((layout) => (
                  <Grid item xs={12} sm={6} md={4} key={layout.id}>
                    <Card
                      variant="outlined"
                      onClick={() => {
                        setSelectedLayout(layout);
                        setWidgetConfig({});
                      }}
                      sx={{ cursor: "pointer", backgroundColor: selectedLayout?.id === layout.id ? "#e3f2fd" : "#fff" }}
                    >
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>{layout.name}</Typography>
                        <Box>
                          <img
                            src={layout.thumbnail}
                            alt={layout.name}
                            onError={(e) => (e.currentTarget.src = "/images/layouts/default.png")}
                            style={{ width: "50%", borderRadius: 6 }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              {renderStructuredPreview()}
            </>
          )}

          <Box mt={4} display="flex" justifyContent="space-between">
            <Button disabled={activeStep === 0} onClick={handleBack}>Back</Button>
            {activeStep < steps.length - 1 ? (
              <Button variant="contained" onClick={handleNext}>Next</Button>
            ) : (
              <Button variant="contained" onClick={() => setOpenSaveDialog(true)}>Finish</Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* Save Layout Dialog */}
      <Dialog open={openSaveDialog} onClose={() => setOpenSaveDialog(false)}>
        <DialogTitle>Save Layout</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Layout Name"
            fullWidth
            value={layoutName}
            onChange={(e) => setLayoutName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            value={layoutDescription}
            onChange={(e) => setLayoutDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSaveDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveLayout}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Widget Picker Dialog */}
      <Dialog open={openWidgetDialog} onClose={() => setOpenWidgetDialog(false)}>
        <DialogTitle>Select Widget</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {widgetOptions.map((widget) => (
              <Grid item xs={6} key={widget}>
                <Button fullWidth variant="outlined" onClick={() => handleWidgetSelect(widget)}>
                  {widget}
                </Button>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>

      <Footer />
    </Box>
  );
}
