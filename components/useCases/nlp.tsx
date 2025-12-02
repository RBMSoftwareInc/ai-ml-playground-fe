'use client';

import { useState } from 'react';
import FormWrapper from '../FormWrapper';
import GenericForm from '../forms/GenericForm';
import GenericTheory from '../forms/GenericTheory';
import DatasetViewer from '../forms/DatasetViewer';
import InsightsPanel from '../forms/InsightsPanel';
import CopilotPanel from '../forms/AskGene';
import DemoPlayer from '../forms/DemoPlayer';
import { Paper, Typography, List, ListItem } from '@mui/material';
import { postJson } from '../../lib/api';

const nlpFields = [
  { name: 'query', label: 'Free-form Query', type: 'text' },
  { name: 'language', label: 'Language', type: 'select', options: ['English', 'Hindi', 'Spanish', 'Arabic'] },
  { name: 'channel', label: 'Channel', type: 'select', options: ['Onsite Search', 'App', 'Marketplace', 'Voice'] },
  { name: 'persona', label: 'Shopper Persona', type: 'select', options: ['New Visitor', 'Returning', 'VIP', 'Wholesale'] },
  { name: 'filters', label: 'Pinned Filters', type: 'text' },
];

const nlpTheory = `
RBM's NLP search rewrites shopper intent into vector + keyword queries and blends them with merchandising rules.
It keeps catalog metadata, embeddings, and business overrides synchronized across channels.
`;

function NLPResult({ summary, suggestions }: { summary: string | null; suggestions: string[] }) {
  if (!summary) {
    return (
      <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)', minHeight: 160 }}>
        <Typography color="text.secondary">Submit a shopper query to see the AI rewrite and recommended filters.</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
        Rewritten Intent
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {summary}
      </Typography>
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Suggested boosters</Typography>
      <List dense>
        {suggestions.map((item) => (
          <ListItem key={item} sx={{ color: 'rgba(255,255,255,0.8)', py: 0.5 }}>
            {item}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default function NLPSearchPage() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      const data = await postJson('/api/v1/nlp/search', payload);
      setSummary(data.intent || `Searching for ${payload.query} with ${payload.persona} context.`);
      setSuggestions(data.suggestions || ['Boost in-stock hero SKUs', 'Pin price filter between $40-$80', 'Show editorial content block']);
    } catch (error) {
      console.error('NLP search failed', error);
      setSummary(`Searching for “${payload.query}” with ${payload.persona || 'general'} persona.`);
      setSuggestions(['Boost organic materials', 'Surface new arrivals carousel', 'Highlight store-wide promo']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="NLP Intent Search"
      subtitle="Understand free-form shopper intent, rewrite queries, and attach business-aware boosters in milliseconds."
      metaLabel="PRODUCT DISCOVERY"
    >
      {{
        form: <GenericForm fields={nlpFields} onSubmit={handleSubmit} loading={loading} />,
        result: <NLPResult summary={summary} suggestions={suggestions} />,
        theory: <GenericTheory content={nlpTheory} />,
        dataset: <DatasetViewer />,
        insights: <InsightsPanel />,
        ask: <CopilotPanel contextType="nlp" />,
        demo: <DemoPlayer />,
      }}
    </FormWrapper>
  );
}

