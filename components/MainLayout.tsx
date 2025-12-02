'use client';

import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  CssBaseline,
  Divider,
  Paper,
  Stack,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { createTheme, ThemeOptions } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import BoltIcon from '@mui/icons-material/Bolt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useRouter } from 'next/navigation';

import Header from './Header';
import Footer from './Footer';
import { navSections } from './Sidebar';
import ModernNavigation from './navigation/ModernNavigation';
// Import your page components from centralized location
import ETAPredictPage from './useCases/eta';
import VariantPage from './useCases/variant';
import VisualSimilarityPage from './useCases/vss';
import FraudPage from './useCases/fruad';
import OrderDelayForecastPage from './useCases/delay';
import InventoryReorderPage from './useCases/inventory';
import NLPSearchPage from './useCases/nlp';
import BundleAndOutfitPage from './useCases/bundle';
import PersonalizationPage from './useCases/personalization';
import AIChatAssistantPage from './useCases/chat';
import VoiceSearchPage from './useCases/voice';
import DynamicPricingPage from './useCases/pricing';
import CouponAbusePage from './useCases/coupon';
import ChurnPredictionPage from './useCases/churn';
import SegmentationPage from './useCases/segmentation';
import SubjectLinePage from './useCases/subject';
import LeadGenPage from './useCases/leadgen';
import AutoCategorizationPage from './useCases/categorization';
import ReviewSentimentPage from './useCases/sentiment';
import TitleDescriptionPage from './useCases/descriptions';
import AITryOnPage from './useCases/tryon';

type ThemeKey = 'noir' | 'lumina' | 'pulse';

const themeConfigs: Record<ThemeKey, ThemeOptions> = {
  noir: {
    palette: {
      mode: 'dark',
      primary: { main: '#ff1f3d' },
      background: { default: '#010101', paper: 'rgba(255,255,255,0.04)' },
      text: { primary: '#ffffff', secondary: 'rgba(255,255,255,0.72)' },
    },
    typography: {
      fontFamily: '"Space Grotesk", "Roboto", sans-serif',
      h1: { fontWeight: 700, letterSpacing: '-0.02em' },
      h2: { fontWeight: 600, letterSpacing: '-0.015em' },
    },
  },
  lumina: {
    palette: {
      mode: 'light',
      primary: { main: '#c62828' },
      background: { default: '#f9fafb', paper: '#ffffff' },
      text: { primary: '#111', secondary: '#4a4a4a' },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            border: '1px solid rgba(0,0,0,0.05)',
          },
        },
      },
    },
  },
  pulse: {
    palette: {
      mode: 'dark',
      primary: { main: '#6b7280' },
      secondary: { main: '#9ca3af' },
      background: { default: '#050219', paper: 'rgba(16,11,32,0.85)' },
      text: { primary: '#fdfcff', secondary: 'rgba(255,255,255,0.7)' },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'radial-gradient(circle at top, rgba(107,114,128,0.2), transparent 60%)',
            border: '1px solid rgba(107,114,128,0.2)',
          },
        },
      },
    },
  },
};

const themeOptionList: { key: ThemeKey; label: string }[] = [
  { key: 'noir', label: 'Noir' },
  { key: 'lumina', label: 'Lumina' },
  { key: 'pulse', label: 'Pulse' },
];

