'use client'

import { Box, Typography } from '@mui/material'

export default function AskGeneChatBubble({ text }: { text: string }) {
  return (
    <Box
      sx={{
        bgcolor: '#e3f2fd',
        px: 3,
        py: 2,
        borderRadius: 3,
        mb: 2,
        maxWidth: '80%',
        alignSelf: 'flex-start',
      }}
    >
      <Typography>{text}</Typography>
    </Box>
  )
}
