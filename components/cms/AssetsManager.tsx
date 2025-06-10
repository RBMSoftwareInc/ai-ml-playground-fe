// File: components/CMS/AssetBrowser.tsx (formerly AssetsManager.tsx)

"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
} from "@mui/material";

interface Asset {
  id: number;
  name: string;
  type: string;
  status: string;
  usedIn: string[];
  project: string | null;
}

const mockAssets: Asset[] = [
  {
    id: 1,
    name: "banner_homepage.jpg",
    type: "image",
    status: "deployed",
    usedIn: ["Home Page Banner"],
    project: null,
  },
  {
    id: 2,
    name: "promo_march.html",
    type: "html",
    status: "locked",
    usedIn: ["CLP: Electronics"],
    project: "March Promo Project",
  },
  {
    id: 3,
    name: "chair_model_X_render.png",
    type: "image",
    status: "available",
    usedIn: [],
    project: null,
  },
];

interface AssetBrowserProps {
  editable?: boolean;
}

export default function AssetBrowser({ editable = false }: AssetBrowserProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAssets(mockAssets);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <Box>
      <Typography variant="h5" color="primary" gutterBottom>
        {editable ? "Project Assets" : "All CMS Assets (Read-Only)"}
      </Typography>

      {!editable && (
        <Typography variant="body2" color="textSecondary" mb={2}>
          View all uploaded/generated assets across the system. Edits and uploads must be done inside a project.
        </Typography>
      )}

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Asset Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Used In</TableCell>
                <TableCell>Project</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>
                    <Chip size="small" label={asset.type} color="default" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={asset.status}
                      color={
                        asset.status === "deployed"
                          ? "success"
                          : asset.status === "locked"
                          ? "warning"
                          : "default"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {asset.usedIn.length ? asset.usedIn.join(", ") : "—"}
                  </TableCell>
                  <TableCell>{asset.project || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
