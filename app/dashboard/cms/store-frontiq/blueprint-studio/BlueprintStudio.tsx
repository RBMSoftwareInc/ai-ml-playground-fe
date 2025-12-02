"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { ThemeProvider, createTheme, alpha, styled } from "@mui/material/styles";
import { Box, Typography, Alert } from "@mui/material";
import EcomCanvasEditor from "./EcomCanvasEditor";
import SidebarMain from "./SidebarMain";
import SidebarEdit from "./SidebarEdit";
import Controls from "./Controls";
import LayerPanel from "./LayerPanel";
import DesignerInfoModal from "./DesignerInfoModal";
import AILayoutModal from "./AILayoutModal";
import axios from "axios";
import { People as PeopleIconMaterial } from "@mui/icons-material";


// Define styled components
const EditorContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "100vh",
  overflow: "hidden",
}));

const Sidebar = styled(Box)(({ theme }) => ({
  width: "250px",
  flexShrink: 0,
  transition: "width 0.3s ease",
  overflow: "hidden",
  zIndex: 1000,
  backgroundColor: "#E0E0E0",
}));

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: "auto",
  padding: theme.spacing(2),
  backgroundColor: "#FFFFFF",
}));

const CollaborationIndicator = styled(Box)(({ theme }) => ({
  position: "fixed",
  bottom: "20px",
  right: "20px",
  display: "flex",
  alignItems: "center",
  gap: 1,
  bgcolor: "#FFFFFF",
  p: 1,
  borderRadius: 1,
  boxShadow: 2,
}));

const theme = createTheme({
  palette: {
    primary: { main: "#333333", light: "#757575", contrastText: "#FFFFFF" },
    background: { default: "#FFFFFF", paper: "#E0E0E0" },
    text: { primary: "#333333", secondary: "#757575" },
    divider: alpha("#333333", 0.1),
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    body1: { fontSize: "0.95rem" },
    body2: { fontSize: "0.85rem" },
  },
});

const API_BASE_URL = "http://localhost:5000/api/v1/cms/page/blueprint";

// Mock theme config
const themeConfig = {
  header: { title: "Example Store", backgroundColor: "#E0E0E0", textColor: "#333333" },
  footer: { text: "© 2025 Example Store. All rights reserved.", backgroundColor: "#E0E0E0", textColor: "#333333" },
};

