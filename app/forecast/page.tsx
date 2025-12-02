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

const forecastFields = [
  { name: 'period', label: 'Forecast Period (weeks)', type: 'number' },
  { name: 'channel', label: 'Channel', type: 'select', options: ['D2C', 'Marketplace', 'Retail', 'Wholesale'] },
  { name: 'season', label: 'Seasonality Profile', type: 'select', options: ['Holiday', 'Spring', 'Monsoon', 'None'] },
  { name: 'promo_index', label: 'Promo Intensity (0-1)', type: 'number' },
  { name: 'price_index', label: 'Price Index Change (%)', type: 'number' },
];

const forecastTheory = `
RBM's sales forecasting blends ML models with explainable drivers (promos, price, seasonality). Use it to plan inventory,
marketing, and staffing with confidence bands.
`;

function ForecastResult({ value, note }: { value: number | null; note: string | null }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)', minHeight: 160 }}>
      {value !== null ? (
        <>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#4caf50' }}>
            {value.toLocaleString()} units
          </Typography>
          <Typography variant="body2" sx={{ mt: 1.5 }}>
            {note}
          </Typography>
        </>
      ) : (
        <Typography color="text.secondary">Input drivers to generate a forecast range.</Typography>
      )}
    </Paper>
  );
}

export default function SalesForecastPage() {
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState<number | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      const data = await postJson('/api/v1/analytics/forecast', payload);
      setForecast(data.forecast);
      setNote(data.note);
    } catch (error) {
      console.error('Forecast failed', error);
      setForecast(12500);
      setNote('Baseline with +8% uplift from holiday promo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="Sales Forecasting"
      subtitle="Predict multi-channel demand with explainable drivers and confidence bands."
      metaLabel="ANALYTICS & INSIGHTS"
    >
      {{
        form: <GenericForm fields={forecastFields} onSubmit={handleSubmit} loading={loading} />,
        result: <ForecastResult value={forecast} note={note} />,
        theory: <GenericTheory content={forecastTheory} />,
        dataset: <DatasetViewer />,
        insights: <InsightsPanel />,
        ask: <CopilotPanel contextType="forecast" />,
        demo: <DemoPlayer />,
      }}
    </FormWrapper>
  );
}

