'use client';
import {
  Box, Typography, RadioGroup, FormControlLabel, Radio,
  Table, TableHead, TableBody, TableRow, TableCell, Divider,
  ToggleButton, ToggleButtonGroup
} from '@mui/material';

const sizeData = {
  metric: [
    { type: 'Small', size: '0.5kg / 10x10x5cm', handling: 'Standard', delay: 'Low', costImpact: 'Low' },
    { type: 'Medium', size: '2kg / 30x20x15cm', handling: 'Moderate', delay: 'Medium', costImpact: 'Moderate' },
    { type: 'Large', size: '10kg / 100x80x60cm', handling: 'Specialized', delay: 'High', costImpact: 'High' },
  ],
  imperial: [
    { type: 'Small', size: '1.1lb / 4x4x2in', handling: 'Standard', delay: 'Low', costImpact: 'Low' },
    { type: 'Medium', size: '4.4lb / 12x8x6in', handling: 'Moderate', delay: 'Medium', costImpact: 'Moderate' },
    { type: 'Large', size: '22lb / 39x31x24in', handling: 'Specialized', delay: 'High', costImpact: 'High' },
  ]
};

export default function ProductSizeStep({ formData, onChange }: any) {
  const currentUnit: 'metric' | 'imperial' = (formData.unit_system || 'metric') as 'metric' | 'imperial';

  const handleUnitChange = (_: any, newUnit: string) => {
    if (newUnit) onChange('unit_system', newUnit);
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>📦 Product Size Behavior</Typography>

    <RadioGroup
        value={formData.avg_package_size || ''}
        onChange={(e) => onChange('avg_package_size', e.target.value)}
        >
        {[
            { label: '📱 Small Items (e.g. Mobile, Perfume)', value: 'small' },
            { label: '👟 Medium (e.g. Fashion, Shoes)', value: 'medium' },
            { label: '🛏️ Large Items (e.g. Furniture)', value: 'large' }
        ].map((item) => (
            <FormControlLabel
            key={item.value}
            value={item.value}
            control={
                <Radio
                sx={{
                    color: '#0d47a1',
                    '&.Mui-checked': {
                    color: '#2979ff',
                    boxShadow: '0 0 4px #2979ff',
                    }
                }}
                />
            }
            label={item.label}
            sx={{
                m: 1,
                px: 2,
                py: 1,
                borderRadius: '15px',
                border: '1px solid #2979ff',
                background: formData.avg_package_size === item.value ? '#e3f2fd' : '#fff',
                '&:hover': {
                background: '#e1f5fe',
                boxShadow: '0 0 10px rgba(41,121,255,0.4)',
                }
            }}
            />
        ))}
        </RadioGroup>


      <Divider sx={{ my: 4 }} />

      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="subtitle1">📊 Metric Comparison by Size</Typography>
        <ToggleButtonGroup
          value={currentUnit}
          exclusive
          onChange={handleUnitChange}
          size="small"
        >
          <ToggleButton value="metric">kg/cm</ToggleButton>
          <ToggleButton value="imperial">lb/in</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell><strong>Size Type</strong></TableCell>
            <TableCell>Avg Dimensions</TableCell>
            <TableCell>Handling Level</TableCell>
            <TableCell>Delay Impact</TableCell>
            <TableCell>Shipping Cost Impact</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sizeData[currentUnit].map((m) => (
            <TableRow key={m.type}>
              <TableCell>{m.type}</TableCell>
              <TableCell>{m.size}</TableCell>
              <TableCell>{m.handling}</TableCell>
              <TableCell>{m.delay}</TableCell>
              <TableCell>{m.costImpact}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
