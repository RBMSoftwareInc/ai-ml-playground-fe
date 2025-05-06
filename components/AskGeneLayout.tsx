'use client'

import { useState } from 'react'
import { Box, Container, Typography, IconButton } from '@mui/material'
import SmartSuggestions from '../components/SmartSuggestions'
import AskGeneInput from '../components/AskGeneInput'
import UserSummary from '../components/UserSummary'
import AskGeneChatBubble from '../components/AskGeneChatBubble'
import CloseIcon from '@mui/icons-material/Close'

export default function AskGeneLayout() {
  const [chat, setChat] = useState<string[]>([])
  const [input, setInput] = useState('')

  const handleSubmit = (value: string) => {
    setChat(prev => [...prev, value])
    setInput('')
    // You can trigger OpenAI or Flask backend here
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#f9f9f9',
      display: 'flex',
      flexDirection: 'column',
      px: 3,
      pt: 2
    }}>
      {/* Top bar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <UserSummary />
        <IconButton onClick={() => window.location.href = '/dashboard'}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Typography variant="h5" fontWeight="bold" color="primary">
        🧞 Ask Gene — Interactive AI Journey
      </Typography>

      <SmartSuggestions onSelect={handleSubmit} />

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          my: 3,
          pr: 2,
        }}
      >
        {chat.map((msg, idx) => (
          <AskGeneChatBubble key={idx} text={msg} />
        ))}
      </Box>

      <AskGeneInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
      />
    </Box>
  )
}
