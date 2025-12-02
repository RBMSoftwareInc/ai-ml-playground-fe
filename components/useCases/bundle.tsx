'use client';

import { useState } from 'react';
import FormWrapper from '../FormWrapper';
import GenericForm from '../forms/GenericForm';
import GenericTheory from '../forms/GenericTheory';
import DatasetViewer from '../forms/DatasetViewer';
import InsightsPanel from '../forms/InsightsPanel';
import CopilotPanel from '../forms/AskGene';
import DemoPlayer from '../forms/DemoPlayer';
import { Paper, Typography, Stack, Chip } from '@mui/material';
import { postJson } from '../../lib/api';

const bundleFields = [
  { name: 'bundle_goal', label: 'Goal', type: 'select', options: ['Increase AOV', 'Clearance', 'Themed Outfit', 'Subscription'] },
  { name: 'anchor_product', label: 'Anchor Product SKU', type: 'text' },
  { name: 'budget_range', label: 'Budget Range', type: 'text' },
  { name: 'styling_context', label: 'Styling Context', type: 'select', options: ['Casual', 'Work', 'Party', 'Athleisure'] },
  { name: 'channels', label: 'Channels', type: 'select', options: ['Onsite', 'App', 'Retail Kiosk', 'Marketplace'] },
];

const bundleTheory = `
Bundles stitch together complementary SKUs by balancing price anchoring, inventory exposure, and storytelling.
Use AI to map style rules, ensure availability, and personalize bundles dynamically per shopper intent.
`;

function BundleResult({ picks }: { picks: string[] }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
        Suggested pairing
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {picks.length
          ? picks.map((item) => (
              <Chip
                key={item}
                label={item}
                sx={{ borderRadius: 2, bgcolor: 'rgba(255,255,255,0.08)', color: '#fff' }}
              />
            ))
          : <Typography color="text.secondary">Submit criteria to generate bundle components.</Typography>}
      </Stack>
    </Paper>
  );
}

export default function BundleAndOutfitPage() {
  const [loading, setLoading] = useState(false);
  const [picks, setPicks] = useState<string[]>([]);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      const data = await postJson('/api/v1/bundle/recommend', payload);
      setPicks(data.components || ['SKU-123 Tee', 'SKU-778 Denim', 'SKU-551 Sneakers']);
    } catch (error) {
      console.error('Bundle recommendation failed', error);
      setPicks(['Anchor SKU', 'Cross-sell Item', 'Accessory Upsell']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="Bundle & Outfit Suggestions"
      subtitle="Curate AI-generated assortments that balance storytelling, margin, and inventory targets."
      metaLabel="PRODUCT DISCOVERY"
    >
      {{
        form: <GenericForm fields={bundleFields} onSubmit={handleSubmit} loading={loading} />,
        result: <BundleResult picks={picks} />,
        theory: <GenericTheory content={bundleTheory} />,
        dataset: <DatasetViewer />,
        insights: <InsightsPanel />,
        ask: <CopilotPanel contextType="bundle" />,
        demo: <DemoPlayer />,
      }}
    </FormWrapper>
  );
}

