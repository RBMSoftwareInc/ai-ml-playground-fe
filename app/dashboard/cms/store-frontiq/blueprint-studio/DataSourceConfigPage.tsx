"use client";

import React, { useState, useCallback } from "react";
import { Box, Typography, Select, MenuItem, Button, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";

interface DataSourceConfigPageProps {
  section: any;
  handleSectionUpdate: (sectionId: string, updates: Partial<any>) => void;
  onClose: () => void;
}

const ConfigWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: "#FFFFFF",
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
}));

const DataSourceConfigPage: React.FC<DataSourceConfigPageProps> = ({ section, handleSectionUpdate, onClose }) => {
  const [dataSource, setDataSource] = useState(section.advanced?.dataSource || "graphql");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = useCallback(() => {
    setIsLoading(true);
    handleSectionUpdate(section.id, { advanced: { ...section.advanced, dataSource } });
    setIsLoading(false);
    onClose();
  }, [section.id, section.advanced, dataSource, handleSectionUpdate, onClose]);

  return (
    <ConfigWrapper>
      <Typography variant="h6" gutterBottom>
        Configure Data Source
      </Typography>
      <Select
        value={dataSource}
        onChange={(e) => setDataSource(e.target.value as string)}
        fullWidth
        sx={{ mb: 2 }}
      >
        <MenuItem value="graphql">GraphQL API</MenuItem>
        <MenuItem value="trpc">tRPC</MenuItem>
        <MenuItem value="jsonapi">JSON:API</MenuItem>
      </Select>
      {error && <Typography color="error">{error}</Typography>}
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
          {isLoading ? <CircularProgress size={24} /> : "Save"}
        </Button>
      </Box>
    </ConfigWrapper>
  );
};

export default DataSourceConfigPage;