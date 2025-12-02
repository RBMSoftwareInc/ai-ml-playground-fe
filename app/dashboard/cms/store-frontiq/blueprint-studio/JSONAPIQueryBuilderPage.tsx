"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Button, CircularProgress, TextField, FormControlLabel, Checkbox, MenuItem, Select } from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";

interface JSONAPIQueryBuilderPageProps {
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

const JSONAPIQueryBuilderPage: React.FC<JSONAPIQueryBuilderPageProps> = ({ section, handleSectionUpdate, onClose }) => {
  const [resource, setResource] = useState(section.advanced?.resource || "products");
  const [include, setInclude] = useState(section.advanced?.include || "");
  const [fields, setFields] = useState(section.advanced?.fields || []);
  const [liveUpdates, setLiveUpdates] = useState(!!section.advanced?.liveUpdates);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableResources = ["products", "reviews", "categories"]; // Mock resources
  const availableFieldsPerResource = {
    products: ["id", "title", "price"],
    reviews: ["id", "comment"],
    categories: ["id", "name"],
  };

  useEffect(() => {
    const fetchPreview = async () => {
      if (!resource) return;
      setIsLoading(true);
      try {
        const url = `https://api.yourplatform.com/jsonapi/${resource}?include=${include}&fields[${resource}]=${fields.join(",")}`;
        const response = await axios.get(url);
        setPreviewData(response.data.data || []);
      } catch (err) {
        setError("Failed to fetch preview data. Using mock data.");
        setPreviewData([{ id: "1", title: "Mock Product" }]); // Fallback
      }
      setIsLoading(false);
    };
    const timeout = setTimeout(fetchPreview, 500); // Throttle
    return () => clearTimeout(timeout);
  }, [resource, include, fields]);

  const handleSave = useCallback(() => {
    handleSectionUpdate(section.id, {
      advanced: { ...section.advanced, resource, include, fields, liveUpdates },
      content: previewData.length ? JSON.stringify(previewData) : section.content,
    });
    onClose();
  }, [section.id, section.advanced, resource, include, fields, liveUpdates, previewData, handleSectionUpdate, onClose]);

  return (
    <BuilderWrapper>
      <Typography variant="h6" gutterBottom>
        Build JSON:API Query
      </Typography>
      <Select
        value={resource}
        onChange={(e) => setResource(e.target.value as string)}
        fullWidth
        sx={{ mb: 2 }}
      >
        {availableResources.map((res) => (
          <MenuItem key={res} value={res}>
            {res}
          </MenuItem>
        ))}
      </Select>
      <TextField
        label="Include Relationships"
        value={include}
        onChange={(e) => setInclude(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Typography variant="body2" gutterBottom>
        Fields:
      </Typography>
      {availableFieldsPerResource[resource]?.map((field) => (
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
              <Typography>Item {index + 1}: {JSON.stringify(item.attributes)}</Typography>
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
          disabled={isLoading || !resource}
          sx={{ color: "#333333" }}
          variant="contained"
        >
          Save
        </Button>
      </Box>
    </BuilderWrapper>
  );
};

export default JSONAPIQueryBuilderPage;