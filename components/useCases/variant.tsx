'use client';

import { useState } from 'react';
import GenericForm from '../forms/GenericForm';
import GenericTheory from '../forms/GenericTheory';
import DatasetViewer from '../forms/DatasetViewer';
import InsightsPanel from '../forms/InsightsPanel';
import CopilotPanel from '../forms/AskGene';
import DemoPlayer from '../forms/DemoPlayer';
import FormWrapper from '../FormWrapper';
import { Paper, Typography } from '@mui/material';
import { postJson } from '../../lib/api';

const variantFields = [
  { name: 'customer_segment', label: 'Customer Segment', type: 'select', options: ['premium', 'regular', 'business', 'new_user'] },
  { name: 'time_of_day', label: 'Time of Day', type: 'select', options: ['morning', 'afternoon', 'evening', 'night'] },
  { name: 'device_type', label: 'Device Type', type: 'select', options: ['mobile', 'desktop', 'tablet'] },
  { name: 'gender', label: 'Gender', type: 'select', options: ['male', 'female', 'other'] },
  { name: 'browser', label: 'Browser', type: 'select', options: ['Chrome', 'Firefox', 'Safari', 'Edge'] },
  { name: 'platform', label: 'Platform', type: 'select', options: ['Android', 'iOS', 'Windows', 'macOS'] },
  { name: 'location', label: 'Location', type: 'select', options: ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad'] },
  { name: 'num_clicks', label: 'Number of Clicks', type: 'number' },
  { name: 'session_time_minutes', label: 'Session Time (minutes)', type: 'number' },
];

const variantTheory = `
Variant intelligence blends behavioral cohorts with experimentation lift to determine which creative, layout,
or offer variant should be served next. Pair customer affinities with live engagement signals to keep experiences fresh.
`;

function VariantResult({ recommendation }: { recommendation: string | null }) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        minHeight: 160,
      }}
    >
      {recommendation ? (
        <>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#9ca3af' }}>
            Recommended Variant
          </Typography>
          <Typography variant="body1" sx={{ mt: 1.5 }}>
            {recommendation}
          </Typography>
        </>
      ) : (
        <Typography color="text.secondary">Submit the form to see the next best variant.</Typography>
      )}
    </Paper>
  );
}

export default function VariantPage() {
  const [loading, setLoading] = useState(false);
  const [variant, setVariant] = useState<string | null>(null);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      const data = await postJson('/api/v1/variant/predict', payload);
      setVariant(data.predicted_variant);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="Variant Recommendation"
      subtitle="Blend cohort context with engagement signals to decide which creative or layout variant should surface next."
      metaLabel="PRODUCT INTELLIGENCE"
    >
      {{
        form: <GenericForm fields={variantFields} onSubmit={handleSubmit} loading={loading} />,
        result: <VariantResult recommendation={variant} />,
        theory: <GenericTheory content={variantTheory} />,
        dataset: <DatasetViewer />,
        insights: <InsightsPanel />,
        ask: <CopilotPanel contextType="variant" />,
        demo: <DemoPlayer />,
      }}
    </FormWrapper>
  );
}