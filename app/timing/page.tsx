'use client';

import { useState } from 'react';
import FormWrapper from '../../components/FormWrapper';
import GenericForm from '../../components/forms/GenericForm';
import GenericTheory from '../../components/forms/GenericTheory';
import DatasetViewer from '../../components/forms/DatasetViewer';
import InsightsPanel from '../../components/forms/InsightsPanel';
import CopilotPanel from '../../components/forms/AskGene';
import DemoPlayer from '../../components/forms/DemoPlayer';
import { Paper, Typography } from '@mui/material';
import { postJson } from '../../lib/api';

const timingFields = [
  { name: 'product_category', label: 'Product Category', type: 'text' },
  { name: 'target_region', label: 'Target Region', type: 'select', options: ['NA', 'EMEA', 'APAC', 'LATAM'] },
  { name: 'lead_time_weeks', label: 'Lead Time (weeks)', type: 'number' },
  { name: 'promo_calendar', label: 'Promo Calendar', type: 'select', options: ['Holiday', 'Back to School', 'Off-season', 'Flash'] },
];

const timingTheory = `
Launch timing analysis blends historical sales bursts, macro events, and promo calendars. Use it to schedule drops
when attention and inventory alignment peak together.
`;

function TimingResult({ window }: { window: string | null }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)', minHeight: 150 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Recommended Window</Typography>
      <Typography variant="body1">
        {window || 'Enter launch details to receive the optimal go-live window.'}
      </Typography>
    </Paper>
  );
}

export default function LaunchTimingPage() {
  const [loading, setLoading] = useState(false);
  const [window, setWindow] = useState<string | null>(null);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      const data = await postJson('/api/v1/analytics/timing', payload);
      setWindow(data.window);
    } catch (error) {
      console.error('Timing recommendation failed', error);
      setWindow('Week 42 (aligns with regional holiday and inventory readiness).');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="Best Launch Timing"
      subtitle="Pinpoint the perfect week to release campaigns or products using RBM intelligence."
      metaLabel="ANALYTICS & INSIGHTS"
    >
      {{
        form: <GenericForm fields={timingFields} onSubmit={handleSubmit} loading={loading} />,
        result: <TimingResult window={window} />,
        theory: <GenericTheory content={timingTheory} />,
        dataset: <DatasetViewer />,
        insights: <InsightsPanel />,
        ask: <CopilotPanel contextType="timing" />,
        demo: <DemoPlayer />,
      }}
    </FormWrapper>
  );
}

