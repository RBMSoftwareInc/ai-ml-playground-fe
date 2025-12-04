export interface UseCaseCatalogItem {
  id: string;
  displayName: string;
  industry: string;
  category: string;
  shortDescription: string;
  keywords: string[];
  interactiveRoute?: string;
  industryRoute: string;
  icon?: string;
}

export const aiCatalog: UseCaseCatalogItem[] = [
  {
    id: 'pricing',
    displayName: 'Dynamic Pricing',
    industry: 'ecommerce',
    category: 'pricing-fraud',
    shortDescription: 'Real-time price optimization based on demand, competition, and inventory',
    keywords: ['price', 'pricing', 'margin', 'discount', 'cost', 'sale', 'revenue', 'profit'],
    interactiveRoute: '/interactive-ai/dynamic-pricing',
    industryRoute: '/industries/ecommerce',
  },
  {
    id: 'fraud',
    displayName: 'Fraud Detection',
    industry: 'fintech',
    category: 'pricing-fraud',
    shortDescription: 'Detect suspicious transaction patterns and prevent fraud in real-time',
    keywords: ['fraud', 'attack', 'abuse', 'bot', 'risk', 'security', 'suspicious', 'transaction'],
    interactiveRoute: '/interactive-ai/fraud-detection',
    industryRoute: '/industries/fintech',
  },
  {
    id: 'loss-prevention',
    displayName: 'Loss Prevention',
    industry: 'retail',
    category: 'analytics',
    shortDescription: 'Minimize shrinkage and improve store security with AI-powered monitoring',
    keywords: ['theft', 'shrinkage', 'loss', 'store', 'security', 'prevention', 'monitoring'],
    interactiveRoute: '/interactive-ai/loss-prevention',
    industryRoute: '/industries/retail',
  },
  {
    id: 'churn',
    displayName: 'Churn Prediction',
    industry: 'ecommerce',
    category: 'marketing-intelligence',
    shortDescription: 'Identify at-risk customers and trigger retention campaigns proactively',
    keywords: ['churn', 'retention', 'customer', 'loyalty', 'cancel', 'leave', 'at-risk'],
    industryRoute: '/industries/ecommerce',
  },
  {
    id: 'personalization',
    displayName: 'Real-Time Personalization',
    industry: 'ecommerce',
    category: 'personalization',
    shortDescription: 'Deliver personalized experiences based on real-time user behavior',
    keywords: ['personalization', 'recommendation', 'customize', 'tailored', 'individual'],
    industryRoute: '/industries/ecommerce',
  },
  {
    id: 'nlp',
    displayName: 'Smart Search (NLP)',
    industry: 'ecommerce',
    category: 'product-discovery',
    shortDescription: 'Natural language product search with semantic understanding',
    keywords: ['search', 'nlp', 'query', 'find', 'discover', 'semantic'],
    industryRoute: '/industries/ecommerce',
  },
  {
    id: 'vss',
    displayName: 'Visual Similarity Search',
    industry: 'ecommerce',
    category: 'product-discovery',
    shortDescription: 'Find similar products using image-based search technology',
    keywords: ['visual', 'image', 'similar', 'look', 'style', 'appearance'],
    industryRoute: '/industries/ecommerce',
  },
  {
    id: 'eta',
    displayName: 'ETA Prediction',
    industry: 'ecommerce',
    category: 'logistics-operations',
    shortDescription: 'Accurate delivery time estimation with route optimization',
    keywords: ['eta', 'delivery', 'shipping', 'logistics', 'time', 'arrival'],
    industryRoute: '/industries/ecommerce',
  },
  {
    id: 'segmentation',
    displayName: 'Customer Segmentation',
    industry: 'ecommerce',
    category: 'marketing-intelligence',
    shortDescription: 'Segment customers by behavior, value, and preferences for targeted marketing',
    keywords: ['segment', 'customer', 'group', 'cohort', 'audience', 'target'],
    industryRoute: '/industries/ecommerce',
  },
  {
    id: 'sentiment',
    displayName: 'Review Sentiment Analysis',
    industry: 'ecommerce',
    category: 'product-intelligence',
    shortDescription: 'Analyze customer reviews to extract insights and improve products',
    keywords: ['review', 'sentiment', 'feedback', 'opinion', 'rating', 'comment'],
    industryRoute: '/industries/ecommerce',
  },
];

export const industries = [
  { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
  { id: 'fintech', name: 'Fintech', icon: '💰' },
  { id: 'retail', name: 'Retail', icon: '🏪' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
  { id: 'hospitality', name: 'Hospitality', icon: '🍽️' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬' },
  { id: 'manufacturing', name: 'Manufacturing', icon: '🏭' },
  { id: 'realestate', name: 'Real Estate', icon: '🏢' },
];

export const categories = [
  { id: 'product-discovery', name: 'Product Discovery', icon: '🔍' },
  { id: 'logistics-operations', name: 'Logistics & Operations', icon: '🚚' },
  { id: 'personalization', name: 'Personalization', icon: '👤' },
  { id: 'pricing-fraud', name: 'Pricing & Fraud', icon: '💳' },
  { id: 'marketing-intelligence', name: 'Marketing Intelligence', icon: '📈' },
  { id: 'product-intelligence', name: 'Product Intelligence', icon: '📦' },
  { id: 'creative-ar', name: 'Creative & AR', icon: '🎨' },
  { id: 'gamification', name: 'Gamification', icon: '🎮' },
  { id: 'analytics', name: 'Analytics & Insights', icon: '📊' },
];

