'use client'
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'

export default function DatasetViewer() {
  const sample = [
    { city: 'Delhi', distance: 250, speed: 55, weather: 'Rainy', eta: 5.2 },
    { city: 'Mumbai', distance: 600, speed: 60, weather: 'Clear', eta: 10.1 },
  ]
  return (
    <>
      <Typography variant="h6" mt={2}>📦 Sample Dataset</Typography>
      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>City</TableCell>
            <TableCell>Distance</TableCell>
            <TableCell>Speed</TableCell>
            <TableCell>Weather</TableCell>
            <TableCell>ETA (hrs)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sample.map((row, i) => (
            <TableRow key={i}>
              <TableCell>{row.city}</TableCell>
              <TableCell>{row.distance}</TableCell>
              <TableCell>{row.speed}</TableCell>
              <TableCell>{row.weather}</TableCell>
              <TableCell>{row.eta}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
