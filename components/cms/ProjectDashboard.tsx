"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  IconButton,
  Grid,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function ProjectDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:5000/api/v1/project");
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">CMS Projects</Typography>
        <Button variant="contained">New Project</Button>
      </Box>

      <Paper elevation={1} sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1">All Projects</Typography>
          <IconButton onClick={fetchProjects}><RefreshIcon /></IconButton>
        </Box>

        <Grid container spacing={2} mt={2}>
          {projects.map((proj) => (
            <Grid item xs={12} md={6} lg={4} key={proj.id}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6">{proj.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {proj.description}
                </Typography>
                <Typography variant="caption" display="block" mt={1}>
                  Created: {new Date(proj.created_at).toLocaleDateString()}
                </Typography>
                <Chip
                  label={proj.status}
                  color={
                    proj.status === "draft"
                      ? "default"
                      : proj.status === "deployed"
                      ? "success"
                      : proj.status === "rejected"
                      ? "error"
                      : "warning"
                  }
                  sx={{ mt: 1 }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}
