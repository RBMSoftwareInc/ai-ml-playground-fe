'use client';

import {
  Box,
  TextField,
  MenuItem,
  Typography,
  FormHelperText,
} from '@mui/material';
import { useEffect, useState } from 'react';

interface Props {
  formData: any;
  onChange: (field: string, value: string) => void;
  setStepValid?: (valid: boolean) => void; // Optional hook for Stepper control
}

const companySizes = ['1-10', '11-50', '51-200', '201-500', '500+'];

export default function UserInfoStep({ formData, onChange, setStepValid }: Props) {
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    company: '',
    size: '',
    purpose: '',
  });

  useEffect(() => {
    const isValid =
      formData.name?.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.company?.trim() &&
      formData.size &&
      formData.purpose?.trim();

    setStepValid?.(Boolean(isValid));
  }, [formData, setStepValid]);

  const validateField = (field: string, value: string) => {
    let error = '';
    if (!value.trim()) {
      error = 'This field is required';
    } else if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = 'Invalid email address';
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    onChange(field, value);
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <TextField
        label="Your Name"
        value={formData.name}
        onChange={(e) => validateField('name', e.target.value)}
        error={!!errors.name}
        helperText={errors.name}
        fullWidth
      />
      <TextField
        label="Email"
        value={formData.email}
        onChange={(e) => validateField('email', e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
        type="email"
        fullWidth
      />
      <TextField
        label="Company Name"
        value={formData.company}
        onChange={(e) => validateField('company', e.target.value)}
        error={!!errors.company}
        helperText={errors.company}
        fullWidth
      />
      <TextField
        select
        label="Company Size"
        value={formData.size}
        onChange={(e) => validateField('size', e.target.value)}
        error={!!errors.size}
        helperText={errors.size}
        fullWidth
      >
        {companySizes.map((size) => (
          <MenuItem key={size} value={size}>
            {size}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Purpose of using Playground"
        value={formData.purpose}
        onChange={(e) => validateField('purpose', e.target.value)}
        error={!!errors.purpose}
        helperText={errors.purpose}
        multiline
        rows={2}
        fullWidth
      />
    </Box>
  );
}
