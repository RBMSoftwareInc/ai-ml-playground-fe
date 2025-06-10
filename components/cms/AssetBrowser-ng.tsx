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
  TextField,
  Button,
  Pagination,
  PaginationItem,
  AppBar,
  Toolbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from 'next/navigation';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { grey, red } from "@mui/material/colors";
import Header from "./Header";
import Footer from "./Footer";

const PAGE_SIZE = 5;
const PRODUCTS_PER_PAGE = 12;

const drawerWidth = 240;
const headerHeight = 80;
const footerHeight = 40;

export default function AssetBrowserNG() {
  const router = useRouter();

  const [stores, setStores] = useState<any[]>([]);
  const [selectedCatalogId, setSelectedCatalogId] = useState<number | null>(null);
  const [selectedCatalogName, setSelectedCatalogName] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [productsMap, setProductsMap] = useState<Record<number, any[]>>({});
  const [skuMap, setSkuMap] = useState<Record<number, any[]>>({});
  const [selectedSku, setSelectedSku] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [promptOpen, setPromptOpen] = useState(false);

  const [catPage, setCatPage] = useState(1);
  const [prodPageMap, setProdPageMap] = useState<Record<number, number>>({});

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/cms/stores")
      .then((res) => res.json())
      .then((data) => setStores(data));
  }, []);

  useEffect(() => {
    if (!selectedCatalogId) return;
    fetch(`http://localhost:5000/api/v1/cms/catalogs/${selectedCatalogId}/categories`)
      .then((res) => res.json())
      .then((cats) => {
        setCategories(cats);
        setActiveCategoryId(null);
        setCatPage(1);
      });
  }, [selectedCatalogId]);

  const toggleCategory = async (cat: any) => {
    const catId = cat.id;
    const isSame = catId === activeCategoryId;

    setActiveCategoryId(isSame ? null : catId);

    if (!isSame && !productsMap[catId]) {
      const products = await fetch(`http://localhost:5000/api/v1/cms/categories/${catId}/products`).then((r) => r.json());
      setProductsMap((prev) => ({ ...prev, [catId]: products }));
      setProdPageMap((prev) => ({ ...prev, [catId]: 1 }));

      for (const prod of products) {
        const skus = await fetch(`http://localhost:5000/api/v1/cms/products/${prod.id}/skus`).then((r) => r.json());
        setSkuMap((prev) => ({ ...prev, [prod.id]: skus }));
      }
    }
  };

  const paginatedCategories = categories.slice((catPage - 1) * PAGE_SIZE, catPage * PAGE_SIZE);

  const handleLogout = () => {
    // Implement logout logic here, e.g., clear auth tokens and redirect
    router.push('/login');
  };


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <Header onLogout={handleLogout} />
    
    <Box sx={{ display: "flex", height: "100vh", background: "#f6f8fb" }}>
        {/* Sidebar */}
        <Box sx={{ width: 240, background: "#fff", borderRight: "1px solid #ddd", p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Catalogs</Typography>
          {stores.map((store) => store.catalogs.map((cat: any) => (
            <Chip
              key={cat.catalog_id}
              label={cat.catalog_name}
              onClick={() => {
                setSelectedCatalogId(cat.catalog_id);
                setSelectedCatalogName(cat.catalog_name);
              } }
              color={selectedCatalogId === cat.catalog_id ? "primary" : "default"}
              variant="outlined"
              sx={{ mb: 1, cursor: "pointer" }} />
          ))
          )}
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, p: 3, overflowY: "auto" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">{selectedCatalogName || "Select a Catalog"}</Typography>
            <Button variant="outlined" startIcon={<FilterAltIcon />} onClick={() => setPromptOpen(true)}>Prompt & Filter</Button>
          </Box>

          {paginatedCategories.map((cat) => {
            const products = productsMap[cat.id] || [];
            const currentProdPage = prodPageMap[cat.id] || 1;
            const paginatedProducts = products.slice((currentProdPage - 1) * PRODUCTS_PER_PAGE, currentProdPage * PRODUCTS_PER_PAGE);

            return (
              <Box key={cat.id} mb={4}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ background: "#fff", p: 2, borderRadius: 1, border: "1px solid #ccc" }}
                  onClick={() => toggleCategory(cat)}
                >
                  <Typography
                    variant="h6"
                    sx={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategory(cat);
                    } }
                  >
                    {cat.name}
                  </Typography>
                  <IconButton>{activeCategoryId === cat.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
                </Box>

                <Collapse in={activeCategoryId === cat.id}>
                  <Box mt={2} pl={2}>
                    <Grid container spacing={2}>
                      {paginatedProducts.map((prod) => (
                        <Grid item xs={6} sm={4} md={3} key={prod.id}>
                          <Paper
                            elevation={3}
                            sx={{ p: 2, textAlign: "center", cursor: "pointer" }}
                            onClick={() => setSelectedSku({ ...prod, skus: skuMap[prod.id] || [] })}
                          >
                            <img
                              src={`https://picsum.photos/seed/${prod.id}/80/80`}
                              alt={prod.name}
                              style={{ width: 60, height: 60, borderRadius: "50%", marginBottom: 8, objectFit: "cover" }} />
                            <Typography fontWeight={600}>{prod.name}</Typography>
                            <Typography variant="caption">
                              {(skuMap[prod.id] || []).length} SKUs
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                    <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="caption">
                        Showing {paginatedProducts.length} of {products.length} products
                      </Typography>
                      <Pagination
                        page={currentProdPage}
                        count={Math.ceil(products.length / PRODUCTS_PER_PAGE)}
                        onChange={(_, val) => setProdPageMap((prev) => ({ ...prev, [cat.id]: val }))}
                        color="primary"
                        sx={{ "& .MuiPaginationItem-root": { color: "#4b4f58" } }} />
                    </Box>
                  </Box>
                </Collapse>
              </Box>
            );
          })}

          <Box mt={3} display="flex" justifyContent="center">
            <Pagination
              page={catPage}
              count={Math.ceil(categories.length / PAGE_SIZE)}
              onChange={(_, val) => setCatPage(val)}
              color="primary"
              sx={{ "& .MuiPaginationItem-root": { color: "#4b4f58" } }} />
          </Box>
        </Box>

        {/* SKU Drawer */}
        <Drawer anchor="right" open={!!selectedSku} onClose={() => setSelectedSku(null)} PaperProps={{ sx: { width: 400 } }}>
          <Box p={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{selectedSku?.name}</Typography>
              <IconButton onClick={() => setSelectedSku(null)}><CloseIcon /></IconButton>
            </Box>
            <Divider sx={{ my: 2 }} />
            <img src={`https://picsum.photos/seed/${selectedSku?.id}/400/200`} alt="Product" style={{ width: "100%", borderRadius: 8 }} />
            <Typography mt={2} variant="subtitle2">Description</Typography>
            <Typography variant="body2">{selectedSku?.description}</Typography>
            <Typography mt={2} fontWeight={600}>Dynamic Attributes</Typography>
            {selectedSku?.dynamic_attributes &&
              Object.entries(selectedSku.dynamic_attributes).map(([key, val]) => (
                <Typography key={key} variant="body2">{key}: {Array.isArray(val) ? val.join(", ") : val}</Typography>
              ))}
            <Divider sx={{ my: 2 }} />
            <Typography fontWeight={600}>SKUs</Typography>
            {(selectedSku?.skus || []).map((sku: any) => (
              <Chip key={sku.id} label={sku.sku_code} sx={{ mr: 1, mt: 1 }} />
            ))}
          </Box>
        </Drawer>

        {/* Category Info Drawer */}
        <Drawer anchor="right" open={!!selectedCategory} onClose={() => setSelectedCategory(null)} PaperProps={{ sx: { width: 350 } }}>
          <Box p={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Category Info</Typography>
              <IconButton onClick={() => setSelectedCategory(null)}><CloseIcon /></IconButton>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2">Name:</Typography>
            <Typography>{selectedCategory?.name}</Typography>
            <Typography mt={2} variant="subtitle2">Description:</Typography>
            <Typography variant="body2">{selectedCategory?.description}</Typography>
            <Typography mt={2} fontWeight={600}>Dynamic Attributes</Typography>
            {selectedCategory?.dynamic_attributes &&
              Object.entries(selectedCategory.dynamic_attributes).map(([key, val]) => (
                <Typography key={key} variant="body2">{key}: {Array.isArray(val) ? val.join(", ") : val}</Typography>
              ))}
          </Box>
        </Drawer>

        {/* Prompt & Filter Drawer */}
        <Drawer anchor="right" open={promptOpen} onClose={() => setPromptOpen(false)} PaperProps={{ sx: { width: 360 } }}>
          <Box p={2}>
            <Typography variant="h6" mb={2}>AI Prompt & Filters</Typography>
            <TextField fullWidth multiline rows={4} placeholder="Ask something like: Show me best rated summer jackets..." />
            <Button fullWidth variant="contained" sx={{ mt: 2 }}>Run Prompt</Button>
          </Box>
        </Drawer>

        
      </Box>

      {/* Footer */}
      <Footer />
      
      </Box>
  );
}
