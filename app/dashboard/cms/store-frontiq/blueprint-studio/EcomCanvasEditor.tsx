"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import GridOverlay from "./GridOverlay";
import SectionRenderer from "./SectionRenderer";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FormatAlignLeft as HeroIcon,
  Category as CategoryIcon,
  ShoppingCart as CartIcon,
  FormatListBulleted as ListIcon,
  Store as StoreIcon,
  Timer as TimerIcon,
  Star as StarIcon,
  FormatQuote as QuoteIcon,
  Storefront as StorefrontIcon,
  Newspaper as NewspaperIcon,
  TextFields as TextIcon,
  LocationOn as LocationIcon,
  FilterList as FilterIcon,
  MonetizationOn as PriceIcon,
  LocalOffer as OfferIcon,
  PhotoCamera as GalleryIcon,
  Favorite as FavoriteIcon,
  LocalShipping as ShippingIcon,
  Description as DescriptionIcon,
  RateReview as ReviewIcon,
  PlaylistAddCheck as PlaylistIcon,
  Chat as ChatIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckIcon,
  Search as SearchIcon,
  AccountCircle as AccountIcon,
  Article as ArticleIcon,
  ContactMail as ContactIcon,
  Info as InfoIcon,
  People as PeopleIcon,
  Flag as FlagIcon,
  Title,
  ViewCarousel,
  Sort,
  GridOn,
  ViewModule,
  Autorenew,
  Campaign,
  NavigateNext,
  LastPage,
  Tune,
  AddShoppingCart,
  Compare,
  Tab as TabIcon,
  Dashboard,
  History,
  ContactSupport,
  Tag,
  Share,
  Home,
  Receipt,
  CheckBox,
  Visibility,
  Error,
  Verified,
  Palette,
  Straighten,
  FormatPaint,
  LocalOffer,
  LocalShipping,
} from "@mui/icons-material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import dynamic from "next/dynamic";

interface EcomCanvasEditorProps {
  canvas: Canvas | null;
  setCanvas: (canvas: Canvas | null) => void;
  updateCanvasWithHistory: (newCanvas: Canvas) => void;
  handleSectionUpdate: (sectionId: string, updates: Partial<Section>) => void;
  handleAddSection: (sectionType: string, templateId?: string, width?: string) => void;
  handleDeleteSection: (sectionId: string) => void;
  zoomLevel: number;
  deviceMode: string;
  setDeviceMode: (mode: string) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  showRulers: boolean;
  setShowRulers: (show: boolean) => void;
  previewMode: boolean;
  setPreviewMode: (mode: boolean) => void;
  selectedSectionId: string | null;
  setSelectedSectionId: (id: string | null) => void;
  alignment: "left" | "center" | "right";
  setAlignment: (alignment: "left" | "center" | "right") => void;
  layerOrder: string[];
  setLayerOrder: (order: string[]) => void;
  selectedLayer: string | null;
  setSelectedLayer: (id: string | null) => void;
  deviceDimensions: { [key: string]: { width: string; height: string } };
  themeConfig: {
    header: { title: string; backgroundColor: string; textColor: string };
    footer: { text: string; backgroundColor: string; textColor: string };
  };
  designerInfo: DesignerInfo | null;
  setDesignerInfo: (info: DesignerInfo | null) => void;
  setErrorMessage: (message: string | null) => void;
}

interface Section {
  id: string;
  type: string;
  dimensions: { width: string; height: string; minWidth?: string; minHeight?: string };
  order: number;
  layoutType: "row" | "column" | "grid" | "custom";
  layoutConfig?: { columns?: number; rows?: number };
  width?: string;
  style?: { [key: string]: string };
  advanced?: { [key: string]: string | boolean };
  visibility_condition?: string;
  content?: string;
  alignment?: "left" | "center" | "right";
}

interface Canvas {
  id: string;
  title: string;
  storeId: string;
  pageTypeId: string;
  status: "draft" | "published";
  sections: Section[];
  createdAt: string;
  updatedAt: string;
  themeId?: string;
  templateId?: string;
  canvasConfig?: any;
}

