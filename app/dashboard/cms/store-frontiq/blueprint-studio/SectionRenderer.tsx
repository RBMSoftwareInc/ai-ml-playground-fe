"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Box, Typography, IconButton, Dialog, DialogTitle, DialogContent, Tabs, Tab, Button, Radio, RadioGroup, FormControlLabel, MenuItem, TextField } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import _ from "lodash"; // Add lodash for debounce
import dynamic from "next/dynamic";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import DataSourceConfigPage from "./DataSourceConfigPage";
import GraphQLQueryBuilderPage from "./GraphQLQueryBuilderPage";
import TRPCQueryBuilderPage from "./TRPCQueryBuilderPage";
import JSONAPIQueryBuilderPage from "./JSONAPIQueryBuilderPage";
import LivePreviewPage from "./LivePreviewPage";

interface SectionRendererProps {
  section: Section;
  index: number;
  handleSectionUpdate: (sectionId: string, updates: Partial<Section>) => void;
  handleDeleteSection: (sectionId: string) => void;
  onDragStart: (sectionId: string, e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetIndex: number) => void;
  onEdit: () => void;
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
  advanced?: { [key: string]: string | boolean | string[] | { [key: string]: string } };
  visibility_condition?: string;
  content?: string;
  alignment?: "left" | "center" | "right";
}

const SectionWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  border: `1px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  background: "#FFFFFF",
  marginBottom: theme.spacing(2),
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  cursor: "move",
  position: "relative",
  overflow: "auto",
  "&:hover": {
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },
}));

const ContentContainer = styled("div")(({ theme, alignment }) => ({
  width: "100%",
  minHeight: "100px",
  textAlign: alignment || "left",
}));

const ResizeHandle = styled(Box)(({ theme, position }) => ({
  position: "absolute",
  width: "10px",
  height: "10px",
  background: "#757575",
  cursor:
    position.includes("se")
      ? "se-resize"
      : position.includes("sw")
      ? "sw-resize"
      : position.includes("ne")
      ? "ne-resize"
      : "nw-resize",
  zIndex: 1,
  "&:hover": {
    background: "#333333",
  },
  ...(position === "top-left" && { top: 0, left: 0, cursor: "nw-resize" }),
  ...(position === "top-right" && { top: 0, right: 0, cursor: "ne-resize" }),
  ...(position === "bottom-left" && { bottom: 0, left: 0, cursor: "sw-resize" }),
  ...(position === "bottom-right" && { bottom: 0, right: 0, cursor: "se-resize" }),
}));

const TabPanel = (props: { children?: React.ReactNode; value: number; index: number }) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
};

const SectionRenderer: React.FC<SectionRendererProps> = ({
  section,
  index,
  handleSectionUpdate,
  handleDeleteSection,
  onDragStart,
  onDrop,
  onEdit,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState<{
    active: boolean;
    position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  }>({ active: false, position: "bottom-right" });
  const [dimensions, setDimensions] = useState(section.dimensions);
  const [editOpen, setEditOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [contentType, setContentType] = useState<"manual" | "api">(section.advanced?.apiUrl ? "api" : "manual");
  const [htmlContent, setHtmlContent] = useState(section.content || "");
  const [apiUrl, setApiUrl] = useState(section.advanced?.apiUrl || "");

  const debouncedHandleSectionUpdate = useCallback(
    _.debounce((id: string, updates: Partial<Section>) => {
      handleSectionUpdate(id, updates);
    }, 100),
    [handleSectionUpdate]
  );

  const [{ isDragging }, drag] = useDrag({
    type: "SECTION",
    item: { id: section.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "SECTION",
    hover: (item: { id: string }) => {
      if (item.id !== section.id) {
        onDrop(null!, index);
      }
    },
  });

  drag(drop(ref));

  useEffect(() => {
    if (
      dimensions.width !== section.dimensions.width ||
      dimensions.height !== section.dimensions.height ||
      section.alignment !== section.alignment
    ) {
      debouncedHandleSectionUpdate(section.id, { dimensions, alignment: section.alignment });
    }
  }, [dimensions, section.alignment, section.id, debouncedHandleSectionUpdate]);

  const handleMouseDown = (position: "top-left" | "top-right" | "bottom-left" | "bottom-right") => (e: React.MouseEvent) => {
    setIsResizing({ active: true, position });
    e.preventDefault();
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isResizing.active && ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const deltaX = e.clientX - rect.left;
        const deltaY = e.clientY - rect.top;
        let newWidth = parseInt(dimensions.width, 10) || rect.width;
        let newHeight = parseInt(dimensions.height, 10) || rect.height;

        switch (isResizing.position) {
          case "top-left":
            newWidth = Math.max(100, rect.width - deltaX);
            newHeight = Math.max(100, rect.height - deltaY);
            break;
          case "top-right":
            newWidth = Math.max(100, rect.width + deltaX);
            newHeight = Math.max(100, rect.height - deltaY);
            break;
          case "bottom-left":
            newWidth = Math.max(100, rect.width - deltaX);
            newHeight = Math.max(100, rect.height + deltaY);
            break;
          case "bottom-right":
            newWidth = Math.max(100, rect.width + deltaX);
            newHeight = Math.max(100, rect.height + deltaY);
            break;
        }

        setDimensions({
          width: `${newWidth}px`,
          height: `${newHeight}px`,
        });
      }
    },
    [isResizing.active, dimensions]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing({ active: false, position: "bottom-right" });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && isResizing.active) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [isResizing.active, handleMouseMove, handleMouseUp]);

  const handleDoubleClick = () => {
    setEditOpen(true);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveSection = () => {
    const updates: Partial<Section> = {
      content: contentType === "manual" ? htmlContent : section.content,
      advanced: { ...section.advanced, apiUrl: contentType === "api" ? apiUrl : "" },
    };
    handleSectionUpdate(section.id, updates);
    setEditOpen(false);
  };

  const handleContentTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newType = event.target.value as "manual" | "api";
    setContentType(newType);
    if (newType === "manual") {
      handleSectionUpdate(section.id, { content: htmlContent, advanced: { ...section.advanced, apiUrl: "" } });
    }
  };

  return (
    <SectionWrapper
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        ...dimensions,
        ...section.style,
        backgroundColor: section.style?.backgroundColor || "#FFFFFF",
        color: section.style?.color || "#333333",
        position: "relative",
      }}
      onDoubleClick={handleDoubleClick}
      draggable
      onDragStart={(e) => onDragStart(section.id, e)}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Typography variant="h6" sx={{ color: "#333333" }}>
          {section.type}
        </Typography>
        <Box>
          <IconButton onClick={() => setEditOpen(true)} size="small" sx={{ color: "#757575" }}>
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDeleteSection(section.id)}
            size="small"
            sx={{ color: "#757575" }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
      <ContentContainer
        alignment={section.alignment}
        style={{
          backgroundColor: section.style?.backgroundColor || "#FFFFFF",
          color: section.style?.color || "#333333",
        }}
        dangerouslySetInnerHTML={{ __html: section.content || "" }}
      />
      <ResizeHandle position="top-left" onMouseDown={handleMouseDown("top-left")} />
      <ResizeHandle position="top-right" onMouseDown={handleMouseDown("top-right")} />
      <ResizeHandle position="bottom-left" onMouseDown={handleMouseDown("bottom-left")} />
      <ResizeHandle position="bottom-right" onMouseDown={handleMouseDown("bottom-right")} />
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
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
              value={dimensions.width || "100%"}
              onChange={(e) =>
                setDimensions((prev) => ({ ...prev, width: e.target.value }))
              }
              fullWidth
            />
            <TextField
              margin="dense"
              label="Height"
              value={dimensions.height || "auto"}
              onChange={(e) =>
                setDimensions((prev) => ({ ...prev, height: e.target.value }))
              }
              fullWidth
            />
            <TextField
              margin="dense"
              label="Background Color"
              value={section.style?.backgroundColor || ""}
              onChange={(e) =>
                handleSectionUpdate(section.id, {
                  style: { ...section.style, backgroundColor: e.target.value },
                })
              }
              fullWidth
            />
            <TextField
              margin="dense"
              label="Text Color"
              value={section.style?.color || ""}
              onChange={(e) =>
                handleSectionUpdate(section.id, {
                  style: { ...section.style, color: e.target.value },
                })
              }
              fullWidth
            />
            <TextField
              margin="dense"
              label="Alignment"
              select
              value={section.alignment || "left"}
              onChange={(e) =>
                handleSectionUpdate(section.id, { alignment: e.target.value as "left" | "center" | "right" })
              }
              fullWidth
            >
              <MenuItem value="left">Left</MenuItem>
              <MenuItem value="center">Center</MenuItem>
              <MenuItem value="right">Right</MenuItem>
            </TextField>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <RadioGroup
              value={contentType}
              onChange={handleContentTypeChange}
              sx={{ mb: 2 }}
            >
              <FormControlLabel value="manual" control={<Radio />} label="Manual HTML" />
              <FormControlLabel value="api" control={<Radio />} label="API Content" />
            </RadioGroup>
            {contentType === "manual" ? (
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
            ) : (
              <>
                <DataSourceConfigPage
                  section={section}
                  handleSectionUpdate={handleSectionUpdate}
                  onClose={() => {}}
                />
                {section.advanced?.dataSource === "graphql" && (
                  <GraphQLQueryBuilderPage
                    section={section}
                    handleSectionUpdate={handleSectionUpdate}
                    onClose={() => {}}
                  />
                )}
                {section.advanced?.dataSource === "trpc" && (
                  <TRPCQueryBuilderPage
                    section={section}
                    handleSectionUpdate={handleSectionUpdate}
                    onClose={() => {}}
                  />
                )}
                {section.advanced?.dataSource === "jsonapi" && (
                  <JSONAPIQueryBuilderPage
                    section={section}
                    handleSectionUpdate={handleSectionUpdate}
                    onClose={() => {}}
                  />
                )}
                <Button
                  onClick={handleSaveSection}
                  sx={{ mt: 2, color: "#333333" }}
                  variant="contained"
                >
                  Save
                </Button>
                <Button
                  onClick={() => setEditOpen(false)}
                  sx={{ mt: 2, mr: 1, color: "#333333" }}
                >
                  Cancel
                </Button>
              </>
            )}
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <TextField
              margin="dense"
              label="Custom CSS"
              value={section.advanced?.customCSS || ""}
              onChange={(e) =>
                handleSectionUpdate(section.id, {
                  advanced: { ...section.advanced, customCSS: e.target.value },
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
              value={section.visibility_condition || ""}
              onChange={(e) =>
                handleSectionUpdate(section.id, { visibility_condition: e.target.value })
              }
              fullWidth
            />
          </TabPanel>
        </DialogContent>
      </Dialog>
    </SectionWrapper>
  );
};

export default SectionRenderer;