'use client'

import { Box, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material'

interface Props {
  formData: any
  onChange: (field: string, value: any) => void
}

const goalsList = [
  'Improve Delivery Estimates',
  'Detect Fraudulent Transactions',
  'Optimize Pricing Strategies',
  'Enhance Visual Search',
  'Increase Personalization',
  'Improve Inventory Forecasting',
  'Generate Product Descriptions',
  'Improve Churn Retention',
]

export default function AiGoalsStep({ formData, onChange }: Props) {
  const selectedGoals: string[] = formData.goals || []

  const toggleGoal = (goal: string) => {
    const updated = selectedGoals.includes(goal)
      ? selectedGoals.filter((g) => g !== goal)
      : [...selectedGoals, goal]
    onChange('goals', updated)
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        🎯 What are your AI Goals?
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Select the objectives you’re most interested in exploring with the AI Playground.
      </Typography>

      <FormGroup>
  {goalsList.map((goal) => (
    <FormControlLabel
      key={goal}
      control={
        <Checkbox
          checked={selectedGoals.includes(goal)}
          onChange={() => toggleGoal(goal)}
          sx={{
            color: '#6a1b9a',
            '&.Mui-checked': {
              color: '#ab47bc',
              boxShadow: '0 0 6px #ab47bc',
            }
          }}
        />
      }
      label={goal}
      sx={{
        m: 1,
        px: 2,
        py: 1,
        borderRadius: '12px',
        border: '1px solid #ab47bc',
        background: selectedGoals.includes(goal) ? '#f3e5f5' : '#fff',
        '&:hover': {
          background: '#fce4ec',
          boxShadow: '0 0 8px rgba(171,71,188,0.4)',
        }
      }}
    />
  ))}
</FormGroup>

    </Box>
  )
}
