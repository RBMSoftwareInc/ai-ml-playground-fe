// File: components/CMS/DeploymentManager.tsx

"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Chip,
  CircularProgress,
  Button,
} from "@mui/material";

// Mock data
const mockDeployments = [
  {
    id: 1,
    project: "Homepage Revamp",
    status: "completed",
    deployedBy: "Ravi",
    startedAt: "2024-05-10 10:00",
    completedAt: "2024-05-10 10:20",
  },
  {
    id: 2,
    project: "New Collection Launch",
    status: "pending",
    deployedBy: "Priya",
    startedAt: "2024-05-12 09:45",
    completedAt: null,
  },
  {
    id: 3,
    project: "Footer Update",
    status: "failed",
    deployedBy: "Admin",
    startedAt: "2024-05-09 15:10",
    completedAt: "2024-05-09 15:12",
  }
];

export default function DeploymentManager() {
  const [deployments, setDeployments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setDeployments(mockDeployments);
      setLoading(false);
    }, 600);
  }, []);

  return (
    <Box>
      <Typography variant="h5" color="primary" gutterBottom>
        Deployment Manager
      </Typography>
      <Typography variant="body2" color="textSecondary" mb={2}>
        View, track, and manage deployments across all CMS projects.
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Deployment ID</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Started At</TableCell>
                <TableCell>Completed At</TableCell>
                <TableCell>Deployed By</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deployments.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>{d.id}</TableCell>
                  <TableCell>{d.project}</TableCell>
                  <TableCell>
                    <Chip
                      label={d.status}
                      size="small"
                      color={
                        d.status === "completed"
                          ? "success"
                          : d.status === "pending"
                          ? "warning"
                          : d.status === "failed"
                          ? "error"
                          : "default"
                      }
                    />
                  </TableCell>
                  <TableCell>{d.startedAt}</TableCell>
                  <TableCell>{d.completedAt || "—"}</TableCell>
                  <TableCell>{d.deployedBy}</TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" disabled={d.status !== "pending"}>
                      Retry
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
