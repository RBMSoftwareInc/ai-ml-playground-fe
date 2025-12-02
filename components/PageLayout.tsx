'use client';

import { useEffect } from 'react';
import { Box, Container, CircularProgress } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import { getUseCase } from '../lib/useCases';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  tagline?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

const getRouteInfo = (pathname: string) => {
  // Check if it's an old route that should redirect
  const oldRouteMap: Record<string, string> = {
    '/nlp': '/ecommerce/nlp',
    '/vss': '/ecommerce/vss',
    '/bundle': '/ecommerce/bundle',
    '/eta': '/ecommerce/eta',
    '/delay': '/ecommerce/delay',
    '/inventory': '/ecommerce/inventory',
    '/personalization': '/ecommerce/personalization',
    '/chat': '/ecommerce/chat',
    '/voice': '/ecommerce/voice',
    '/pricing': '/ecommerce/pricing',
    '/fraud': '/ecommerce/fraud',
    '/fruad': '/ecommerce/fraud',
    '/coupon': '/ecommerce/coupon',
    '/churn': '/ecommerce/churn',
    '/segmentation': '/ecommerce/segmentation',
    '/subject': '/ecommerce/subject',
    '/leadgen': '/ecommerce/leadgen',
    '/variant': '/ecommerce/variant',
    '/categorization': '/ecommerce/categorization',
    '/sentiment': '/ecommerce/sentiment',
    '/descriptions': '/ecommerce/descriptions',
    '/tryon': '/ecommerce/tryon',
    '/forecast': '/ecommerce/forecast',
    '/timing': '/ecommerce/timing',
    '/abtest': '/ecommerce/abtest',
    '/quiz': '/ecommerce/quiz',
    '/spin': '/ecommerce/spin',
    '/iq': '/ecommerce/iq',
  };

  // If old route, return redirect info
  if (oldRouteMap[pathname]) {
    return { redirect: oldRouteMap[pathname] };
  }

  // Check if it's a new ecommerce route
  if (pathname.startsWith('/ecommerce/')) {
    const slug = pathname.replace('/ecommerce/', '');
    const useCase = getUseCase(slug);
    if (useCase) {
      return {
        title: useCase.title,
        tagline: useCase.tagline,
        backUrl: useCase.backUrl,
      };
    }
  }

  return { title: 'AI Playground', tagline: '', backUrl: '/' };
};

export default function PageLayout({ 
  children, 
  title, 
  tagline, 
  showHeader = true, 
  showFooter = true 
}: PageLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Handle redirects for old routes
  useEffect(() => {
    const routeInfo = getRouteInfo(pathname);
    if (routeInfo.redirect) {
      router.replace(routeInfo.redirect);
    }
  }, [pathname, router]);

  const routeInfo = getRouteInfo(pathname);
  
  // Show loading while redirecting
  if (routeInfo.redirect) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Get route info or use provided props
  const routeData = routeInfo;
  const displayTitle = title || routeData.title;
  const displayTagline = tagline || routeData.tagline;
  const backUrl = routeData.backUrl;

  // Don't show header/footer on certain pages
  const isHomePage = pathname === '/';
  const isIndustryPage = pathname.startsWith('/industries/');
  const isEcommerceUseCasePage = pathname.startsWith('/ecommerce/');
  const isDashboardPage = pathname.startsWith('/dashboard');
  const isCMSPage = pathname.startsWith('/cms');
  
  // Industry pages and ecommerce use case pages handle their own header/footer, so skip here
  if (isIndustryPage || isEcommerceUseCasePage || isDashboardPage || isCMSPage || isHomePage) {
    return <>{children}</>;
  }

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
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {showHeader && (
          <Header
            variant="simple"
            title={displayTitle}
            tagline={displayTagline}
            showBackButton={true}
            backUrl={backUrl}
            titleColor="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
          />
        )}
        
        <Box sx={{ flex: 1 }}>
          {children}
        </Box>
      </Container>

      {showFooter && (
        <Box sx={{ mt: 'auto', pt: 4 }}>
          <Container maxWidth="xl">
            <Footer variant="simple" text="© 2025 RBM Software • AI-Driven Digital Transformation" />
          </Container>
        </Box>
      )}
    </Box>
  );
}

