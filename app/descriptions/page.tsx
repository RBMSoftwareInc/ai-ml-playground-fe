'use client';

import { useState } from 'react';
import FormWrapper from '../../components/FormWrapper';
import GenericTheory from '../../components/forms/GenericTheory';
import DatasetViewer from '../../components/forms/DatasetViewer';
import InsightsPanel from '../../components/forms/InsightsPanel';
import CopilotPanel from '../../components/forms/AskGene';
import DemoPlayer from '../../components/forms/DemoPlayer';
import {
  Paper,
  Typography,
  TextField,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
} from '@mui/material';
import { postJson } from '../../lib/api';

const copyTheory = `
AI copy generation enforces brand voice presets, SEO structure, and channel-specific requirements.
Pair variants with experimentation to continually raise CTR and conversion.
`;

function CopyForm({ onSubmit, loading }: { onSubmit: (payload: any) => void; loading: boolean }) {
  const [payload, setPayload] = useState({
    product_type: '',
    attributes: '',
    channel: 'Web PDP',
    tone: 'Premium',
  });

  const handleChange = (field: string, value: string) => {
    setPayload((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Product Type"
            value={payload.product_type}
            onChange={(e) => handleChange('product_type', e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Channel"
            value={payload.channel}
            onChange={(e) => handleChange('channel', e.target.value)}
            placeholder="Web PDP, Marketplace, App Card..."
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Key Attributes"
            value={payload.attributes}
            onChange={(e) => handleChange('attributes', e.target.value)}
            multiline
            minRows={3}
            fullWidth
            placeholder="e.g. Organic cotton, machine washable, built-in stretch"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Tone
          </Typography>
          <RadioGroup
            row
            value={payload.tone}
            onChange={(e) => handleChange('tone', e.target.value)}
          >
            {['Premium', 'Playful', 'Minimal', 'Bold'].map((opt) => (
              <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
            ))}
          </RadioGroup>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={() => onSubmit(payload)}
            disabled={loading}
            sx={{ minWidth: 200, py: 1.4, fontWeight: 600 }}
          >
            {loading ? 'Generating…' : 'Generate Copy'}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

function CopyResult({ title, description }: { title: string | null; description: string | null }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)', display: 'grid', gap: 2 }}>
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Title</Typography>
        <Typography variant="body1">{title || '–'}</Typography>
      </Box>
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Description</Typography>
        <Typography variant="body1">
          {description || 'Fill out the product blueprint to generate a SEO-friendly description.'}
        </Typography>
      </Box>
    </Paper>
  );
}

export default function TitleDescriptionPage() {
  const [loading, setLoading] = useState(false);
  const [copy, setCopy] = useState<{ title: string | null; description: string | null }>({
    title: null,
    description: null,
  });

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      const data = await postJson('/api/v1/copy/generate', payload);
      setCopy({
        title: data.title,
        description: data.description,
      });
    } catch (error) {
      console.error('Copy generation failed', error);
      setCopy({
        title: `${payload.product_type} built for everyday luxe comfort`,
        description: 'Glide through the day in breathable organic fibers, sculpted seams, and just-right stretch. Ships carbon-neutral.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="Title & Description Generator"
      subtitle="Craft SEO-ready titles and descriptions with tone presets and channel awareness."
      metaLabel="PRODUCT INTELLIGENCE"
    >
      {{
        form: <CopyForm onSubmit={handleSubmit} loading={loading} />,
        result: <CopyResult title={copy.title} description={copy.description} />,
        theory: <GenericTheory content={copyTheory} />,
        dataset: <DatasetViewer />,
        insights: <InsightsPanel />,
        ask: <CopilotPanel contextType="descriptions" />,
        demo: <DemoPlayer />,
      }}
    </FormWrapper>
  );
}

