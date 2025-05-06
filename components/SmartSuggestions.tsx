'use client'

import { Box, Button, Typography } from '@mui/material'

const suggestions = [
  '🔍 What’s the ETA for 2kg package from Delhi to Bangalore?',
  '📦 Predict inventory reorder time for a fast-moving item',
  '🎯 Improve delivery precision for rainy weather',
  '🛍️ Suggest best AI goal for my store type',
]

export default function SmartSuggestions({ onSelect }: { onSelect: (q: string) => void }) {
  return (
    <Box my={2}>
      <Typography variant="subtitle1" mb={1}>Try asking:</Typography>
      <Box display="flex" gap={1} flexWrap="wrap">
        {suggestions.map((text, i) => (
          <Button
            key={i}
            variant="outlined"
            onClick={() => onSelect(text)}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              fontSize: '0.85rem',
            }}
          >
            {text}
          </Button>
        ))}
      </Box>
    </Box>
  )
}
