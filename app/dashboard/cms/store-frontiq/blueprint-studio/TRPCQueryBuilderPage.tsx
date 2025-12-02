"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Button, CircularProgress, TextField, FormControlLabel, Checkbox, MenuItem, Select } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";

interface TRPCQueryBuilderPageProps {
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

const TRPCQueryBuilderPage: React.FC<TRPCQueryBuilderPageProps> = ({ section, handleSectionUpdate, onClose }) => {
  const [procedure, setProcedure] = useState(section.advanced?.procedure || "getProducts");
  const [params, setParams] = useState(section.advanced?.params || {});
  const [liveUpdates, setLiveUpdates] = useState(!!section.advanced?.liveUpdates);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableProcedures = ["getProducts", "getReviews", "getCategories"]; // Mock tRPC procedures

  useEffect(() => {
    const fetchPreview = async () => {
      if (!procedure) return;
      setIsLoading(true);
      try {
        const response = await axios.post("https://api.yourplatform.com/trpc", {
          json: { method: procedure, params },
        });
        setPreviewData(response.data.result.data || []);
      } catch (err) {
        setError("Failed to fetch preview data. Using mock data.");
        setPreviewData([{ id: "1", name: "Mock Product" }]); // Fallback
      }
      setIsLoading(false);
    };
    const timeout = setTimeout(fetchPreview, 500); // Throttle
    return () => clearTimeout(timeout);
  }, [procedure, params]);

  const handleSave = useCallback(() => {
    handleSectionUpdate(section.id, {
      advanced: { ...section.advanced, procedure, params, liveUpdates },
      content: previewData.length ? JSON.stringify(previewData) : section.content,
    });
    onClose();
  }, [section.id, section.advanced, procedure, params, liveUpdates, previewData, handleSectionUpdate, onClose]);

  const handleParamChange = (key: string, value: string) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <BuilderWrapper>
      <Typography variant="h6" gutterBottom>
        Build tRPC Query
      </Typography>
      <Select
        value={procedure}
        onChange={(e) => setProcedure(e.target.value as string)}
        fullWidth
        sx={{ mb: 2 }}
      >
        {availableProcedures.map((proc) => (
          <MenuItem key={proc} value={proc}>
            {proc}
          </MenuItem>
        ))}
      </Select>
      <Typography variant="body2" gutterBottom>
        Parameters:
      </Typography>
      <TextField
        label="Limit"
        value={params.limit || ""}
        onChange={(e) => handleParamChange("limit", e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
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
              <Typography>Item {index + 1}: {JSON.stringify(item)}</Typography>
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
          disabled={isLoading}
          sx={{ color: "#333333" }}
          variant="contained"
        >
          Save
        </Button>
      </Box>
    </BuilderWrapper>
  );
};

export default TRPCQueryBuilderPage;