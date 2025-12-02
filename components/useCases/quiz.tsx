'use client';

import { useState } from 'react';
import FormWrapper from '../FormWrapper';
import GenericTheory from '../forms/GenericTheory';
import DatasetViewer from '../forms/DatasetViewer';
import InsightsPanel from '../forms/InsightsPanel';
import CopilotPanel from '../forms/AskGene';
import DemoPlayer from '../forms/DemoPlayer';
import { Paper, Typography, Grid, TextField, MenuItem, Button } from '@mui/material';
import { postJson } from '../../lib/api';

const quizTheory = `
Product match quizzes personalize merchandising journeys. Configure question banks, scoring rules, and
recommendation mappings to keep experiences fun yet outcome-driven.
`;

function QuizForm({ onSubmit, loading }: { onSubmit: (payload: any) => void; loading: boolean }) {
  const [payload, setPayload] = useState({
    quiz_name: 'Style Match',
    number_of_questions: 5,
    recommendation_type: 'Outfit',
    data_destination: 'CRM + ESP',
  });

  const handleChange = (field: string, value: any) => {
    setPayload(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField label="Quiz Name" value={payload.quiz_name} onChange={(e) => handleChange('quiz_name', e.target.value)} fullWidth />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            type="number"
            label="Questions"
            value={payload.number_of_questions}
            onChange={(e) => handleChange('number_of_questions', Number(e.target.value))}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Recommendation Type"
            value={payload.recommendation_type}
            onChange={(e) => handleChange('recommendation_type', e.target.value)}
            fullWidth
          >
            {['Outfit', 'Routine', 'Bundle', 'Plan'].map(opt => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Data Destination"
            value={payload.data_destination}
            onChange={(e) => handleChange('data_destination', e.target.value)}
            fullWidth
          >
            {['CRM + ESP', 'CDP only', 'Analytics only'].map(opt => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={() => onSubmit(payload)} disabled={loading} sx={{ minWidth: 200, py: 1.4, fontWeight: 600 }}>
            {loading ? 'Planning…' : 'Generate Quiz Blueprint'}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

function QuizResult({ plan }: { plan: string | null }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)', minHeight: 160 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Quiz Flow</Typography>
      <Typography variant="body1">
        {plan || 'Configure quiz inputs to see recommended questions and recommendation logic.'}
      </Typography>
    </Paper>
  );
}

export default function ProductMatchQuizPage() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string | null>(null);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      const data = await postJson('/api/v1/gamification/quiz', payload);
      setPlan(data.plan);
    } catch (error) {
      console.error('Quiz plan failed', error);
      setPlan(`Ask ${payload.number_of_questions} lifestyle questions and recommend a ${payload.recommendation_type.toLowerCase()} with confidence scoring.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="Product Match Quiz"
      subtitle="Design intelligent quizzes that capture zero-party data and serve personalized recommendations."
      metaLabel="GAMIFICATION"
    >
      {{
        form: <QuizForm onSubmit={handleSubmit} loading={loading} />,
        result: <QuizResult plan={plan} />,
        theory: <GenericTheory content={quizTheory} />,
        dataset: <DatasetViewer />,
        insights: <InsightsPanel />,
        ask: <CopilotPanel contextType="quiz" />,
        demo: <DemoPlayer />,
      }}
    </FormWrapper>
  );
}

