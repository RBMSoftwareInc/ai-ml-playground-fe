"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Drawer,
  Divider,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import CloseIcon from "@mui/icons-material/Close";

const mockProject = {
  id: 1,
  name: "Spring 2025 Launch",
  description: "All assets for spring home and fashion catalog rollout.",
  status: "review",
  created_by: "john.doe",
  created_at: "2024-12-01T10:30:00Z",
};

const mockAssets = [
  {
    id: 101,
    name: "Menswear Category",
    type: "Category",
    version: "v3",
    locked_by: "john.doe",
    status: "in_review",
  },
  {
    id: 102,
    name: "Slim Fit Shirt",
    type: "Product",
    version: "v5",
    locked_by: null,
    status: "draft",
  },
  {
    id: 103,
    name: "SlimFit-L-Red",
    type: "SKU",
    version: "v2",
    locked_by: "alice.wu",
    status: "approved",
  },
];

const mockLogs = [
  {
    user: "alice.wu",
    action: "edited",
    message: "Updated product description",
    timestamp: "2024-12-05 14:32",
  },
  {
    user: "john.doe",
    action: "locked",
    message: "Locked category for updates",
    timestamp: "2024-12-04 11:22",
  },
];

export default function ProjectDetails() {
  const [project, setProject] = useState(mockProject);
  const [assets, setAssets] = useState(mockAssets);
  const [logs, setLogs] = useState(mockLogs);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  const handleStatusChange = (e: any) => {
    setProject({ ...project, status: e.target.value });
  };

  const handleAssetClick = (asset: any) => {
    setSelectedAsset(asset);
  };

  return (
    <Box p={3}>
      {/* Project Summary */}
      <Typography variant="h4" gutterBottom>
        {project.name}
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          label="Description"
          fullWidth
          value={project.description}
          onChange={(e) => setProject({ ...project, description: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          select
          label="Status"
          value={project.status}
          onChange={handleStatusChange}
          sx={{ width: 200 }}
        >
          <MenuItem value="draft">Draft</MenuItem>
          <MenuItem value="review">In Review</MenuItem>
          <MenuItem value="approved">Approved</MenuItem>
          <MenuItem value="deployed">Deployed</MenuItem>
        </TextField>
      </Paper>

      {/* Asset Table */}
      <Typography variant="h6" gutterBottom>
        Linked Assets
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Asset Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Locked By</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id} hover onClick={() => handleAssetClick(asset)} sx={{ cursor: "pointer" }}>
                <TableCell>{asset.name}</TableCell>
                <TableCell>{asset.type}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={asset.status}
                    color={
                      asset.status === "draft"
                        ? "default"
                        : asset.status === "in_review"
                        ? "warning"
                        : asset.status === "approved"
                        ? "success"
                        : "info"
                    }
                  />
                </TableCell>
                <TableCell>{asset.version}</TableCell>
                <TableCell>
                  {asset.locked_by ? (
                    <Chip size="small" icon={<LockIcon />} label={asset.locked_by} />
                  ) : (
                    <Chip size="small" icon={<LockOpenIcon />} label="Unlocked" variant="outlined" />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton title="Approve">
                    <CheckCircleIcon color="success" />
                  </IconButton>
                  <IconButton title="Reject">
                    <CancelIcon color="error" />
                  </IconButton>
                  <IconButton title="Deploy">
                    <RocketLaunchIcon color="primary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Project Logs */}
      <Typography variant="h6" gutterBottom>
        Activity Log
      </Typography>

      <Paper sx={{ p: 2 }}>
        {logs.map((log, i) => (
          <Box key={i} mb={1}>
            <Typography variant="body2">
              <b>{log.user}</b> {log.action} – {log.message} <br />
              <Typography variant="caption" color="text.secondary">
                {log.timestamp}
              </Typography>
            </Typography>
            <Divider sx={{ my: 1 }} />
          </Box>
        ))}
      </Paper>

      {/* Right Drawer – Asset Edit */}
      <Drawer anchor="right" open={!!selectedAsset} onClose={() => setSelectedAsset(null)} PaperProps={{ sx: { width: 400 } }}>
        <Box p={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Edit Asset</Typography>
            <IconButton onClick={() => setSelectedAsset(null)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ my: 2 }} />

          {selectedAsset && (
            <>
              <TextField
                label="Asset Name"
                fullWidth
                value={selectedAsset.name}
                onChange={(e) =>
                  setSelectedAsset({ ...selectedAsset, name: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                label="Version"
                fullWidth
                value={selectedAsset.version}
                onChange={(e) =>
                  setSelectedAsset({ ...selectedAsset, version: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                select
                fullWidth
                label="Status"
                value={selectedAsset.status}
                onChange={(e) =>
                  setSelectedAsset({ ...selectedAsset, status: e.target.value })
                }
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="in_review">In Review</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
              </TextField>

              <Button variant="contained" sx={{ mt: 3 }} fullWidth>
                Save Changes
              </Button>
            </>
          )}
        </Box>
      </Drawer>
    </Box>
  );
}
