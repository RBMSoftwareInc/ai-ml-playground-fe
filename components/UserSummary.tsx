'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, CircularProgress } from '@mui/material';

export default function UserSummary() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/setup/userinfo')
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch user data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <CircularProgress size={20} />;
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <Typography variant="caption" color="textSecondary">Logged in as</Typography>
      <Typography variant="body1" fontWeight="bold">👤 {userData?.name || 'Unknown'}</Typography>
      <Typography variant="caption" color="gray">
        {userData?.store_type || '—'} | {userData?.currency || '—'} | {userData?.timezone || '—'}
      </Typography>
    </Box>
  );
}
