// File: components/CMS/ProjectEditor.tsx

"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  Chip,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const mockProject = {
  id: 1,
  name: "Summer Promo Launch",
  description: "Launch campaign assets for summer promotion.",
  status: "draft",
  assets: [
    {
      id: 101,
      name: "summer_banner.jpg",
      type: "image",
      status: "draft",
    },
    {
      id: 102,
      name: "homepage_promo.html",
      type: "html",
      status: "in_review",
    },
  ],
};

export default function ProjectEditor() {
  const [project, setProject] = useState(mockProject);
  const [newAssetName, setNewAssetName] = useState("");
  const [newAssetType, setNewAssetType] = useState("image");

  const handleAddAsset = () => {
    const newAsset = {
      id: Date.now(),
      name: newAssetName,
      type: newAssetType,
      status: "draft",
    };
    setProject((prev) => ({
      ...prev,
      assets: [...prev.assets, newAsset],
    }));
    setNewAssetName("");
    setNewAssetType("image");
  };

  const handleDeleteAsset = (id: number) => {
    setProject((prev) => ({
      ...prev,
      assets: prev.assets.filter((a) => a.id !== id),
    }));
  };

  return (
    <Box>
      <Typography variant="h5" color="primary" gutterBottom>
        Edit Project: {project.name}
      </Typography>
      <Typography variant="body2" color="textSecondary" mb={2}>
        {project.description}
      </Typography>

      <Box component={Paper} variant="outlined" p={2} mb={3}>
        <Typography variant="subtitle1">Add Asset</Typography>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={5}>
            <TextField
              label="Asset Name"
              fullWidth
              value={newAssetName}
              onChange={(e) => setNewAssetName(e.target.value)}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Type"
              fullWidth
              value={newAssetType}
              onChange={(e) => setNewAssetType(e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              onClick={handleAddAsset}
              variant="contained"
              color="primary"
              disabled={!newAssetName}
              fullWidth
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Typography variant="subtitle1" gutterBottom>
        Project Assets
      </Typography>

      <Box component={Paper} variant="outlined" p={2}>
        {project.assets.length === 0 ? (
          <Typography>No assets added yet.</Typography>
        ) : (
          project.assets.map((asset) => (
            <Box
              key={asset.id}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={1}
            >
              <Box>
                <Typography>{asset.name}</Typography>
                <Chip label={asset.type} size="small" sx={{ mr: 1 }} />
                <Chip
                  label={asset.status}
                  size="small"
                  color={
                    asset.status === "in_review"
                      ? "warning"
                      : asset.status === "draft"
                      ? "default"
                      : "success"
                  }
                />
              </Box>
              <IconButton onClick={() => handleDeleteAsset(asset.id)}>
                <DeleteIcon color="error" />
              </IconButton>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}