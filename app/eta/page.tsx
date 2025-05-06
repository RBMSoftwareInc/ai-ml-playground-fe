'use client'

import { useState } from 'react'
import { Box, Tabs, Tab, Typography, Button } from '@mui/material'
import GenericForm from '../../components/forms/GenericForm'
import GenericResult from '../../components/forms/GenericResult'
import GenericTheory from '../../components/forms/GenericTheory'
import DatasetViewer from '../../components/forms/DatasetViewer'
import InsightsPanel from '../../components/forms/InsightsPanel'
import AskGene from '../../components/forms/AskGene'
import DemoPlayer from '../../components/forms/DemoPlayer'

import etaTheoryContent from './etaTheoryData';

export default function ETAPredictPage() {
  const [tab, setTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [etaTime, setEtaTime] = useState<string | null>(null)

  const handleSubmit = async (formData: any) => {
    setLoading(true)
    const res = await fetch('http://localhost:5000/api/v1/eta/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    const data = await res.json()
    setResult(data.predicted_eta_hours)
    setEtaTime(data.predicted_eta_datetime)
    setTab(1)
    setLoading(false)
  }

  const formFields = [
    { name: 'distance_km', label: 'Distance (km)', type: 'number' },
    { name: 'carrier_speed', label: 'Carrier Speed (km/h)', type: 'number' },
    { name: 'weight_kg', label: 'Package Weight (kg)', type: 'number' },
    { name: 'origin_city', label: 'Origin City', type: 'select', options: ['Delhi', 'Bangalore', 'Hyderabad', 'Mumbai'] },
    { name: 'destination_city', label: 'Destination City', type: 'select', options: ['Delhi', 'Bangalore', 'Hyderabad', 'Mumbai'] },
    { name: 'carrier', label: 'Carrier', type: 'select', options: ['BlueDart', 'Delhivery', 'FedEx', 'EcomExpress'] },
    { name: 'weather_condition', label: 'Weather Condition', type: 'select', options: ['Clear', 'Rainy', 'Foggy', 'Stormy'] }
  ]

  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(e, newVal) => setTab(newVal)}
        textColor="secondary"
        indicatorColor="secondary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2, borderBottom: '1px solid #ccc' }}
      >
        <Tab label="📝 Form" />
        <Tab label="📊 Result" />
        <Tab label="🧠 Theory" />
        <Tab label="📁 Dataset" />
        <Tab label="📈 Insights" />
        <Tab label="🧞 Ask Gene" />

        <Tab label="🎥 Demo" />
      </Tabs>

      <Box>
        {tab === 0 && <GenericForm fields={formFields} onSubmit={handleSubmit} loading={loading} />}
        {tab === 1 && <GenericResult result={result} datetime={etaTime} />}
        {tab === 2 && <GenericTheory content={etaTheoryContent} />}
        {tab === 3 && <DatasetViewer />}
        {tab === 4 && <InsightsPanel />}
        {tab === 5 && <AskGene contextType="eta" />}
        <Button
          onClick={() => setTab(5)} // Ask Gene tab
          sx={{
            position: 'absolute',
            right: 30,
            top: 100,
            bgcolor: 'gold',
            borderRadius: '50%',
            width: 50,
            height: 50,
            animation: 'pulse 2s infinite',
            boxShadow: '0 0 12px orange',
            '&:hover': { transform: 'scale(1.1)', boxShadow: '0 0 20px gold' }
          }}
        >
          🧞
        </Button>
        {tab === 6 && <DemoPlayer />}
      </Box>
    </Box>
  )
}
