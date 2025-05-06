'use client';

import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Container,
  Paper,
  AppBar,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Step Components
import UserInfoStep from '../setupWizard/steps/UserInfoStep';
import StoreTypeStep from '../setupWizard/steps/StoreTypeStep';
import StepLocation from '../setupWizard/steps/StepLocation';
import DeliveryProfileStep from '../setupWizard/steps/StepDeliveryProfile';
import ProductSizeStep from '../setupWizard/steps/StepProductSize';
import AiGoalsStep from '../setupWizard/steps/AiGoalsStep';
import ReviewStep from '../setupWizard/steps/StepReview';

import Header from '../Header';
import Footer from '../Footer';

const steps = [
  'User Information',
  'Store Type',
  'Country & Currency',
  'Delivery Profile',
  'Product Size Profile',
  'AI Goal Preferences',
  'Review & Finish',
];

export default function SetupWizard() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<any>({
    name: '',
    email: '',
    company: '',
    size: '',
    purpose: '',
    store_type: '',
    country: 'India',
    currency: 'INR',
    delivery_mode: '',
    timezone: '',
    avg_package_size: '',
    product_weight: '',
    ai_goals: [],
    metric_unit: 'kg', // added for unit configuration
  });

  const [isStepValid, setIsStepValid] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleBack = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      setSubmitting(true);
      setError('');

      try {
        const response = await fetch('http://localhost:5000/api/v1/setup/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error('Failed to save configuration');

        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setSubmitting(false);
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: return <UserInfoStep formData={formData} onChange={handleChange}  setStepValid={setIsStepValid} />;
      case 1: return <StoreTypeStep formData={formData} onChange={handleChange} />;
      case 2: return <StepLocation formData={formData} onChange={handleChange} />;
      case 3: return <DeliveryProfileStep formData={formData} onChange={handleChange} />;
      case 4: return <ProductSizeStep formData={formData} onChange={handleChange} />;
      case 5: return <AiGoalsStep formData={formData} onChange={handleChange} />;
      case 6: return <ReviewStep formData={formData} />;
      default: return <Typography>Unknown Step</Typography>;
    }
  };

  return (
    <Container maxWidth="md">
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #eee' }}>
        <Header />
      </AppBar>

      <Paper elevation={3} sx={{ mt: 6, p: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          eCommerce AI Wizard
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box>{renderStepContent(activeStep)}</Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Setup complete! Redirecting to dashboard...
          </Alert>
        )}

        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            disabled={activeStep === 0 || submitting}
            onClick={handleBack}
            variant="outlined"
          >
            ⬅ Back
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={!isStepValid}
            startIcon={activeStep === steps.length - 1 && submitting ? <CircularProgress size={20} /> : null}
          >
            {activeStep === steps.length - 1
              ? submitting ? 'Submitting...' : 'Submit & Continue'
              : 'Next'}
          </Button>
        </Box>
      </Paper>

      <Footer />
    </Container>
  );
}
