"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Divider,
  TextField,
  Button,
  Tabs,
  Tab,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PushPinIcon from "@mui/icons-material/PushPin";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RateReviewIcon from "@mui/icons-material/RateReview";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import AIPromptWidget from "./AIPromptWidget";

interface Asset {
  id?: string;
  catalog_id?: string;
  category_id?: string;
  name?: string;
  store?: string;
  catalog_name?: string;
  sku_code?: string;
  label: string;
  description?: string;
  image?: string;
  catalogs?: Asset[];
  categories?: Asset[];
  products?: Asset[];
  skus?: Asset[];
  images?: Asset[];
  dynamic_attributes?: { [key: string]: any };
  type?: string;
  [key: string]: any;
}

export default function SmartFlipAssetBrowser() {
  const [currentLeftPanelItems, setCurrentLeftPanelItems] = useState<Asset[]>([]);
  const [leftPanelStack, setLeftPanelStack] = useState<Asset[][]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<{ type: string; value: string; id?: string }[]>([]);
  const [currentLevelData, setCurrentLevelData] = useState<Asset[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [modalAsset, setModalAsset] = useState<Asset | null>(null);
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"forward" | "backward">("forward");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [productImages, setProductImages] = useState<Asset[]>([]);
  const [pinnedAssets, setPinnedAssets] = useState<Asset[]>([]);
  const [aiPromptOpen, setAiPromptOpen] = useState(false);
  const [originalLeftPanelItems, setOriginalLeftPanelItems] = useState<Asset[]>([]);

  useEffect(() => {
    console.log("[State Update] currentLeftPanelItems:", currentLeftPanelItems);
    console.log("[State Update] leftPanelStack:", leftPanelStack);
    console.log("[State Update] breadcrumbs:", breadcrumbs);
  }, [currentLeftPanelItems, leftPanelStack, breadcrumbs]);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const catalogsRes = await fetch("http://localhost:5000/api/v1/cms/catalogs");
        if (!catalogsRes.ok) {
          throw new Error(`Catalogs API failed with status: ${catalogsRes.status}`);
        }
        const catalogs = await catalogsRes.json();
        console.log("[Initial Load] Raw catalogs response:", catalogs);

        const normalizedCatalogs = catalogs.map((cat: any, index: number) => {
          const catalogId = cat.id || cat.catalog_id || cat.catalogId || cat.CatalogID || `catalog-${index}`;
          const normalizedCat = {
            ...cat,
            id: catalogId,
            label: cat.catalog_name || cat.catalogName || cat.name || "Unnamed Catalog",
            categories: cat.categories || [],
            type: "catalog",
          };
          console.log("[Initial Load] Normalized catalog:", normalizedCat);
          return normalizedCat;
        });
        console.log("[Initial Load] Normalized catalogs:", normalizedCatalogs);

        setCurrentLeftPanelItems(normalizedCatalogs);
        setOriginalLeftPanelItems(normalizedCatalogs);
        setLeftPanelStack([]);
      } catch (error) {
        console.error("[Initial Load] Error:", error);
        setCurrentLeftPanelItems([]);
        setOriginalLeftPanelItems([]);
        setLeftPanelStack([]);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const fetchProductImages = async () => {
      if (selectedAsset?.type === "product" && selectedAsset.id) {
        setLoading(true);
        try {
          const res = await fetch(`http://localhost:5000/api/v1/cms/products/${selectedAsset.id}/images`);
          if (!res.ok) {
            throw new Error(`Product images API failed with status: ${res.status}`);
          }
          const images = await res.json();
          console.log("[fetchProductImages] Images response:", images);
          const normalizedImages = images.map((img: any, index: number) => ({
            ...img,
            id: img.id || `image-${index}`,
            image: img.url || img.image || "placeholder.jpg",
            label: img.name || `Image ${index + 1}`,
          }));
          setProductImages(normalizedImages);
        } catch (error) {
          console.error("[fetchProductImages] Error:", error);
          setProductImages([]);
        } finally {
          setLoading(false);
        }
      } else {
        setProductImages([]);
      }
    };

    fetchProductImages();
  }, [selectedAsset]);

  useEffect(() => {
    if (currentLevelData.length > 0) {
      const filtered = currentLevelData.filter((product) =>
        (product.label || "").toLowerCase().includes(productSearchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
      setPage(0);
    }
  }, [currentLevelData, productSearchQuery]);

  const handleFlipForward = async (item: Asset) => {
    console.log("[handleFlipForward] Item:", item);
    const itemId = item.id || item.catalog_id || item.category_id || item.product_id;
    if (!itemId) {
      console.error("[handleFlipForward] Item ID is undefined:", item);
      return;
    }

    let url = "";
    let nextLevelItems: Asset[] = [];
    let childType = "";

    if (item.type === "catalog") {
      url = `http://localhost:5000/api/v1/cms/catalogs/${itemId}/categories`;
      childType = "category";
    } else if (item.type === "category") {
      url = `http://localhost:5000/api/v1/cms/categories/${itemId}/products`;
      childType = "product";
    } else if (item.type === "product") {
      url = `http://localhost:5000/api/v1/cms/products/${itemId}/skus`;
      childType = "sku";
    } else {
      console.error("[handleFlipForward] Unknown item type:", item.type);
      return;
    }

    console.log(`[handleFlipForward] Fetching ${childType}s for ${item.label} (ID: ${itemId})`);
    setLoading(true);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`${childType}s API failed with status: ${res.status}`);
      }
      let data = await res.json();
      console.log(`[handleFlipForward] ${childType}s response for ${item.label}:`, data);
      if (!Array.isArray(data)) {
        console.error(`[handleFlipForward] ${childType}s response is not an array:`, data);
        data = [];
      }

      nextLevelItems = data.map((child: any, index: number) => {
        let childId = child.id || child[`${childType}_id`] || child[`${childType}Id`] || `${childType}-${index}`;
        let childLabel = child.name || child[`${childType}_name`] || child.sku_code || `Unnamed ${childType}`;
        return {
          ...child,
          id: childId,
          label: childLabel,
          type: childType,
          products: childType === "category" ? child.products || [] : undefined,
          skus: childType === "product" ? child.skus || [] : undefined,
        };
      });
      console.log(`[handleFlipForward] Normalized ${childType}s:`, nextLevelItems);

      setLeftPanelStack((prev) => {
        const newStack = [...prev, [...currentLeftPanelItems]];
        console.log("[handleFlipForward] Updated leftPanelStack:", newStack);
        return newStack;
      });
      setCurrentLeftPanelItems([...nextLevelItems]);
      setOriginalLeftPanelItems([...nextLevelItems]);
      setBreadcrumbs((prev) => [...prev, { type: item.type, value: item.label, id: itemId }]);
      setCurrentLevelData([]);
      setSelectedAsset(null);
      setFlipDirection("forward");
      setProductSearchQuery("");
    } catch (error) {
      console.error(`[handleFlipForward] Error fetching ${childType}s:`, error);
      setCurrentLeftPanelItems([]);
      setOriginalLeftPanelItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetails = async (item: Asset) => {
    console.log("[handleShowDetails] Item:", item);
    const itemId = item.id || item.catalog_id || item.category_id || item.product_id;
    if (!itemId) {
      console.error("[handleShowDetails] Item ID is undefined:", item);
      return;
    }

    let url = "";
    let childType = "";

    if (item.type === "catalog") {
      url = `http://localhost:5000/api/v1/cms/catalogs/${itemId}/categories`;
      childType = "category";
    } else if (item.type === "category") {
      url = `http://localhost:5000/api/v1/cms/categories/${itemId}/products`;
      childType = "product";
    } else if (item.type === "product") {
      url = `http://localhost:5000/api/v1/cms/products/${itemId}/skus`;
      childType = "sku";
    } else {
      console.error("[handleShowDetails] Unknown item type:", item.type);
      return;
    }

    console.log(`[handleShowDetails] Fetching ${childType}s for ${item.label} (ID: ${itemId})`);
    setLoading(true);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`${childType}s API failed with status: ${res.status}`);
      }
      const data = await res.json();
      console.log(`[handleShowDetails] ${childType}s response for ${item.label}:`, data);
      const normalizedData = data.map((child: any, index: number) => {
        let childId = child.id || child[`${childType}_id`] || child[`${childType}Id`] || `${childType}-${index}`;
        let childLabel = child.name || child[`${childType}_name`] || child.sku_code || `Unnamed ${childType}`;
        return {
          ...child,
          id: childId,
          label: childLabel,
          type: childType,
        };
      });

      setSelectedAsset(item);
      setCurrentLevelData(normalizedData);
      setBreadcrumbs((prev) => {
        const newBreadcrumbs = prev.filter((crumb) => crumb.id !== itemId);
        return [...newBreadcrumbs, { type: item.type, value: item.label, id: itemId }];
      });
      setProductSearchQuery("");
    } catch (error) {
      console.error(`[handleShowDetails] Error fetching ${childType}s:`, error);
      setCurrentLevelData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSkuClick = (sku: Asset) => {
    console.log("[handleSkuClick] Opening modal for SKU:", sku);
    setModalAsset(sku);
  };

  const handleLeftPanelBack = () => {
    if (leftPanelStack.length === 0) {
      console.log("[handleLeftPanelBack] At root level, cannot go back further");
      return;
    }

    const newStack = [...leftPanelStack];
    newStack.pop();
    const previousItems = newStack[newStack.length - 1] || originalLeftPanelItems;

    console.log("[handleLeftPanelBack] Current leftPanelStack before pop:", leftPanelStack);
    console.log("[handleLeftPanelBack] New leftPanelStack after pop:", newStack);
    console.log("[handleLeftPanelBack] Going back, previous items:", previousItems);

    setLeftPanelStack(newStack);
    setCurrentLeftPanelItems([...previousItems]);
    setOriginalLeftPanelItems([...previousItems]);
    setBreadcrumbs((prev) => {
      const newBreadcrumbs = prev.slice(0, -1);
      console.log("[handleLeftPanelBack] Updated breadcrumbs:", newBreadcrumbs);
      return newBreadcrumbs;
    });
    setCurrentLevelData([]);
    setSelectedAsset(null);
    setFlipDirection("backward");
    setProductSearchQuery("");
  };

  const handleBreadcrumbClick = (index: number) => {
    const targetCrumb = breadcrumbs[index];
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);

    const item = {
      id: targetCrumb.id,
      label: targetCrumb.value,
      type: targetCrumb.type,
    };
    handleShowDetails(item);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePinAsset = (item: Asset) => {
    if (!pinnedAssets.find((asset) => asset.id === item.id)) {
      setPinnedAssets((prev) => [...prev, item]);
      console.log("[handlePinAsset] Pinned asset:", item);
    }
  };

  const handlePinnedAssetClick = (item: Asset) => {
    setCurrentLeftPanelItems([item]);
  };

  const handleClearLeftPane = () => {
    setCurrentLeftPanelItems([...originalLeftPanelItems]);
  };

  const handleAiPromptSubmit = (prompt: string) => {
    console.log("[handleAiPromptSubmit] AI Prompt:", prompt);
    setAiPromptOpen(false);
  };

  const hasChildren = (item: Asset) => {
    if (item.type === "catalog") {
      return true;
    } else if (item.type === "category") {
      return item.products && item.products.length > 0;
    } else if (item.type === "product") {
      return item.skus && item.skus.length > 0;
    }
    return false;
  };

  const renderDynamicAttributeValue = (key: string, value: any, depth: number = 0): JSX.Element => {
    const indent = depth * 16;

    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return (
        <Typography sx={{ ml: `${indent}px` }}>
          {value.toString()}
        </Typography>
      );
    } else if (Array.isArray(value)) {
      return (
        <Box sx={{ ml: `${indent}px` }}>
          <List dense>
            {value.map((item, index) => (
              <ListItem key={index}>
                <ListItemText>
                  {typeof item === "object" ? renderDynamicAttributeValue(`${index}`, item, depth + 1) : item.toString()}
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </Box>
      );
    } else if (typeof value === "object" && value !== null) {
      if (value.id && value.label) {
        return (
          <Typography sx={{ ml: `${indent}px`, color: "#d32f2f", textDecoration: "underline" }}>
            {value.label}
          </Typography>
        );
      } else {
        return (
          <Box sx={{ ml: `${indent}px` }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Property</TableCell>
                    <TableCell>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(value).map(([subKey, subValue]) => (
                    <TableRow key={subKey}>
                      <TableCell>{subKey}</TableCell>
                      <TableCell>
                        {renderDynamicAttributeValue(subKey, subValue, depth + 1)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );
      }
    }
    return (
      <Typography sx={{ ml: `${indent}px` }}>
        N/A
      </Typography>
    );
  };

  const getCurrentLevelLabel = () => {
    if (leftPanelStack.length === 0) return "Catalogs";
    if (leftPanelStack.length === 1) return "Categories";
    if (leftPanelStack.length === 2) return "Products";
    return "SKUs";
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", background: "#f5f5f5" }}>
      <Box
        sx={{
          width: "100%",
          height: 60,
          background: "#ffffff",
          border: "1px solid #616161",
          boxShadow: "0 2px 4px rgba(224, 224, 224, 0.5)",
          display: "flex",
          alignItems: "center",
          px: 2,
          overflowX: "auto",
          mb: 2,
        }}
      >
        <Typography sx={{ color: "#616161", fontWeight: 500, mr: 2 }}>
          Pinned Assets:
        </Typography>
        {pinnedAssets.length === 0 ? (
          <Typography sx={{ color: "#616161" }}>No assets pinned</Typography>
        ) : (
          pinnedAssets.map((asset) => (
            <Box
              key={asset.id}
              sx={{
                background: "#f5f5f5",
                borderRadius: "4px",
                border: "1px solid #e0e0e0",
                px: 1,
                py: 0.5,
                mr: 1,
                display: "inline-flex",
                alignItems: "center",
                cursor: "pointer",
                "&:hover": {
                  background: "#e0e0e0",
                },
              }}
              onClick={() => handlePinnedAssetClick(asset)}
            >
              <Typography sx={{ color: "#616161", fontSize: "14px" }}>
                {asset.label}
              </Typography>
            </Box>
          ))
        )}
      </Box>

      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Box
          sx={{
            width: 300,
            background: "#ffffff",
            borderRight: "1px solid #616161",
            p: 2,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ color: "#616161", fontWeight: 500 }}>
              {getCurrentLevelLabel()}
            </Typography>
            {currentLeftPanelItems.length === 1 && (
              <IconButton onClick={handleClearLeftPane} sx={{ color: "#d32f2f" }}>
                <ClearIcon />
              </IconButton>
            )}
          </Box>
          {leftPanelStack.length > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <IconButton onClick={handleLeftPanelBack} sx={{ color: "#d32f2f" }}>
                <ArrowBackIosNewIcon />
              </IconButton>
              <Typography sx={{ color: "#d32f2f" }}>Back</Typography>
            </Box>
          )}
          <Box
            sx={{
              opacity: 1,
              transition: "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
              animation: flipDirection === "forward" ? "slideInRight 0.3s" : "slideInLeft 0.3s",
              flexGrow: 1,
            }}
          >
            <style>
              {`
                @keyframes slideInRight {
                  from { transform: translateX(100%); opacity: 0; }
                  to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideInLeft {
                  from { transform: translateX(-100%); opacity: 0; }
                  to { transform: translateX(0); opacity: 1; }
                }
              `}
            </style>
            {loading ? (
              <Typography sx={{ color: "#616161" }}>Loading...</Typography>
            ) : currentLeftPanelItems.length === 0 ? (
              <Typography sx={{ color: "#616161" }}>No items to display</Typography>
            ) : (
              currentLeftPanelItems.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                    p: 1,
                    borderRadius: "8px",
                    background: "#f5f5f5",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 1px 3px rgba(224, 224, 224, 0.5)",
                    transition: "background 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      background: "#e0e0e0",
                      boxShadow: "0 2px 6px rgba(224, 224, 224, 0.7)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      flexGrow: 1,
                      cursor: "pointer",
                      color: "#616161",
                      fontSize: "14px",
                      fontWeight: 400,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`[Item Click] ${item.label}, stack length: ${leftPanelStack.length}`);
                      handleShowDetails(item);
                    }}
                  >
                    {item.label}
                  </Typography>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePinAsset(item);
                    }}
                    sx={{ color: "#d32f2f" }}
                  >
                    <PushPinIcon />
                  </IconButton>
                  {hasChildren(item) && (
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(`[Arrow Click] ${item.label}, stack length: ${leftPanelStack.length}`);
                        handleFlipForward(item);
                      }}
                      sx={{ color: "#d32f2f" }}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  )}
                </Box>
              ))
            )}
          </Box>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            position: "relative",
            overflow: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100%",
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              {breadcrumbs.length > 0 && (
                <Box display="flex" alignItems="center">
                  {breadcrumbs.map((crumb, index) => (
                    <Box key={crumb.id} display="flex" alignItems="center">
                      <Typography
                        sx={{
                          cursor: "pointer",
                          color: "#d32f2f",
                          textDecoration: "underline",
                        }}
                        onClick={() => handleBreadcrumbClick(index)}
                      >
                        {crumb.value}
                      </Typography>
                      {index < breadcrumbs.length - 1 && (
                        <Typography sx={{ mx: 1, color: "#616161" }}>></Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              )}
              <Box sx={{ flexGrow: 1 }} />
              <Typography
                sx={{
                  color: "#d32f2f",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onClick={() => setAiPromptOpen(true)}
              >
                Enhance with AI
              </Typography>
            </Box>

            <Divider sx={{ mb: 2, borderColor: "#e0e0e0" }} />

            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {loading ? (
                <Typography sx={{ color: "#616161" }}>Loading...</Typography>
              ) : !selectedAsset ? (
                <Typography sx={{ color: "#616161" }}>No asset is selected</Typography>
              ) : (
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    animation: "fadeIn 0.5s",
                    background: "#ffffff",
                    border: "1px solid #e0e0e0",
                    width: "100%",
                  }}
                >
                  <style>
                    {`
                      @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                      }
                    `}
                  </style>
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography variant="h6" sx={{ color: "#616161" }}>
                      {selectedAsset.label}
                    </Typography>
                  </Box>
                  <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                    <Tab label="General" sx={{ color: "#616161", "&.Mui-selected": { color: "#d32f2f" } }} />
                    <Tab label="Attributes" sx={{ color: "#616161", "&.Mui-selected": { color: "#d32f2f" } }} />
                    <Tab label="Child Items" sx={{ color: "#616161", "&.Mui-selected": { color: "#d32f2f" } }} />
                    <Tab label="Media" sx={{ color: "#616161", "&.Mui-selected": { color: "#d32f2f" } }} />
                  </Tabs>
                  {tabValue === 0 && (
                    <Box>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ color: "#616161" }}>Property</TableCell>
                              <TableCell sx={{ color: "#616161" }}>Value</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {Object.entries(selectedAsset).map(([key, value]) => {
                              if (key === "id" || key === "type" || key === "products" || key === "skus" || key === "categories" || key === "images" || key === "dynamic_attributes") return null;
                              return (
                                <TableRow key={key}>
                                  <TableCell sx={{ color: "#616161" }}>{key}</TableCell>
                                  <TableCell sx={{ color: "#616161" }}>{value?.toString() || "N/A"}</TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}
                  {tabValue === 1 && (
                    <Box>
                      {selectedAsset.dynamic_attributes && Object.keys(selectedAsset.dynamic_attributes).length > 0 ? (
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ color: "#616161" }}>Serial No</TableCell>
                                <TableCell sx={{ color: "#616161" }}>Property Name</TableCell>
                                <TableCell sx={{ color: "#616161" }}>Value</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {Object.entries(selectedAsset.dynamic_attributes).map(([key, value], index) => (
                                <TableRow key={key}>
                                  <TableCell sx={{ color: "#616161" }}>{index + 1}</TableCell>
                                  <TableCell sx={{ color: "#616161" }}>{key}</TableCell>
                                  <TableCell>
                                    {renderDynamicAttributeValue(key, value)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <Typography sx={{ color: "#616161" }}>No attributes available</Typography>
                      )}
                    </Box>
                  )}
                  {tabValue === 2 && currentLevelData.length > 0 && (
                    <Box>
                      <Box display="flex" alignItems="center" mb={2}>
                        <TextField
                          placeholder="Search child items..."
                          value={productSearchQuery}
                          onChange={(e) => setProductSearchQuery(e.target.value)}
                          variant="outlined"
                          size="small"
                          sx={{
                            width: 200,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "8px",
                              background: "#f5f5f5",
                              borderColor: "#e0e0e0",
                            },
                          }}
                        />
                      </Box>
                      <Typography mb={1} sx={{ color: "#616161" }}>Child Items:</Typography>
                      {filteredProducts.length === 0 ? (
                        <Typography sx={{ color: "#616161" }}>No child items found</Typography>
                      ) : (
                        <>
                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{ color: "#616161" }}>Serial No</TableCell>
                                  <TableCell sx={{ color: "#616161" }}>Child Item</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {filteredProducts
                                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                  .map((item, index) => (
                                    <TableRow key={item.id}>
                                      <TableCell sx={{ color: "#616161" }}>{page * rowsPerPage + index + 1}</TableCell>
                                      <TableCell>
                                        <Typography
                                          sx={{
                                            color: "#d32f2f",
                                            cursor: "pointer",
                                            textDecoration: "underline",
                                          }}
                                          onClick={() => handleSkuClick(item)}
                                        >
                                          {item.label}
                                        </Typography>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={filteredProducts.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                          />
                        </>
                      )}
                    </Box>
                  )}
                  {tabValue === 3 && (
                    <Box>
                      {selectedAsset.type === "product" && productImages.length > 0 ? (
                        productImages.map((img, index) => (
                          <img
                            key={index}
                            src={img.image || "placeholder.jpg"}
                            alt={`Image ${index}`}
                            style={{ maxWidth: "100%", marginBottom: 16 }}
                            onClick={() => setModalAsset(img)}
                          />
                        ))
                      ) : (selectedAsset.images || []).length > 0 ? (
                        selectedAsset.images.map((img: Asset, index: number) => (
                          <img
                            key={index}
                            src={img.image || "placeholder.jpg"}
                            alt={`Image ${index}`}
                            style={{ maxWidth: "100%", marginBottom: 16 }}
                            onClick={() => setModalAsset(img)}
                          />
                        ))
                      ) : (
                        <Typography sx={{ color: "#616161" }}>No images available</Typography>
                      )}
                    </Box>
                  )}
                </Paper>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              right: 16,
              display: "flex",
              gap: 1,
            }}
          >
            <Button
              onClick={() => console.log("[Preview Changes] Clicked")}
              startIcon={<VisibilityIcon />}
              sx={{
                border: "1px solid #d32f2f",
                color: "#d32f2f",
                background: "transparent",
                px: 2,
                py: 0.5,
                "&:hover": {
                  background: "rgba(211, 47, 47, 0.1)",
                },
              }}
            >
              Preview Changes
            </Button>
            <Button
              onClick={() => console.log("[Review Changes] Clicked")}
              startIcon={<RateReviewIcon />}
              sx={{
                border: "1px solid #d32f2f",
                color: "#d32f2f",
                background: "transparent",
                px: 2,
                py: 0.5,
                "&:hover": {
                  background: "rgba(211, 47, 47, 0.1)",
                },
              }}
            >
              Review Changes
            </Button>
            <Button
              onClick={() => console.log("[Save to Project] Clicked")}
              startIcon={<SaveIcon />}
              sx={{
                border: "1px solid #d32f2f",
                color: "#d32f2f",
                background: "transparent",
                px: 2,
                py: 0.5,
                "&:hover": {
                  background: "rgba(211, 47, 47, 0.1)",
                },
              }}
            >
              Save to Project
            </Button>
          </Box>
        </Box>
      </Box>

      <AIPromptWidget
        open={aiPromptOpen}
        onClose={() => setAiPromptOpen(false)}
        onSubmit={handleAiPromptSubmit}
        placeholder="Enter your AI prompt here..."
        buttonText="Submit"
        topOffset={60}
      />

      {modalAsset && (
        <Modal open={!!modalAsset} onClose={() => setModalAsset(null)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "#ffffff",
              p: 4,
              borderRadius: 2,
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="h6" mb={2} sx={{ color: "#616161" }}>
              {modalAsset.label}
            </Typography>
            <Typography sx={{ color: "#616161" }}>
              <strong>Description:</strong> {modalAsset.description || "N/A"}
            </Typography>
            {modalAsset.image && (
              <img src={modalAsset.image} alt={modalAsset.label} style={{ maxWidth: "100%", marginTop: 16 }} />
            )}
            <Button
              onClick={() => setModalAsset(null)}
              sx={{
                mt: 2,
                border: "1px solid #d32f2f",
                color: "#d32f2f",
                background: "transparent",
                px: 2,
                py: 0.5,
                "&:hover": {
                  background: "rgba(211, 47, 47, 0.1)",
                },
              }}
            >
              Close
            </Button>
          </Box>
        </Modal>
      )}
    </Box>
  );
}