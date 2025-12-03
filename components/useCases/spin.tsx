'use client';

import { useState } from 'react';
import FormWrapper from '../FormWrapper';
import GenericTheory from '../forms/GenericTheory';
import DatasetViewer from '../forms/DatasetViewer';
import InsightsPanel from '../forms/InsightsPanel';
import CopilotPanel from '../forms/AskGene';
import DemoPlayer from '../forms/DemoPlayer';
import { Paper, Typography, Box, TextField, MenuItem, Slider, Button } from '@mui/material';
import { postJson } from '../../lib/api';

const spinTheory = `
Spin-to-win experiences balance delight with fraud prevention. Configure win rates, prize pools, and eligibility
rules to keep acquisition campaigns fresh and on-brand.
`;

function SpinForm({ onSubmit, loading }: { onSubmit: (payload: any) => void; loading: boolean }) {
  const [payload, setPayload] = useState({
    campaign: 'Welcome Spin',
    prize_pool: 'Store Credit',
    daily_limit: 1000,
    win_probability: 20,
    eligibility: 'All Visitors',
  });

  const handleChange = (field: string, value: any) => {
    setPayload(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          gap: 2,
        }}
      >
        <Box>
          <TextField label="Campaign Name" value={payload.campaign} onChange={(e) => handleChange('campaign', e.target.value)} fullWidth />
        </Box>
        <Box>
          <TextField select label="Prize Pool" value={payload.prize_pool} onChange={(e) => handleChange('prize_pool', e.target.value)} fullWidth>
            {['Store Credit', 'Free Shipping', 'Gift Item', 'Mystery Box'].map(opt => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>
        </Box>
        <Box>
          <TextField
            label="Daily Spin Limit"
            type="number"
            value={payload.daily_limit}
            onChange={(e) => handleChange('daily_limit', Number(e.target.value))}
            fullWidth
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Win Probability (%)</Typography>
          <Slider
            min={1}
            max={50}
            value={payload.win_probability}
            onChange={(_, value) => handleChange('win_probability', value)}
            valueLabelDisplay="auto"
            marks
          />
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}>
          <TextField
            select
            label="Eligibility"
            value={payload.eligibility}
            onChange={(e) => handleChange('eligibility', e.target.value)}
            fullWidth
          >
            {['All Visitors', 'Logged-in only', 'New Users', 'VIP'].map(opt => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>
        </Box>
        <Box sx={{ gridColumn: { xs: '1 / -1', sm: '1 / -1' } }}>
          <Button variant="contained" onClick={() => onSubmit(payload)} disabled={loading} sx={{ minWidth: 200, py: 1.4, fontWeight: 600 }}>
            {loading ? 'Calibrating…' : 'Generate Spin Blueprint'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

function SpinResult({ summary }: { summary: string | null }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)', minHeight: 160 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Playbook</Typography>
      <Typography variant="body1">
        {summary || 'Fill in campaign details to see recommended prize mixes and guardrails.'}
      </Typography>
    </Paper>
  );
}

export default function SpinToWinPage() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      const data = await postJson('/api/v1/gamification/spin', payload);
      setSummary(data.plan);
    } catch (error) {
      console.error('Spin plan failed', error);
      setSummary(`Offer ${payload.prize_pool} at ${payload.win_probability}% win rate with ${payload.daily_limit} spins/day.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="Spin-to-Win Experience"
      subtitle="Design on-brand spin widgets with responsible win rates and fraud controls."
      metaLabel="GAMIFICATION"
    >
      {{
        form: <SpinForm onSubmit={handleSubmit} loading={loading} />,
        result: <SpinResult summary={summary} />,
        theory: <GenericTheory content={spinTheory} />,
        dataset: <DatasetViewer />,
        insights: <InsightsPanel />,
        ask: <CopilotPanel contextType="spin" />,
        demo: <DemoPlayer />,
      }}
    </FormWrapper>
  );
}

