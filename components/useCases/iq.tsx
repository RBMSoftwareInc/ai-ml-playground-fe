'use client';

import { useState } from 'react';
import FormWrapper from '../FormWrapper';
import GenericTheory from '../forms/GenericTheory';
import DatasetViewer from '../forms/DatasetViewer';
import InsightsPanel from '../forms/InsightsPanel';
import CopilotPanel from '../forms/AskGene';
import DemoPlayer from '../forms/DemoPlayer';
import { Paper, Typography, List, ListItem, TextField, Grid, Button } from '@mui/material';
import { postJson } from '../../lib/api';

const iqTheory = `
Bring arcade-like moments into commerce. IQ Game Suite lets shoppers solve micro-puzzles—style Sudoku, cart Tetris,
or product pick crosswords—and rewards them with dynamic perks.
`;

function IQForm({ onSubmit, loading }: { onSubmit: (payload: any) => void; loading: boolean }) {
  const [payload, setPayload] = useState({
    game_type: 'Style Sudoku',
    reward: 'Extra loyalty points',
    difficulty: 'Adaptive',
    timer_seconds: 60,
  });

  const handleChange = (field: string, value: any) => {
    setPayload(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Game Type"
            value={payload.game_type}
            onChange={(e) => handleChange('game_type', e.target.value)}
            fullWidth
            SelectProps={{ native: false }}
          >
            {['Style Sudoku', 'Cart Tetris', 'Trend Crossword', 'Rapid Recommendation'].map(opt => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Reward" value={payload.reward} onChange={(e) => handleChange('reward', e.target.value)} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField select label="Difficulty" value={payload.difficulty} onChange={(e) => handleChange('difficulty', e.target.value)} fullWidth>
            {['Adaptive', 'Beginner', 'Pro'].map(opt => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            type="number"
            label="Timer (seconds)"
            value={payload.timer_seconds}
            onChange={(e) => handleChange('timer_seconds', Number(e.target.value))}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={() => onSubmit(payload)} disabled={loading} sx={{ minWidth: 200, py: 1.4, fontWeight: 600 }}>
            {loading ? 'Building…' : 'Build Game Blueprint'}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

function IQResult({ steps }: { steps: string[] }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)', minHeight: 160 }}>
      {steps.length ? (
        <>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Game Flow</Typography>
          <List dense>
            {steps.map(step => (
              <ListItem key={step} sx={{ color: 'rgba(255,255,255,0.85)' }}>
                {step}
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <Typography color="text.secondary">Configure a game to see flow and integration steps.</Typography>
      )}
    </Paper>
  );
}

export default function IQGameSuitePage() {
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<string[]>([]);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      const data = await postJson('/api/v1/gamification/iq', payload);
      setSteps(data.steps || []);
    } catch (error) {
      console.error('IQ plan failed', error);
      setSteps([
        'Load product dataset into puzzle grid',
        'Enable adaptive timer + hints',
        `Grant reward (${payload.reward}) upon completion`,
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="AI IQ Game Suite"
      subtitle="Drop futuristic mini-games (Sudoku, Tetris, Crosswords) into your commerce funnel."
      metaLabel="GAMIFICATION"
    >
      {{
        form: <IQForm onSubmit={handleSubmit} loading={loading} />,
        result: <IQResult steps={steps} />,
        theory: <GenericTheory content={iqTheory} />,
        dataset: <DatasetViewer />,
        insights: <InsightsPanel />,
        ask: <CopilotPanel contextType="iq" />,
        demo: <DemoPlayer />,
      }}
    </FormWrapper>
  );
}

