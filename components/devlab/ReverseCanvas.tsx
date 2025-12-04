'use client';

import { useState } from 'react';
import { Box, Typography, Paper, Button, Chip, List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import { motion } from 'framer-motion';
import UploadArea from './UploadArea';
import FileTree from './FileTree';
import reverseSample from '../../data/devlab/reverse-sample.json';

export default function ReverseCanvas() {
  const [uploaded, setUploaded] = useState(false);
  const [selectedVuln, setSelectedVuln] = useState<string | null>(null);

  const handleUpload = () => {
    // Mock upload
    setTimeout(() => {
      setUploaded(true);
    }, 1000);
  };

  const handleGenerateUML = () => {
    // Mock UML generation
    alert('UML diagram generated (mock)');
  };

  const handleDetectVulnerabilities = () => {
    // Mock vulnerability detection
    setSelectedVuln('vuln-1');
  };

  return (
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Left: File Tree */}
      <Box sx={{ width: 300, borderRight: '1px solid rgba(255,255,255,0.1)' }}>
        {uploaded ? (
          <FileTree tree={reverseSample.fileTree} />
        ) : (
          <Box sx={{ p: 3, textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
            <Typography variant="body2">Upload a project to view file tree</Typography>
          </Box>
        )}
      </Box>

      {/* Center: Diagram Canvas */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {!uploaded ? (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UploadArea onUpload={handleUpload} />
          </Box>
        ) : (
          <>
            {/* Toolbar */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                p: 2,
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                bgcolor: 'rgba(0,0,0,0.3)',
              }}
            >
              <Button
                onClick={handleGenerateUML}
                sx={{
                  textTransform: 'none',
                  color: 'rgba(255,255,255,0.8)',
                  '&:hover': {
                    bgcolor: 'rgba(255,0,0,0.1)',
                  },
                }}
              >
                Generate UML
              </Button>
              <Button
                onClick={handleDetectVulnerabilities}
                sx={{
                  textTransform: 'none',
                  color: 'rgba(255,255,255,0.8)',
                  '&:hover': {
                    bgcolor: 'rgba(255,0,0,0.1)',
                  },
                }}
              >
                Detect Vulnerabilities
              </Button>
            </Box>

            {/* Diagram Area */}
            <Box
              sx={{
                flex: 1,
                position: 'relative',
                bgcolor: 'rgba(0,0,0,0.2)',
                overflow: 'auto',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {/* Mock Architecture Diagram */}
                <Box sx={{ position: 'relative', width: 600, height: 400 }}>
                  {reverseSample.diagram.nodes.map((node) => (
                    <Paper
                      key={node.id}
                      sx={{
                        position: 'absolute',
                        left: node.x,
                        top: node.y,
                        p: 2,
                        bgcolor:
                          node.type === 'service'
                            ? 'rgba(255,0,0,0.1)'
                            : node.type === 'database'
                            ? 'rgba(0,255,0,0.1)'
                            : 'rgba(255,255,0,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: 2,
                        minWidth: 120,
                        textAlign: 'center',
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {node.label}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Box>

      {/* Right: Suggestions & Vulnerabilities */}
      <Box sx={{ width: 350, borderLeft: '1px solid rgba(255,255,255,0.1)', overflow: 'auto' }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: '1rem' }}>
            AI Reasoning & Improvements
          </Typography>

          {uploaded && reverseSample.vulnerabilities && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'rgba(255,255,255,0.7)' }}>
                Detected Vulnerabilities
              </Typography>
              <List dense>
                {reverseSample.vulnerabilities.map((vuln) => (
                  <Paper
                    key={vuln.id}
                    sx={{
                      mb: 1,
                      p: 1.5,
                      bgcolor: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Chip
                        label={vuln.severity}
                        size="small"
                        sx={{
                          bgcolor:
                            vuln.severity === 'high'
                              ? '#f44336'
                              : vuln.severity === 'medium'
                              ? '#ff9800'
                              : '#ffc107',
                          color: '#fff',
                          fontSize: '0.7rem',
                          height: 20,
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
                        {vuln.title}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 1 }}>
                      {vuln.file}:{vuln.line}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.85rem', mb: 1 }}>
                      {vuln.description}
                    </Typography>
                    <Button
                      size="small"
                      sx={{
                        textTransform: 'none',
                        color: '#ff0000',
                        fontSize: '0.75rem',
                        '&:hover': {
                          bgcolor: 'rgba(255,0,0,0.1)',
                        },
                      }}
                    >
                      Apply Fix
                    </Button>
                  </Paper>
                ))}
              </List>
            </Box>
          )}

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'rgba(255,255,255,0.7)' }}>
              Suggested Improvements
            </Typography>
            <List dense>
              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary="Extract authentication middleware"
                  secondary="Reduce code duplication"
                  primaryTypographyProps={{ variant: 'body2', sx: { fontSize: '0.85rem' } }}
                  secondaryTypographyProps={{ variant: 'caption', sx: { fontSize: '0.75rem' } }}
                />
                <Button size="small" sx={{ textTransform: 'none', color: '#ff0000', fontSize: '0.75rem' }}>
                  Apply
                </Button>
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary="Add input validation"
                  secondary="Prevent injection attacks"
                  primaryTypographyProps={{ variant: 'body2', sx: { fontSize: '0.85rem' } }}
                  secondaryTypographyProps={{ variant: 'caption', sx: { fontSize: '0.75rem' } }}
                />
                <Button size="small" sx={{ textTransform: 'none', color: '#ff0000', fontSize: '0.75rem' }}>
                  Apply
                </Button>
              </ListItem>
            </List>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

