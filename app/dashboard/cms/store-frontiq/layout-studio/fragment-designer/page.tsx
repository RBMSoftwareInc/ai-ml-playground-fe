'use client';

import React from 'react';
import { Box, Typography, styled, Tabs, Tab, Button, List, ListItem, ListItemText } from '@mui/material';
import FragmentDesignerCanvas from '../canvas/FragmentDesignerCanvas';
import { useSearchParams,useRouter } from 'next/navigation';

import Header from '../../../../../../components/cms/Header';
import Footer from '../../../../../../components/cms/Footer';

// Styled Components for Page.tsx
const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#F5F5F5',
}));

export default function FragmentDesignerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageType = searchParams.get('pageType') || 'Home';

  return (
  
  <PageContainer>
        <Header onLogout={() => router.push('/dashboard/cms/login')} />
  <FragmentDesignerCanvas pageType={pageType} fragment={undefined} onSave={undefined} onCancel={undefined} />

  <Footer />
  </PageContainer>
);
}