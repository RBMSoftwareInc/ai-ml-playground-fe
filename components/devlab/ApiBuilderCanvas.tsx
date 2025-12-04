'use client';

import { useState } from 'react';
import { Box, Typography, Paper, Button, TextField, Select, MenuItem, FormControl, InputLabel, Tabs, Tab } from '@mui/material';
import { motion } from 'framer-motion';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CodeIcon from '@mui/icons-material/Code';
import SendIcon from '@mui/icons-material/Send';

const languages = ['JavaScript', 'Python', 'Java', 'Go', 'TypeScript'];

export default function ApiBuilderCanvas() {
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const [sdkCode, setSdkCode] = useState('');
  const [testResponse, setTestResponse] = useState<any>(null);

  const handleUploadSchema = () => {
    // Mock schema upload
    alert('Schema uploaded (mock)');
  };

  const handleGenerateSDK = (lang: string) => {
    // Mock SDK generation
    const mockCode = `// ${lang} SDK (Generated)
import axios from 'axios';

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async getUser(id) {
    const response = await axios.get(\`\${this.baseURL}/users/\${id}\`);
    return response.data;
  }

  async createUser(userData) {
    const response = await axios.post(\`\${this.baseURL}/users\`, userData);
    return response.data;
  }
}

export default ApiClient;`;
    setSdkCode(mockCode);
  };

  const handleTestRequest = () => {
    // Mock API test
    setTestResponse({
      status: 200,
      data: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      },
      headers: {
        'content-type': 'application/json',
      },
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Top: Schema Upload */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          bgcolor: 'rgba(0,0,0,0.3)',
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            startIcon={<CloudUploadIcon />}
            onClick={handleUploadSchema}
            sx={{
              textTransform: 'none',
              color: 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              '&:hover': {
                bgcolor: 'rgba(255,0,0,0.1)',
                borderColor: '#ff0000',
              },
            }}
          >
            Upload Schema (OpenAPI/DDL)
          </Button>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            TODO (Phase 2): Implement real schema parsing
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Center: API Builder Canvas */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Box
            sx={{
              flex: 1,
              p: 3,
              bgcolor: 'rgba(0,0,0,0.2)',
              overflow: 'auto',
              position: 'relative',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              API Builder Canvas
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 3 }}>
              TODO (Phase 2): Implement drag-and-drop API builder
            </Typography>

            {/* Mock API Nodes */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {['GET /users', 'POST /users', 'GET /products', 'PUT /products/:id'].map((endpoint) => (
                <Paper
                  key={endpoint}
                  sx={{
                    p: 2,
                    minWidth: 200,
                    bgcolor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    cursor: 'move',
                    '&:hover': {
                      borderColor: '#ff0000',
                      bgcolor: 'rgba(255,255,255,0.08)',
                    },
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {endpoint}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>

          {/* Bottom: Live Test Panel */}
          <Box
            sx={{
              height: 300,
              borderTop: '1px solid rgba(255,255,255,0.1)',
              p: 2,
              bgcolor: 'rgba(0,0,0,0.3)',
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Live Test Panel
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <Select
                  value="GET"
                  sx={{
                    color: '#fff',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                  }}
                >
                  <MenuItem value="GET">GET</MenuItem>
                  <MenuItem value="POST">POST</MenuItem>
                  <MenuItem value="PUT">PUT</MenuItem>
                  <MenuItem value="DELETE">DELETE</MenuItem>
                </Select>
              </FormControl>
              <TextField
                size="small"
                placeholder="/api/users/1"
                defaultValue="/api/users/1"
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.2)',
                    },
                  },
                }}
              />
              <Button
                startIcon={<SendIcon />}
                onClick={handleTestRequest}
                sx={{
                  bgcolor: '#ff0000',
                  color: '#fff',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#cc0000',
                  },
                }}
              >
                Send
              </Button>
            </Box>

            {testResponse && (
              <Paper
                sx={{
                  p: 2,
                  bgcolor: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 1,
                }}
              >
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1, display: 'block' }}>
                  Response ({testResponse.status})
                </Typography>
                <Typography
                  component="pre"
                  variant="caption"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    color: '#0f0',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {JSON.stringify(testResponse.data, null, 2)}
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>

        {/* Right: SDK Generator */}
        <Box sx={{ width: 400, borderLeft: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: '1rem' }}>
              Client SDK Generator
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {languages.map((lang) => (
                <Button
                  key={lang}
                  size="small"
                  onClick={() => handleGenerateSDK(lang)}
                  sx={{
                    textTransform: 'none',
                    color: selectedLanguage === lang ? '#ff0000' : 'rgba(255,255,255,0.8)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    '&:hover': {
                      bgcolor: 'rgba(255,0,0,0.1)',
                      borderColor: '#ff0000',
                    },
                  }}
                >
                  {lang}
                </Button>
              ))}
            </Box>
          </Box>

          {sdkCode && (
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1, display: 'block' }}>
                Generated SDK Code
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: '#1e1e1e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 1,
                }}
              >
                <Typography
                  component="pre"
                  variant="caption"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    color: '#0f0',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {sdkCode}
                </Typography>
              </Paper>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

