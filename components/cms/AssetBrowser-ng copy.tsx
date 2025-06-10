"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Drawer,
  Divider,
  Grid,
  Paper,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  TextField,
  Button,
  Pagination,
  AppBar,
  Toolbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { grey, red } from "@mui/material/colors";


const drawerWidth = 240;
const headerHeight = 80;
const footerHeight = 40;


export default function AssetBrowserNG() {
  const [stores, setStores] = useState<any[]>([]);
  const [selectedCatalogId, setSelectedCatalogId] = useState<number | null>(null);
  const [selectedCatalogName, setSelectedCatalogName] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryExpandMap, setCategoryExpandMap] = useState<Record<number, boolean>>({});
  const [productsMap, setProductsMap] = useState<Record<number, any[]>>({});
  const [skuMap, setSkuMap] = useState<Record<number, any[]>>({});
  const [selectedSku, setSelectedSku] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Pagination
  const [categoryPage, setCategoryPage] = useState(1);
  const [categoriesPerPage] = useState(5);
  const [productPageMap, setProductPageMap] = useState<Record<number, number>>({});

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/cms/stores")
      .then((res) => res.json())
      .then((data) => setStores(data));
  }, []);

  useEffect(() => {
    if (!selectedCatalogId) return;
    setLoading(true);

    fetch(`http://localhost:5000/api/v1/cms/catalogs/${selectedCatalogId}/categories`)
      .then((res) => res.json())
      .then((cats) => {
        setCategories(cats);
        const expandMap: Record<number, boolean> = {};
        cats.forEach((cat) => (expandMap[cat.id] = false));
        setCategoryExpandMap(expandMap);
        setCategoryPage(1);
        setLoading(false);
      });
  }, [selectedCatalogId]);

  const toggleCategory = async (catId: number) => {
    const newExpandMap: Record<number, boolean> = {};
    Object.keys(categoryExpandMap).forEach((id) => {
      newExpandMap[parseInt(id)] = parseInt(id) === catId;
    });
    setCategoryExpandMap(newExpandMap);

    if (!productsMap[catId]) {
      const products = await fetch(`http://localhost:5000/api/v1/cms/categories/${catId}/products`).then((r) => r.json());
      setProductsMap((prev) => ({ ...prev, [catId]: products }));
      setProductPageMap((prev) => ({ ...prev, [catId]: 1 }));

      for (const prod of products) {
        const skus = await fetch(`http://localhost:5000/api/v1/cms/products/${prod.id}/skus`).then((r) => r.json());
        setSkuMap((prev) => ({ ...prev, [prod.id]: skus }));
      }
    }
  };

  const handleCatalogSelect = (catalog: any) => {
    setSelectedCatalogId(catalog.catalog_id);
    setSelectedCatalogName(catalog.catalog_name);
    setProductsMap({});
    setSkuMap({});
  };

  const displayedCategories = categories.slice(
    (categoryPage - 1) * categoriesPerPage,
    categoryPage * categoriesPerPage
  );

  return (
    <Box sx={{ display: "flex", height: "100vh", background: "#f6f8fb" }}>

       {/* Header */}
       <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(90deg, #ffffff, #e5e7eb)',
          height: headerHeight,
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: headerHeight }}>
          <Box display="flex" flexDirection="column" gap={0.5}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: grey[800] }}>
              <img src="/images/rbm-logo.svg" alt="RBM Logo" style={{ height: 22, marginRight: 8, verticalAlign: 'middle' }} />
              .comIQ Studio
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: grey[600],
                fontStyle: 'italic',
                fontSize: '0.875rem',
                lineHeight: 1.2,
              }}
            >
              Content Orchestration & Release Engine — Powerful, AI-driven content deployment workspace
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2" sx={{ color: grey[700] }}>Hello, Admin</Typography>
            <Button
              variant="outlined"
              size="small"
              sx={{
                color: red[600],
                borderColor: red[400],
                textTransform: 'uppercase',
                '&:hover': {
                  borderColor: red[600],
                  backgroundColor: red[50],
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      
      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          background: "#fff",
          borderRight: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Catalogs
        </Typography>
        {stores.map((store) =>
          store.catalogs.map((cat: any) => (
            <Chip
              key={cat.catalog_id}
              label={cat.catalog_name}
              onClick={() => handleCatalogSelect(cat)}
              color={selectedCatalogId === cat.catalog_id ? "primary" : "default"}
              variant="outlined"
              sx={{ mb: 1, cursor: "pointer" }}
            />
          ))
        )}
      </Box>

      {/* Main Panel */}
      <Box sx={{ flexGrow: 1, p: 3, overflowY: "auto", position: "relative" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">
            {selectedCatalogName || "Select a Catalog"}
          </Typography>
          <IconButton onClick={() => setFilterDrawerOpen(true)} title="Filters">
            <FilterAltIcon />
          </IconButton>
        </Box>

        {loading ? (
          <CircularProgress />
        ) : (
          displayedCategories.map((cat) => {
            const products = productsMap[cat.id] || [];
            const productPage = productPageMap[cat.id] || 1;
            const productsPerPage = 4;
            const paginatedProducts = products.slice(
              (productPage - 1) * productsPerPage,
              productPage * productsPerPage
            );

            return (
              <Box key={cat.id} mb={3}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    background: "#fff",
                    p: 2,
                    borderRadius: 1,
                    border: "1px solid #ccc",
                    cursor: "pointer",
                  }}
                  onClick={() => toggleCategory(cat.id)}
                >
                  <Typography variant="h6">{cat.name}</Typography>
                  <IconButton>{categoryExpandMap[cat.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
                </Box>

                <Collapse in={categoryExpandMap[cat.id]}>
                  <Box mt={2} pl={3}>
                    {paginatedProducts.map((prod) => (
                      <Paper key={prod.id} sx={{ mb: 2, p: 2, background: "#fafafa" }}>
                        <Typography fontWeight={600}>{prod.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {prod.description}
                        </Typography>

                        <Box mt={1}>
                          {(skuMap[prod.id] || []).map((sku) => (
                            <Chip
                              key={sku.id}
                              label={sku.sku_code}
                              onClick={() => setSelectedSku(sku)}
                              sx={{ mr: 1, mb: 1 }}
                            />
                          ))}
                        </Box>
                      </Paper>
                    ))}
                    {products.length > productsPerPage && (
                      <Box display="flex" justifyContent="center" mt={2}>
                        <Pagination
                          count={Math.ceil(products.length / productsPerPage)}
                          page={productPage}
                          onChange={(_, val) =>
                            setProductPageMap((prev) => ({ ...prev, [cat.id]: val }))
                          }
                          shape="rounded"
                          color="primary"
                          sx={{
                            "& .MuiPaginationItem-root": {
                              color: "#c62828",
                              borderColor: "#ffcdd2",
                            },
                            "& .Mui-selected": {
                              backgroundColor: "#c62828",
                              color: "#fff",
                              "&:hover": {
                                backgroundColor: "#b71c1c",
                              },
                            },
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </Collapse>
              </Box>
            );
          })
        )}

        {/* Pagination for categories */}
        {categories.length > categoriesPerPage && (
          <Box mt={3} display="flex" justifyContent="center" alignItems="center">
            <Pagination
              count={Math.ceil(categories.length / categoriesPerPage)}
              page={categoryPage}
              onChange={(_, val) => setCategoryPage(val)}
              shape="rounded"
              color="primary"
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#c62828",
                  borderColor: "#ffcdd2",
                },
                "& .Mui-selected": {
                  backgroundColor: "#c62828",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#b71c1c",
                  },
                },
              }}
              showFirstButton
              showLastButton
            />
            <Typography variant="caption" ml={2}>
              Page {categoryPage} of {Math.ceil(categories.length / categoriesPerPage)}
            </Typography>
          </Box>
        )}
      </Box>

      {/* SKU Detail Drawer */}
      <Drawer
        anchor="right"
        open={!!selectedSku}
        onClose={() => setSelectedSku(null)}
        PaperProps={{ sx: { width: 400 } }}
      >
        <Box p={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">SKU Details</Typography>
            <IconButton onClick={() => setSelectedSku(null)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ my: 2 }} />

          {selectedSku ? (
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {selectedSku.sku_code}
              </Typography>
              <Typography>Price: ₹{selectedSku.price}</Typography>
              <Typography>Stock: {selectedSku.stock}</Typography>

              <Typography mt={2} fontWeight={600}>
                Attributes
              </Typography>
              {selectedSku.dynamic_attributes &&
                Object.entries(selectedSku.dynamic_attributes).map(([key, val]) => (
                  <Typography key={key} variant="body2">
                    {key}: {Array.isArray(val) ? val.join(", ") : val}
                  </Typography>
                ))}
            </Box>
          ) : null}
        </Box>
      </Drawer>

      {/* Filter Drawer */}
      <Drawer
        anchor="top"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        PaperProps={{ sx: { p: 3 } }}
      >
        <Typography variant="h6" gutterBottom>
          🔍 Search & Filter Assets
        </Typography>
        <TextField label="Search Prompt" fullWidth sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField label="Min Price" fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Max Price" fullWidth />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button variant="outlined" onClick={() => setFilterDrawerOpen(false)} sx={{ mr: 1 }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary">
            Apply Filters
          </Button>
        </Box>
      </Drawer>

      {/* Footer */}
      <Box
              component="footer"
              sx={{
                backgroundColor: grey[200],
                textAlign: 'center',
                py: 1,
                borderTop: '1px solid #d1d5db',
                fontSize: '0.75rem',
                color: grey[600],
                height: footerHeight,
              }}
            >
              © 2025 RBM .comIQ Studio. All rights reserved.
            </Box>
    </Box>
  );
}
