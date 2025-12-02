'use client';

import { useState } from 'react';
import FormWrapper from '../../components/FormWrapper';
import GenericForm from '../../components/forms/GenericForm';
import GenericTheory from '../../components/forms/GenericTheory';
import DatasetViewer from '../../components/forms/DatasetViewer';
import InsightsPanel from '../../components/forms/InsightsPanel';
import CopilotPanel from '../../components/forms/AskGene';
import DemoPlayer from '../../components/forms/DemoPlayer';
import { Paper, Typography, Stack } from '@mui/material';
import { postJson } from '../../lib/api';

const chatFields = [
  { name: 'persona', label: 'Bot Persona', type: 'select', options: ['Concierge', 'Stylist', 'Support Agent', 'Product Expert'] },
  { name: 'tone', label: 'Tone', type: 'select', options: ['Friendly', 'Premium', 'Playful', 'Direct'] },
  { name: 'primary_goal', label: 'Primary Goal', type: 'select', options: ['Upsell', 'Issue Resolution', 'Guided Selling', 'FAQ'] },
  { name: 'hand_off', label: 'Human Handoff Threshold', type: 'number' },
  { name: 'channels', label: 'Channels', type: 'select', options: ['Web Widget', 'WhatsApp', 'Instagram DM', 'Retail Kiosk'] },
];

const chatTheory = `
RBM's AI chat assistant routes prompts through retrieval, safety, and tool layers.
Define persona, tone, goal, and when to escalate so the assistant mirrors your brand voice.
`;

function ChatResult({ script }: { script: string | null }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)', minHeight: 160 }}>
      <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
        Sample Opening Script
      </Typography>
      <Typography variant="body1">
        {script || 'Fill in the assistant blueprint to preview the greeting and escalation plan.'}
      </Typography>
    </Paper>
  );
}

export default function AIChatAssistantPage() {
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<string | null>(null);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      const data = await postJson('/api/v1/chat/blueprint', payload);
      setScript(data.script || `Hey there! I'm your ${payload.persona} ready to ${payload.primary_goal.toLowerCase()}.`);
    } catch (error) {
      console.error('Chat blueprint failed', error);
      setScript(`Hi! I'm your ${payload.persona} here to help with ${payload.primary_goal.toLowerCase()} on ${payload.channels}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="AI Chat Assistant"
      subtitle="Design an on-brand assistant with goals, escalation paths, and omnichannel reach."
      metaLabel="PERSONALIZATION"
    >
      {{
        form: <GenericForm fields={chatFields} onSubmit={handleSubmit} loading={loading} />,
        result: <ChatResult script={script} />,
        theory: <GenericTheory content={chatTheory} />,
        dataset: <DatasetViewer />,
        insights: <InsightsPanel />,
        ask: <CopilotPanel contextType="chat" />,
        demo: <DemoPlayer />,
      }}
    </FormWrapper>
  );
}

