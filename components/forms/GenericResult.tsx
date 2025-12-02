'use client'
import { Box, Typography } from '@mui/material'

export default function GenericResult({
  result,
  datetime,
  label = 'Result',
  unit,
}: {
  result: number | null;
  datetime: string | null;
  label?: string;
  unit?: string;
}) {
  return (
    <Box
      sx={{
        mt: 2,
        p: 3,
        borderRadius: 3,
        backgroundColor: 'rgba(76, 175, 80, 0.08)',
        border: '1px solid rgba(76,175,80,0.3)',
      }}
    >
      {result !== null ? (
        <>
          <Typography variant="h6" fontWeight="bold" sx={{ color: '#4caf50' }}>
            {label}: {unit ? `${result} ${unit}` : result}
          </Typography>
          {datetime && (
            <Typography variant="body2" color="text.secondary">
              🕒 Expected by: <strong>{datetime}</strong>
            </Typography>
          )}
        </>
      ) : (
        <Typography color="text.secondary">No result yet. Please submit the form.</Typography>
      )}
    </Box>
  );
}
