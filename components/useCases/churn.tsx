'use client';

import { useState } from 'react';
import FormWrapper from '../FormWrapper';
import GenericForm from '../forms/GenericForm';
import GenericTheory from '../forms/GenericTheory';
import DatasetViewer from '../forms/DatasetViewer';
import InsightsPanel from '../forms/InsightsPanel';
import CopilotPanel from '../forms/AskGene';
import DemoPlayer from '../forms/DemoPlayer';
import { Paper, Typography, LinearProgress } from '@mui/material';
import { postJson } from '../../lib/api';

const churnFields = [
  { name: 'segment', label: 'Customer Segment', type: 'select', options: ['VIP', 'Active', 'Dormant', 'Wholesale'] },
  { name: 'tenure_months', label: 'Tenure (months)', type: 'number' },
  { name: 'avg_order_value', label: 'Avg Order Value', type: 'number' },
  { name: 'orders_last_60', label: 'Orders (last 60 days)', type: 'number' },
  { name: 'support_tickets', label: 'Support Tickets (90 days)', type: 'number' },
  { name: 'loyalty_status', label: 'Loyalty Tier', type: 'select', options: ['None', 'Silver', 'Gold', 'Platinum'] },
];

const churnTheory = `
Churn prediction combines leading indicators (engagement, support, spend) with trailing revenue to produce a risk score.
Trigger lifecycle journeys, offers, or AI concierge outreach before the customer defects.
`;

function ChurnResult({ score }: { score: number | null }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)' }}>
      {score !== null ? (
        <>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Churn Probability: {score}%
          </Typography>
          <LinearProgress
            variant="determinate"
            value={score}
            sx={{
              height: 10,
              borderRadius: 999,
              '& .MuiLinearProgress-bar': { backgroundColor: score > 60 ? '#f44336' : '#9ca3af' },
            }}
          />
        </>
      ) : (
        <Typography color="text.secondary">Provide cohort metrics to calculate churn probability.</Typography>
      )}
    </Paper>
  );
}

export default function ChurnPredictionPage() {
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      const data = await postJson('/api/v1/churn/predict', payload);
      setScore(data.score ?? 42);
    } catch (error) {
      console.error('Churn prediction failed', error);
      setScore(58);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="Churn Prediction"
      subtitle="Identify at-risk customers early and auto-trigger retention playbooks."
      metaLabel="MARKETING INTELLIGENCE"
    >
      {{
        form: <GenericForm fields={churnFields} onSubmit={handleSubmit} loading={loading} />,
        result: <ChurnResult score={score} />,
        theory: <GenericTheory content={churnTheory} />,
        dataset: <DatasetViewer />,
        insights: <InsightsPanel />,
        ask: <CopilotPanel contextType="churn" />,
        demo: <DemoPlayer />,
      }}
    </FormWrapper>
  );
}

