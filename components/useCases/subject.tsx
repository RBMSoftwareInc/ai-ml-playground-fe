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

const subjectFields = [
  { name: 'campaign', label: 'Campaign Name', type: 'text' },
  { name: 'audience', label: 'Audience', type: 'select', options: ['VIP', 'Dormant', 'First Purchase', 'Wholesale'] },
  { name: 'tone', label: 'Tone', type: 'select', options: ['Excited', 'Premium', 'Urgent', 'Conversational'] },
  { name: 'emoji', label: 'Emoji?', type: 'select', options: ['None', 'Subtle', 'Bold'] },
  { name: 'cta', label: 'Primary CTA', type: 'text' },
];

const subjectTheory = `
AI-crafted subject lines blend audience insights, tone, and merchandising hooks while abiding by brand guardrails.
Pair subject variations with preheader testing and real-time send-time optimization for best lift.
`;

function SubjectResult({ subjects }: { subjects: string[] }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)' }}>
      {subjects.length ? (
        <>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Suggested Subject Lines
          </Typography>
          <List dense>
            {subjects.map((subject) => (
              <ListItem key={subject} sx={{ color: 'rgba(255,255,255,0.85)' }}>
                {subject}
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <Typography color="text.secondary">Provide campaign context to generate subject line tests.</Typography>
      )}
    </Paper>
  );
}

export default function SubjectLinePage() {
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<string[]>([]);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      const data = await postJson('/api/v1/email/subject', payload);
      setSubjects(data.subjects || []);
    } catch (error) {
      console.error('Subject generation failed', error);
      setSubjects([
        `🔥 ${payload.campaign}: Exclusive drop just for ${payload.audience}`,
        `Only for you: ${payload.cta}`,
        `Your ${payload.campaign} access is live`,
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="Email Subject Line Generator"
      subtitle="Spin up on-brand subject tests with tone, emoji, and CTA controls."
      metaLabel="MARKETING INTELLIGENCE"
    >
      {{
        form: <GenericForm fields={subjectFields} onSubmit={handleSubmit} loading={loading} />,
        result: <SubjectResult subjects={subjects} />,
        theory: <GenericTheory content={subjectTheory} />,
        dataset: <DatasetViewer />,
        insights: <InsightsPanel />,
        ask: <CopilotPanel contextType="subject" />,
        demo: <DemoPlayer />,
      }}
    </FormWrapper>
  );
}

