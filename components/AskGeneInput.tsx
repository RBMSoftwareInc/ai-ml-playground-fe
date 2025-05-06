'use client'

import { Box, TextField, IconButton } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'

export default function AskGeneInput({ value, onChange, onSubmit }: any) {
  return (
    <Box display="flex" gap={2}>
      <TextField
        fullWidth
        placeholder="Type your question to Gene..."
        variant="outlined"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit(value)}
        sx={{ borderRadius: '20px' }}
      />
      <IconButton color="primary" onClick={() => onSubmit(value)}>
        <SendIcon />
      </IconButton>
    </Box>
  )
}
