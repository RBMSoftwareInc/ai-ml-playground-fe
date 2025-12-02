'use client'

import { useState } from 'react'
import { Box, Typography, TextField, Button, Paper } from '@mui/material'

const copilotKnowledge: Record<string, string> = {
  nlp: `
    NLP search rewrites intent into vector + keyword queries.
    • Blend embeddings with merchandising rules and availability
    • Language detection + transliteration keeps multi-lingual queries seamless
    • Booster rules prevent zero-result moments
  `,
  bundle: `
    Bundle design balances anchor items, complementary SKUs, and inventory health.
    • Use price anchoring and theme-based rules
    • Hide OOS inventory in real time
    • Test multiple price ladders per persona
  `,
  personalization: `
    Real-time personalization maps cohorts to experiences with guardrails.
    • Connect to feature store + decision engine
    • Track lift per surface and fall back gracefully
    • Respect policy, compliance, and experiment limits
  `,
  chat: `
    Chat assistants need persona, tone, tool access, and escalation logic.
    • Combine retrieval + function calling
    • Log each turn for coaching
    • Escalate after low-confidence or sentiment dips
  `,
  voice: `
    Voice commerce mirrors Alexa/Siri experiences.
    • Wake phrase + locale drive ASR tuning
    • Multimodal fallbacks (visual cards) improve trust
    • Export WebAR assets for immersive follow-up
  `,
  eta: `
    ETA (Estimated Time of Arrival) blends carrier telemetry, lane distance, and weather adjustments.
    • Rainy weather adds about 12% delay
    • Carrier speed variance is the strongest influencer
    • Known traffic routes affect adjustment
    • Congested metros like Mumbai often result in longer delays
  `,
  variant: `
    Variant intelligence weighs experiment lift, cohort engagement, and merchandising priorities.
    • Keep cohorts small so uplift is statistically sound
    • Blend qualitative signals (NPS, chat) with click-path data
    • Archive dormant variants monthly to avoid dilution
  `,
  fraud: `
    Fraud detection models score velocity, device fingerprints, behavioral anomalies, and payment metadata.
    • Velocity spikes paired with mismatched devices increase risk
    • Manual queues should focus on medium confidence ranges (0.45 - 0.7)
    • Rotate feature importance dashboards every sprint to spot drifts
  `,
  delay: `
    Order delay forecasting monitors SLA breaches by lane, carrier, and handoff timing.
    • Weather + carrier + hub congestion contribute to 80% of variance
    • Tag remediation owners when confidence exceeds 65%
    • Use alerts at T+2 hours to reassign carriers before the breach hits the customer
  `,
  inventory: `
    Inventory reordering uses sell-through velocity, safety stock, and supplier lead time.
    • Reorder point = (Average daily usage × lead time) + safety stock
    • Surface anomalies when velocity deviates ±30% week-over-week
    • Sync procurement once projections cross MOQ thresholds
  `,
  vss: `
    Visual similarity search relies on high-quality embeddings and consistent tagging.
    • Refresh embeddings whenever new catalog drops exceed 5% of assortment
    • Keep background removal consistent to avoid noisy vectors
    • Pair similarity results with price/availability filters for better conversion
  `,
  pricing: `
    Dynamic pricing operates within floor/ceiling guardrails, elasticity, and competitor deltas.
    • Tie every recommendation to explainable drivers
    • Freeze prices during promos, resume after guardrail check
  `,
  coupon: `
    Coupon abuse is flagged via velocity, device overlap, and geo anomalies.
    • Auto-expire compromised codes and issue replacements to legit users
    • Send mid-campaign alerts to marketing + risk owners
  `,
  churn: `
    Churn scoring highlights at-risk customers for early retention plays.
    • Look at engagement decay, service tickets, and order frequency
    • Trigger concierge or perks once score exceeds target threshold
  `,
  segmentation: `
    Segmentation groups shoppers for targeting.
    • Start with behavioral + value axes, then enrich with qualitative signals
    • Keep cadence short (weekly) so cohorts stay fresh
  `,
  subject: `
    Subject lines respond to tone, emoji policy, and CTA.
    • Generate at least 3 variants per send
    • Pair with preheader tests for best lift
  `,
  leadgen: `
    Lead gen magnets, scoring, and routing must be orchestrated.
    • Align sales SLAs with qualification scores
    • Trigger nurture for low scores instead of hard drop-off
  `,
  categorization: `
    Categorization uses text + attributes to map taxonomy paths.
    • Keep confidence scores visible for manual QA
    • Auto-sync to channels once >90% confidence
  `,
  sentiment: `
    Sentiment analysis extracts tone, feature requests, and urgency.
    • Route severe issues to CX instantly
    • Turn positive highlights into marketing copy
  `,
  descriptions: `
    Title/description generation follows brand voice presets.
    • Use tone radios + channel context for accurate copy
    • Return structured outputs (title, bullets, long copy)
  `,
  tryon: `
    AI try-on requires garment meshes, body models, and lighting.
    • Control latency by choosing resolution + pose count
    • Export GLB/WebAR for immersive experiences
  `,
};

export default function AskGene({ contextType }: { contextType: string }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAsk = async () => {
    setLoading(true)

    // For now: mock logic
    const kb = copilotKnowledge[contextType] || 'Sorry, no knowledge available.'
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
        🤖 AI Copilot — ETA insights
      </Typography>

      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        I’m your AI copilot! Ask me anything about ETA prediction — from formulas to factors affecting delivery time.
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
          <Typography variant="subtitle2">🤖 Copilot says:</Typography>
          <Typography variant="body1">{answer}</Typography>
        </Box>
      )}
    </Paper>
  )
}
