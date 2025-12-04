'use client';

import { Box, Typography, Paper, Button, Chip } from '@mui/material';
import { useRouter } from 'next/navigation';
import DevLabLayout from '../../components/devlab/DevLabLayout';
import QuickActionsBar from '../../components/devlab/QuickActionsBar';
import DevToolsDock from '../../components/devlab/DevToolsDock';
import InsightsFeed from '../../components/devlab/InsightsFeed';
import { motion } from 'framer-motion';
import sampleProjects from '../../data/devlab/sample-projects.json';
import FolderIcon from '@mui/icons-material/Folder';

export default function DevLabHome() {
  const router = useRouter();

  return (
    <DevLabLayout title="DevLab">
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Quick Actions */}
        <QuickActionsBar />

        {/* Dev Tools Dock */}
        <DevToolsDock />

        {/* Main Content */}
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left: Projects & Insights */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
            {/* Recent Projects */}
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Recent Projects
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
                {sampleProjects.projects.map((project) => (
                  <motion.div
                    key={project.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Paper
                      onClick={() => router.push(`/devlab/sandbox?project=${project.id}`)}
                      sx={{
                        p: 2,
                        bgcolor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: 'rgba(255,0,0,0.3)',
                          bgcolor: 'rgba(255,255,255,0.08)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <FolderIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.6)' }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {project.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1, fontSize: '0.85rem' }}>
                        {project.description}
                      </Typography>
                      <Chip
                        label={project.language}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255,0,0,0.1)',
                          color: '#ff0000',
                          fontSize: '0.7rem',
                          height: 20,
                        }}
                      />
                    </Paper>
                  </motion.div>
                ))}
              </Box>
            </Box>

            {/* AI Insights Feed */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              <InsightsFeed />
            </Box>
          </Box>
        </Box>
      </Box>
    </DevLabLayout>
  );
}

