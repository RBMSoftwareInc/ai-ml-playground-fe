'use client';

import { useState } from 'react';
import GenericForm from '../../components/forms/GenericForm';
import GenericTheory from '../../components/forms/GenericTheory';
import DatasetViewer from '../../components/forms/DatasetViewer';
import InsightsPanel from '../../components/forms/InsightsPanel';
import CopilotPanel from '../../components/forms/AskGene';
import DemoPlayer from '../../components/forms/DemoPlayer';
import FormWrapper from '../../components/FormWrapper';
import { Paper, Typography } from '@mui/material';
import { postJson } from '../../lib/api';

const fraudFields = [
  { name: 'transaction_amount', label: 'Transaction Amount', type: 'number' },
  { name: 'user_age', label: 'User Age', type: 'number' },
  { name: 'device_type', label: 'Device Type', type: 'select', options: ['mobile', 'desktop', 'tablet'] },
  { name: 'location_match', label: 'Location Match', type: 'select', options: ['yes', 'no'] },
  { name: 'velocity_score', label: 'Velocity Score (0-1)', type: 'number' },
  { name: 'card_country', label: 'Card Country', type: 'select', options: ['India', 'USA', 'UK', 'Germany'] },
];

const fraudTheory = `
Fraud models combine payment metadata, device fingerprints, and behavioral velocity to assign a risk score.
Tight feedback loops with manual review teams are necessary to keep false positives low while stopping high-risk activity.
`;

function FraudResult({ verdict }: { verdict: string | null }) {
  const isFraud = verdict === 'fraud';
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        backgroundColor: isFraud ? 'rgba(244,67,54,0.08)' : 'rgba(67,160,71,0.08)',
        border: `1px solid ${isFraud ? 'rgba(244,67,54,0.4)' : 'rgba(67,160,71,0.4)'}`,
        minHeight: 160,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 700, color: isFraud ? '#f44336' : '#43a047' }}>
        {verdict ? (isFraud ? '⚠️ Potential Fraud' : '✅ Looks Genuine') : 'Awaiting Prediction'}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1.5, color: 'rgba(255,255,255,0.7)' }}>
        {verdict
          ? isFraud
            ? 'Escalate to manual review and freeze fulfillment until verified.'
            : 'Transaction cleared. Monitor velocity for recurring signals.'
          : 'Submit the form with transaction parameters to generate a score.'}
      </Typography>
    </Paper>
  );
}

export default function FraudDetection() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      const data = await postJson('/api/v1/fraud/predict', payload);
      setResult(data.result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="Fraud Detection"
      subtitle="Score risky orders instantly using velocity, biometrics, and payment patterns."
      metaLabel="PRICING & FRAUD"
    >
      {{
        form: <GenericForm fields={fraudFields} onSubmit={handleSubmit} loading={loading} />,
        result: <FraudResult verdict={result} />,
        theory: <GenericTheory content={fraudTheory} />,
        dataset: <DatasetViewer />,
        insights: <InsightsPanel />,
        ask: <CopilotPanel contextType="fraud" />,
        demo: <DemoPlayer />,
      }}
    </FormWrapper>
  );
}