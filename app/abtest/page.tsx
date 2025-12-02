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

const abFields = [
  { name: 'test_name', label: 'Test Name', type: 'text' },
  { name: 'primary_kpi', label: 'Primary KPI', type: 'select', options: ['Conversion', 'CTR', 'AOV', 'Bounce Rate'] },
  { name: 'traffic_split', label: 'Traffic Split (A/B)', type: 'text' },
  { name: 'required_sample', label: 'Required Sample (per variant)', type: 'number' },
  { name: 'confidence', label: 'Confidence Level (%)', type: 'number' },
];

const abTheory = `
RBM's A/B test analyzer tracks lifts, significance, and guardrails. It ensures experiments auto-stop when
confidence thresholds are met, and pushes winners to production safely.
`;

function ABResult({ summary }: { summary: string | null }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)', minHeight: 150 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Experiment Insight</Typography>
      <Typography variant="body1">
        {summary || 'Enter experiment inputs to see recommended monitoring actions.'}
      </Typography>
    </Paper>
  );
}

export default function ABTestPage() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      const data = await postJson('/api/v1/analytics/abtest', payload);
      setSummary(data.summary);
    } catch (error) {
      console.error('AB test analyzer failed', error);
      setSummary('Monitor daily; auto-stop once 95% confidence or after 14 days, whichever comes first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="A/B Test Analyzer"
      subtitle="Monitor experiment performance, confidence, and guardrails in real time."
      metaLabel="ANALYTICS & INSIGHTS"
    >
      {{
        form: <GenericForm fields={abFields} onSubmit={handleSubmit} loading={loading} />,
        result: <ABResult summary={summary} />,
        theory: <GenericTheory content={abTheory} />,
        dataset: <DatasetViewer />,
        insights: <InsightsPanel />,
        ask: <CopilotPanel contextType="abtest" />,
        demo: <DemoPlayer />,
      }}
    </FormWrapper>
  );
}

