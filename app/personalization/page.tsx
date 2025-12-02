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

const personalizationFields = [
  { name: 'audience', label: 'Audience Cohort', type: 'select', options: ['VIP', 'New Visitor', 'Churn-risk', 'B2B'] },
  { name: 'surface', label: 'Surface', type: 'select', options: ['Homepage Hero', 'PLP Slot', 'Email Banner', 'In-App Card'] },
  { name: 'goal', label: 'Goal', type: 'select', options: ['Conversion', 'Engagement', 'Attachment', 'AOV'] },
  { name: 'data_signals', label: 'Key Signals (comma separated)', type: 'text' },
  { name: 'experiment', label: 'Experiment Name', type: 'text' },
];

const personalizationTheory = `
Real-time personalization orchestrates decisions across a feature store, policy engine, and rendering surface.
Define cohorts, attach goals, and let the AI decide the right content, offer, or layout in <100ms.
`;

function PersonalizationResult({ playbook }: { playbook: string | null }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)', minHeight: 160 }}>
      {playbook ? (
        <>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
            Recommended Play
          </Typography>
          <Typography variant="body1">{playbook}</Typography>
        </>
      ) : (
        <Typography color="text.secondary">Describe the cohort and surface to generate a personalization playbook.</Typography>
      )}
    </Paper>
  );
}

export default function PersonalizationPage() {
  const [loading, setLoading] = useState(false);
  const [playbook, setPlaybook] = useState<string | null>(null);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      const data = await postJson('/api/v1/personalization/plan', payload);
      setPlaybook(data.playbook || `Target ${payload.audience} on ${payload.surface} with ${payload.goal} KPI.`);
    } catch (error) {
      console.error('Personalization plan failed', error);
      setPlaybook(`Use dynamic hero with social proof + limited time perk tailored to ${payload.audience}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="Real-Time Personalization"
      subtitle="Sequence AI-driven decisions per shopper, channel, and KPI while staying policy compliant."
      metaLabel="PERSONALIZATION"
    >
      {{
        form: <GenericForm fields={personalizationFields} onSubmit={handleSubmit} loading={loading} />,
        result: <PersonalizationResult playbook={playbook} />,
        theory: <GenericTheory content={personalizationTheory} />,
        dataset: <DatasetViewer />,
        insights: <InsightsPanel />,
        ask: <CopilotPanel contextType="personalization" />,
        demo: <DemoPlayer />,
      }}
    </FormWrapper>
  );
}

