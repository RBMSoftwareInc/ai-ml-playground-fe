'use client';

import { useState } from 'react';
import FormWrapper from '../FormWrapper';
import GenericTheory from '../forms/GenericTheory';
import DatasetViewer from '../forms/DatasetViewer';
import InsightsPanel from '../forms/InsightsPanel';
import CopilotPanel from '../forms/AskGene';
import DemoPlayer from '../forms/DemoPlayer';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Grid,
  MenuItem,
  Button,
  Slider,
} from '@mui/material';
import { postJson } from '../../lib/api';

const tryOnTheory = `
AI Try-On stitches pose estimation, cloth draping, and lighting transfer so shoppers can preview outfits instantly.
Use RBM's pipeline to manage garments, body models, and export-ready renders.
`;

function TryOnForm({ onSubmit, loading }: { onSubmit: (payload: any) => void; loading: boolean }) {
  const [payload, setPayload] = useState({
    garment_type: 'Dress',
    garment_sku: '',
    device: 'Webcam',
    latency: 2,
    export_format: 'PNG',
  });

  const handleChange = (field: string, value: any) => {
    setPayload((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Garment Type"
            value={payload.garment_type}
            onChange={(e) => handleChange('garment_type', e.target.value)}
            fullWidth
          >
            {['Dress', 'Top', 'Outerwear', 'Footwear', 'Accessories'].map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Garment SKU"
            value={payload.garment_sku}
            onChange={(e) => handleChange('garment_sku', e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Input Device"
            value={payload.device}
            onChange={(e) => handleChange('device', e.target.value)}
            fullWidth
          >
            {['Webcam', 'iOS LiDAR', 'Android Depth', 'Uploaded Photo'].map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Export Format"
            value={payload.export_format}
            onChange={(e) => handleChange('export_format', e.target.value)}
            fullWidth
          >
            {['PNG', 'GLB', 'WebAR'].map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Latency Target (seconds)
          </Typography>
          <Slider
            min={1}
            max={6}
            step={0.5}
            value={payload.latency}
            marks
            valueLabelDisplay="auto"
            onChange={(_, value) => handleChange('latency', value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={() => onSubmit(payload)}
            disabled={loading}
            sx={{ minWidth: 200, py: 1.4, fontWeight: 600 }}
          >
            {loading ? 'Rendering…' : 'Preview Try-On'}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

function TryOnResult({ renderPlan }: { renderPlan: string | null }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Render Plan
      </Typography>
      <Typography variant="body1">
        {renderPlan || 'Define garment + latency to see how the pipeline will render virtual try-ons.'}
      </Typography>
    </Paper>
  );
}

export default function AITryOnPage() {
  const [loading, setLoading] = useState(false);
  const [renderPlan, setRenderPlan] = useState<string | null>(null);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      const data = await postJson('/api/v1/tryon/plan', payload);
      setRenderPlan(data.plan);
    } catch (error) {
      console.error('Try-on plan failed', error);
      setRenderPlan(
        `Generate 3 poses, drape ${payload.garment_type} on avatar, tune lighting for ${payload.device}. Export ${payload.export_format}.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="AI Try-On (AR)"
      subtitle="Blend pose estimation, cloth draping, and WebAR export to wow shoppers with futuristic try-ons."
      metaLabel="CREATIVE & AR"
    >
      {{
        form: <TryOnForm onSubmit={handleSubmit} loading={loading} />,
        result: <TryOnResult renderPlan={renderPlan} />,
        theory: <GenericTheory content={tryOnTheory} />,
        dataset: <DatasetViewer />,
        insights: <InsightsPanel />,
        ask: <CopilotPanel contextType="tryon" />,
        demo: <DemoPlayer />,
      }}
    </FormWrapper>
  );
}

