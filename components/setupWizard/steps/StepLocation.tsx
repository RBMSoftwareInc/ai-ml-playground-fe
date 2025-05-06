'use client'

import { Box, Typography, TextField, MenuItem } from '@mui/material'

const currencies = ['INR', 'USD', 'EUR', 'AED']
const countries = ['India', 'USA', 'Germany', 'UAE']

export default function StepLocation({ formData, onChange }: any) {
  return (
    <Box>
      <Typography variant="h6" mb={2}>🌍 Select Country & Currency</Typography>

      <TextField
        fullWidth
        select
        label="Country"
        value={formData?.country || ''}
        onChange={(e) => onChange('country', e.target.value)}
        sx={{ mb: 3 }}
      >
        {countries.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
      </TextField>

      <TextField
        fullWidth
        select
        label="Currency"
        value={formData?.currency || ''}
        onChange={(e) => onChange('currency', e.target.value)}
      >
        {currencies.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
      </TextField>
    </Box>
  )
}
