'use client';

import { useState } from 'react';
import { Box, Typography, Container, Grid, Paper, alpha, IconButton, Chip, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {
  Search,
  ImageSearch,
  Inventory,
  LocalShipping,
  Schedule,
  Warehouse,
  Person,
  Chat,
  Mic,
  AttachMoney,
  Security,
  LocalOffer,
  TrendingDown,
  PeopleAlt,
  Email,
  Leaderboard,
  Category,
  Label,
  Reviews,
  Description,
  AutoFixHigh,
  PhotoSizeSelectActual,
  Checkroom,
  Quiz,
  Casino,
  SportsEsports,
  ShowChart,
  CalendarMonth,
  Science,
} from '@mui/icons-material';
import UseCaseModal from '../../../components/UseCaseModal';

const MotionPaper = motion(Paper);

interface UseCaseDetails {
  duration: string;
  difficulty: string;
  benefits: string[];
  howItWorks: string;
  techStack: string[];
}

interface UseCase {
  key: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  details: UseCaseDetails;
}

interface Category {
  title: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  useCases: UseCase[];
}

const categories: Category[] = [
  {
    title: 'Product Discovery',
    icon: <Search />,
    color: '#3b82f6',
    description: 'Help customers find products faster with AI-powered search',
    useCases: [
      { 
        key: 'nlp', 
        label: 'Smart Search (NLP)', 
        description: 'Natural language product search with semantic understanding', 
        icon: <Search />, 
        route: '/nlp',
        details: {
          duration: '5-8 min',
          difficulty: 'Beginner',
          benefits: ['Understand user intent', 'Handle typos & synonyms', 'Multi-language support'],
          howItWorks: 'Uses transformer models to understand natural language queries and match them with product attributes, descriptions, and metadata.',
          techStack: ['BERT', 'Elasticsearch', 'FastAPI', 'React'],
        }
      },
      { 
        key: 'vss', 
        label: 'Visual Similarity', 
        description: 'Image-based product discovery using deep learning', 
        icon: <ImageSearch />, 
        route: '/vss',
        details: {
          duration: '8-12 min',
          difficulty: 'Intermediate',
          benefits: ['Shop by image', 'Find similar styles', 'Increase engagement'],
          howItWorks: 'Extract visual embeddings from product images using CNN models, then perform similarity search in vector space.',
          techStack: ['ResNet', 'FAISS', 'PyTorch', 'React'],
        }
      },
      { 
        key: 'bundle', 
        label: 'Bundle Suggestions', 
        description: 'AI-powered outfit and bundle recommendations', 
        icon: <Inventory />, 
        route: '/bundle',
        details: {
          duration: '6-10 min',
          difficulty: 'Intermediate',
          benefits: ['Increase AOV', 'Cross-sell automation', 'Style consistency'],
          howItWorks: 'Analyzes purchase patterns and visual compatibility to suggest complementary products.',
          techStack: ['Collaborative Filtering', 'Graph Neural Networks', 'Python'],
        }
      },
    ],
  },
  {
    title: 'Logistics & Operations',
    icon: <LocalShipping />,
    color: '#22c55e',
    description: 'Optimize delivery and supply chain with predictive AI',
    useCases: [
      { 
        key: 'eta', 
        label: 'ETA Prediction', 
        description: 'Accurate delivery time forecasting', 
        icon: <Schedule />, 
        route: '/eta',
        details: {
          duration: '5-7 min',
          difficulty: 'Beginner',
          benefits: ['Accurate delivery estimates', 'Customer satisfaction', 'Operational planning'],
          howItWorks: 'Combines historical delivery data, traffic patterns, weather, and carrier performance to predict arrival times.',
          techStack: ['XGBoost', 'Time Series', 'FastAPI', 'React'],
        }
      },
      { 
        key: 'delay', 
        label: 'Delay Forecast', 
        description: 'Predict and prevent order delays', 
        icon: <LocalShipping />, 
        route: '/delay',
        details: {
          duration: '6-8 min',
          difficulty: 'Intermediate',
          benefits: ['Proactive alerts', 'Reduce complaints', 'Better planning'],
          howItWorks: 'ML models analyze risk factors like weather, carrier history, and route complexity to flag potential delays.',
          techStack: ['Random Forest', 'Weather API', 'Python', 'React'],
        }
      },
      { 
        key: 'inventory', 
        label: 'Inventory Reorder', 
        description: 'Smart replenishment recommendations', 
        icon: <Warehouse />, 
        route: '/inventory',
        details: {
          duration: '8-10 min',
          difficulty: 'Advanced',
          benefits: ['Prevent stockouts', 'Reduce overstock', 'Optimize capital'],
          howItWorks: 'Demand forecasting combined with lead time analysis to recommend optimal reorder points and quantities.',
          techStack: ['Prophet', 'ARIMA', 'Python', 'React'],
        }
      },
    ],
  },
  {
    title: 'Personalization',
    icon: <Person />,
    color: '#a855f7',
    description: 'Deliver tailored experiences for every customer',
    useCases: [
      { 
        key: 'personalization', 
        label: 'Real-Time Personalization', 
        description: 'Dynamic content per user session', 
        icon: <Person />, 
        route: '/personalization',
        details: {
          duration: '10-15 min',
          difficulty: 'Advanced',
          benefits: ['Higher conversion', 'Better engagement', 'Increased loyalty'],
          howItWorks: 'Real-time decision engine that combines user behavior, preferences, and context to personalize every touchpoint.',
          techStack: ['Feature Store', 'Redis', 'TensorFlow', 'React'],
        }
      },
      { 
        key: 'chat', 
        label: 'AI Chat Assistant', 
        description: 'Intelligent conversational support', 
        icon: <Chat />, 
        route: '/chat',
        details: {
          duration: '8-12 min',
          difficulty: 'Intermediate',
          benefits: ['24/7 support', 'Reduce tickets', 'Instant answers'],
          howItWorks: 'LLM-powered chatbot trained on your product catalog and FAQs to handle customer queries.',
          techStack: ['GPT-4', 'LangChain', 'Vector DB', 'React'],
        }
      },
      { 
        key: 'voice', 
        label: 'Voice Search', 
        description: 'Voice-enabled product discovery', 
        icon: <Mic />, 
        route: '/voice',
        details: {
          duration: '5-8 min',
          difficulty: 'Intermediate',
          benefits: ['Hands-free shopping', 'Accessibility', 'Mobile-first UX'],
          howItWorks: 'Speech-to-text conversion followed by NLP processing to understand and execute product searches.',
          techStack: ['Whisper', 'NLP Pipeline', 'Web Speech API', 'React'],
        }
      },
    ],
  },
  {
    title: 'Pricing & Fraud',
    icon: <AttachMoney />,
    color: '#f97316',
    description: 'Maximize revenue while protecting against fraud',
    useCases: [
      { 
        key: 'pricing', 
        label: 'Dynamic Pricing', 
        description: 'AI-driven price optimization', 
        icon: <AttachMoney />, 
        route: '/pricing',
        details: {
          duration: '10-12 min',
          difficulty: 'Advanced',
          benefits: ['Maximize margins', 'Stay competitive', 'Demand-based pricing'],
          howItWorks: 'Analyzes demand elasticity, competitor prices, inventory levels, and market conditions to recommend optimal prices.',
          techStack: ['Reinforcement Learning', 'Price Elasticity Models', 'Python'],
        }
      },
      { 
        key: 'fraud', 
        label: 'Fraud Detection', 
        description: 'Real-time transaction risk scoring', 
        icon: <Security />, 
        route: '/fruad',
        details: {
          duration: '8-10 min',
          difficulty: 'Intermediate',
          benefits: ['Reduce chargebacks', 'Protect revenue', 'Customer trust'],
          howItWorks: 'ML models analyze transaction patterns, device fingerprints, and behavioral signals to score fraud risk.',
          techStack: ['Isolation Forest', 'Neural Networks', 'Real-time Streaming'],
        }
      },
      { 
        key: 'coupon', 
        label: 'Coupon Abuse', 
        description: 'Detect promotional code misuse', 
        icon: <LocalOffer />, 
        route: '/coupon',
        details: {
          duration: '6-8 min',
          difficulty: 'Intermediate',
          benefits: ['Protect margins', 'Fair promotions', 'Reduce abuse'],
          howItWorks: 'Pattern detection algorithms identify suspicious coupon usage across accounts and sessions.',
          techStack: ['Anomaly Detection', 'Graph Analysis', 'Python'],
        }
      },
    ],
  },
  {
    title: 'Marketing Intelligence',
    icon: <TrendingDown />,
    color: '#ec4899',
    description: 'Data-driven marketing with predictive insights',
    useCases: [
      { 
        key: 'churn', 
        label: 'Churn Prediction', 
        description: 'Identify at-risk customers early', 
        icon: <TrendingDown />, 
        route: '/churn',
        details: {
          duration: '8-10 min',
          difficulty: 'Intermediate',
          benefits: ['Proactive retention', 'Reduce churn', 'Increase LTV'],
          howItWorks: 'Survival analysis and ML models predict customer churn probability based on engagement patterns.',
          techStack: ['Survival Analysis', 'XGBoost', 'Python', 'React'],
        }
      },
      { 
        key: 'segmentation', 
        label: 'Customer Segmentation', 
        description: 'AI-powered audience clustering', 
        icon: <PeopleAlt />, 
        route: '/segmentation',
        details: {
          duration: '10-12 min',
          difficulty: 'Advanced',
          benefits: ['Targeted campaigns', 'Personalized offers', 'Better ROI'],
          howItWorks: 'Unsupervised learning algorithms cluster customers based on behavior, demographics, and purchase patterns.',
          techStack: ['K-Means', 'DBSCAN', 'PCA', 'Python'],
        }
      },
      { 
        key: 'subject', 
        label: 'Email Subject Gen', 
        description: 'AI-generated high-converting subjects', 
        icon: <Email />, 
        route: '/subject',
        details: {
          duration: '3-5 min',
          difficulty: 'Beginner',
          benefits: ['Higher open rates', 'A/B testing', 'Time savings'],
          howItWorks: 'LLM fine-tuned on high-performing email subjects generates compelling alternatives for your campaigns.',
          techStack: ['GPT-4', 'Fine-tuning', 'A/B Framework'],
        }
      },
      { 
        key: 'leadgen', 
        label: 'Lead Gen Blueprint', 
        description: 'AI strategy recommendations', 
        icon: <Leaderboard />, 
        route: '/leadgen',
        details: {
          duration: '8-10 min',
          difficulty: 'Intermediate',
          benefits: ['Qualified leads', 'Better targeting', 'Higher conversion'],
          howItWorks: 'Analyzes your funnel data and market trends to recommend lead generation strategies.',
          techStack: ['Predictive Analytics', 'Lead Scoring', 'Python'],
        }
      },
    ],
  },
  {
    title: 'Product Intelligence',
    icon: <Category />,
    color: '#06b6d4',
    description: 'Automate product data management with AI',
    useCases: [
      { 
        key: 'variant', 
        label: 'Variant Assignment', 
        description: 'Automatic variant detection', 
        icon: <Label />, 
        route: '/variant',
        details: {
          duration: '5-7 min',
          difficulty: 'Beginner',
          benefits: ['Automate cataloging', 'Reduce errors', 'Faster listing'],
          howItWorks: 'Computer vision and NLP extract variant attributes (size, color, material) from images and descriptions.',
          techStack: ['Computer Vision', 'NER', 'Python', 'React'],
        }
      },
      { 
        key: 'categorization', 
        label: 'Auto Categorization', 
        description: 'ML-powered taxonomy mapping', 
        icon: <Category />, 
        route: '/categorization',
        details: {
          duration: '6-8 min',
          difficulty: 'Intermediate',
          benefits: ['Consistent taxonomy', 'Faster onboarding', 'Better search'],
          howItWorks: 'Text classification models automatically assign products to the correct category in your taxonomy.',
          techStack: ['BERT', 'Hierarchical Classification', 'Python'],
        }
      },
      { 
        key: 'sentiment', 
        label: 'Review Sentiment', 
        description: 'Customer feedback insights', 
        icon: <Reviews />, 
        route: '/sentiment',
        details: {
          duration: '5-8 min',
          difficulty: 'Beginner',
          benefits: ['Understand customers', 'Improve products', 'Track trends'],
          howItWorks: 'NLP models analyze review text to extract sentiment, key topics, and actionable insights.',
          techStack: ['Sentiment Analysis', 'Topic Modeling', 'Python'],
        }
      },
      { 
        key: 'descriptions', 
        label: 'Description Generator', 
        description: 'AI-generated product copy', 
        icon: <Description />, 
        route: '/descriptions',
        details: {
          duration: '3-5 min',
          difficulty: 'Beginner',
          benefits: ['SEO-optimized', 'Consistent tone', 'Scale content'],
          howItWorks: 'LLM generates compelling product descriptions based on attributes, brand voice, and SEO keywords.',
          techStack: ['GPT-4', 'SEO Optimization', 'Content Templates'],
        }
      },
    ],
  },
  {
    title: 'Creative & AR Tools',
    icon: <AutoFixHigh />,
    color: '#8b5cf6',
    description: 'Enhance product visuals with AI creativity',
    useCases: [
      { 
        key: 'remover', 
        label: 'Background Remover', 
        description: 'AI-powered image editing', 
        icon: <AutoFixHigh />, 
        route: '/remover',
        details: {
          duration: '3-5 min',
          difficulty: 'Beginner',
          benefits: ['Professional photos', 'Consistent style', 'Save time'],
          howItWorks: 'Segmentation models precisely separate foreground products from backgrounds for clean cutouts.',
          techStack: ['U-Net', 'Segment Anything', 'Python', 'Canvas API'],
        }
      },
      { 
        key: 'upscaler', 
        label: 'Image Upscaler', 
        description: 'Enhance image quality', 
        icon: <PhotoSizeSelectActual />, 
        route: '/upscaler',
        details: {
          duration: '3-5 min',
          difficulty: 'Beginner',
          benefits: ['HD images', 'Zoom capability', 'Better conversions'],
          howItWorks: 'Super-resolution models enhance image quality and increase resolution without losing detail.',
          techStack: ['ESRGAN', 'Real-ESRGAN', 'Python'],
        }
      },
      { 
        key: 'tryon', 
        label: 'AI Try-On (AR)', 
        description: 'Virtual fitting room', 
        icon: <Checkroom />, 
        route: '/tryon',
        details: {
          duration: '10-15 min',
          difficulty: 'Advanced',
          benefits: ['Reduce returns', 'Increase confidence', 'Engagement'],
          howItWorks: 'Combines pose estimation and image synthesis to virtually dress customers in products.',
          techStack: ['Pose Estimation', 'GANs', 'AR.js', 'React'],
        }
      },
    ],
  },
  {
    title: 'Gamification',
    icon: <Quiz />,
    color: '#f43f5e',
    description: 'Engage customers with interactive AI experiences',
    useCases: [
      { 
        key: 'quiz', 
        label: 'Product Match Quiz', 
        description: 'Interactive recommendation quiz', 
        icon: <Quiz />, 
        route: '/quiz',
        details: {
          duration: '5-8 min',
          difficulty: 'Beginner',
          benefits: ['Higher engagement', 'Personalized picks', 'Data collection'],
          howItWorks: 'Interactive quiz collects preferences and uses recommendation engine to suggest perfect products.',
          techStack: ['Recommendation Engine', 'React', 'Animation'],
        }
      },
      { 
        key: 'spin', 
        label: 'Spin-to-Win', 
        description: 'Gamified promotional wheel', 
        icon: <Casino />, 
        route: '/spin',
        details: {
          duration: '3-5 min',
          difficulty: 'Beginner',
          benefits: ['Lead capture', 'Viral potential', 'Excitement'],
          howItWorks: 'Configurable prize wheel with controlled probability distribution for promotional campaigns.',
          techStack: ['Probability Engine', 'Canvas Animation', 'React'],
        }
      },
      { 
        key: 'iq', 
        label: 'IQ Game Suite', 
        description: 'Engagement mini-games', 
        icon: <SportsEsports />, 
        route: '/iq',
        details: {
          duration: '5-10 min',
          difficulty: 'Intermediate',
          benefits: ['Time on site', 'Brand recall', 'Viral sharing'],
          howItWorks: 'Collection of brain games and puzzles that reward players with discounts and perks.',
          techStack: ['Game Engine', 'Reward System', 'React'],
        }
      },
    ],
  },
  {
    title: 'Analytics & Insights',
    icon: <ShowChart />,
    color: '#64748b',
    description: 'Data-driven decisions with predictive analytics',
    useCases: [
      { 
        key: 'forecast', 
        label: 'Sales Forecasting', 
        description: 'Predict future sales trends', 
        icon: <ShowChart />, 
        route: '/forecast',
        details: {
          duration: '10-12 min',
          difficulty: 'Advanced',
          benefits: ['Better planning', 'Inventory optimization', 'Budget accuracy'],
          howItWorks: 'Time series models analyze historical sales, seasonality, and external factors to forecast demand.',
          techStack: ['Prophet', 'LSTM', 'Time Series Analysis'],
        }
      },
      { 
        key: 'timing', 
        label: 'Best Launch Timing', 
        description: 'Optimal product release schedule', 
        icon: <CalendarMonth />, 
        route: '/timing',
        details: {
          duration: '6-8 min',
          difficulty: 'Intermediate',
          benefits: ['Maximum impact', 'Avoid conflicts', 'Trend alignment'],
          howItWorks: 'Analyzes market trends, competitor activity, and seasonal patterns to recommend launch windows.',
          techStack: ['Trend Analysis', 'Calendar Optimization', 'Python'],
        }
      },
      { 
        key: 'abtest', 
        label: 'A/B Test Analyzer', 
        description: 'Statistical experiment analysis', 
        icon: <Science />, 
        route: '/abtest',
        details: {
          duration: '8-10 min',
          difficulty: 'Intermediate',
          benefits: ['Data-driven decisions', 'Statistical rigor', 'Clear insights'],
          howItWorks: 'Bayesian and frequentist analysis of A/B test results with confidence intervals and recommendations.',
          techStack: ['Bayesian Statistics', 'Hypothesis Testing', 'Python'],
        }
      },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function EcommercePage() {
  const router = useRouter();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);
  const [selectedCategoryColor, setSelectedCategoryColor] = useState<string>('#3b82f6');
  const [modalOpen, setModalOpen] = useState(false);

  const handleUseCaseClick = (useCase: UseCase, categoryColor: string) => {
    setSelectedUseCase(useCase);
    setSelectedCategoryColor(categoryColor);
    setModalOpen(true);
  };

  const handleLaunch = (route: string) => {
    setModalOpen(false);
    router.push(route);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#0a0a0a',
        py: 4,
        position: 'relative',
      }}
    >
      {/* Background effects */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
          filter: 'blur(60px)',
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Tooltip title="Back to Industries" arrow>
              <IconButton
                onClick={() => router.push('/')}
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.05)',
                    borderColor: 'rgba(255,255,255,0.2)',
                  },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: '"Inter", "Roboto", sans-serif',
                }}
              >
                E-commerce AI
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
                30+ AI/ML use cases to transform your online store
              </Typography>
            </Box>
          </Box>

          {/* Info banner */}
          <Paper
            sx={{
              p: 2,
              mt: 3,
              background: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <InfoOutlinedIcon sx={{ color: '#3b82f6' }} />
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              <strong>Tip:</strong> Click on any use case to see details, estimated time, and launch the interactive demo. 
              Each demo includes real AI models and sample data.
            </Typography>
          </Paper>
        </Box>

        {/* Categories Grid */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={12} md={6} lg={4} key={category.title}>
                <motion.div variants={itemVariants}>
                  <Paper
                    onMouseEnter={() => setHoveredCategory(category.title)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    sx={{
                      p: 3,
                      background: 'linear-gradient(145deg, #141414 0%, #1a1a1a 100%)',
                      border: '1px solid',
                      borderColor: hoveredCategory === category.title 
                        ? alpha(category.color, 0.4) 
                        : 'rgba(255,255,255,0.05)',
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      boxShadow: hoveredCategory === category.title 
                        ? `0 10px 40px ${alpha(category.color, 0.1)}`
                        : 'none',
                    }}
                  >
                    {/* Category Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          background: alpha(category.color, 0.15),
                          color: category.color,
                          display: 'flex',
                        }}
                      >
                        {category.icon}
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, color: '#fff', fontSize: '1rem', lineHeight: 1.2 }}
                        >
                          {category.title}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mb: 2.5, pl: 0.5 }}
                    >
                      {category.description}
                    </Typography>

                    {/* Use Cases */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {category.useCases.map((useCase) => (
                        <MotionPaper
                          key={useCase.key}
                          onClick={() => handleUseCaseClick(useCase, category.color)}
                          whileHover={{ x: 4, scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          sx={{
                            p: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            cursor: 'pointer',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: 2,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              background: alpha(category.color, 0.08),
                              borderColor: alpha(category.color, 0.2),
                              boxShadow: `0 4px 20px ${alpha(category.color, 0.15)}`,
                              '& .use-case-icon': {
                                color: category.color,
                              },
                              '& .time-chip': {
                                opacity: 1,
                              },
                            },
                          }}
                        >
                          <Box
                            className="use-case-icon"
                            sx={{
                              color: 'rgba(255,255,255,0.5)',
                              transition: 'color 0.2s ease',
                              display: 'flex',
                              '& svg': { fontSize: 20 },
                            }}
                          >
                            {useCase.icon}
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600, color: '#fff', fontSize: '0.85rem' }}
                            >
                              {useCase.label}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: 'rgba(255,255,255,0.4)',
                                display: 'block',
                                fontSize: '0.7rem',
                              }}
                            >
                              {useCase.description}
                            </Typography>
                          </Box>
                          <Chip
                            className="time-chip"
                            icon={<AccessTimeIcon sx={{ fontSize: '12px !important' }} />}
                            label={useCase.details.duration}
                            size="small"
                            sx={{
                              opacity: 0.6,
                              transition: 'opacity 0.2s ease',
                              height: 22,
                              fontSize: '0.65rem',
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              color: 'rgba(255,255,255,0.6)',
                              '& .MuiChip-icon': { 
                                color: 'rgba(255,255,255,0.4)',
                                ml: 0.5,
                              },
                            }}
                          />
                        </MotionPaper>
                      ))}
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* CMS Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Paper
            sx={{
              mt: 4,
              p: 4,
              background: 'linear-gradient(145deg, #1a1a1a 0%, #242424 100%)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', mb: 1 }}>
                  🏗️ StorefrontIQ CMS
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                  Visual page builder, layout studio, and content management for e-commerce
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Tooltip title="Design page layouts visually" arrow>
                  <Chip
                    label="Layout Studio"
                    onClick={() => router.push('/dashboard/cms/store-frontiq/layout-studio')}
                    sx={{
                      cursor: 'pointer',
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      color: '#ef4444',
                      '&:hover': { background: 'rgba(239,68,68,0.2)' },
                    }}
                  />
                </Tooltip>
                <Tooltip title="Pre-built design templates" arrow>
                  <Chip
                    label="Blueprint Studio"
                    onClick={() => router.push('/dashboard/cms/store-frontiq/blueprint-studio')}
                    sx={{
                      cursor: 'pointer',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      '&:hover': { background: 'rgba(255,255,255,0.1)' },
                    }}
                  />
                </Tooltip>
                <Tooltip title="Content composition workflow" arrow>
                  <Chip
                    label="ComposerIQ"
                    onClick={() => router.push('/dashboard/cms/store-frontiq/composeriq')}
                    sx={{
                      cursor: 'pointer',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      '&:hover': { background: 'rgba(255,255,255,0.1)' },
                    }}
                  />
                </Tooltip>
              </Box>
            </Box>
          </Paper>
        </motion.div>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 6, pb: 4 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.3)' }}>
            © 2025 RBM Software • E-commerce AI Solutions
          </Typography>
        </Box>
      </Container>

      {/* Use Case Modal */}
      <UseCaseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        useCase={selectedUseCase}
        categoryColor={selectedCategoryColor}
        onLaunch={handleLaunch}
      />
    </Box>
  );
}
