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

const delayFields = [
  { name: 'order_id', label: 'Order ID', type: 'text' },
  { name: 'lane', label: 'Lane / Route', type: 'text' },
  { name: 'carrier', label: 'Carrier', type: 'select', options: ['BlueDart', 'Delhivery', 'FedEx', 'EcomExpress'] },
  { name: 'current_status', label: 'Current Status', type: 'select', options: ['Picked Up', 'In Transit', 'At Hub', 'Out for Delivery'] },
  { name: 'hours_in_state', label: 'Hours in Current State', type: 'number' },
  { name: 'weather_condition', label: 'Weather', type: 'select', options: ['Clear', 'Rainy', 'Foggy', 'Stormy'] },
  { name: 'hub_congestion_index', label: 'Hub Congestion Index (0-1)', type: 'number' },
];

const delayTheory = `
Order delay forecasting joins carrier telemetry, hub congestion, and weather events to surface early warnings.
Alerts routed at T+2 hours give ops teams enough time to re-route or incentivize alternate carriers.
`;

function DelayResult({ hours, action }: { hours: number | null; action: string | null }) {
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
      {hours !== null ? (
        <>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff7043' }}>
            +{hours} hrs risk
          </Typography>
          {action && (
            <Typography variant="body2" sx={{ mt: 2, color: 'rgba(255,255,255,0.8)' }}>
              Recommended action: {action}
            </Typography>
          )}
        </>
      ) : (
        <Typography color="text.secondary">Provide lane and carrier context to score delay risk.</Typography>
      )}
    </Paper>
  );
}

export default function OrderDelayForecastPage() {
  const [loading, setLoading] = useState(false);
  const [delayHours, setDelayHours] = useState<number | null>(null);
  const [action, setAction] = useState<string | null>(null);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      const data = await postJson('/api/v1/delay/predict', payload);
      setDelayHours(data.delay_hours ?? null);
      setAction(data.recovery_action ?? null);
    } catch (error) {
      console.error('Delay forecast failed', error);
      setDelayHours(4);
      setAction('Escalate to alternate carrier for final mile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="Order Delay Forecast"
      subtitle="Spot breach risk across lanes, carriers, and hub congestion before customers notice."
      metaLabel="LOGISTICS OPS"
    >
      {{
        form: <GenericForm fields={delayFields} onSubmit={handleSubmit} loading={loading} />,
        result: <DelayResult hours={delayHours} action={action} />,
        theory: <GenericTheory content={delayTheory} />,
        dataset: <DatasetViewer />,
        insights: <InsightsPanel />,
        ask: <CopilotPanel contextType="delay" />,
        demo: <DemoPlayer />,
      }}
    </FormWrapper>
  );
}

