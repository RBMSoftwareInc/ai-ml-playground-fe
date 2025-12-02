'use client'

import { useState } from 'react'
import GenericForm from '../forms/GenericForm';
import GenericResult from '../forms/GenericResult';
import GenericTheory from '../forms/GenericTheory';
import DatasetViewer from '../forms/DatasetViewer';
import InsightsPanel from '../forms/InsightsPanel';
import CopilotPanel from '../forms/AskGene';
import DemoPlayer from '../forms/DemoPlayer';
import FormWrapper from '../FormWrapper';
import { postJson } from '../../lib/api';

import etaTheoryContent from './etaTheoryData';

export default function ETAPredictPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [etaTime, setEtaTime] = useState<string | null>(null);

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    try {
      const data = await postJson('/api/v1/eta/predict', formData);
      setResult(data.predicted_eta_hours);
      setEtaTime(data.predicted_eta_datetime);
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    { name: 'distance_km', label: 'Distance (km)', type: 'number' },
    { name: 'carrier_speed', label: 'Carrier Speed (km/h)', type: 'number' },
    { name: 'weight_kg', label: 'Package Weight (kg)', type: 'number' },
    { name: 'origin_city', label: 'Origin City', type: 'select', options: ['Delhi', 'Bangalore', 'Hyderabad', 'Mumbai'] },
    { name: 'destination_city', label: 'Destination City', type: 'select', options: ['Delhi', 'Bangalore', 'Hyderabad', 'Mumbai'] },
    { name: 'carrier', label: 'Carrier', type: 'select', options: ['BlueDart', 'Delhivery', 'FedEx', 'EcomExpress'] },
    { name: 'weather_condition', label: 'Weather Condition', type: 'select', options: ['Clear', 'Rainy', 'Foggy', 'Stormy'] }
  ];

  return (
    <FormWrapper
      title="ETA Prediction"
      subtitle="Forecast last-mile arrival windows by combining distance, carrier telemetry, and weather conditions."
      metaLabel="LOGISTICS OPS"
    >
      {{
        form: <GenericForm fields={formFields} onSubmit={handleSubmit} loading={loading} />,
        result: <GenericResult result={result} datetime={etaTime} label="ETA" unit="hours" />,
        theory: <GenericTheory content={etaTheoryContent} />,
        dataset: <DatasetViewer />,
        insights: <InsightsPanel />,
        ask: <CopilotPanel contextType="eta" />,
        demo: <DemoPlayer />,
      }}
    </FormWrapper>
  );
}
