'use client'
import { Box, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material'

export default function StepDeliveryProfile({ formData, onChange }: any) {
  const options = [
    { value: '1-day', label: '🚀 1-Day Express' },
    { value: 'standard', label: '📦 Standard (3-5 Days)' },
    { value: 'international', label: '✈️ International Shipping' },
  ]

  return (
    <Box>
      <Typography variant="h6" mb={2}>🚚 Delivery Profile</Typography>
      <RadioGroup
        value={formData.delivery_mode || ''}
        onChange={(e) => onChange('delivery_mode', e.target.value)}
      >
        {options.map((opt) => (
          <FormControlLabel
            key={opt.value}
            value={opt.value}
            control={<Radio />}
            label={opt.label}
            sx={{
              m: 1,
              px: 2,
              py: 1,
              borderRadius: '16px',
              border: '2px solid #d32f2f',
              backgroundColor:
                formData.delivery_mode === opt.value ? '#fff0f0' : '#fff',
              boxShadow:
                formData.delivery_mode === opt.value
                  ? '0 0 12px rgba(211,47,47,0.4)'
                  : 'none',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                backgroundColor: '#ffe6e6',
              },
            }}
          />
        ))}
      </RadioGroup>
    </Box>
  )
}
