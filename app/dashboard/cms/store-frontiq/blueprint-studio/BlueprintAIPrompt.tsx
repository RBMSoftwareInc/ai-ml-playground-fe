'use client';

import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import { useState } from 'react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export default function BlueprintAIPrompt({ onGenerateLayout }) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const handleGenerate = () => {
    // Simulate AI response — you can replace this with real API
    const fakeResponse = `Suggested Layout: 2-column section with 70/30 split, followed by full-width banner.`;
    setResponse(fakeResponse);

    // Optional → trigger callback to add layout
    if (onGenerateLayout) {
      onGenerateLayout([
        { columns: [70, 30], sectionType: 'Content' },
        { columns: [100], sectionType: 'Banner' },
      ]);
    }
  };

  return (
    <Paper sx={{ p: 2, mb: 3, border: '1px solid #999' }}>
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <AutoAwesomeIcon /> AI Layout Generator
      </Typography>

      <TextField
        placeholder="Describe your desired layout..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        fullWidth
        multiline
        rows={2}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" onClick={handleGenerate}>
        Generate Layout
      </Button>

      {response && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          {response}
        </Typography>
      )}
    </Paper>
  );
}