export default function BlueprintStudio() {
  const params = useParams();
  const canvasId = params.pageId as string | undefined;
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [storeId, setStoreId] = useState("1");
  const [pageTypeId, setPageTypeId] = useState("1");
  const [stores, setStores] = useState<{ id: string; name: string }[]>([]);
  const [pageTypes, setPageTypes] = useState<{ id: string; name: string }[]>([]);
  const [isMainSidebarOpen, setIsMainSidebarOpen] = useState(true);
  const [isEditSidebarOpen, setIsEditSidebarOpen] = useState(false);
  const [sidebarPosition, setSidebarPosition] = useState("left");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [deviceMode, setDeviceMode] = useState("desktop");
  const [showGrid, setShowGrid] = useState(false);
  const [showRulers, setShowRulers] = useState(false);
  const [history, setHistory] = useState<Canvas[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isFirstSave, setIsFirstSave] = useState(true);
  const [designerInfo, setDesignerInfo] = useState<DesignerInfo | null>(null);
  const [showDesignerModal, setShowDesignerModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [collaborators, setCollaborators] = useState(2);
  const [showAILayoutModal, setShowAILayoutModal] = useState(false);
  const [aiPageType, setAIPageType] = useState("Home");
  const [desiredSections, setDesiredSections] = useState("");
  const [layoutStyle, setLayoutStyle] = useState("grid");
  const [contentFocus, setContentFocus] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [generatedLayout, setGeneratedLayout] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [sectionEditorTab, setSectionEditorTab] = useState(0);
  const [fragments, setFragments] = useState<Fragment[]>([]);
  const [sectionTemplates, setSectionTemplates] = useState<SectionTemplate[]>([]);
  const [pageSectionMapping, setPageSectionMapping] = useState<{ [key: string]: string[] }>({});
  const [sectionContentMapping, setSectionContentMapping] = useState<{
    [key: string]: { allowedWidgets: string[]; allowedFragments: string[] };
  }>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [alignment, setAlignment] = useState<"left" | "center" | "right">("left");
  const [layerOrder, setLayerOrder] = useState<string[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);

  interface Section {
    id: string;
    type: string;
    dimensions: { width: string; height: string; minWidth?: string; minHeight?: string };
    order: number;
    layoutType: "row" | "column" | "grid" | "custom";
    layoutConfig?: { columns?: number; rows?: number };
    width?: string;
    style?: { [key: string]: string };
    advanced?: { [key: string]: string | boolean | string[] | { [key: string]: string } };
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

  interface Fragment {
    id: string;
    name: string;
    type: "Fragment";
    content: any;
    config: any;
    category: string;
  }

  interface SectionTemplate {
    id: string;
    name: string;
    type: string;
    slots: { id: string; content: null; order: number }[];
    layoutType: "row" | "column" | "grid" | "custom";
    layoutConfig?: { columns?: number };
  }

  const deviceDimensions = {
    desktop: { width: "100%", height: "calc(100vh - 160px)" },
    tablet: { width: "768px", height: "calc(100vh - 160px)" },
    mobile: { width: "375px", height: "calc(100vh - 160px)" },
  };

  useEffect(() => {
    const fetchStoresAndPageTypes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/stores-and-page-types`);
        setStores(response.data.stores);
        setPageTypes(response.data.page_types);
      } catch (error) {
        console.error("Error fetching stores and page types:", error);
        setErrorMessage("Failed to fetch stores and page types.");
      }
    };
    fetchStoresAndPageTypes();
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const storesAndPageTypesResponse = await axios.get(`${API_BASE_URL}/stores-and-page-types`);
        setStores(storesAndPageTypesResponse.data.stores);
        setPageTypes(storesAndPageTypesResponse.data.page_types);

        let initialPageTypeId = "1";
        if (canvasId) {
          const matchedPageType = storesAndPageTypesResponse.data.page_types.find(
            (pt: { id: string; name: string }) => pt.id === canvasId || pt.name.toLowerCase() === canvasId.toLowerCase()
          );
          initialPageTypeId = matchedPageType ? matchedPageType.id : "1";
        }
        setPageTypeId(initialPageTypeId);

        const canvasResponse = await axios.get(`${API_BASE_URL}/stores/${storeId}/pages/${initialPageTypeId}`);
        const { canvas: canvasData, sections } = canvasResponse.data;
        const mappedCanvas: Canvas = {
          id: canvasData.canvas_id,
          title: canvasData.title || "New Canvas",
          storeId: String(canvasData.store_id),
          pageTypeId: String(canvasData.page_type_id),
          status: canvasData.status,
          sections: sections.map((section: any) => ({
            id: section.section_id,
            type: section.type,
            dimensions: section.dimensions,
            order: section.order_num,
            layoutType: section.layout_type,
            layoutConfig: section.layout_config,
            width: section.width,
            style: section.style,
            advanced: section.advanced,
            visibility_condition: section.visibility_condition,
            content: section.content || "",
            alignment: section.alignment || "left",
          })),
          createdAt: canvasData.created_at,
          updatedAt: canvasData.updated_at,
          themeId: canvasData.theme_id,
          templateId: canvasData.template_id,
          canvasConfig: canvasData.canvas_config,
        };
        setCanvas(mappedCanvas);
        setStoreId(String(canvasData.store_id));
        setPageTypeId(String(canvasData.page_type_id));
        setIsCompleted(canvasData.status === "published");
        setHistory([mappedCanvas]);
        setHistoryIndex(0);

        if (canvasId) {
          try {
            const designerResponse = await axios.get(`${API_BASE_URL}/designer-info?canvas_id=${canvasId}`);
            setDesignerInfo(designerResponse.data);
          } catch (error) {
            console.error("Error fetching designer info:", error);
          }
        }

        try {
          const fragmentsResponse = await axios.get(`${API_BASE_URL}/fragments`);
          setFragments(fragmentsResponse.data);
        } catch (error) {
          console.error("Fragments endpoint failed:", error);
          setErrorMessage("Failed to fetch fragments.");
        }

        try {
          const templatesResponse = await axios.get(`${API_BASE_URL}/section-templates`);
          setSectionTemplates(templatesResponse.data);
        } catch (error) {
          console.error("Section templates endpoint failed:", error);
          setErrorMessage("Failed to fetch section templates.");
        }

        try {
          const pageSectionResponse = await axios.get(`${API_BASE_URL}/mappings/page-sections`);
          setPageSectionMapping(pageSectionResponse.data);
        } catch (error) {
          console.error("Page-section mappings endpoint failed:", error);
          setErrorMessage("Failed to fetch page-section mappings.");
        }

        try {
          const sectionContentResponse = await axios.get(`${API_BASE_URL}/mappings/section-content`);
          setSectionContentMapping(sectionContentResponse.data);
        } catch (error) {
          console.error("Section-content mappings endpoint failed:", error);
          setErrorMessage("Failed to fetch section-content mappings.");
        }

        const draft = localStorage.getItem(`canvas-draft-${canvasId || initialPageTypeId}`);
        if (draft) {
          const parsedDraft = JSON.parse(draft);
          if (new Date(parsedDraft.updatedAt) > new Date(canvasData.updated_at)) {
            setCanvas(parsedDraft);
            setHistory([parsedDraft]);
            setHistoryIndex(0);
            setHasUnsavedChanges(true);
            setErrorMessage("Loaded unsaved draft from local storage.");
          }
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setErrorMessage("Failed to fetch initial data. Using default canvas.");
        const defaultCanvas: Canvas = {
          id: canvasId || `default-${initialPageTypeId}`,
          title: "New Canvas",
          storeId: storeId,
          pageTypeId: initialPageTypeId,
          status: "draft",
          sections: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setCanvas(defaultCanvas);
        setHistory([defaultCanvas]);
        setHistoryIndex(0);
      }
    };
    fetchInitialData();
  }, [canvasId, storeId]);

  useEffect(() => {
    if (canvas) {
      const newLayerOrder = canvas.sections.map((s) => s.id);
      if (JSON.stringify(newLayerOrder) !== JSON.stringify(layerOrder)) {
        setLayerOrder(newLayerOrder);
      }
    }
  }, [canvas, layerOrder]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (canvas && historyIndex > 0) {
      localStorage.setItem(`canvas-draft-${canvasId}`, JSON.stringify(canvas));
      setHasUnsavedChanges(true);
    }
  }, [canvas, historyIndex, canvasId]);

  const updateCanvasWithHistory = useCallback(
    (newCanvas: Canvas) => {
      if (JSON.stringify(canvas) === JSON.stringify(newCanvas)) return;
      const newHistory = [...history.slice(0, historyIndex + 1), newCanvas];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setCanvas(newCanvas);
    },
    [canvas, history, historyIndex]
  );

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setCanvas(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setCanvas(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const handleSave = useCallback(async () => {
    if (!canvas) {
      setErrorMessage("Cannot save: Canvas is not initialized.");
      return;
    }
    if (isFirstSave && !designerInfo) {
      setShowDesignerModal(true);
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/generate-template/${canvas.id}`, canvas);
      if (response.data.message) {
        setErrorMessage(response.data.message);
        localStorage.removeItem(`canvas-draft-${canvasId}`);
        setHasUnsavedChanges(false);
        setIsFirstSave(false);
      }
    } catch (error) {
      console.error("Error saving canvas:", error);
      setErrorMessage("Failed to save canvas or generate template.");
    }
  }, [canvas, designerInfo, isFirstSave, canvasId]);

  const handleExport = useCallback(() => {
    if (!canvas) {
      setErrorMessage("Cannot export: Canvas is not initialized.");
      return;
    }
    const dataStr = JSON.stringify(canvas, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${canvas.title || "canvas"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [canvas]);

  const handleExportPDF = useCallback(() => {
    if (!canvas) {
      setErrorMessage("Cannot export PDF: Canvas is not initialized.");
      return;
    }
    setErrorMessage("PDF export feature coming soon.");
  }, [canvas]);

  const handlePublish = useCallback(async () => {
    if (!canvas) {
      setErrorMessage("Cannot publish: Canvas is not initialized.");
      return;
    }
    const newCanvas = { ...canvas, status: "published", updatedAt: new Date().toISOString() };
    updateCanvasWithHistory(newCanvas);
    setIsCompleted(true);
    await handleSave();
  }, [canvas, updateCanvasWithHistory, handleSave]);

  const handleMarkComplete = useCallback(async () => {
    if (!designerInfo && isFirstSave) {
      setShowDesignerModal(true);
      return;
    }
    setIsCompleted(true);
    await handleSave();
  }, [designerInfo, isFirstSave, handleSave]);

  const handleDesignerInfoSubmit = useCallback(
    async (info: DesignerInfo) => {
      try {
        await axios.post(`${API_BASE_URL}/designer-info`, {
          entity_type: "canvas",
          entity_id: canvasId,
          name: info.name,
          email: info.email,
          design_name: info.designName,
          description: info.description,
        });
        setDesignerInfo(info);
        setShowDesignerModal(false);
        await handleSave();
      } catch (error) {
        console.error("Error saving designer info:", error);
        setErrorMessage("Failed to save designer information.");
      }
    },
    [canvasId, handleSave]
  );

  const handleAddSection = useCallback(
    async (sectionType: string, templateId?: string, width: string = "full") => {
      if (!canvas) {
        setErrorMessage("Cannot add section: Canvas is not initialized.");
        return;
      }
      let newSection: Section = {
        id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: sectionType,
        dimensions: { width: "100%", height: sectionType === "Header" || sectionType === "Footer" ? "64px" : "auto" },
        order: canvas.sections.length,
        layoutType: "row",
        width,
        style: {},
        advanced: {},
        alignment: "left",
      };
      if (templateId) {
        const template = sectionTemplates.find((t) => t.id === templateId);
        if (template) {
          newSection.layoutType = template.layoutType;
          newSection.layoutConfig = template.layoutConfig;
        }
      }
      const updatedSections = [...canvas.sections, newSection];
      const newCanvas = { ...canvas, sections: updatedSections };
      updateCanvasWithHistory(newCanvas);
      setErrorMessage(`Successfully added ${sectionType} section.`);
      setSelectedSectionId(null);
    },
    [canvas, sectionTemplates, updateCanvasWithHistory]
  );

  const handleDeleteSection = useCallback(
    (sectionId: string) => {
      if (!canvas) return;
      const updatedSections = canvas.sections.filter((section) => section.id !== sectionId);
      const newCanvas = { ...canvas, sections: updatedSections.map((s, i) => ({ ...s, order: i })) };
      updateCanvasWithHistory(newCanvas);
      if (selectedSectionId === sectionId) {
        setSelectedSectionId(null);
      }
    },
    [canvas, selectedSectionId, updateCanvasWithHistory]
  );

  const handleSectionUpdate = useCallback(
    (sectionId: string, updates: Partial<Section>) => {
      if (!canvas) return;
      const updatedSections = canvas.sections.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section
      );
      const newCanvas = { ...canvas, sections: updatedSections };
      updateCanvasWithHistory(newCanvas);
    },
    [canvas, updateCanvasWithHistory]
  );

  const handleDragEnd = useCallback(
    (event: any) => {
      const { active, over } = event;
      if (!over) return;
      if (active.id !== over.id) {
        if (active.id.startsWith("section") && over.id.startsWith("section")) {
          if (!canvas) return;
          const oldIndex = canvas.sections.findIndex((s) => s.id === active.id);
          const newIndex = canvas.sections.findIndex((s) => s.id === over.id);
          const reorderedSections = arrayMove(canvas.sections, oldIndex, newIndex);
          const newCanvas = { ...canvas, sections: reorderedSections.map((s, i) => ({ ...s, order: i })) };
          updateCanvasWithHistory(newCanvas);
        }
      }
    },
    [canvas, updateCanvasWithHistory]
  );

  const handleGenerateLayout = useCallback(
    async () => {
      const prompt = `Generate a layout for a ${aiPageType} page with the following requirements:
- Desired sections: ${desiredSections || "Header, Content, Footer"}
- Layout style: ${layoutStyle}
- Content focus: ${contentFocus || "General content"}`;
      setGeneratedPrompt(prompt);
      try {
        const response = await axios.post(`${API_BASE_URL}/ai-layout`, {
          page_type: aiPageType,
          desired_sections: desiredSections,
          layout_style: layoutStyle,
          content_focus: contentFocus,
        });
        const suggestion = response.data;
        setGeneratedLayout(JSON.stringify(suggestion, null, 2));
      } catch (error) {
        console.error("Error generating AI layout:", error);
        setErrorMessage("Failed to generate AI layout.");
        const fallbackLayout = {
          sections: [{ id: `section-ai-${aiPageType}-0`, type: desiredSections.split(",")[0] || "Header", layout_type: layoutStyle, dimensions: { width: "100%", height: "auto" }, style: {}, advanced: {} }],
        };
        setGeneratedLayout(JSON.stringify(fallbackLayout, null, 2));
      }
    },
    [aiPageType, desiredSections, layoutStyle, contentFocus]
  );

  const handleApplyLayout = useCallback(() => {
    if (!canvas) return;
    const suggestion = JSON.parse(generatedLayout);
    const updatedSections = [...canvas.sections, ...suggestion.sections.map((section: any, index: number) => ({
      id: `section-ai-${aiPageType}-${index}-${Date.now()}`,
      type: section.type,
      dimensions: section.dimensions || { width: "100%", height: "auto" },
      order: canvas.sections.length + index,
      layoutType: section.layout_type || "row",
      layoutConfig: section.layout_config,
      width: section.width || "full",
      style: section.style || {},
      advanced: section.advanced || {},
      alignment: "left",
    }))];
    const newCanvas = { ...canvas, sections: updatedSections };
    updateCanvasWithHistory(newCanvas);
    setErrorMessage("AI-suggested layout applied successfully.");
    setShowAILayoutModal(false);
  }, [canvas, generatedLayout, aiPageType, updateCanvasWithHistory]);

  const moveLayerUp = useCallback(() => {
    if (!canvas || !selectedLayer) return;
    const currentIndex = layerOrder.indexOf(selectedLayer);
    if (currentIndex < layerOrder.length - 1) {
      const newOrder = [...layerOrder];
      [newOrder[currentIndex], newOrder[currentIndex + 1]] = [newOrder[currentIndex + 1], newOrder[currentIndex]];
      setLayerOrder(newOrder);
      const updatedSections = newOrder.map((id, index) => ({
        ...canvas.sections.find((s) => s.id === id)!,
        order: index,
      }));
      const newCanvas = { ...canvas, sections: updatedSections };
      updateCanvasWithHistory(newCanvas);
    }
  }, [canvas, selectedLayer, layerOrder, updateCanvasWithHistory]);

  const moveLayerDown = useCallback(() => {
    if (!canvas || !selectedLayer) return;
    const currentIndex = layerOrder.indexOf(selectedLayer);
    if (currentIndex > 0) {
      const newOrder = [...layerOrder];
      [newOrder[currentIndex], newOrder[currentIndex - 1]] = [newOrder[currentIndex - 1], newOrder[currentIndex]];
      setLayerOrder(newOrder);
      const updatedSections = newOrder.map((id, index) => ({
        ...canvas.sections.find((s) => s.id === id)!,
        order: index,
      }));
      const newCanvas = { ...canvas, sections: updatedSections };
      updateCanvasWithHistory(newCanvas);
    }
  }, [canvas, selectedLayer, layerOrder, updateCanvasWithHistory]);

  return (
    <ThemeProvider theme={theme}>
      <EditorContainer>
        {showOnboarding && (
          <Alert
            severity="info"
            onClose={() => setShowOnboarding(false)}
            sx={{ position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)", zIndex: 1000 }}
          >
            Welcome to BlueprintStudio! Start by selecting a Page and adding Sections from the sidebar.
          </Alert>
        )}
        {errorMessage && (
          <Alert
            severity={errorMessage.includes("Failed") ? "error" : "success"}
            onClose={() => setErrorMessage(null)}
            sx={{ position: "fixed", top: 120, left: "50%", transform: "translateX(-50%)", zIndex: 1000 }}
          >
            {errorMessage}
          </Alert>
        )}
        <Sidebar>
          <SidebarMain
            isOpen={isMainSidebarOpen}
            toggleSidebar={() => setIsMainSidebarOpen(!isMainSidebarOpen)}
            storeId={storeId}
            setStoreId={setStoreId}
            pageTypeId={pageTypeId}
            setPageTypeId={setPageTypeId}
            stores={stores}
            pageTypes={pageTypes}
            pageSectionMapping={pageSectionMapping}
            sectionTemplates={sectionTemplates}
            sectionContentMapping={sectionContentMapping}
            handleAddSection={handleAddSection}
          />
          {isEditSidebarOpen && (
            <SidebarEdit
              isOpen={isEditSidebarOpen}
              toggleSidebar={() => setIsEditSidebarOpen(!isEditSidebarOpen)}
              selectedSectionId={selectedSectionId}
              section={canvas?.sections.find((s) => s.id === selectedSectionId) || null}
              handleSectionUpdate={handleSectionUpdate}
              sectionEditorTab={sectionEditorTab}
              setSectionEditorTab={setSectionEditorTab}
            />
          )}
        </Sidebar>
        <MainContent>
          <Box sx={{ display: "flex", height: "100%" }}>
            <EcomCanvasEditor
              canvas={canvas}
              setCanvas={setCanvas}
              updateCanvasWithHistory={updateCanvasWithHistory}
              handleSectionUpdate={handleSectionUpdate}
              handleAddSection={handleAddSection}
              handleDeleteSection={handleDeleteSection}
              zoomLevel={zoomLevel}
              deviceMode={deviceMode}
              setDeviceMode={setDeviceMode}
              showGrid={showGrid}
              setShowGrid={setShowGrid}
              showRulers={showRulers}
              setShowRulers={setShowRulers}
              previewMode={previewMode}
              setPreviewMode={setPreviewMode}
              selectedSectionId={selectedSectionId}
              setSelectedSectionId={setSelectedSectionId}
              alignment={alignment}
              setAlignment={setAlignment}
              layerOrder={layerOrder}
              setLayerOrder={setLayerOrder}
              selectedLayer={selectedLayer}
              setSelectedLayer={setSelectedLayer}
              deviceDimensions={deviceDimensions}
              themeConfig={themeConfig}
              designerInfo={designerInfo}
              setDesignerInfo={setDesignerInfo}
              setErrorMessage={setErrorMessage}
            />
          </Box>
        </MainContent>
        <Controls
          handleSave={handleSave}
          handleMarkComplete={handleMarkComplete}
          handlePublish={handlePublish}
          handleExport={handleExport}
          handleExportPDF={handleExportPDF}
          handleUndo={handleUndo}
          handleRedo={handleRedo}
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
          deviceMode={deviceMode}
          setDeviceMode={setDeviceMode}
          showGrid={showGrid}
          setShowGrid={setShowGrid}
          showRulers={showRulers}
          setShowRulers={setShowRulers}
          previewMode={previewMode}
          setPreviewMode={setPreviewMode}
          showAILayoutModal={showAILayoutModal}
          setShowAILayoutModal={setShowAILayoutModal}
          sidebarPosition={sidebarPosition}
          setSidebarPosition={setSidebarPosition}
          isCompleted={isCompleted}
          historyIndex={historyIndex}
          historyLength={history.length}
        />
        <LayerPanel
          canvas={canvas}
          layerOrder={layerOrder}
          selectedLayer={selectedLayer}
          setSelectedLayer={setSelectedLayer}
          moveLayerUp={moveLayerUp}
          moveLayerDown={moveLayerDown}
        />
        <CollaborationIndicator>
          <PeopleIconMaterial sx={{ color: "#757575" }} />
          <Typography variant="body2">{collaborators} users collaborating</Typography>
        </CollaborationIndicator>
        <DesignerInfoModal
          showDesignerModal={showDesignerModal}
          setShowDesignerModal={setShowDesignerModal}
          handleDesignerInfoSubmit={handleDesignerInfoSubmit}
        />
        <AILayoutModal
          showAILayoutModal={showAILayoutModal}
          setShowAILayoutModal={setShowAILayoutModal}
          aiPageType={aiPageType}
          setAIPageType={setAIPageType}
          desiredSections={desiredSections}
          setDesiredSections={setDesiredSections}
          layoutStyle={layoutStyle}
          setLayoutStyle={setLayoutStyle}
          contentFocus={contentFocus}
          setContentFocus={setContentFocus}
          generatedPrompt={generatedPrompt}
          setGeneratedPrompt={setGeneratedPrompt}
          generatedLayout={generatedLayout}
          setGeneratedLayout={setGeneratedLayout}
          handleGenerateLayout={handleGenerateLayout}
          handleApplyLayout={handleApplyLayout}
        />
      </EditorContainer>
    </ThemeProvider>
  );
}