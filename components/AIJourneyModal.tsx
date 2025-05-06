'use client'
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box
} from '@mui/material';
import { useRouter } from 'next/navigation';

export default function AIJourneyModal({ open }: { open: boolean }) {
  const router = useRouter();

  const handleSelect = (mode: 'conventional' | 'ask-gene') => {
    localStorage.setItem('journey_mode', mode);
    router.push(`/dashboard/${mode}`);
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
    
    <Typography variant="h4" fontWeight="bold" mb={3}>
        Welcome to AI Playground
      </Typography>
      <DialogTitle>🚀 Choose Your Journey</DialogTitle>
      <DialogContent>
        <Typography>
          How would you like to explore the AI Playground?
        </Typography>

        <Box mt={3}>
          <Button
            fullWidth
            variant="contained"
            sx={{ mb: 2 }}
            onClick={() => handleSelect('conventional')}
          >
            🔍 Go Conventional
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => handleSelect('ask-gene')}
          >
            🧞 Ask Gene (AI-Powered)
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
