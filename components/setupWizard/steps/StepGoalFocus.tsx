'use client'
import { Box, Typography, FormGroup, FormControlLabel, Checkbox } from '@mui/material'

const options = ['Improve ETA', 'Optimize Pricing', 'Enhance Recommendations', 'Prevent Fraud', 'Analyze Reviews']

export default function StepGoalFocus({ data, update }: any) {
  const toggleOption = (val: string) => {
    const newGoals = data.goals.includes(val)
      ? data.goals.filter((g: string) => g !== val)
      : [...data.goals, val]
    update({ goals: newGoals })
  }

  return (
    <Box>
      <Typography variant="h6" mb={2}>🎯 What do you want to improve?</Typography>
      <FormGroup>
        {options.map((goal) => (
          <FormControlLabel
            key={goal}
            control={<Checkbox checked={data.goals.includes(goal)} onChange={() => toggleOption(goal)} />}
            label={goal}
          />
        ))}
      </FormGroup>
    </Box>
  )
}
