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
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';

// Import existing step components
import UserInfoStep from './steps/UserInfoStep';
import StoreTypeStep from './steps/StoreTypeStep';
import StepLocation from './steps/StepLocation';
import DeliveryProfileStep from './steps/StepDeliveryProfile';
import ProductSizeStep from './steps/StepProductSize';
import AiGoalsStep from './steps/AiGoalsStep';
import ReviewStep from './steps/StepReview';
import Header from '../Header';
import Footer from '../Footer';

// Validation schemas
const userInfoSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  company: z.string().min(2, 'Company name is required'),
  size: z.string().min(1, 'Company size is required'),
  purpose: z.string().min(2, 'Purpose is required'),
});

const steps = [
  { label: 'User Information', icon: '👤' },
  { label: 'Store Type', icon: '🏪' },
  { label: 'Country & Currency', icon: '🌍' },
  { label: 'Delivery Profile', icon: '🚚' },
  { label: 'Product Size Profile', icon: '📦' },
  { label: 'AI Goal Preferences', icon: '🤖' },
  { label: 'Review & Finish', icon: '✓' },
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
    metric_unit: 'kg',
  });

  const [isStepValid, setIsStepValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  // Validate current step when form data changes
  useEffect(() => {
    validateCurrentStep();
  }, [formData, activeStep]);

  const validateCurrentStep = async () => {
    try {
      switch (activeStep) {
        case 0:
          await userInfoSchema.parseAsync({
            name: formData.name,
            email: formData.email,
            company: formData.company,
            size: formData.size,
            purpose: formData.purpose,
          });
          setIsStepValid(true);
          break;
        // Add validation for other steps
        default:
          setIsStepValid(true);
      }
    } catch (error) {
      setIsStepValid(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
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
  };

  const renderStepContent = (step: number) => {
    const slideAnimation = {
      initial: { x: 20, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -20, opacity: 0 },
      transition: { duration: 0.3 }
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div key={step} {...slideAnimation}>
          {(() => {
            switch (step) {
              case 0: return <UserInfoStep formData={formData} onChange={handleChange} setStepValid={setIsStepValid} />;
              case 1: return <StoreTypeStep formData={formData} onChange={handleChange} />;
              case 2: return <StepLocation formData={formData} onChange={handleChange} />;
              case 3: return <DeliveryProfileStep formData={formData} onChange={handleChange} />;
              case 4: return <ProductSizeStep formData={formData} onChange={handleChange} />;
              case 5: return <AiGoalsStep formData={formData} onChange={handleChange} />;
              case 6: return <ReviewStep formData={formData} />;
              default: return <Typography>Unknown Step</Typography>;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <Box sx={{ bgcolor: '#000000', minHeight: '100vh' }}>
      <Header />
      
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4,
            bgcolor: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            gutterBottom
            sx={{ color: '#ff0000', textAlign: 'center', mb: 4 }}
          >
            eCommerce AI Setup
          </Typography>

          <Stepper 
            activeStep={activeStep} 
            alternativeLabel 
            sx={{ 
              mb: 4,
              '.MuiStepLabel-label': {
                color: 'rgba(255,255,255,0.7)',
                '&.Mui-active': { color: '#ff0000' }
              }
            }}
          >
            {steps.map(({ label, icon }) => (
              <Step key={label}>
                <StepLabel StepIconComponent={() => (
                  <Box sx={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: activeStep === steps.findIndex(s => s.label === label) ? '#ff0000' : 'rgba(255,255,255,0.1)',
                    transition: 'all 0.3s ease'
                  }}>
                    {icon}
                  </Box>
                )}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(activeStep)}

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
              onClick={() => setActiveStep(prev => prev - 1)}
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                '&:hover': { borderColor: 'white' }
              }}
            >
              Back
            </Button>

            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleSubmit : () => setActiveStep(prev => prev + 1)}
              disabled={!isStepValid || submitting}
              sx={{
                bgcolor: '#ff0000',
                '&:hover': { bgcolor: '#cc0000' },
                '&.Mui-disabled': { bgcolor: 'rgba(255,0,0,0.3)' }
              }}
            >
              {submitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : activeStep === steps.length - 1 ? (
                'Complete Setup'
              ) : (
                'Next'
              )}
            </Button>
          </Box>
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
}