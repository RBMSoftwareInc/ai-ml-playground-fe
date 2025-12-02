'use client';

import { useState } from 'react';
import { Box, Typography, Container, Grid, Paper, alpha, IconButton, Chip, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ScienceIcon from '@mui/icons-material/Science';
import {
  LocalHospital,
  Flight,
  AccountBalance,
  Restaurant,
  Movie,
  Factory,
  Apartment,
  Store,
  Psychology,
  Biotech,
  MonitorHeart,
  Medication,
  LocalPharmacy,
  HealthAndSafety,
  PersonSearch,
  Assessment,
  FlightTakeoff,
  TravelExplore,
  DirectionsCar,
  Hotel,
  AttractionsOutlined,
  Luggage,
  AirlineSeatReclineNormal,
  Campaign,
  CreditScore,
  TrendingUp,
  CurrencyExchange,
  Gavel,
  AccountBalanceWallet,
  SwapHoriz,
  Shield,
  Fastfood,
  MenuBook,
  Groups,
  Kitchen,
  Inventory2,
  Schedule,
  StarRate,
  DeliveryDining,
  Theaters,
  LiveTv,
  Subscriptions,
  Sensors,
  Recommend,
  CampaignOutlined,
  MusicNote,
  SportsEsports,
  PrecisionManufacturing,
  Engineering,
  Settings,
  Memory,
  Speed,
  ElectricalServices,
  LocalShipping,
  Warehouse,
  HomeWork,
  House,
  LocationCity,
  Apartment as ApartmentIcon,
  TrendingDown,
  Construction,
  MapOutlined,
  Storefront,
  PointOfSale,
  ShoppingBasket,
  QrCodeScanner,
  LocalMall,
  Loyalty,
  Security,
} from '@mui/icons-material';
import UseCaseModal from '../../../components/UseCaseModal';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

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

interface CategoryData {
  title: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  useCases: UseCase[];
}

interface IndustryData {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: React.ReactNode;
  primaryColor: string;
  secondaryColor: string;
  categories: CategoryData[];
}

const industriesData: Record<string, IndustryData> = {
  healthcare: {
    id: 'healthcare',
    name: 'Healthcare AI',
    tagline: 'Transforming patient care with intelligent solutions',
    description: '8 AI use cases for modern healthcare delivery',
    icon: <LocalHospital sx={{ fontSize: 44 }} />,
    primaryColor: '#22c55e',
    secondaryColor: '#16a34a',
    categories: [
      {
        title: 'Clinical Intelligence',
        icon: <MonitorHeart />,
        color: '#22c55e',
        description: 'AI-powered clinical decision support',
        useCases: [
          {
            key: 'risk-scoring',
            label: 'Patient Risk Scoring',
            description: 'Predict patient deterioration and readmission risk',
            icon: <HealthAndSafety />,
            route: '#',
            details: {
              duration: '8-10 min',
              difficulty: 'Intermediate',
              benefits: ['Early intervention', 'Reduce readmissions', 'Resource allocation'],
              howItWorks: 'ML models analyze vitals, lab results, and medical history to predict patient risk scores.',
              techStack: ['XGBoost', 'FHIR', 'Python', 'React'],
            },
          },
          {
            key: 'diagnostic-ai',
            label: 'Diagnostic Image Analysis',
            description: 'AI-assisted radiology and pathology',
            icon: <Biotech />,
            route: '#',
            details: {
              duration: '10-12 min',
              difficulty: 'Advanced',
              benefits: ['Faster diagnosis', 'Consistency', 'Second opinion'],
              howItWorks: 'CNN models trained on medical images detect anomalies in X-rays, CT scans, and pathology slides.',
              techStack: ['ResNet', 'U-Net', 'DICOM', 'PyTorch'],
            },
          },
        ],
      },
      {
        title: 'Drug & Research',
        icon: <Medication />,
        color: '#3b82f6',
        description: 'Accelerate pharmaceutical research',
        useCases: [
          {
            key: 'drug-discovery',
            label: 'Drug Discovery AI',
            description: 'Accelerate molecule screening and drug candidates',
            icon: <LocalPharmacy />,
            route: '#',
            details: {
              duration: '12-15 min',
              difficulty: 'Advanced',
              benefits: ['Faster R&D', 'Cost reduction', 'Novel compounds'],
              howItWorks: 'Graph neural networks predict molecular properties and drug-target interactions.',
              techStack: ['Graph Neural Networks', 'RDKit', 'PyTorch', 'Molecular DB'],
            },
          },
          {
            key: 'clinical-trials',
            label: 'Clinical Trial Optimization',
            description: 'Patient matching and trial design',
            icon: <PersonSearch />,
            route: '#',
            details: {
              duration: '8-10 min',
              difficulty: 'Intermediate',
              benefits: ['Better recruitment', 'Diverse cohorts', 'Faster enrollment'],
              howItWorks: 'NLP extracts eligibility criteria and matches against patient records.',
              techStack: ['NLP', 'EHR Integration', 'Python'],
            },
          },
        ],
      },
      {
        title: 'Operations',
        icon: <Assessment />,
        color: '#f97316',
        description: 'Optimize healthcare operations',
        useCases: [
          {
            key: 'patient-flow',
            label: 'Patient Flow Prediction',
            description: 'Forecast admissions and optimize bed management',
            icon: <Psychology />,
            route: '#',
            details: {
              duration: '6-8 min',
              difficulty: 'Intermediate',
              benefits: ['Capacity planning', 'Reduce wait times', 'Staff scheduling'],
              howItWorks: 'Time series models predict patient volumes based on historical patterns and external factors.',
              techStack: ['Prophet', 'LSTM', 'Python'],
            },
          },
          {
            key: 'resource-allocation',
            label: 'Resource Allocation AI',
            description: 'Optimize staff and equipment utilization',
            icon: <Assessment />,
            route: '#',
            details: {
              duration: '8-10 min',
              difficulty: 'Advanced',
              benefits: ['Cost efficiency', 'Better care', 'Reduced burnout'],
              howItWorks: 'Optimization algorithms allocate resources based on predicted demand and constraints.',
              techStack: ['Operations Research', 'Constraint Programming', 'Python'],
            },
          },
        ],
      },
    ],
  },
  travel: {
    id: 'travel',
    name: 'Travel AI',
    tagline: 'Intelligent solutions for modern travel',
    description: '8 AI use cases for travel and tourism',
    icon: <Flight sx={{ fontSize: 44 }} />,
    primaryColor: '#3b82f6',
    secondaryColor: '#2563eb',
    categories: [
      {
        title: 'Pricing & Revenue',
        icon: <TrendingUp />,
        color: '#3b82f6',
        description: 'Maximize revenue with dynamic pricing',
        useCases: [
          {
            key: 'dynamic-pricing',
            label: 'Dynamic Pricing Engine',
            description: 'Real-time price optimization based on demand',
            icon: <CurrencyExchange />,
            route: '#',
            details: {
              duration: '10-12 min',
              difficulty: 'Advanced',
              benefits: ['Revenue maximization', 'Competitive pricing', 'Demand capture'],
              howItWorks: 'RL agents optimize prices in real-time based on demand signals, competition, and inventory.',
              techStack: ['Reinforcement Learning', 'Real-time Processing', 'Python'],
            },
          },
          {
            key: 'demand-forecast',
            label: 'Demand Forecasting',
            description: 'Predict booking volumes and patterns',
            icon: <TravelExplore />,
            route: '#',
            details: {
              duration: '8-10 min',
              difficulty: 'Intermediate',
              benefits: ['Inventory planning', 'Marketing timing', 'Resource allocation'],
              howItWorks: 'Time series models forecast demand using historical data, events, and seasonality.',
              techStack: ['Prophet', 'XGBoost', 'Python'],
            },
          },
        ],
      },
      {
        title: 'Personalization',
        icon: <Recommend />,
        color: '#a855f7',
        description: 'Tailored travel experiences',
        useCases: [
          {
            key: 'trip-recommendations',
            label: 'Personalized Recommendations',
            description: 'AI-curated destinations and experiences',
            icon: <AttractionsOutlined />,
            route: '#',
            details: {
              duration: '8-10 min',
              difficulty: 'Intermediate',
              benefits: ['Higher conversion', 'Customer satisfaction', 'Cross-sell'],
              howItWorks: 'Collaborative filtering and content-based models suggest destinations based on preferences.',
              techStack: ['Recommendation Systems', 'Embeddings', 'Python'],
            },
          },
          {
            key: 'chatbot-concierge',
            label: 'AI Concierge',
            description: 'Intelligent travel assistant chatbot',
            icon: <Luggage />,
            route: '#',
            details: {
              duration: '6-8 min',
              difficulty: 'Intermediate',
              benefits: ['24/7 support', 'Instant booking', 'Personalized help'],
              howItWorks: 'LLM-powered chatbot handles travel queries, bookings, and itinerary management.',
              techStack: ['GPT-4', 'LangChain', 'Travel APIs'],
            },
          },
        ],
      },
      {
        title: 'Operations',
        icon: <FlightTakeoff />,
        color: '#f97316',
        description: 'Optimize travel operations',
        useCases: [
          {
            key: 'route-optimization',
            label: 'Route Optimization',
            description: 'AI-powered journey planning',
            icon: <DirectionsCar />,
            route: '#',
            details: {
              duration: '8-10 min',
              difficulty: 'Advanced',
              benefits: ['Fuel savings', 'Time efficiency', 'Better experience'],
              howItWorks: 'Graph algorithms optimize routes considering traffic, weather, and preferences.',
              techStack: ['Graph Algorithms', 'OR-Tools', 'Maps API'],
            },
          },
          {
            key: 'hotel-matching',
            label: 'Hotel Matching AI',
            description: 'Find the perfect accommodation',
            icon: <Hotel />,
            route: '#',
            details: {
              duration: '5-7 min',
              difficulty: 'Beginner',
              benefits: ['Better matches', 'Higher satisfaction', 'Reduced cancellations'],
              howItWorks: 'ML models match traveler preferences with hotel attributes for optimal recommendations.',
              techStack: ['Classification', 'NLP', 'Python'],
            },
          },
        ],
      },
    ],
  },
  fintech: {
    id: 'fintech',
    name: 'Fintech AI',
    tagline: 'Intelligent financial services',
    description: '8 AI use cases for financial technology',
    icon: <AccountBalance sx={{ fontSize: 44 }} />,
    primaryColor: '#a855f7',
    secondaryColor: '#9333ea',
    categories: [
      {
        title: 'Risk & Compliance',
        icon: <Shield />,
        color: '#a855f7',
        description: 'Manage risk with AI precision',
        useCases: [
          {
            key: 'credit-scoring',
            label: 'Credit Risk Scoring',
            description: 'AI-powered creditworthiness assessment',
            icon: <CreditScore />,
            route: '#',
            details: {
              duration: '10-12 min',
              difficulty: 'Advanced',
              benefits: ['Better decisions', 'Reduce defaults', 'Financial inclusion'],
              howItWorks: 'ML models analyze traditional and alternative data to predict credit risk.',
              techStack: ['XGBoost', 'Feature Engineering', 'Python'],
            },
          },
          {
            key: 'fraud-detection',
            label: 'Transaction Fraud Detection',
            description: 'Real-time fraud scoring and prevention',
            icon: <Security />,
            route: '#',
            details: {
              duration: '8-10 min',
              difficulty: 'Intermediate',
              benefits: ['Reduce losses', 'Customer trust', 'Real-time protection'],
              howItWorks: 'Anomaly detection and neural networks identify fraudulent patterns in real-time.',
              techStack: ['Isolation Forest', 'Neural Networks', 'Streaming'],
            },
          },
        ],
      },
      {
        title: 'Trading & Markets',
        icon: <TrendingUp />,
        color: '#22c55e',
        description: 'AI-powered trading insights',
        useCases: [
          {
            key: 'algo-trading',
            label: 'Algorithmic Trading',
            description: 'ML-driven trading strategies',
            icon: <SwapHoriz />,
            route: '#',
            details: {
              duration: '12-15 min',
              difficulty: 'Advanced',
              benefits: ['Alpha generation', 'Risk management', 'Speed'],
              howItWorks: 'Deep learning models predict price movements and execute optimal trades.',
              techStack: ['LSTM', 'Transformers', 'Python', 'Backtesting'],
            },
          },
          {
            key: 'market-sentiment',
            label: 'Market Sentiment Analysis',
            description: 'Gauge market mood from news and social media',
            icon: <CampaignOutlined />,
            route: '#',
            details: {
              duration: '6-8 min',
              difficulty: 'Intermediate',
              benefits: ['Early signals', 'Risk awareness', 'Trading edge'],
              howItWorks: 'NLP models analyze news, social media, and filings to extract market sentiment.',
              techStack: ['FinBERT', 'NLP', 'Real-time APIs'],
            },
          },
        ],
      },
      {
        title: 'Customer Services',
        icon: <AccountBalanceWallet />,
        color: '#f97316',
        description: 'Enhance financial customer experience',
        useCases: [
          {
            key: 'kyc-automation',
            label: 'KYC/AML Automation',
            description: 'Streamline compliance verification',
            icon: <Gavel />,
            route: '#',
            details: {
              duration: '8-10 min',
              difficulty: 'Intermediate',
              benefits: ['Faster onboarding', 'Compliance', 'Cost reduction'],
              howItWorks: 'Document AI and identity verification automate know-your-customer processes.',
              techStack: ['Document AI', 'OCR', 'Face Verification'],
            },
          },
          {
            key: 'wealth-advisor',
            label: 'AI Wealth Advisor',
            description: 'Personalized investment recommendations',
            icon: <AccountBalanceWallet />,
            route: '#',
            details: {
              duration: '8-10 min',
              difficulty: 'Intermediate',
              benefits: ['Personalized advice', 'Goal-based planning', 'Democratization'],
              howItWorks: 'Robo-advisors use optimization algorithms to create personalized portfolios.',
              techStack: ['Portfolio Optimization', 'Risk Models', 'Python'],
            },
          },
        ],
      },
    ],
  },
  hospitality: {
    id: 'hospitality',
    name: 'Restaurant & Hospitality AI',
    tagline: 'Smart solutions for hospitality excellence',
    description: '8 AI use cases for restaurants and hospitality',
    icon: <Restaurant sx={{ fontSize: 44 }} />,
    primaryColor: '#f97316',
    secondaryColor: '#ea580c',
    categories: [
      {
        title: 'Menu & Kitchen',
        icon: <MenuBook />,
        color: '#f97316',
        description: 'Optimize menu and kitchen operations',
        useCases: [
          {
            key: 'menu-optimization',
            label: 'Menu Engineering AI',
            description: 'Optimize menu for profitability and appeal',
            icon: <MenuBook />,
            route: '#',
            details: {
              duration: '8-10 min',
              difficulty: 'Intermediate',
              benefits: ['Higher margins', 'Better UX', 'Data-driven decisions'],
              howItWorks: 'ML analyzes sales data, costs, and customer preferences to optimize menu design.',
              techStack: ['Optimization', 'Analytics', 'Python'],
            },
          },
          {
            key: 'kitchen-ai',
            label: 'Kitchen Automation',
            description: 'Prep time prediction and workflow optimization',
            icon: <Kitchen />,
            route: '#',
            details: {
              duration: '6-8 min',
              difficulty: 'Intermediate',
              benefits: ['Faster service', 'Consistent quality', 'Less waste'],
              howItWorks: 'Models predict prep times and optimize kitchen workflow based on orders.',
              techStack: ['Time Series', 'Workflow Optimization', 'Python'],
            },
          },
        ],
      },
      {
        title: 'Operations',
        icon: <Groups />,
        color: '#22c55e',
        description: 'Streamline restaurant operations',
        useCases: [
          {
            key: 'demand-prediction',
            label: 'Demand Prediction',
            description: 'Forecast customer traffic and orders',
            icon: <Schedule />,
            route: '#',
            details: {
              duration: '6-8 min',
              difficulty: 'Intermediate',
              benefits: ['Staff planning', 'Inventory prep', 'Reduce waste'],
              howItWorks: 'Time series models predict demand based on history, weather, events, and trends.',
              techStack: ['Prophet', 'Weather API', 'Python'],
            },
          },
          {
            key: 'staff-scheduling',
            label: 'Staff Scheduling AI',
            description: 'Optimize workforce scheduling',
            icon: <Groups />,
            route: '#',
            details: {
              duration: '8-10 min',
              difficulty: 'Advanced',
              benefits: ['Labor cost savings', 'Employee satisfaction', 'Coverage'],
              howItWorks: 'Constraint optimization creates schedules balancing demand, costs, and preferences.',
              techStack: ['Constraint Programming', 'OR-Tools', 'Python'],
            },
          },
        ],
      },
      {
        title: 'Customer Experience',
        icon: <StarRate />,
        color: '#ec4899',
        description: 'Enhance guest satisfaction',
        useCases: [
          {
            key: 'review-insights',
            label: 'Review Sentiment Analysis',
            description: 'Extract insights from customer feedback',
            icon: <StarRate />,
            route: '#',
            details: {
              duration: '5-7 min',
              difficulty: 'Beginner',
              benefits: ['Actionable insights', 'Track trends', 'Improve service'],
              howItWorks: 'NLP models analyze reviews to extract sentiment, topics, and improvement areas.',
              techStack: ['Sentiment Analysis', 'Topic Modeling', 'Python'],
            },
          },
          {
            key: 'delivery-optimization',
            label: 'Delivery Optimization',
            description: 'Route and timing optimization for delivery',
            icon: <DeliveryDining />,
            route: '#',
            details: {
              duration: '8-10 min',
              difficulty: 'Intermediate',
              benefits: ['Faster delivery', 'Cost reduction', 'Customer satisfaction'],
              howItWorks: 'Routing algorithms optimize delivery sequences for time and efficiency.',
              techStack: ['VRP', 'Maps API', 'Python'],
            },
          },
        ],
      },
    ],
  },
  entertainment: {
    id: 'entertainment',
    name: 'Entertainment AI',
    tagline: 'AI-powered media and entertainment',
    description: '8 AI use cases for media and entertainment',
    icon: <Movie sx={{ fontSize: 44 }} />,
    primaryColor: '#ec4899',
    secondaryColor: '#db2777',
    categories: [
      {
        title: 'Content',
        icon: <Theaters />,
        color: '#ec4899',
        description: 'Intelligent content solutions',
        useCases: [
          {
            key: 'content-recs',
            label: 'Content Recommendations',
            description: 'Personalized content suggestions',
            icon: <Recommend />,
            route: '#',
            details: {
              duration: '10-12 min',
              difficulty: 'Intermediate',
              benefits: ['Engagement', 'Retention', 'Discovery'],
              howItWorks: 'Hybrid recommendation systems combine collaborative and content-based filtering.',
              techStack: ['Matrix Factorization', 'Deep Learning', 'Python'],
            },
          },
          {
            key: 'content-moderation',
            label: 'Content Moderation',
            description: 'AI-powered safety and moderation',
            icon: <Security />,
            route: '#',
            details: {
              duration: '6-8 min',
              difficulty: 'Intermediate',
              benefits: ['Brand safety', 'Community trust', 'Scalability'],
              howItWorks: 'Multi-modal models detect inappropriate content in text, images, and video.',
              techStack: ['Vision Models', 'NLP', 'Moderation APIs'],
            },
          },
        ],
      },
      {
        title: 'Audience',
        icon: <LiveTv />,
        color: '#3b82f6',
        description: 'Understand and grow audiences',
        useCases: [
          {
            key: 'audience-analytics',
            label: 'Audience Analytics',
            description: 'Deep insights into viewer behavior',
            icon: <Sensors />,
            route: '#',
            details: {
              duration: '8-10 min',
              difficulty: 'Intermediate',
              benefits: ['Programming decisions', 'Advertising value', 'Content strategy'],
              howItWorks: 'ML segments audiences and predicts engagement based on viewing patterns.',
              techStack: ['Clustering', 'Behavioral Analytics', 'Python'],
            },
          },
          {
            key: 'churn-prediction',
            label: 'Subscriber Churn Prediction',
            description: 'Identify at-risk subscribers',
            icon: <Subscriptions />,
            route: '#',
            details: {
              duration: '8-10 min',
              difficulty: 'Intermediate',
              benefits: ['Retention', 'Proactive engagement', 'Revenue protection'],
              howItWorks: 'Survival analysis models predict subscription cancellation probability.',
              techStack: ['Survival Analysis', 'XGBoost', 'Python'],
            },
          },
        ],
      },
      {
        title: 'Monetization',
        icon: <Campaign />,
        color: '#f97316',
        description: 'Maximize revenue potential',
        useCases: [
          {
            key: 'ad-optimization',
            label: 'Ad Optimization',
            description: 'Maximize ad revenue and relevance',
            icon: <Campaign />,
            route: '#',
            details: {
              duration: '8-10 min',
              difficulty: 'Advanced',
              benefits: ['Higher CPMs', 'Better targeting', 'User experience'],
              howItWorks: 'ML models optimize ad placement, targeting, and bidding in real-time.',
              techStack: ['Real-time Bidding', 'CTR Prediction', 'Python'],
            },
          },
          {
            key: 'music-discovery',
            label: 'Music/Media Discovery',
            description: 'AI-curated playlists and discovery',
            icon: <MusicNote />,
            route: '#',
            details: {
              duration: '6-8 min',
              difficulty: 'Intermediate',
              benefits: ['Engagement', 'Artist discovery', 'Personalization'],
              howItWorks: 'Audio analysis and collaborative filtering create personalized discovery experiences.',
              techStack: ['Audio Embeddings', 'Spotify-style Models', 'Python'],
            },
          },
        ],
      },
    ],
  },
  manufacturing: {
    id: 'manufacturing',
    name: 'Manufacturing AI',
    tagline: 'Industry 4.0 intelligent manufacturing',
    description: '8 AI use cases for smart manufacturing',
    icon: <Factory sx={{ fontSize: 44 }} />,
    primaryColor: '#64748b',
    secondaryColor: '#475569',
    categories: [
      {
        title: 'Equipment',
        icon: <Settings />,
        color: '#64748b',
        description: 'Optimize equipment performance',
        useCases: [
          {
            key: 'predictive-maintenance',
            label: 'Predictive Maintenance',
            description: 'Predict equipment failures before they happen',
            icon: <Engineering />,
            route: '#',
            details: {
              duration: '10-12 min',
              difficulty: 'Advanced',
              benefits: ['Reduce downtime', 'Cost savings', 'Safety'],
              howItWorks: 'Sensor data analyzed by ML models to predict equipment degradation and failures.',
              techStack: ['Time Series', 'Anomaly Detection', 'IoT', 'Python'],
            },
          },
          {
            key: 'energy-optimization',
            label: 'Energy Optimization',
            description: 'Reduce energy consumption and costs',
            icon: <ElectricalServices />,
            route: '#',
            details: {
              duration: '8-10 min',
              difficulty: 'Intermediate',
              benefits: ['Cost reduction', 'Sustainability', 'Efficiency'],
              howItWorks: 'ML optimizes energy usage based on production schedules and equipment efficiency.',
              techStack: ['Optimization', 'IoT Sensors', 'Python'],
            },
          },
        ],
      },
      {
        title: 'Quality',
        icon: <PrecisionManufacturing />,
        color: '#22c55e',
        description: 'Ensure product quality',
        useCases: [
          {
            key: 'quality-vision',
            label: 'Visual Quality Inspection',
            description: 'AI-powered defect detection',
            icon: <Memory />,
            route: '#',
            details: {
              duration: '8-10 min',
              difficulty: 'Intermediate',
              benefits: ['Consistency', 'Speed', 'Cost reduction'],
              howItWorks: 'Computer vision models detect defects and anomalies in real-time on production lines.',
              techStack: ['YOLO', 'Vision AI', 'Edge Computing'],
            },
          },
          {
            key: 'process-optimization',
            label: 'Process Optimization',
            description: 'Optimize production parameters',
            icon: <Speed />,
            route: '#',
            details: {
              duration: '10-12 min',
              difficulty: 'Advanced',
              benefits: ['Yield improvement', 'Quality consistency', 'Efficiency'],
              howItWorks: 'ML models find optimal process parameters based on sensor data and outcomes.',
              techStack: ['Bayesian Optimization', 'Process Control', 'Python'],
            },
          },
        ],
      },
      {
        title: 'Supply Chain',
        icon: <LocalShipping />,
        color: '#f97316',
        description: 'Optimize supply chain operations',
        useCases: [
          {
            key: 'demand-planning',
            label: 'Demand Planning',
            description: 'Forecast production requirements',
            icon: <Warehouse />,
            route: '#',
            details: {
              duration: '8-10 min',
              difficulty: 'Intermediate',
              benefits: ['Inventory optimization', 'Production planning', 'Cost reduction'],
              howItWorks: 'Time series models forecast demand incorporating market signals and seasonality.',
              techStack: ['Prophet', 'Hierarchical Forecasting', 'Python'],
            },
          },
          {
            key: 'supply-optimization',
            label: 'Supply Chain Optimization',
            description: 'Optimize procurement and logistics',
            icon: <LocalShipping />,
            route: '#',
            details: {
              duration: '10-12 min',
              difficulty: 'Advanced',
              benefits: ['Cost reduction', 'Resilience', 'Efficiency'],
              howItWorks: 'Network optimization models balance cost, risk, and service across the supply chain.',
              techStack: ['Network Optimization', 'OR-Tools', 'Python'],
            },
          },
        ],
      },
    ],
  },
  realestate: {
    id: 'realestate',
    name: 'Real Estate AI',
    tagline: 'Intelligent property solutions',
    description: '8 AI use cases for real estate and construction',
    icon: <Apartment sx={{ fontSize: 44 }} />,
    primaryColor: '#78716c',
    secondaryColor: '#57534e',
    categories: [
      {
        title: 'Valuation',
        icon: <House />,
        color: '#78716c',
        description: 'Accurate property valuation',
        useCases: [
          {
            key: 'property-valuation',
            label: 'Property Valuation AI',
            description: 'Automated property value estimation',
            icon: <HomeWork />,
            route: '#',
            details: {
              duration: '8-10 min',
              difficulty: 'Intermediate',
              benefits: ['Accuracy', 'Speed', 'Market insights'],
              howItWorks: 'ML models predict property values based on features, location, and market comparables.',
              techStack: ['Gradient Boosting', 'Geospatial', 'Python'],
            },
          },
          {
            key: 'market-trends',
            label: 'Market Trend Analysis',
            description: 'Predict real estate market movements',
            icon: <TrendingDown />,
            route: '#',
            details: {
              duration: '10-12 min',
              difficulty: 'Advanced',
              benefits: ['Investment timing', 'Risk management', 'Strategic planning'],
              howItWorks: 'Time series and economic models forecast market trends and price movements.',
              techStack: ['Time Series', 'Economic Indicators', 'Python'],
            },
          },
        ],
      },
      {
        title: 'Investment',
        icon: <LocationCity />,
        color: '#22c55e',
        description: 'Smart investment decisions',
        useCases: [
          {
            key: 'investment-scoring',
            label: 'Investment Opportunity Scoring',
            description: 'Rank properties by investment potential',
            icon: <ApartmentIcon />,
            route: '#',
            details: {
              duration: '8-10 min',
              difficulty: 'Intermediate',
              benefits: ['Better returns', 'Risk assessment', 'Portfolio optimization'],
              howItWorks: 'ML models score properties based on ROI potential, risk factors, and market dynamics.',
              techStack: ['Scoring Models', 'Feature Engineering', 'Python'],
            },
          },
          {
            key: 'lead-scoring',
            label: 'Lead Scoring',
            description: 'Prioritize buyer and seller leads',
            icon: <PersonSearch />,
            route: '#',
            details: {
              duration: '6-8 min',
              difficulty: 'Beginner',
              benefits: ['Sales efficiency', 'Better conversion', 'Resource allocation'],
              howItWorks: 'Propensity models score leads based on behavior and demographics.',
              techStack: ['Classification', 'CRM Integration', 'Python'],
            },
          },
        ],
      },
      {
        title: 'Construction',
        icon: <Construction />,
        color: '#f97316',
        description: 'Optimize construction projects',
        useCases: [
          {
            key: 'project-risk',
            label: 'Project Risk Assessment',
            description: 'Predict construction project risks',
            icon: <Construction />,
            route: '#',
            details: {
              duration: '8-10 min',
              difficulty: 'Intermediate',
              benefits: ['Risk mitigation', 'Better planning', 'Cost control'],
              howItWorks: 'ML models assess project risks based on scope, timeline, contractor history, and external factors.',
              techStack: ['Risk Models', 'NLP', 'Python'],
            },
          },
          {
            key: 'smart-building',
            label: 'Smart Building Analytics',
            description: 'Optimize building operations with AI',
            icon: <MapOutlined />,
            route: '#',
            details: {
              duration: '10-12 min',
              difficulty: 'Advanced',
              benefits: ['Energy savings', 'Tenant comfort', 'Maintenance efficiency'],
              howItWorks: 'IoT sensor data analyzed by ML to optimize HVAC, lighting, and maintenance.',
              techStack: ['IoT', 'Time Series', 'Building Management'],
            },
          },
        ],
      },
    ],
  },
  retail: {
    id: 'retail',
    name: 'Retail AI',
    tagline: 'In-store and omnichannel retail intelligence',
    description: '8 AI use cases for modern retail',
    icon: <Store sx={{ fontSize: 44 }} />,
    primaryColor: '#06b6d4',
    secondaryColor: '#0891b2',
    categories: [
      {
        title: 'In-Store',
        icon: <Storefront />,
        color: '#06b6d4',
        description: 'Transform the in-store experience',
        useCases: [
          {
            key: 'store-analytics',
            label: 'In-Store Analytics',
            description: 'Track and analyze shopper behavior',
            icon: <QrCodeScanner />,
            route: '#',
            details: {
              duration: '8-10 min',
              difficulty: 'Intermediate',
              benefits: ['Layout optimization', 'Staffing', 'Conversion insights'],
              howItWorks: 'Computer vision tracks customer movements and behavior patterns in-store.',
              techStack: ['Computer Vision', 'Heatmaps', 'Python'],
            },
          },
          {
            key: 'queue-management',
            label: 'Queue Management',
            description: 'Reduce wait times with AI predictions',
            icon: <Groups />,
            route: '#',
            details: {
              duration: '6-8 min',
              difficulty: 'Intermediate',
              benefits: ['Customer satisfaction', 'Staff allocation', 'Efficiency'],
              howItWorks: 'ML predicts queue lengths and wait times to optimize checkout staffing.',
              techStack: ['Time Series', 'Vision AI', 'Python'],
            },
          },
        ],
      },
      {
        title: 'Operations',
        icon: <PointOfSale />,
        color: '#22c55e',
        description: 'Optimize retail operations',
        useCases: [
          {
            key: 'inventory-ai',
            label: 'Inventory Intelligence',
            description: 'Smart inventory management',
            icon: <ShoppingBasket />,
            route: '#',
            details: {
              duration: '8-10 min',
              difficulty: 'Intermediate',
              benefits: ['Reduce stockouts', 'Lower carrying costs', 'Better turns'],
              howItWorks: 'Demand forecasting and optimization models manage inventory across locations.',
              techStack: ['Demand Forecasting', 'Optimization', 'Python'],
            },
          },
          {
            key: 'loss-prevention',
            label: 'Loss Prevention AI',
            description: 'Detect and prevent shrinkage',
            icon: <Security />,
            route: '#',
            details: {
              duration: '8-10 min',
              difficulty: 'Advanced',
              benefits: ['Reduce shrinkage', 'Fraud detection', 'Asset protection'],
              howItWorks: 'Anomaly detection in POS transactions and video analytics identify theft patterns.',
              techStack: ['Anomaly Detection', 'Video Analytics', 'Python'],
            },
          },
        ],
      },
      {
        title: 'Customer',
        icon: <Loyalty />,
        color: '#ec4899',
        description: 'Enhance customer relationships',
        useCases: [
          {
            key: 'customer-journey',
            label: 'Customer Journey Mapping',
            description: 'Understand omnichannel customer behavior',
            icon: <LocalMall />,
            route: '#',
            details: {
              duration: '10-12 min',
              difficulty: 'Advanced',
              benefits: ['Unified view', 'Better targeting', 'Experience optimization'],
              howItWorks: 'ML unifies customer touchpoints to map and predict journey patterns.',
              techStack: ['Identity Resolution', 'Journey Analytics', 'Python'],
            },
          },
          {
            key: 'loyalty-optimization',
            label: 'Loyalty Program Optimization',
            description: 'Maximize loyalty program ROI',
            icon: <Loyalty />,
            route: '#',
            details: {
              duration: '8-10 min',
              difficulty: 'Intermediate',
              benefits: ['Higher redemption', 'Better engagement', 'Reduced costs'],
              howItWorks: 'ML optimizes reward structures and personalized offers for maximum engagement.',
              techStack: ['Optimization', 'Personalization', 'Python'],
            },
          },
        ],
      },
    ],
  },
};

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

export default function IndustryPage() {
  const router = useRouter();
  const params = useParams();
  const industryKey = params.industry as string;

  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null);
  const [selectedCategoryColor, setSelectedCategoryColor] = useState<string>('#3b82f6');
  const [modalOpen, setModalOpen] = useState(false);

  // Redirect to specific e-commerce page
  if (industryKey === 'ecommerce') {
    router.replace('/industries/ecommerce');
    return null;
  }

  const industry = industriesData[industryKey];

  if (!industry) {
    router.replace('/');
    return null;
  }

  const handleUseCaseClick = (useCase: UseCase, categoryColor: string) => {
    setSelectedUseCase(useCase);
    setSelectedCategoryColor(categoryColor);
    setModalOpen(true);
  };

  const handleLaunch = (route: string) => {
    setModalOpen(false);
    if (route !== '#') {
      router.push(route);
    }
  };

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
          background: `radial-gradient(circle, ${alpha(industry.primaryColor, 0.1)} 0%, transparent 60%)`,
          pointerEvents: 'none',
          filter: 'blur(60px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-10%',
          right: '-5%',
          width: '400px',
          height: '400px',
          background: `radial-gradient(circle, ${alpha(industry.primaryColor, 0.08)} 0%, transparent 60%)`,
          pointerEvents: 'none',
          filter: 'blur(80px)',
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Header
          variant="simple"
          title={industry.name}
          tagline={industry.tagline}
          showBackButton={true}
          backUrl="/"
          titleColor={`linear-gradient(135deg, ${industry.primaryColor} 0%, ${industry.secondaryColor} 100%)`}
        />

          {/* Info banner */}
          <Paper
            sx={{
              p: 2,
              mt: 3,
              background: alpha(industry.primaryColor, 0.08),
              border: `1px solid ${alpha(industry.primaryColor, 0.2)}`,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <ScienceIcon sx={{ color: industry.primaryColor }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                <strong>Explore Mode:</strong> Click any use case to see details, estimated completion time, and demo preview. 
                These demos showcase AI capabilities with simulated data.
              </Typography>
            </Box>
            <Chip
              icon={<InfoOutlinedIcon sx={{ fontSize: '16px !important' }} />}
              label={industry.description}
              size="small"
              sx={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.7)',
              }}
            />
          </Paper>

        {/* Categories Grid */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Grid container spacing={3}>
            {industry.categories.map((category) => (
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

        <Footer variant="simple" text={`© 2025 RBM Software • ${industry.name} Solutions`} />
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
