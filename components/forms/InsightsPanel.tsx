'use client'
import { Box, Typography } from '@mui/material'

export default function InsightsPanel() {
  return (
    <Box mt={2}>
      <Typography variant="h6" color="primary">📈 Key Insights</Typography>
      <Typography mt={1}>• Weather impacts ETA by up to 20%</Typography>
      <Typography mt={1}>• Speed is the most influential parameter</Typography>
      <Typography mt={1}>• Certain city pairs show predictable delay patterns</Typography>
    </Box>
  )
}
