"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function BCCStyleAssetExplorer() {
  const [stores, setStores] = useState<any[]>([]);
  const [catalogs, setCatalogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [storeView, setStoreView] = useState(true);
  const [catalogView, setCatalogView] = useState(false);
  const [categoryView, setCategoryView] = useState(false);
  const [productView, setProductView] = useState(false);

  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [selectedCatalog, setSelectedCatalog] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/cms/stores")
      .then((res) => res.json())
      .then((data) => setStores(data));
  }, []);

  const loadCatalogs = (store: any) => {
    setSelectedStore(store);
    setCatalogs(store.catalogs);
    setStoreView(false);
    setCatalogView(true);
  };

  const loadCategories = async (catalog: any) => {
    const res = await fetch(`http://localhost:5000/api/v1/cms/catalogs/${catalog.catalog_id}/categories`);
    const cats = await res.json();
    setSelectedCatalog(catalog);
    setCategories(cats);
    setCatalogView(false);
    setCategoryView(true);
  };

  const loadProducts = async (category: any) => {
    const res = await fetch(`http://localhost:5000/api/v1/cms/categories/${category.id}/products`);
    const prods = await res.json();
    setSelectedCategory(category);
    setProducts(prods);
    setCategoryView(false);
    setProductView(true);
  };

  const goBack = () => {
    if (productView) {
      setProductView(false);
      setCategoryView(true);
    } else if (categoryView) {
      setCategoryView(false);
      setCatalogView(true);
    } else if (catalogView) {
      setCatalogView(false);
      setStoreView(true);
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", background: "#f6f8fb", p: 3 }}>
      <Box sx={{ width: 420, background: "#fff", p: 2, borderRadius: 2 }}>
        {(catalogView || categoryView || productView) && (
          <IconButton onClick={goBack}>
            <ArrowBackIcon />
          </IconButton>
        )}

        {storeView && (
          <>
            <Typography variant="h6">Select Store</Typography>
            <Divider sx={{ my: 1 }} />
            <List>
              {stores.map((s) => (
                <ListItem button key={s.store} onClick={() => loadCatalogs(s)}>
                  <ListItemText primary={s.store} />
                </ListItem>
              ))}
            </List>
          </>
        )}

        {catalogView && (
          <>
            <Typography variant="h6">Catalogs of {selectedStore.store}</Typography>
            <Divider sx={{ my: 1 }} />
            <List>
              {catalogs.map((c: any) => (
                <ListItem button key={c.catalog_id} onClick={() => loadCategories(c)}>
                  <ListItemText primary={c.catalog_name} />
                </ListItem>
              ))}
            </List>
          </>
        )}

        {categoryView && (
          <>
            <Typography variant="h6">Categories in {selectedCatalog.catalog_name}</Typography>
            <Divider sx={{ my: 1 }} />
            <List>
              {categories.map((cat) => (
                <ListItem button key={cat.id} onClick={() => loadProducts(cat)}>
                  <ListItemText primary={cat.name} />
                </ListItem>
              ))}
            </List>
          </>
        )}

        {productView && (
          <>
            <Typography variant="h6">Products in {selectedCategory.name}</Typography>
            <Divider sx={{ my: 1 }} />
            <List>
              {products.map((p) => (
                <ListItem key={p.id}>
                  <ListItemText primary={p.name} secondary={p.description || "No description"} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Box>

      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Typography variant="h4" gutterBottom>
          RBM BCC Style Viewer
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore assets by drilling down through Stores → Catalogs → Categories → Products, all in the left panel.
        </Typography>
      </Box>
    </Box>
  );
}
