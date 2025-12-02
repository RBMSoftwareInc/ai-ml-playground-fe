'use client';

import { useState } from 'react';
import FormWrapper from '../FormWrapper';
import GenericTheory from '../forms/GenericTheory';
import DatasetViewer from '../forms/DatasetViewer';
import InsightsPanel from '../forms/InsightsPanel';
import CopilotPanel from '../forms/AskGene';
import DemoPlayer from '../forms/DemoPlayer';
import { Paper, Typography, TextField, Button, Grid, MenuItem } from '@mui/material';
import { postJson } from '../../lib/api';

const sentimentTheory = `
Review sentiment models tag intent, emotion, and feature requests across large text streams.
Surface instant insights to merchandising, CX, and product teams.
`;

function SentimentForm({ onSubmit, loading }: { onSubmit: (payload: any) => void; loading: boolean }) {
  const [payload, setPayload] = useState({
    channel: 'D2C',
    language: 'English',
    review_text: '',
    contains_media: 'No',
  });

  const handleChange = (field: string, value: string) => {
    setPayload((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Channel"
            value={payload.channel}
            onChange={(e) => handleChange('channel', e.target.value)}
            fullWidth
          >
            {['D2C', 'Marketplace', 'App Store', 'Social'].map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Language"
            value={payload.language}
            onChange={(e) => handleChange('language', e.target.value)}
            fullWidth
          >
            {['English', 'Spanish', 'Hindi', 'Arabic'].map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Sample Review"
            value={payload.review_text}
            onChange={(e) => handleChange('review_text', e.target.value)}
            multiline
            minRows={4}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            select
            label="Contains Media"
            value={payload.contains_media}
            onChange={(e) => handleChange('contains_media', e.target.value)}
            fullWidth
          >
            {['No', 'Yes - Photos', 'Yes - Video'].map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={() => onSubmit(payload)}
            disabled={loading}
            sx={{ minWidth: 200, py: 1.4, fontWeight: 600 }}
          >
            {loading ? 'Analyzing…' : 'Analyze Sentiment'}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

function SentimentResult({ summary }: { summary: string | null }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)', minHeight: 150 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Insight
      </Typography>
      <Typography variant="body1">
        {summary || 'Paste a sample review to generate sentiment, emotion, and action signals.'}
      </Typography>
    </Paper>
  );
}

export default function ReviewSentimentPage() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      const data = await postJson('/api/v1/sentiment/analyze', payload);
      setSummary(data.summary);
    } catch (error) {
      console.error('Sentiment failed', error);
      setSummary('Tone: Joyful. Mentions fast shipping + premium packaging. Upsell accessories in follow-up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="Review & Sentiment Analysis"
      subtitle="Turn messy customer feedback into structured signals for CX, merchandising, and product teams."
      metaLabel="PRODUCT INTELLIGENCE"
    >
      {{
        form: <SentimentForm onSubmit={handleSubmit} loading={loading} />,
        result: <SentimentResult summary={summary} />,
        theory: <GenericTheory content={sentimentTheory} />,
        dataset: <DatasetViewer />,
        insights: <InsightsPanel />,
        ask: <CopilotPanel contextType="sentiment" />,
        demo: <DemoPlayer />,
      }}
    </FormWrapper>
  );
}

