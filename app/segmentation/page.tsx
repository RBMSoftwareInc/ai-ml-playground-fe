'use client';

import { useState } from 'react';
import FormWrapper from '../../components/FormWrapper';
import GenericForm from '../../components/forms/GenericForm';
import GenericTheory from '../../components/forms/GenericTheory';
import DatasetViewer from '../../components/forms/DatasetViewer';
import InsightsPanel from '../../components/forms/InsightsPanel';
import CopilotPanel from '../../components/forms/AskGene';
import DemoPlayer from '../../components/forms/DemoPlayer';
import { Paper, Typography, List, ListItem } from '@mui/material';
import { postJson } from '../../lib/api';

const segmentationFields = [
  { name: 'dataset_size', label: 'Dataset Size', type: 'number' },
  { name: 'clustering_method', label: 'Clustering Method', type: 'select', options: ['KMeans', 'DBSCAN', 'RFM', 'Hierarchical'] },
  { name: 'features', label: 'Features (comma separated)', type: 'text' },
  { name: 'refresh_cadence', label: 'Refresh Cadence (days)', type: 'number' },
  { name: 'activation_channel', label: 'Activation Channel', type: 'select', options: ['Email', 'Ads', 'In-App', 'Salesforce'] },
];

const segmentationTheory = `
Customer segmentation clusters shoppers by behavior, value, and intent. Use the resulting cohorts to tailor campaigns,
experiments, and AI assistant playbooks.
`;

function SegmentationResult({ segments }: { segments: string[] }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)' }}>
      {segments.length ? (
        <>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
            Proposed Cohorts
          </Typography>
          <List dense>
            {segments.map((segment) => (
              <ListItem key={segment} sx={{ color: 'rgba(255,255,255,0.85)' }}>
                {segment}
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <Typography color="text.secondary">Add dataset parameters to generate cohort suggestions.</Typography>
      )}
    </Paper>
  );
}

export default function SegmentationPage() {
  const [loading, setLoading] = useState(false);
  const [segments, setSegments] = useState<string[]>([]);

  const handleSubmit = async (payload: any) => {
    setLoading(true);
    try {
      const data = await postJson('/api/v1/segmentation/build', payload);
      setSegments(data.segments || ['High-AOV Loyalists', 'Discount Seekers', 'Window Shoppers']);
    } catch (error) {
      console.error('Segmentation failed', error);
      setSegments(['Launch Enthusiasts', 'Discount Seekers', 'Dormant VIPs']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="Customer Segmentation"
      subtitle="Cluster customers by behavior and value, then push cohorts into every activation channel."
      metaLabel="MARKETING INTELLIGENCE"
    >
      {{
        form: <GenericForm fields={segmentationFields} onSubmit={handleSubmit} loading={loading} />,
        result: <SegmentationResult segments={segments} />,
        theory: <GenericTheory content={segmentationTheory} />,
        dataset: <DatasetViewer />,
        insights: <InsightsPanel />,
        ask: <CopilotPanel contextType="segmentation" />,
        demo: <DemoPlayer />,
      }}
    </FormWrapper>
  );
}

