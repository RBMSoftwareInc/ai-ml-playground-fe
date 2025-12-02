"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import SectionRenderer from "./SectionRenderer";

interface LivePreviewPageProps {
  section: any;
  handleSectionUpdate: (sectionId: string, updates: Partial<any>) => void;
  onClose: () => void;
}

const PreviewWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: "#F5F5F5",
  height: "100vh",
  overflow: "auto",
}));

const LivePreviewPage: React.FC<LivePreviewPageProps> = ({ section, handleSectionUpdate, onClose }) => {
  const [previewContent, setPreviewContent] = useState(section.content || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLiveData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://api.yourplatform.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: `query { products { ${section.advanced?.fields?.join(" ") || "id title"} } }` }),
      });
      const data = await response.json();
      setPreviewContent(JSON.stringify(data.data.products || []));
      handleSectionUpdate(section.id, { content: JSON.stringify(data.data.products || []) });
    } catch (err) {
      setError("Failed to fetch live data. Using cached content.");
      setPreviewContent(section.content || "No data");
    }
    setIsLoading(false);
  }, [section.id, section.advanced?.fields, section.content, handleSectionUpdate]);

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 2000); // Throttle every 2 seconds
    return () => clearInterval(interval);
  }, [fetchLiveData]);

  return (
    <PreviewWrapper>
      <Typography variant="h6" gutterBottom>
        Live Preview
      </Typography>
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <SectionRenderer
          section={{ ...section, content: previewContent }}
          index={0}
          handleSectionUpdate={handleSectionUpdate}
          handleDeleteSection={() => {}}
          onDragStart={() => {}}
          onDrop={() => {}}
          onEdit={() => {}}
        />
      )}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button onClick={onClose} sx={{ color: "#333333" }} variant="contained">
          Close
        </Button>
      </Box>
    </PreviewWrapper>
  );
};

export default LivePreviewPage;