const Placeholder = ({ label }: { label: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <Box
      sx={{
        p: 4,
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'rgba(255,255,255,0.1)',
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: 'text.primary',
          fontWeight: 600,
          mb: 2,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: 'text.secondary' }}
      >
        Coming soon...
      </Typography>
    </Box>
  </motion.div>
);

const tipLibrary: Record<
  string,
  {
    title: string;
    description: string;
    tips: string[];
    actions?: string[];
  }
> = {
  eta: {
    title: 'ETA Playbook',
    description: 'Keep distance, carrier speed, and weather data tidy before predicting delivery slots.',
    tips: [
      'Feed recent carrier telemetry so the model adapts to lane disruptions quickly.',
      'Pair ETA outputs with confidence intervals before exposing them in tracking widgets.',
      'Schedule auto-refreshes every 30 minutes during peak seasons.',
    ],
    actions: ['Upload carrier CSV', 'Check anomaly flags'],
  },
  variant: {
    title: 'Variant Assignment Guide',
    description: 'Balance merchandising signals with engagement data for more accurate variant picks.',
    tips: [
      'Blend customer cohort info with recent click-path behavior to avoid stale recommendations.',
      'Limit the number of simultaneous experiments per cohort so insights stay explainable.',
      'Export winning variants weekly for the creative team.',
    ],
    actions: ['Sync segment list', 'Review uplift chart'],
  },
  vss: {
    title: 'Visual Similarity Tips',
    description: 'Ensure embeddings stay fresh for the latest catalog drops.',
    tips: [
      'Batch process imagery nightly and purge deprecated SKUs.',
      'Tag lifestyle vs. catalog photos differently for better recall.',
      'Expose filters (price, availability) on top of similarity to boost conversions.',
    ],
    actions: ['Refresh embeddings', 'QA filter mapping'],
  },
  fraud: {
    title: 'Fraud Defense Checklist',
    description: 'Layer velocity metrics with device fingerprinting for more resilient policies.',
    tips: [
      'Track declines segmented by payment processor to catch integration drifts.',
      'Pipe suspicious sessions to manual review queues with auto-summaries.',
      'Rotate rules monthly and archive what did not trigger in the past quarter.',
    ],
    actions: ['Audit decline reasons', 'Export case summaries'],
  },
  nlp: {
    title: 'NLP Search Tips',
    description: 'Keep embeddings, synonyms, and boosters aligned with merchandising rules.',
    tips: [
      'Refresh embeddings whenever new catalog copy ships.',
      'Monitor zero-result queries and auto-map them to best sellers.',
      'Blend content + commerce results for inspirational queries.',
    ],
  },
  bundle: {
    title: 'Bundle Strategy',
    description: 'Anchor bundles around high-margin items and mix discovery SKUs.',
    tips: [
      'Auto-hide OOS SKUs to avoid shopper disappointment.',
      'Test bundle price ladders per persona.',
      'Highlight stories (weekend edit, workwear, athleisure).',
    ],
  },
  personalization: {
    title: 'Personalization Ops',
    description: 'Feed real-time signals into your decision engine.',
    tips: [
      'Audit feature freshness daily.',
      'Limit concurrent treatments per cohort.',
      'Always define a safe fallback for new visitors.',
    ],
  },
  chat: {
    title: 'Assistant Design',
    description: 'Document persona, tone, and escalation paths.',
    tips: [
      'Route sensitive intents to humans within 2 turns.',
      'Inject first-party data via secure function calling.',
      'Record summaries for CRM notes automatically.',
    ],
  },
  voice: {
    title: 'Voice Commerce',
    description: 'Optimize wake phrases and latency budgets per device.',
    tips: [
      'Cache top intents for sub-second replies.',
      'Offer a visual hand-off for complex flows.',
      'Log audio snippets (hashed) for QA.',
    ],
  },
  pricing: {
    title: 'Dynamic Pricing North Star',
    description: 'Balance velocity and margin with explainable guardrails.',
    tips: [
      'Set min/max per region and channel.',
      'Pause automation during site-wide promos.',
      'Pair price moves with merchandising messaging.',
    ],
  },
  coupon: {
    title: 'Coupon Shield',
    description: 'Watch velocity spikes and device duplication.',
    tips: [
      'Throttle redemptions above baseline.',
      'Enforce OTP for high-value codes.',
      'Alert growth + risk teams simultaneously.',
    ],
  },
  churn: {
    title: 'Retention Radar',
    description: 'Blend engagement, spend, and CX data for early warnings.',
    tips: [
      'Trigger concierge chats for high-value churn risk.',
      'Measure uplift for each save play.',
      'Pipe churn scores into ad suppression lists.',
    ],
  },
  segmentation: {
    title: 'Segmentation Best Practices',
    description: 'Refresh cohorts frequently and name them clearly.',
    tips: [
      'Use both behavioral and value axes.',
      'Archive cohorts that fall below significance.',
      'Auto-sync segments to ESP/CDP nightly.',
    ],
  },
  subject: {
    title: 'Email Subject Boosters',
    description: 'Pair multiple tones/emoji styles per campaign.',
    tips: [
      'Always A/B at least three variants.',
      'Match preheaders to subject promise.',
      'Respect deliverability guardrails (spam words).',
    ],
  },
  leadgen: {
    title: 'Lead Gen Flow',
    description: 'Align magnets, scoring, and sales SLAs.',
    tips: [
      'Track time-to-first-touch religiously.',
      'Send nurture paths for low-scoring leads.',
      'Pipe feedback loop from sales to scoring model.',
    ],
  },
  categorization: {
    title: 'Taxonomy Control',
    description: 'Keep high confidence thresholds before auto-sync.',
    tips: [
      'Flag low confidence outputs for human QA.',
      'Map attributes to filters for better PLP faceting.',
      'Version control taxonomy changes.',
    ],
  },
  sentiment: {
    title: 'Voice of Customer',
    description: 'Mine reviews for actionable insights.',
    tips: [
      'Route urgent complaints to CX instantly.',
      'Share weekly sentiment digest with merchandising.',
      'Tag feature requests for product roadmap.',
    ],
  },
  descriptions: {
    title: 'Copy Studio',
    description: 'Let AI draft, humans approve.',
    tips: [
      'Lock tone presets per brand.',
      'Auto-generate bullets + long copy simultaneously.',
      'Track conversion lift per copy experiment.',
    ],
  },
  tryon: {
    title: 'AR Try-On Ops',
    description: 'Manage garment meshes and avatar diversity.',
    tips: [
      'Pre-process garments for clean alpha masks.',
      'Offer multiple body types per session.',
      'Export WebAR assets for marketing reuse.',
    ],
  },
};

const defaultTips = {
  title: 'Workspace Tips',
  description: 'Pick a use-case from the left nav to see focused guidance, datasets, and playbooks.',
  tips: [
    'Use the tabs across each module (Form, Result, Theory, etc.) for a linear storyline.',
    'Bookmark high-signal prompts so you can replay them inside the AI mode later.',
    'Keep datasets light by archiving unused experiments every sprint.',
  ],
  actions: ['View knowledge base', 'Share feedback'],
};

export default function MainLayout() {
  const [activeCategory, setActiveCategory] = useState(navSections[0].title);
  const [activeTab, setActiveTab] = useState(navSections[0].items[0].key);
  const [themeKey, setThemeKey] = useState<ThemeKey>('noir');
  const activeTheme = useMemo(() => createTheme(themeConfigs[themeKey]), [themeKey]);
  const router = useRouter();
  const activeItem = useMemo(
    () => navSections.flatMap((s) => s.items).find((i) => i.key === activeTab),
    [activeTab]
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'eta':
        return <ETAPredictPage />;
      case 'nlp':
        return <NLPSearchPage />;
      case 'bundle':
        return <BundleAndOutfitPage />;
      case 'variant':
        return <VariantPage />;
      case 'personalization':
        return <PersonalizationPage />;
      case 'chat':
        return <AIChatAssistantPage />;
      case 'voice':
        return <VoiceSearchPage />;
      case 'delay':
        return <OrderDelayForecastPage />;
      case 'vss':
        return <VisualSimilarityPage />;
      case 'inventory':
        return <InventoryReorderPage />;
      case 'pricing':
        return <DynamicPricingPage />;
      case 'fraud':
        return <FraudPage />;
      case 'coupon':
        return <CouponAbusePage />;
      case 'churn':
        return <ChurnPredictionPage />;
      case 'segmentation':
        return <SegmentationPage />;
      case 'subject':
        return <SubjectLinePage />;
      case 'leadgen':
        return <LeadGenPage />;
      case 'categorization':
        return <AutoCategorizationPage />;
      case 'sentiment':
        return <ReviewSentimentPage />;
      case 'descriptions':
        return <TitleDescriptionPage />;
      case 'tryon':
        return <AITryOnPage />;
      default: {
        const selectedItem = navSections.flatMap((s) => s.items).find(i => i.key === activeTab);
        return <Placeholder label={selectedItem?.label || 'Welcome'} />;
      }
    }
  };

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#010101',
        }}
      >
        <Header
          themeOptions={themeOptionList}
          themeKey={themeKey}
          onThemeChange={setThemeKey}
        />
        <ModernNavigation
          sections={navSections}
          activeCategory={activeCategory}
          activeTab={activeTab}
          onCategoryChange={setActiveCategory}
          onTabChange={setActiveTab}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minHeight: '100vh',
            ml: '280px',
            pt: '90px',
            px: 3,
          }}
        >
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={2}
              mb={3}
            >
              <Box>
                <Typography
                  variant="overline"
                  sx={{ letterSpacing: '0.35em', color: 'rgba(255,255,255,0.5)' }}
                >
                  {activeCategory.toUpperCase()}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                  {activeItem?.label || 'Experience Builder'}
                </Typography>
              </Box>

              <Button
                variant="outlined"
                color="inherit"
                onClick={() => router.push('/dashboard/ai')}
                sx={{
                  borderColor: 'rgba(255,255,255,0.35)',
                  color: '#fff',
                  borderRadius: 3,
                  px: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#ff0000',
                    color: '#ff8a8a',
                  },
                }}
              >
                Switch to AI Mode
              </Button>
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', xl: 'minmax(0,3fr) minmax(260px,1fr)' },
                gap: 3,
              }}
            >
              <Paper
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  minHeight: '60vh',
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {renderContent()}
                  </motion.div>
                </AnimatePresence>
              </Paper>

              <TipsPanel activeTab={activeTab} />
            </Box>
          </Container>
        </Box>

        <Footer />
      </Box>
    </ThemeProvider>
  );
}

