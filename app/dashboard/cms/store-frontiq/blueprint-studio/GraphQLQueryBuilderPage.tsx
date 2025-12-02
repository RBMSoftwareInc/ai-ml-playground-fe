"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Button, CircularProgress, Checkbox, FormControlLabel } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";

interface GraphQLQueryBuilderPageProps {
  section: any;
  handleSectionUpdate: (sectionId: string, updates: Partial<any>) => void;
  onClose: () => void;
}

const BuilderWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: "#FFFFFF",
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
}));

const GraphQLQueryBuilderPage: React.FC<GraphQLQueryBuilderPageProps> = ({ section, handleSectionUpdate, onClose }) => {
  const [fields, setFields] = useState<string[]>(section.advanced?.fields || []);
  const [liveUpdates, setLiveUpdates] = useState(!!section.advanced?.liveUpdates);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableFields = ["id", "title", "price", "imageUrl", "description"]; // Mock schema

  useEffect(() => {
    const fetchPreview = async () => {
      if (!fields.length) return;
      setIsLoading(true);
      try {
        const response = await axios.post("https://api.yourplatform.com/graphql", {
          query: `query { products { ${fields.join(" ")} } }`,
        });
        setPreviewData(response.data.data.products || []);
      } catch (err) {
        setError("Failed to fetch preview data. Using mock data.");
        setPreviewData([{ id: "1", title: "Mock Product", price: "99.99" }]); // Fallback
      }
      setIsLoading(false);
    };
    const timeout = setTimeout(fetchPreview, 500); // Throttle
    return () => clearTimeout(timeout);
  }, [fields]);

  const handleSave = useCallback(() => {
    handleSectionUpdate(section.id, {
      advanced: { ...section.advanced, fields, liveUpdates },
      content: previewData.length ? JSON.stringify(previewData) : section.content,
    });
    onClose();
  }, [section.id, section.advanced, fields, liveUpdates, previewData, handleSectionUpdate, onClose]);

  return (
    <BuilderWrapper>
      <Typography variant="h6" gutterBottom>
        Build GraphQL Query
      </Typography>
      <Typography variant="body2" gutterBottom>
        Select fields to display:
      </Typography>
      {availableFields.map((field) => (
        <FormControlLabel
          key={field}
          control={<Checkbox checked={fields.includes(field)} onChange={(e) => {
            setFields(e.target.checked ? [...fields, field] : fields.filter(f => f !== field));
          }} />}
          label={field}
        />
      ))}
      <FormControlLabel
        control={<Checkbox checked={liveUpdates} onChange={(e) => setLiveUpdates(e.target.checked)} />}
        label="Enable Live Updates"
      />
      <Typography variant="body2" sx={{ mt: 2 }}>
        Preview:
      </Typography>
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : previewData.length ? (
        <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
          {previewData.map((item, index) => (
            <Box key={index} sx={{ border: "1px solid #ddd", p: 1, mb: 1 }}>
              {fields.map((field) => (
                <Typography key={field}>{field}: {item[field] || "N/A"}</Typography>
              ))}
            </Box>
          ))}
        </Box>
      ) : (
        <Typography>No data available</Typography>
      )}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button onClick={onClose} sx={{ mr: 1, color: "#333333" }}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isLoading || !fields.length}
          sx={{ color: "#333333" }}
          variant="contained"
        >
          Save
        </Button>
      </Box>
    </BuilderWrapper>
  );
};

export default GraphQLQueryBuilderPage;