interface DesignerInfo {
  name: string;
  email: string;
  designName: string;
  description: string;
}

const API_BASE_URL = "http://localhost:5000/api/v1/cms/page/blueprint";

const CanvasWrapper = styled(Box)(({ theme }) => ({
  height: "calc(100vh - 160px)",
  width: "100%",
  background: "#FFFFFF",
  position: "relative",
  overflow: "auto",
  border: `1px dashed ${theme.palette.divider}`,
  display: "grid",
  gridTemplateColumns: "1fr",
  gridGap: theme.spacing(2),
}));

const ToolPanel = styled(Box)(({ theme }) => ({
  width: "250px",
  background: "#E0E0E0",
  padding: theme.spacing(2),
  borderRight: `1px solid ${theme.palette.divider}`,
  height: "calc(100vh - 160px)",
  overflowY: "auto",
}));

const Header = styled(Box)(({ theme, config }) => ({
  backgroundColor: config.backgroundColor,
  color: config.textColor,
  padding: theme.spacing(2),
  textAlign: "center",
  marginBottom: theme.spacing(2),
  position: "sticky",
  top: 0,
  zIndex: 1000,
}));

const Footer = styled(Box)(({ theme, config }) => ({
  backgroundColor: config.backgroundColor,
  color: config.textColor,
  padding: theme.spacing(2),
  textAlign: "center",
  marginTop: theme.spacing(2),
  position: "sticky",
  bottom: 0,
  zIndex: 1000,
}));

const DesignerInfoDisplay = styled(Box)(({ theme }) => ({
  backgroundColor: "#F5F5F5",
  padding: theme.spacing(1),
  marginBottom: theme.spacing(1),
  textAlign: "center",
  borderRadius: theme.shape.borderRadius,
}));

const ToolItem = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  background: "#FFFFFF",
  cursor: "move",
  textAlign: "center",
  fontSize: "0.875rem",
  color: "#333333",
  transition: "transform 0.2s, opacity 0.2s",
  "&:hover": {
    background: "#F5F5F5",
    transform: "scale(1.05)",
  },
  "&.dragging": {
    opacity: 0.5,
    transform: "scale(1.1)",
  },
}));

const TabPanel = (props: { children?: React.ReactNode; value: number; index: number }) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
};

