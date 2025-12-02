'use client';

import { useState } from 'react';
import FormWrapper from '../FormWrapper';
import GenericForm from '../forms/GenericForm';
import GenericTheory from '../forms/GenericTheory';
import DatasetViewer from '../forms/DatasetViewer';
import InsightsPanel from '../forms/InsightsPanel';
import CopilotPanel from '../forms/AskGene';
import DemoPlayer from '../forms/DemoPlayer';
import { Paper, Typography, Stack, LinearProgress } from '@mui/material';
import { postJson } from '../../lib/api';

const pricingFields = [
  { name: 'sku', label: 'SKU', type: 'text' },
  { name: 'current_price', label: 'Current Price', type: 'number' },
  { name: 'floor_price', label: 'Floor Price', type: 'number' },
  { name: 'ceiling_price', label: 'Ceiling Price', type: 'number' },
  { name: 'inventory_cover_days', label: 'Inventory Cover (days)', type: 'number' },
  { name: 'elasticity', label: 'Elasticity Score', type: 'number' },
  { name: 'competitor_delta', label: 'Competitor Price Delta (%)', type: 'number' },
];

const pricingTheory = `
Dynamic pricing ingests demand, elasticity, inventory, and competitor deltas to recommend safe price moves.
RBM keeps guardrails (floor/ceiling) and compliance policies in real-time sync with storefront APIs.
`;

function PricingResult({
  recommendation,
  confidence,
}: {
  recommendation: { price: number; note: string } | null;
  confidence: number;
}) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)' }}>
      {recommendation ? (
        <>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef4444' }}>
            ${recommendation.price.toFixed(2)}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1.5 }}>
            {recommendation.note}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 3, mb: 0.5 }}>
            Confidence
          </Typography>
          <LinearProgress
            variant="determinate"
            value={confidence}
            sx={{
              height: 8,
              borderRadius: 999,
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #ef4444, #ef4444)',
              },
            }}
          />
        </>
      ) : (
        <Typography color="text.secondary">
          Input SKU, guardrails, and elasticity to generate a recommended price move.
        </Typography>
      )}
    </Paper>
  );
}

export default function DynamicPricingPage() {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<{ price: number; note: string } | null>(null);
  const [confidence, setConfidence] = useState(0);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      const data = await postJson('/api/v1/pricing/recommend', payload);
      setRecommendation(data.recommendation || { price: Number(payload.current_price) - 2, note: 'Match competitor minus $2 to unlock velocity.' });
      setConfidence(data.confidence || 72);
    } catch (error) {
      console.error('Pricing recommendation failed', error);
      const safePrice = Math.max(payload.floor_price || 0, Number(payload.current_price) - 1);
      setRecommendation({ price: safePrice, note: 'Fallback to controlled discount while inventory cover is high.' });
      setConfidence(65);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="Dynamic Pricing Blueprint"
      subtitle="Balance margin, velocity, and competitor deltas with AI guardrails for your key SKUs."
      metaLabel="PRICING & FRAUD"
    >
      {{
        form: <GenericForm fields={pricingFields} onSubmit={handleSubmit} loading={loading} />,
        result: <PricingResult recommendation={recommendation} confidence={confidence} />,
        theory: <GenericTheory content={pricingTheory} />,
        dataset: <DatasetViewer />,
        insights: <InsightsPanel />,
        ask: <CopilotPanel contextType="pricing" />,
        demo: <DemoPlayer />,
      }}
    </FormWrapper>
  );
}

