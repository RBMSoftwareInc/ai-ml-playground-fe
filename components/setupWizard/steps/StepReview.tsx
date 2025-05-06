'use client'

import { Box, Typography, List, ListItem, ListItemText, Alert } from '@mui/material'

interface StepReviewProps {
  formData: Record<string, any>
}

export default function StepReview({ formData = {} }: StepReviewProps) {
  return (
    <Box>
      <Typography variant="h5" mb={2} fontWeight="bold">
        ✅ Review Your Configuration
      </Typography>

      {Object.keys(formData).length === 0 ? (
        <Alert severity="warning" sx={{ mb: 3 }}>
          No data to display. Please complete the previous steps.
        </Alert>
      ) : (
        <List sx={{ mb: 3 }}>
          {Object.entries(formData).map(([key, val]) => (
            <ListItem key={key} sx={{ px: 0 }}>
              <ListItemText
                primary={key.replace(/_/g, ' ').toUpperCase()}
                secondary={Array.isArray(val) ? val.join(', ') : val || '—'}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}
