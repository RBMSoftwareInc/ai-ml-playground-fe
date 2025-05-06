'use client'

import { useState } from 'react'
import { Box, Typography, TextField, Button, Paper } from '@mui/material'

const geneKnowledge: Record<string, string> = {
  eta: `
    ETA (Estimated Time of Arrival) is calculated using:
    ETA = (Distance / Carrier Speed) + Delay(weather) + Adjustment(city_traffic)

    - Rainy weather adds about 12% delay
    - Carrier Speed is the strongest influencer
    - Known traffic routes affect adjustment
    - Cities like Mumbai often result in longer delays
  `
}

export default function AskGene({ contextType }: { contextType: string }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAsk = async () => {
    setLoading(true)

    // For now: mock logic
    const kb = geneKnowledge[contextType] || 'Sorry, no knowledge available.'
    const lowerQ = question.toLowerCase()

    let result = ''
    if (lowerQ.includes('rain') || lowerQ.includes('weather')) {
      result = 'Rainy weather adds ~12% delay to ETA.'
    } else if (lowerQ.includes('fastest') || lowerQ.includes('quickest')) {
      result = 'Fastest ETAs occur when weather is clear and carrier speed is high.'
    } else if (lowerQ.includes('formula') || lowerQ.includes('how is')) {
      result = 'ETA = Distance ÷ Carrier Speed + Delay(weather) + Adjustment(city traffic)'
    } else {
      result = 'Great question! For now, ETA is influenced by distance, carrier speed, weather, and city patterns.'
    }

    setTimeout(() => {
      setAnswer(result)
      setLoading(false)
    }, 800)
  }

  return (
    <Paper sx={{ p: 4, borderRadius: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        🧞 Ask Gene about ETA
      </Typography>

      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        I’m Gene, your AI genie! Ask me anything about ETA prediction — from formulas to factors affecting delivery time.
      </Typography>

      <Box display="flex" gap={2}>
        <TextField
          fullWidth
          label="Your question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Button variant="contained" onClick={handleAsk} disabled={loading}>
          {loading ? 'Thinking...' : 'Ask'}
        </Button>
      </Box>

      {answer && (
        <Box mt={3}>
          <Typography variant="subtitle2">🧞 Gene says:</Typography>
          <Typography variant="body1">{answer}</Typography>
        </Box>
      )}
    </Paper>
  )
}
