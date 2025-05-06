'use client'
import { Box, Typography } from '@mui/material'

export default function DemoPlayer() {
  return (
    <Box mt={3}>
      <Typography variant="h6">🎥 Walkthrough Demo</Typography>
      <video controls width="100%" style={{ borderRadius: 10, marginTop: '10px' }}>
        <source src="/demo/eta_demo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </Box>
  )
}
