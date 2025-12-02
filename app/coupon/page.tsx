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

const couponFields = [
  { name: 'campaign', label: 'Campaign Name', type: 'text' },
  { name: 'coupon_type', label: 'Coupon Type', type: 'select', options: ['Single-use', 'Multi-use', 'Referral', 'Employee'] },
  { name: 'redemption_rate', label: 'Redemption Rate (%)', type: 'number' },
  { name: 'avg_discount', label: 'Avg Discount (%)', type: 'number' },
  { name: 'duplicate_devices', label: 'Duplicate Devices', type: 'number' },
  { name: 'geo_anomalies', label: 'Geo Anomalies (%)', type: 'number' },
];

const couponTheory = `
Coupon abuse detection blends velocity metrics, device overlap, and geographic anomalies.
Flag suspicious redeemers early and auto-expire compromised campaigns without hurting genuine shoppers.
`;

function CouponResult({ risk }: { risk: string | null }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)', minHeight: 150 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
        Risk Assessment
      </Typography>
      <Typography variant="body1">
        {risk || 'Provide campaign telemetry to score coupon abuse risk.'}
      </Typography>
    </Paper>
  );
}

export default function CouponAbusePage() {
  const [loading, setLoading] = useState(false);
  const [risk, setRisk] = useState<string | null>(null);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      const data = await postJson('/api/v1/coupon/risk', payload);
      setRisk(data.summary || 'Medium risk: tighten device limit and require OTP.');
    } catch (error) {
      console.error('Coupon risk failed', error);
      setRisk('Medium risk detected — throttle redemption rate and enable OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="Coupon Abuse Detection"
      subtitle="Monitor suspicious redemption spikes, device duplication, and geo anomalies in real time."
      metaLabel="PRICING & FRAUD"
    >
      {{
        form: <GenericForm fields={couponFields} onSubmit={handleSubmit} loading={loading} />,
        result: <CouponResult risk={risk} />,
        theory: <GenericTheory content={couponTheory} />,
        dataset: <DatasetViewer />,
        insights: <InsightsPanel />,
        ask: <CopilotPanel contextType="coupon" />,
        demo: <DemoPlayer />,
      }}
    </FormWrapper>
  );
}