function TipsPanel({ activeTab }: { activeTab: string }) {
  const copy = tipLibrary[activeTab] ?? defaultTips;

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at top right, rgba(255,0,0,0.18), transparent 60%)',
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      />
      <Stack spacing={2} position="relative">
        <Stack direction="row" alignItems="center" spacing={1}>
          <TipsAndUpdatesIcon color="warning" />
          <Typography variant="overline" sx={{ letterSpacing: '0.25em', color: 'rgba(255,255,255,0.7)' }}>
            TIPS
          </Typography>
        </Stack>

        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {copy.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {copy.description}
        </Typography>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

        <Stack spacing={1.5}>
          {copy.tips.map((tip) => (
            <Stack key={tip} direction="row" spacing={1.5} alignItems="flex-start">
              <BoltIcon fontSize="small" color="primary" />
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                {tip}
              </Typography>
            </Stack>
          ))}
        </Stack>

        {copy.actions && copy.actions.length > 0 && (
          <>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
            <Stack direction="row" gap={1} flexWrap="wrap">
              {copy.actions.map((action) => (
                <Chip
                  key={action}
                  label={action}
                  icon={<CheckCircleIcon sx={{ color: '#7cffd8 !important' }} />}
                  sx={{
                    borderRadius: 999,
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    color: '#fff',
                    '& .MuiChip-icon': { ml: 0.5 },
                  }}
                />
              ))}
            </Stack>
          </>
        )}
      </Stack>
    </Paper>
  );
}