const initialHomeSections = [
  {
    id: "section-1",
    type: "Header",
    dimensions: { width: "100%", height: "64px" },
    order: 0,
    layoutType: "row",
    style: { backgroundColor: "#E0E0E0", color: "#333333" },
    content:
      '<div style="background-image: url(\'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=64\'); background-size: cover; height: 100%;"><span style="color: #333333;">Header Content</span></div>',
  },
  {
    id: "section-2",
    type: "Hero Banner",
    dimensions: { width: "100%", height: "400px" },
    order: 1,
    layoutType: "row",
    style: { backgroundColor: "#FFFFFF" },
    content:
      '<div class="carousel" style="background-color: #FFFFFF; height: 100%; display: flex; justify-content: center; align-items: center;"><img src="https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=240&h=400" alt="Banner 1" loading="lazy" /><img src="https://images.pexels.com/photos/1109542/pexels-photo-1109542.jpeg?auto=compress&cs=tinysrgb&w=240&h=400" alt="Banner 2" loading="lazy" /><img src="https://images.pexels.com/photos/1457983/pexels-photo-1457983.jpeg?auto=compress&cs=tinysrgb&w=240&h=400" alt="Banner 3" loading="lazy" /><img src="https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=240&h=400" alt="Banner 4" loading="lazy" /><img src="https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg?auto=compress&cs=tinysrgb&w=240&h=400" alt="Banner 5" loading="lazy" /></div>',
  },
  {
    id: "section-3",
    type: "Hero Banner",
    dimensions: { width: "100%", height: "400px" },
    order: 2,
    layoutType: "row",
    style: { backgroundColor: "#FFFFFF" },
    content:
      '<div class="carousel" style="background-color: #FFFFFF; height: 100%; display: flex; justify-content: center; align-items: center;"><img src="https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=240&h=400" alt="Banner 6" loading="lazy" /><img src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=240&h=400" alt="Banner 7" loading="lazy" /><img src="https://images.pexels.com/photos/3184419/pexels-photo-3184419.jpeg?auto=compress&cs=tinysrgb&w=240&h=400" alt="Banner 8" loading="lazy" /><img src="https://images.pexels.com/photos/325153/pexels-photo-325153.jpeg?auto=compress&cs=tinysrgb&w=240&h=400" alt="Banner 9" loading="lazy" /><img src="https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg?auto=compress&cs=tinysrgb&w=240&h=400" alt="Banner 10" loading="lazy" /></div>',
  },
  {
    id: "section-4",
    type: "Text Block",
    dimensions: { width: "100%", height: "200px" },
    order: 3,
    layoutType: "row",
    style: { backgroundColor: "#F5F5F5", color: "#333333" },
    content:
      '<div style="background-image: url(\'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=200\'); background-size: cover; height: 100%; display: flex; justify-content: center; align-items: center;"><h2>Welcome to Our Store</h2><p>Discover the latest trends and offers.</p></div>',
  },
  {
    id: "section-5",
    type: "New Arrivals",
    dimensions: { width: "100%", height: "300px" },
    order: 4,
    layoutType: "row",
    style: { backgroundColor: "#FFFFFF" },
    content:
      '<div class="product-carousel" style="background-image: url(\'https://images.unsplash.com/photo-1511556820780-490ff0a8f4e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=300\'); background-size: cover; height: 100%; display: flex; justify-content: center; align-items: center;"><div class="product-tile">Product 1</div><div class="product-tile">Product 2</div><div class="product-tile">Product 3</div><div class="product-tile">Product 4</div><div class="product-tile">Product 5</div></div>',
  },
  {
    id: "section-6",
    type: "Text Block",
    dimensions: { width: "100%", height: "200px" },
    order: 5,
    layoutType: "row",
    style: { backgroundColor: "#F5F5F5", color: "#333333" },
    content:
      '<div style="background-image: url(\'https://images.unsplash.com/photo-1506784923726-8b0e9e4e2e7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=200\'); background-size: cover; height: 100%; display: flex; justify-content: center; align-items: center;"><h2>Shop the Latest</h2><p>Explore our new collection today.</p></div>',
  },
  {
    id: "section-7",
    type: "Footer",
    dimensions: { width: "100%", height: "64px" },
    order: 6,
    layoutType: "row",
    style: { backgroundColor: "#E0E0E0", color: "#333333" },
    content:
      '<div style="background-image: url(\'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=64\'); background-size: cover; height: 100%;"><span style="color: #333333;">Footer Content</span></div>',
  },
];

