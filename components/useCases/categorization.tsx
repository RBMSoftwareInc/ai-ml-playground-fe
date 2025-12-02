'use client';

import { useState } from 'react';
import FormWrapper from '../FormWrapper';
import GenericTheory from '../forms/GenericTheory';
import DatasetViewer from '../forms/DatasetViewer';
import InsightsPanel from '../forms/InsightsPanel';
import CopilotPanel from '../forms/AskGene';
import DemoPlayer from '../forms/DemoPlayer';
import { Paper, Typography, TextField, Grid, MenuItem, Button } from '@mui/material';
import { postJson } from '../../lib/api';

const categorizationTheory = `
Next-gen auto-categorization fuses embeddings, attribute extraction, and policy rules.
Upload metadata/text and receive compliant taxonomy labels with confidence scores.
`;

function CategorizationForm({ onSubmit, loading }: { onSubmit: (payload: any) => void; loading: boolean }) {
  const [payload, setPayload] = useState({
    sku: '',
    title: '',
    description: '',
    material: '',
    gender: 'Unisex',
    taxonomy: 'RBM Standard',
  });

  const handleChange = (field: string, value: string) => {
    setPayload((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField label="SKU" value={payload.sku} onChange={(e) => handleChange('sku', e.target.value)} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Taxonomy"
            value={payload.taxonomy}
            onChange={(e) => handleChange('taxonomy', e.target.value)}
            fullWidth
          >
            {['RBM Standard', 'Google Shopping', 'Custom (JSON upload)'].map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Product Title"
            value={payload.title}
            onChange={(e) => handleChange('title', e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Long Description"
            value={payload.description}
            onChange={(e) => handleChange('description', e.target.value)}
            fullWidth
            multiline
            minRows={4}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Target Gender"
            value={payload.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            fullWidth
          >
            {['Unisex', 'Women', 'Men', 'Kids'].map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Key Materials"
            value={payload.material}
            onChange={(e) => handleChange('material', e.target.value)}
            placeholder="e.g. Organic cotton, recycled nylon"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={() => onSubmit(payload)}
            disabled={loading}
            sx={{ minWidth: 200, py: 1.4, fontWeight: 600 }}
          >
            {loading ? 'Classifying…' : 'Classify Product'}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

function CategorizationResult({ labels }: { labels: Array<{ path: string; confidence: number }> }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)' }}>
      {labels.length ? (
        labels.map((label) => (
          <Typography key={label.path} sx={{ mb: 1 }}>
            {label.path} — <Typography component="span" color="text.secondary">{label.confidence}%</Typography>
          </Typography>
        ))
      ) : (
        <Typography color="text.secondary">Provide product metadata to auto-generate taxonomy labels.</Typography>
      )}
    </Paper>
  );
}

export default function AutoCategorizationPage() {
  const [loading, setLoading] = useState(false);
  const [labels, setLabels] = useState<Array<{ path: string; confidence: number }>>([]);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      const data = await postJson('/api/v1/categorization/classify', payload);
      setLabels(data.labels || []);
    } catch (error) {
      console.error('Categorization failed', error);
      setLabels([
        { path: 'Apparel > Women > Dresses > Cocktail', confidence: 91 },
        { path: 'Occasion > Evening', confidence: 78 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="Auto Categorization"
      subtitle="Feed raw product copy and let AI map it to compliant taxonomy paths with confidence scoring."
      metaLabel="PRODUCT INTELLIGENCE"
    >
      {{
        form: <CategorizationForm onSubmit={handleSubmit} loading={loading} />,
        result: <CategorizationResult labels={labels} />,
        theory: <GenericTheory content={categorizationTheory} />,
        dataset: <DatasetViewer />,
        insights: <InsightsPanel />,
        ask: <CopilotPanel contextType="categorization" />,
        demo: <DemoPlayer />,
      }}
    </FormWrapper>
  );
}

