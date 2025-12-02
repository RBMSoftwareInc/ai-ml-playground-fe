'use client';

import React, { useState, useEffect } from 'react';
import { styled } from "@mui/material/styles";
import PageEditor from "./PageEditorSPA";
import { Box } from "@mui/material";
import { useRouter } from 'next/navigation';
import Header from "../../../../../components/cms/Header";
import Footer from '../../../../../components/cms/Footer';


const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: '#F5F5F5',
}));
interface PageProps {
  pageData?: any;
}

export default function AssetBrowserPage() {
  const router = useRouter();
  return (
    <PageContainer>
          <Header onLogout={() => router.push('/dashboard/cms/login')} />
            <PageEditor pageType={""} layoutId={0} />;
            
            <Footer/>
    </PageContainer>
  )
}