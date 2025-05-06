'use client'
import { Box, Typography } from '@mui/material'

export default function GenericResult({
  result,
  datetime
}: {
  result: number | null,
  datetime: string | null
}) {
  return (
    <Box sx={{ mt: 4, p: 3, bgcolor: '#e8f5e9', borderLeft: '5px solid #388e3c', borderRadius: 2 }}>
      {result !== null ? (
        <>
          <Typography variant="h6" fontWeight="bold" color="green">ETA: {result} hours</Typography>
          {datetime && (
            <Typography variant="body2" color="text.secondary">
              🕒 Expected by: <strong>{datetime}</strong>
            </Typography>
          )}
        </>
      ) : (
        <Typography color="gray">No result yet. Please submit the form.</Typography>
      )}
    </Box>
  )
}
