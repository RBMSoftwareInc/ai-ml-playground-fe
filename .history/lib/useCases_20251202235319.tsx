'use client';

// Import all use case components from centralized location
import NLPSearchPage from '../components/useCases/nlp';
import VisualSimilarityPage from '../components/useCases/vss';
import BundleAndOutfitPage from '../components/useCases/bundle';
import ETAPredictPage from '../components/useCases/eta';
import OrderDelayForecastPage from '../components/useCases/delay';
import InventoryReorderPage from '../components/useCases/inventory';
import PersonalizationPage from '../components/useCases/personalization';
import AIChatAssistantPage from '../components/useCases/chat';
import VoiceSearchPage from '../components/useCases/voice';
import DynamicPricingPage from '../components/useCases/pricing';
import FraudPage from '../components/useCases/fruad';
import CouponAbusePage from '../components/useCases/coupon';
import ChurnPredictionPage from '../components/useCases/churn';
import SegmentationPage from '../components/useCases/segmentation';
import SubjectLinePage from '../components/useCases/subject';
import LeadGenPage from '../components/useCases/leadgen';
import VariantPage from '../components/useCases/variant';
import AutoCategorizationPage from '../components/useCases/categorization';
import ReviewSentimentPage from '../components/useCases/sentiment';
import TitleDescriptionPage from '../components/useCases/descriptions';
import AITryOnPage from '../components/useCases/tryon';
import ForecastPage from '../components/useCases/forecast';
import TimingPage from '../components/useCases/timing';
import ABTestPage from '../components/useCases/abtest';
import QuizPage from '../components/useCases/quiz';
import SpinPage from '../components/useCases/spin';
import IQPage from '../components/useCases/iq';

export interface UseCaseConfig {
  slug: string;
  component: React.ComponentType;
  title: string;
  tagline: string;
  category: string;
  backUrl: string;
}