const EcomCanvasEditor: React.FC<EcomCanvasEditorProps> = ({
  canvas,
  setCanvas,
  updateCanvasWithHistory,
  handleSectionUpdate,
  handleAddSection,
  handleDeleteSection,
  zoomLevel,
  deviceMode,
  setDeviceMode,
  showGrid,
  setShowGrid,
  showRulers,
  setShowRulers,
  previewMode,
  setPreviewMode,
  selectedSectionId,
  setSelectedSectionId,
  alignment,
  setAlignment,
  layerOrder,
  setLayerOrder,
  selectedLayer,
  setSelectedLayer,
  deviceDimensions,
  themeConfig,
  designerInfo,
  setDesignerInfo,
  setErrorMessage,
}) => {
  const [showRulerOverlay, setShowRulerOverlay] = useState(false);
  const [draggingSection, setDraggingSection] = useState<string | null>(null);
  const [pageType, setPageType] = useState<string>("Home");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [useApi, setUseApi] = useState(false);
  const [apiUrl, setApiUrl] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [designerModalOpen, setDesignerModalOpen] = useState(false);
  const [designers, setDesigners] = useState<DesignerInfo[]>([]);
  const [newDesigner, setNewDesigner] = useState<DesignerInfo>({
    name: "",
    email: "",
    designName: "",
    description: "",
  });
  const [designerMode, setDesignerMode] = useState<"select" | "create">("select");

  useEffect(() => {
    setShowRulerOverlay(showRulers);
    const fetchDesigners = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/fetchDesigners`);
        setDesigners(response.data);
      } catch (error) {
        console.error("Error fetching designers:", error);
        setErrorMessage("Failed to fetch designers.");
      }
    };
    fetchDesigners();
    if (!canvas) {
      const initialCanvas: Canvas = {
        id: "home-canvas-20250624",
        title: "Home Page",
        storeId: "1",
        pageTypeId: "1",
        status: "draft",
        sections: initialHomeSections,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCanvas(initialCanvas);
      setLayerOrder(initialHomeSections.map((s) => s.id));
    }
    if (!designerInfo) {
      setDesignerModalOpen(true);
    }
  }, [showRulers, designerInfo, canvas, setCanvas, setLayerOrder, setErrorMessage]);

  const handleAlignmentChange = useCallback(
    (newAlignment: "left" | "center" | "right") => {
      setAlignment(newAlignment);
      if (selectedSectionId && canvas) {
        const section = canvas.sections.find((s) => s.id === selectedSectionId);
        if (section) {
          handleSectionUpdate(section.id, { alignment: newAlignment });
        }
      }
    },
    [setAlignment, selectedSectionId, canvas, handleSectionUpdate]
  );

  const moveSection = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (!canvas) return;
      const newOrder = [...layerOrder];
      const [movedSection] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, movedSection);
      setLayerOrder(newOrder);
      const updatedSections = newOrder.map((id, index) => ({
        ...canvas.sections.find((s) => s.id === id)!,
        order: index,
      }));
      const newCanvas = { ...canvas, sections: updatedSections };
      updateCanvasWithHistory(newCanvas);
    },
    [canvas, layerOrder, setLayerOrder, updateCanvasWithHistory]
  );

  const handleDragStart = useCallback((sectionType: string, e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", sectionType);
    setDraggingSection(sectionType);
    const toolItem = e.target as HTMLElement;
    toolItem.classList.add("dragging");
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    const toolItem = e.target as HTMLElement;
    toolItem.classList.remove("dragging");
    setDraggingSection(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetIndex: number) => {
      e.preventDefault();
      const sectionType = e.dataTransfer.getData("text/plain");
      if (sectionType && canvas && !canvas.sections.find((s) => s.type === sectionType)) {
        handleAddSection(sectionType);
      }
      setDraggingSection(null);
    },
    [canvas, handleAddSection]
  );

  const handleDelete = useCallback(
    (sectionId: string) => {
      handleDeleteSection(sectionId);
    },
    [handleDeleteSection]
  );

  const renderSections = useCallback(() => {
    if (!canvas) return null;
    return layerOrder.map((sectionId, index) => {
      const section = canvas.sections.find((s) => s.id === sectionId);
      if (!section) return null;
      return (
        <SectionRenderer
          key={section.id}
          section={section}
          index={index}
          handleSectionUpdate={handleSectionUpdate}
          handleDeleteSection={handleDelete}
          onDragStart={handleDragStart}
          onDrop={(e, idx) => moveSection(idx, index)}
          onEdit={() => {
            setSelectedSection(section);
            setHtmlContent(section.content || "");
            setApiUrl(section.advanced?.apiUrl || "");
            setUseApi(!!section.advanced?.apiUrl);
            setModalOpen(true);
          }}
        />
      );
    });
  }, [canvas, layerOrder, handleSectionUpdate, handleDelete, handleDragStart, moveSection]);

  const handleTabChange = useCallback((event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  }, []);

  const fetchContentFromApi = useCallback(async () => {
    if (apiUrl) {
      try {
        const response = await axios.get(apiUrl);
        setHtmlContent(response.data || "");
      } catch (error) {
        console.error("API fetch failed:", error);
        setHtmlContent("Error fetching content");
      }
    }
  }, [apiUrl]);

  const handleSaveSection = useCallback(() => {
    if (selectedSection && canvas) {
      const updates: Partial<Section> = {
        type: selectedSection.type,
        style: selectedSection.style,
        dimensions: selectedSection.dimensions,
        alignment: alignment,
      };
      if (useApi && apiUrl) {
        updates.advanced = { ...selectedSection.advanced, apiUrl };
        fetchContentFromApi();
      } else {
        updates.content = htmlContent;
        updates.advanced = { ...selectedSection.advanced, apiUrl: "" };
      }
      const updatedSections = canvas.sections.map((s) =>
        s.id === selectedSection.id ? { ...s, ...updates } : s
      );
      const newCanvas = { ...canvas, sections: updatedSections };
      updateCanvasWithHistory(newCanvas);
      setModalOpen(false);
      setSelectedSection(null);
    }
  }, [selectedSection, canvas, alignment, useApi, apiUrl, htmlContent, updateCanvasWithHistory, fetchContentFromApi]);

  const handleDesignerSave = useCallback(async () => {
    if (designerMode !== "create") return;
    try {
      const payload = {
        name: newDesigner.name,
        email: newDesigner.email,
        design_name: newDesigner.designName,
        description: newDesigner.description,
      };
      const response = await axios.post(`${API_BASE_URL}/addDesigner`, payload);
      const newDesignerData = response.data;
      setDesigners([...designers, newDesignerData]);
      setDesignerInfo(newDesignerData);
      setDesignerModalOpen(false);
      setNewDesigner({ name: "", email: "", designName: "", description: "" });
      setErrorMessage("Designer created successfully.");
    } catch (error) {
      console.error("Error saving designer:", error);
      setErrorMessage("Failed to save designer information.");
    }
  }, [designerMode, newDesigner, designers, setDesignerInfo, setErrorMessage]);

  const handleDesignerSelect = useCallback(() => {
    if (designerMode === "select" && designerInfo) {
      setDesignerModalOpen(false);
      setErrorMessage("Designer selected successfully.");
    }
  }, [designerMode, designerInfo, setErrorMessage]);

  const toolsByPageType = {
    Home: [
      { type: "Hero Banner", icon: <HeroIcon /> },
      { type: "Featured Categories", icon: <CategoryIcon /> },
      { type: "Promo Banner", icon: <LocalOffer /> },
      { type: "Best Sellers", icon: <StarIcon /> },
      { type: "New Arrivals", icon: <NewspaperIcon /> },
      { type: "Top Deals", icon: <PriceIcon /> },
      { type: "Countdown Timer", icon: <TimerIcon /> },
      { type: "Editor’s Picks", icon: <StorefrontIcon /> },
      { type: "Testimonials", icon: <QuoteIcon /> },
      { type: "Shop by Brand", icon: <StoreIcon /> },
      { type: "Blog Tiles", icon: <ArticleIcon /> },
      { type: "Product Grid Carousel", icon: <ViewCarousel /> },
      { type: "SEO Text", icon: <TextIcon /> },
      { type: "Store Locator", icon: <LocationIcon /> },
    ],
    PLP: [
      { type: "Category Title", icon: <Title /> },
      { type: "Filter Sidebar", icon: <FilterIcon /> },
      { type: "Price Range", icon: <PriceIcon /> },
      { type: "Brand Filter", icon: <StoreIcon /> },
      { type: "Rating Filter", icon: <StarIcon /> },
      { type: "Availability Filter", icon: <CheckIcon /> },
      { type: "Material Filter", icon: <FormatPaint /> },
      { type: "Size Filter", icon: <Straighten /> },
      { type: "Color Filter", icon: <Palette /> },
      { type: "Sorting Dropdown", icon: <Sort /> },
      { type: "Product Grid", icon: <GridOn /> },
      { type: "Masonry Layout", icon: <ViewModule /> },
      { type: "Infinite Scroll", icon: <Autorenew /> },
      { type: "Category Banner", icon: <LocalOffer /> },
      { type: "Breadcrumbs", icon: <NavigateNext /> },
      { type: "Pagination", icon: <LastPage /> },
      { type: "Promotional Inline Banner", icon: <Campaign /> },
    ],
    PDP: [
      { type: "Product Image Gallery", icon: <GalleryIcon /> },
      { type: "Product Title", icon: <Title /> },
      { type: "Ratings", icon: <StarIcon /> },
      { type: "Reviews", icon: <ReviewIcon /> },
      { type: "Price", icon: <PriceIcon /> },
      { type: "Discount Tag", icon: <LocalOffer /> },
      { type: "Offer Tag", icon: <LocalOffer /> },
      { type: "Variant Selector", icon: <Tune /> },
      { type: "Add to Cart", icon: <AddShoppingCart /> },
      { type: "Wishlist", icon: <FavoriteIcon /> },
      { type: "Compare", icon: <Compare /> },
      { type: "Estimated Delivery", icon: <LocalShipping /> },
      { type: "Zip Checker", icon: <LocationIcon /> },
      { type: "Product Description", icon: <DescriptionIcon /> },
      { type: "Specifications", icon: <ListIcon /> },
      { type: "Materials", icon: <FormatPaint /> },
      { type: "Frequently Bought Together", icon: <PlaylistIcon /> },
      { type: "Related Products", icon: <GridOn /> },
      { type: "Delivery Tabs", icon: <TabIcon /> },
      { type: "Live Chat", icon: <ChatIcon /> },
    ],
    Cart: [
      { type: "Product List", icon: <ListIcon /> },
      { type: "Price Summary", icon: <PriceIcon /> },
      { type: "Tax Estimate", icon: <PriceIcon /> },
      { type: "Shipping Estimate", icon: <LocalShipping /> },
      { type: "Promo Code", icon: <LocalOffer /> },
      { type: "Checkout CTA", icon: <CartIcon /> },
      { type: "Continue Shopping", icon: <StoreIcon /> },
      { type: "Trust Seals", icon: <Verified /> },
    ],
    Checkout: [
      { type: "Multi-step Tabs", icon: <TabIcon /> },
      { type: "Login Toggle", icon: <AccountIcon /> },
      { type: "Address Form", icon: <Home /> },
      { type: "Shipping Options", icon: <LocalShipping /> },
      { type: "Payment Methods", icon: <PaymentIcon /> },
      { type: "Order Summary", icon: <Receipt /> },
      { type: "T&C Checkbox", icon: <CheckBox /> },
      { type: "Place Order", icon: <CheckIcon /> },
    ],
    Search: [
      { type: "Query Echo", icon: <SearchIcon /> },
      { type: "Filter Sidebar", icon: <FilterIcon /> },
      { type: "Product Grid", icon: <GridOn /> },
      { type: "No Results Message", icon: <InfoIcon /> },
      { type: "Quick View", icon: <Visibility /> },
    ],
    MyAccount: [
      { type: "Dashboard Overview", icon: <Dashboard /> },
      { type: "Order History", icon: <History /> },
      { type: "Tracking", icon: <LocalShipping /> },
      { type: "Address Book", icon: <Home /> },
      { type: "Payment Methods", icon: <PaymentIcon /> },
      { type: "Profile", icon: <AccountIcon /> },
      { type: "Support", icon: <ContactSupport /> },
    ],
    Other: [
      { type: "Blog Article", icon: <ArticleIcon /> },
      { type: "Rich Text", icon: <TextIcon /> },
      { type: "Product Mentions", icon: <Tag /> },
      { type: "Share Buttons", icon: <Share /> },
      { type: "Contact Form", icon: <ContactIcon /> },
      { type: "Map Embed", icon: <LocationIcon /> },
      { type: "Support Info", icon: <ContactSupport /> },
      { type: "Brand Story", icon: <InfoIcon /> },
      { type: "Team Showcase", icon: <PeopleIcon /> },
      { type: "Milestones", icon: <FlagIcon /> },
      { type: "404 CTA", icon: <Error /> },
    ],
  };

  if (!canvas) return <Typography>Loading...</Typography>;

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
        <ToolPanel>
          <Typography variant="h6" sx={{ mb: 2, color: "#333333" }}>
            Tools
          </Typography>
          <Select
            value={pageType}
            onChange={(e) => setPageType(e.target.value as string)}
            sx={{ mb: 2, width: "100%" }}
          >
            <MenuItem value="Home">Home</MenuItem>
            <MenuItem value="PLP">Category Listing</MenuItem>
            <MenuItem value="PDP">Product Detail</MenuItem>
            <MenuItem value="Cart">Cart</MenuItem>
            <MenuItem value="Checkout">Checkout</MenuItem>
            <MenuItem value="Search">Search Results</MenuItem>
            <MenuItem value="MyAccount">My Account</MenuItem>
            <MenuItem value="Other">Other Pages</MenuItem>
          </Select>
          {toolsByPageType[pageType as keyof typeof toolsByPageType].map(({ type, icon }) => (
            <ToolItem
              key={type}
              draggable
              onDragStart={(e) => handleDragStart(type, e)}
              onDragEnd={handleDragEnd}
              sx={{ fontSize: "0.875rem", color: "#333333" }}
              className={draggingSection === type ? "dragging" : ""}
            >
              {icon}
              <Typography component="span" sx={{ ml: 1 }}>
                {type}
              </Typography>
            </ToolItem>
          ))}
        </ToolPanel>
        <Box sx={{ flex: 1 }}>
          <Header config={themeConfig.header}>
            <Typography variant="h4">{themeConfig.header.title}</Typography>
          </Header>
          {designerInfo && (
            <DesignerInfoDisplay>
              <Typography variant="body2" color="#333333">
                Designed by: {designerInfo.name} | Design: {designerInfo.designName}
              </Typography>
            </DesignerInfoDisplay>
          )}
          {showGrid && <GridOverlay />}
          {showRulerOverlay && (
            <>
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "10px",
                  background: "linear-gradient(to right, #757575 1px, transparent 1px)",
                  backgroundSize: "20px 1px",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "10px",
                  height: "100%",
                  background: "linear-gradient(to bottom, #757575 1px, transparent 1px)",
                  backgroundSize: "1px 20px",
                }}
              />
            </>
          )}
          <CanvasWrapper
            style={{
              width: deviceDimensions[deviceMode].width,
              height: deviceDimensions[deviceMode].height,
              transform: `scale(${zoomLevel})`,
              transformOrigin: "top left",
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Grid container spacing={2}>
              {renderSections()}
            </Grid>
          </CanvasWrapper>
          <Footer config={themeConfig.footer}>
            <Typography variant="body2">{themeConfig.footer.text}</Typography>
          </Footer>
          <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>Edit Section</DialogTitle>
            <DialogContent>
              <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                <Tab label="Styling" />
                <Tab label="Contents" />
                <Tab label="Advanced" />
                <Tab label="Settings" />
              </Tabs>
              <TabPanel value={tabValue} index={0}>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Width"
                  value={selectedSection?.dimensions?.width || "100%"}
                  onChange={(e) =>
                    setSelectedSection({
                      ...selectedSection!,
                      dimensions: { ...selectedSection!.dimensions, width: e.target.value },
                    })
                  }
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Height"
                  value={selectedSection?.dimensions?.height || "auto"}
                  onChange={(e) =>
                    setSelectedSection({
                      ...selectedSection!,
                      dimensions: { ...selectedSection!.dimensions, height: e.target.value },
                    })
                  }
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Background Color"
                  value={selectedSection?.style?.backgroundColor || ""}
                  onChange={(e) =>
                    setSelectedSection({
                      ...selectedSection!,
                      style: { ...selectedSection!.style, backgroundColor: e.target.value },
                    })
                  }
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Text Color"
                  value={selectedSection?.style?.color || ""}
                  onChange={(e) =>
                    setSelectedSection({
                      ...selectedSection!,
                      style: { ...selectedSection!.style, color: e.target.value },
                    })
                  }
                  fullWidth
                />
                <TextField
                  margin="dense"
                  label="Alignment"
                  select
                  value={alignment}
                  onChange={(e) => handleAlignmentChange(e.target.value as "left" | "center" | "right")}
                  fullWidth
                >
                  <MenuItem value="left">Left</MenuItem>
                  <MenuItem value="center">Center</MenuItem>
                  <MenuItem value="right">Right</MenuItem>
                </TextField>
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <Box sx={{ mb: 2 }}>
                  <Button onClick={() => setUseApi(!useApi)} sx={{ color: "#333333" }}>
                    {useApi ? "Switch to Manual HTML" : "Switch to API Content"}
                  </Button>
                </Box>
                {useApi ? (
                  <TextField
                    autoFocus
                    margin="dense"
                    label="API URL"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    fullWidth
                    onBlur={fetchContentFromApi}
                  />
                ) : (
                  <ReactQuill
                    value={htmlContent}
                    onChange={setHtmlContent}
                    modules={{
                      toolbar: [
                        ["bold", "italic", "underline", "link"],
                        [{ list: "bullet" }, { list: "ordered" }],
                      ],
                    }}
                    theme="snow"
                  />
                )}
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <TextField
                  margin="dense"
                  label="Custom CSS"
                  value={selectedSection?.advanced?.customCSS || ""}
                  onChange={(e) =>
                    setSelectedSection({
                      ...selectedSection!,
                      advanced: { ...selectedSection!.advanced, customCSS: e.target.value },
                    })
                  }
                  fullWidth
                  multiline
                />
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                <TextField
                  margin="dense"
                  label="Visibility Condition"
                  value={selectedSection?.visibility_condition || ""}
                  onChange={(e) =>
                    setSelectedSection({
                      ...selectedSection!,
                      visibility_condition: e.target.value,
                    })
                  }
                  fullWidth
                />
              </TabPanel>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setModalOpen(false)} sx={{ color: "#333333" }}>
                Cancel
              </Button>
              <Button onClick={handleSaveSection} sx={{ color: "#333333" }}>
                Save
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={designerModalOpen} onClose={() => setDesignerModalOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Designer Information</DialogTitle>
            <DialogContent>
              <RadioGroup
                value={designerMode}
                onChange={(e) => setDesignerMode(e.target.value as "select" | "create")}
                sx={{ mb: 2 }}
              >
                <FormControlLabel value="select" control={<Radio />} label="Select Existing Designer" />
                <FormControlLabel value="create" control={<Radio />} label="Create New Designer" />
              </RadioGroup>
              {designerMode === "select" ? (
                <>
                  <Select
                    value={designerInfo?.name || ""}
                    onChange={(e) => {
                      const selected = designers.find((d) => d.name === e.target.value);
                      setDesignerInfo(selected || null);
                    }}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="">Select Designer</MenuItem>
                    {designers.map((designer) => (
                      <MenuItem key={designer.name} value={designer.name}>
                        {designer.name}
                      </MenuItem>
                    ))}
                  </Select>
                </>
              ) : (
                <>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Name"
                    value={newDesigner.name}
                    onChange={(e) => setNewDesigner({ ...newDesigner, name: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    margin="dense"
                    label="Email"
                    value={newDesigner.email}
                    onChange={(e) => setNewDesigner({ ...newDesigner, email: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    margin="dense"
                    label="Design Name"
                    value={newDesigner.designName}
                    onChange={(e) => setNewDesigner({ ...newDesigner, designName: e.target.value })}
                    fullWidth
                  />
                  <TextField
                    margin="dense"
                    label="Description"
                    value={newDesigner.description}
                    onChange={(e) => setNewDesigner({ ...newDesigner, description: e.target.value })}
                    fullWidth
                    multiline
                  />
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDesignerModalOpen(false)} sx={{ color: "#333333" }}>
                Cancel
              </Button>
              {designerMode === "select" ? (
                <Button
                  onClick={handleDesignerSelect}
                  sx={{ color: "#333333" }}
                  disabled={!designerInfo}
                >
                  Proceed
                </Button>
              ) : (
                <Button
                  onClick={handleDesignerSave}
                  sx={{ color: "#333333" }}
                  disabled={
                    !newDesigner.name || !newDesigner.email || !newDesigner.designName || !newDesigner.description
                  }
                >
                  Save
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </DndProvider>
  );
};

export default EcomCanvasEditor;