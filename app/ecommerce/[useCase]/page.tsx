'use client';

import { useParams, useRouter } from 'next/navigation';
import { Box, Container, CircularProgress, Typography } from '@mui/material';
import { getUseCase } from '../../../lib/useCases';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

function UseCaseContent() {
  const params = useParams();
  const router = useRouter();
  const useCaseSlug = params.useCase as string;

  const useCase = getUseCase(useCaseSlug);

  if (!useCase) {
    router.replace('/industries/ecommerce');
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#121212',
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: '#f44336' }} />
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
          Use case not found. Redirecting...
        </Typography>
      </Box>
    );
  }

  const UseCaseComponent = useCase.component;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#0a0a0a',
        py: 4,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Header
          variant="simple"
          title={useCase.title}
          tagline={useCase.tagline}
          showBackButton={true}
          backUrl={useCase.backUrl}
          titleColor="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
        />
      </Container>

      {/* Use Case Content */}
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flex: 1 }}>
          <UseCaseComponent />
        </Box>
      </Container>

      {/* Footer - sticky at bottom */}
      <Box sx={{ mt: 'auto', pt: 4 }}>
        <Container maxWidth="xl">
          <Footer variant="simple" text="© 2025 RBM Software • AI-Driven Digital Transformation" />
        </Container>
      </Box>
    </Box>
  );
}

export default function UseCasePage() {
  return <UseCaseContent />;
}