export const useCasesConfig: Record<string, UseCaseConfig> = {
  nlp: {
    slug: 'nlp',
    component: NLPSearchPage,
    title: 'NLP Intent Search',
    tagline: 'Understand free-form shopper intent with AI',
    category: 'Product Discovery',
    backUrl: '/industries/ecommerce',
  },
  vss: {
    slug: 'vss',
    component: VisualSimilarityPage,
    title: 'Visual Similarity Search',
    tagline: 'Image-based product discovery using deep learning',
    category: 'Product Discovery',
    backUrl: '/industries/ecommerce',
  },
  bundle: {
    slug: 'bundle',
    component: BundleAndOutfitPage,
    title: 'Bundle & Outfit Suggestions',
    tagline: 'AI-powered outfit and bundle recommendations',
    category: 'Product Discovery',
    backUrl: '/industries/ecommerce',
  },
  eta: {
    slug: 'eta',
    component: ETAPredictPage,
    title: 'ETA Prediction',
    tagline: 'Predict delivery times with machine learning',
    category: 'Logistics & Operations',
    backUrl: '/industries/ecommerce',
  },
  delay: {
    slug: 'delay',
    component: OrderDelayForecastPage,
    title: 'Order Delay Forecast',
    tagline: 'Forecast potential delivery delays',
    category: 'Logistics & Operations',
    backUrl: '/industries/ecommerce',
  },
  inventory: {
    slug: 'inventory',
    component: InventoryReorderPage,
    title: 'Inventory Reordering',
    tagline: 'AI-powered inventory management',
    category: 'Logistics & Operations',
    backUrl: '/industries/ecommerce',
  },
  personalization: {
    slug: 'personalization',
    component: PersonalizationPage,
    title: 'Real-Time Personalization',
    tagline: 'Personalized recommendations in real-time',
    category: 'Personalization',
    backUrl: '/industries/ecommerce',
  },
  chat: {
    slug: 'chat',
    component: AIChatAssistantPage,
    title: 'AI Chat Assistant',
    tagline: 'Intelligent customer support chatbot',
    category: 'Personalization',
    backUrl: '/industries/ecommerce',
  },
  voice: {
    slug: 'voice',
    component: VoiceSearchPage,
    title: 'Voice Search',
    tagline: 'Voice-powered product search',
    category: 'Personalization',
    backUrl: '/industries/ecommerce',
  },
  pricing: {
    slug: 'pricing',
    component: DynamicPricingPage,
    title: 'Dynamic Pricing',
    tagline: 'AI-powered pricing optimization',
    category: 'Pricing & Fraud',
    backUrl: '/industries/ecommerce',
  },
  fraud: {
    slug: 'fraud',
    component: FraudPage,
    title: 'Fraud Detection',
    tagline: 'Detect fraudulent transactions with AI',
    category: 'Pricing & Fraud',
    backUrl: '/industries/ecommerce',
  },
  fruad: {
    slug: 'fruad',
    component: FraudPage,
    title: 'Fraud Detection',
    tagline: 'Detect fraudulent transactions with AI',
    category: 'Pricing & Fraud',
    backUrl: '/industries/ecommerce',
  },
  coupon: {
    slug: 'coupon',
    component: CouponAbusePage,
    title: 'Coupon Abuse Detection',
    tagline: 'Prevent coupon fraud and abuse',
    category: 'Pricing & Fraud',
    backUrl: '/industries/ecommerce',
  },
  churn: {
    slug: 'churn',
    component: ChurnPredictionPage,
    title: 'Churn Prediction',
    tagline: 'Predict customer churn with ML',
    category: 'Marketing Intelligence',
    backUrl: '/industries/ecommerce',
  },
  segmentation: {
    slug: 'segmentation',
    component: SegmentationPage,
    title: 'Customer Segmentation',
    tagline: 'Segment customers using AI',
    category: 'Marketing Intelligence',
    backUrl: '/industries/ecommerce',
  },
  subject: {
    slug: 'subject',
    component: SubjectLinePage,
    title: 'Email Subject Line Generator',
    tagline: 'Generate compelling email subject lines',
    category: 'Marketing Intelligence',
    backUrl: '/industries/ecommerce',
  },
  leadgen: {
    slug: 'leadgen',
    component: LeadGenPage,
    title: 'Lead Gen Blueprint',
    tagline: 'AI-powered lead generation',
    category: 'Marketing Intelligence',
    backUrl: '/industries/ecommerce',
  },
  variant: {
    slug: 'variant',
    component: VariantPage,
    title: 'Variant Assignment',
    tagline: 'Assign product variants intelligently',
    category: 'Product Intelligence',
    backUrl: '/industries/ecommerce',
  },
  categorization: {
    slug: 'categorization',
    component: AutoCategorizationPage,
    title: 'Auto Categorization',
    tagline: 'Automatically categorize products',
    category: 'Product Intelligence',
    backUrl: '/industries/ecommerce',
  },
  sentiment: {
    slug: 'sentiment',
    component: ReviewSentimentPage,
    title: 'Review Sentiment Analysis',
    tagline: 'Analyze customer sentiment from reviews',
    category: 'Product Intelligence',
    backUrl: '/industries/ecommerce',
  },
  descriptions: {
    slug: 'descriptions',
    component: TitleDescriptionPage,
    title: 'Title & Description Generator',
    tagline: 'Generate product titles and descriptions',
    category: 'Product Intelligence',
    backUrl: '/industries/ecommerce',
  },
  tryon: {
    slug: 'tryon',
    component: AITryOnPage,
    title: 'AI Try-On (AR)',
    tagline: 'Virtual try-on using augmented reality',
    category: 'Creative & AR Tools',
    backUrl: '/industries/ecommerce',
  },
  forecast: {
    slug: 'forecast',
    component: ForecastPage,
    title: 'Forecast',
    tagline: 'AI-powered forecasting',
    category: 'Analytics & Insights',
    backUrl: '/industries/ecommerce',
  },
  timing: {
    slug: 'timing',
    component: TimingPage,
    title: 'Timing',
    tagline: 'Optimal timing predictions',
    category: 'Analytics & Insights',
    backUrl: '/industries/ecommerce',
  },
  abtest: {
    slug: 'abtest',
    component: ABTestPage,
    title: 'A/B Testing',
    tagline: 'AI-powered A/B testing',
    category: 'Analytics & Insights',
    backUrl: '/industries/ecommerce',
  },
  quiz: {
    slug: 'quiz',
    component: QuizPage,
    title: 'Quiz',
    tagline: 'Interactive quiz system',
    category: 'Gamification',
    backUrl: '/industries/ecommerce',
  },
  spin: {
    slug: 'spin',
    component: SpinPage,
    title: 'Spin',
    tagline: 'Spin wheel gamification',
    category: 'Gamification',
    backUrl: '/industries/ecommerce',
  },
  iq: {
    slug: 'iq',
    component: IQPage,
    title: 'IQ',
    tagline: 'Intelligence quotient system',
    category: 'Gamification',
    backUrl: '/industries/ecommerce',
  },
};

export function getUseCase(slug: string): UseCaseConfig | undefined {
  return useCasesConfig[slug];
}

export function getAllUseCases(): UseCaseConfig[] {
  return Object.values(useCasesConfig);
}

