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

const leadFields = [
  { name: 'offer', label: 'Lead Magnet', type: 'select', options: ['Playbook PDF', 'Webinar', 'Quiz', 'Demo'] },
  { name: 'channel', label: 'Primary Channel', type: 'select', options: ['Email', 'Paid Ads', 'Organic Social', 'Website Modal'] },
  { name: 'audience', label: 'Audience', type: 'text' },
  { name: 'sla_minutes', label: 'Sales SLA (minutes)', type: 'number' },
  { name: 'qualification_score', label: 'Qualification Score (0-100)', type: 'number' },
];

const leadTheory = `
Lead generation orchestrates magnet, channel, scoring, and routing. RBM's AI suggests nurture steps, channel sequencing,
and sales SLAs to keep follow-ups lightning fast.
`;

function LeadPlayResult({ steps }: { steps: string[] }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)' }}>
      {steps.length ? (
        <>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Recommended Flow
          </Typography>
          <List dense>
            {steps.map((step, idx) => (
              <ListItem key={idx} sx={{ color: 'rgba(255,255,255,0.85)' }}>
                {step}
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <Typography color="text.secondary">Add magnet details to generate a playbook.</Typography>
      )}
    </Paper>
  );
}

export default function LeadGenPage() {
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<string[]>([]);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      const data = await postJson('/api/v1/leadgen/plan', payload);
      setSteps(data.steps || []);
    } catch (error) {
      console.error('Lead gen plan failed', error);
      setSteps([
        `Launch ${payload.offer} across ${payload.channel}`,
        'Score leads via first-party data + quiz responses',
        `Route >${payload.qualification_score}% to sales within ${payload.sla_minutes} minutes`,
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="Lead Gen Blueprint"
      subtitle="Design lead magnets, qualification rules, and auto-routing to sales with AI guardrails."
      metaLabel="MARKETING INTELLIGENCE"
    >
      {{
        form: <GenericForm fields={leadFields} onSubmit={handleSubmit} loading={loading} />,
        result: <LeadPlayResult steps={steps} />,
        theory: <GenericTheory content={leadTheory} />,
        dataset: <DatasetViewer />,
        insights: <InsightsPanel />,
        ask: <CopilotPanel contextType="leadgen" />,
        demo: <DemoPlayer />,
      }}
    </FormWrapper>
  );
}

