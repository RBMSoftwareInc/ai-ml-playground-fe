'use client';

import { useState } from 'react';
import FormWrapper from '../../components/FormWrapper';
import GenericTheory from '../../components/forms/GenericTheory';
import DatasetViewer from '../../components/forms/DatasetViewer';
import InsightsPanel from '../../components/forms/InsightsPanel';
import CopilotPanel from '../../components/forms/AskGene';
import DemoPlayer from '../../components/forms/DemoPlayer';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
} from '@mui/material';
import { postJson } from '../../lib/api';

const voiceTheory = `
Voice search blends wake-word detection, NLU, and fulfillment. RBM mirrors Alexa / Siri style dialogs by fusing
customer identity, catalog data, and order APIs — all within brand-safe guardrails.
`;

function VoiceForm({ onGenerate, loading }: { onGenerate: (payload: any) => void; loading: boolean }) {
  const [payload, setPayload] = useState({
    assistant_name: 'RBM Genie',
    voice_pack: 'Soprano',
    wake_phrase: 'Hey RBM',
    locale: 'en-US',
    enable_multimodal: true,
  });

  const handleChange = (key: string, value: any) => {
    setPayload((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        border: '1px solid rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(255,255,255,0.02)',
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
      }}
    >
      <TextField
        label="Assistant Name"
        value={payload.assistant_name}
        onChange={(e) => handleChange('assistant_name', e.target.value)}
      />
      <TextField
        select
        label="Voice Pack"
        value={payload.voice_pack}
        onChange={(e) => handleChange('voice_pack', e.target.value)}
      >
        {['Soprano', 'Baritone', 'Neutral', 'Conversational'].map((opt) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Wake Phrase"
        value={payload.wake_phrase}
        onChange={(e) => handleChange('wake_phrase', e.target.value)}
      />
      <TextField
        select
        label="Locale"
        value={payload.locale}
        onChange={(e) => handleChange('locale', e.target.value)}
      >
        {['en-US', 'en-IN', 'ar-SA', 'es-MX'].map((opt) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </TextField>
      <FormControlLabel
        control={
          <Switch
            checked={payload.enable_multimodal}
            onChange={(e) => handleChange('enable_multimodal', e.target.checked)}
          />
        }
        label="Show companion visuals"
        sx={{ gridColumn: { xs: '1 / 2', md: '1 / span 2' } }}
      />
      <Button
        variant="contained"
        onClick={() => onGenerate(payload)}
        disabled={loading}
        sx={{ gridColumn: { xs: '1 / 2', md: '1 / span 2' }, py: 1.4, fontWeight: 600 }}
      >
        {loading ? 'Compiling skill...' : 'Generate Voice Flow'}
      </Button>
    </Paper>
  );
}

function VoiceResult({ script }: { script: string | null }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)', minHeight: 180 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, color: 'rgba(255,255,255,0.7)' }}>
        Sample Dialogue
      </Typography>
      <Typography variant="body1">
        {script || 'Define wake phrase and locale to preview a sample Alexa/Siri-style conversation.'}
      </Typography>
    </Paper>
  );
}

export default function VoiceSearchPage() {
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<string | null>(null);

  const handleGenerate = async (payload: any) => {
    setLoading(true);
    try {
      const data = await postJson('/api/v1/voice/blueprint', payload);
      setScript(data.script);
    } catch (error) {
      console.error('Voice blueprint failed', error);
      setScript(
        `${payload.wake_phrase}, show me new drops. → ${payload.assistant_name}: "Here are the top matches with live inventory."`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="Voice Commerce"
      subtitle="Launch Alexa / Siri-grade experiences that sync voice intents with your catalog and store APIs."
      metaLabel="PERSONALIZATION"
    >
      {{
        form: <VoiceForm onGenerate={handleGenerate} loading={loading} />,
        result: <VoiceResult script={script} />,
        theory: <GenericTheory content={voiceTheory} />,
        dataset: <DatasetViewer />,
        insights: <InsightsPanel />,
        ask: <CopilotPanel contextType="voice" />,
        demo: <DemoPlayer />,
      }}
    </FormWrapper>
  );
}

