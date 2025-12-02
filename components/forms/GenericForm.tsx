'use client'
import { useEffect, useMemo, useState } from 'react'
import { Box, Grid, TextField, MenuItem, Button, CircularProgress } from '@mui/material'

type FieldConfig = { name: string, label: string, type: string, options?: string[] }

export default function GenericForm({
  fields,
  onSubmit,
  loading
}: {
  fields: FieldConfig[],
  onSubmit: (form: any) => void,
  loading: boolean
}) {
  const initialState = useMemo(() => {
    return fields.reduce<Record<string, any>>((acc, field) => {
      if (field.options?.length) {
        acc[field.name] = field.options[0]
      } else {
        acc[field.name] = ''
      }
      return acc
    }, {})
  }, [fields])

  const [formData, setFormData] = useState<Record<string, any>>(initialState)

  useEffect(() => {
    setFormData(initialState)
  }, [initialState])

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
                value={formData[field.name] ?? ''}
                onChange={handleChange}
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 3,
                    backgroundColor: 'rgba(255,255,255,0.02)',
                  },
                }}
                SelectProps={{ displayEmpty: false }}
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
                value={formData[field.name] ?? ''}
                onChange={handleChange}
                sx={{
                  '& .MuiInputBase-root': {
                    borderRadius: 3,
                    backgroundColor: 'rgba(255,255,255,0.02)',
                  },
                }}
              />
            )}
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onSubmit(formData)}
            sx={{ minWidth: { xs: '100%', sm: 200 }, px: 4, py: 1.4, fontWeight: 600, borderRadius: 999 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : '🚀 Predict'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}
