'use client'
import { useState } from 'react'
import { Box, Grid, TextField, MenuItem, Button, CircularProgress } from '@mui/material'

export default function GenericForm({
  fields,
  onSubmit,
  loading
}: {
  fields: { name: string, label: string, type: string, options?: string[] }[],
  onSubmit: (form: any) => void,
  loading: boolean
}) {
  const [formData, setFormData] = useState<any>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <Box component="form" sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {fields.map((field) => (
          <Grid item xs={12} sm={6} key={field.name}>
            {field.options ? (
              <TextField
                select
                fullWidth
                label={field.label}
                name={field.name}
                onChange={handleChange}
                defaultValue=""
                sx={{ paddingRight: '100px' }}
              >
                {field.options.map(opt => (
                  <MenuItem value={opt} key={opt}>{opt}</MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                fullWidth
                type={field.type}
                label={field.label}
                name={field.name}
                onChange={handleChange}
              />
            )}
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onSubmit(formData)}
            fullWidth
            sx={{ py: 1.5, fontWeight: 'bold' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : '🚀 Predict'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}
