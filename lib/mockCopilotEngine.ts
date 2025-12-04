import { aiCatalog, UseCaseCatalogItem } from '../data/ai/catalog';

export interface CopilotContext {
  industries?: string[];
  categories?: string[];
  mentionedUseCases?: string[];
  conversationHistory?: string[];
}

export interface CopilotAction {
  type: 'SUGGEST_USE_CASES' | 'NAVIGATE' | 'SHOW_COMPARISON' | 'EXPLAIN_USE_CASE';
  useCases?: string[];
  route?: string;
  metadata?: Record<string, any>;
}

export interface CopilotResponse {
  reply: string;
  actions: CopilotAction[];
  contextUpdate?: CopilotContext;
}

/**
 * Mock AI Copilot Engine
 * Analyzes user messages and returns contextual recommendations
 */
export function mockCopilotEngine(
  message: string,
  context: CopilotContext = {}
): CopilotResponse {
  const lowerMessage = message.toLowerCase();
  const words = lowerMessage.split(/\s+/);
  
  // Detect industries
  const detectedIndustries: string[] = [];
  const industryKeywords: Record<string, string[]> = {
    ecommerce: ['ecommerce', 'e-commerce', 'online store', 'shop', 'retail', 'selling'],
    fintech: ['fintech', 'finance', 'payment', 'banking', 'transaction', 'money'],
    retail: ['retail', 'store', 'physical', 'brick', 'shop', 'in-store'],
    healthcare: ['healthcare', 'health', 'medical', 'patient', 'hospital', 'clinic'],
    travel: ['travel', 'trip', 'hotel', 'flight', 'booking', 'tourism'],
    hospitality: ['restaurant', 'hotel', 'hospitality', 'dining', 'food'],
    entertainment: ['entertainment', 'media', 'content', 'streaming', 'video'],
    manufacturing: ['manufacturing', 'production', 'factory', 'supply chain'],
    realestate: ['real estate', 'property', 'realty', 'housing', 'construction'],
  };

  Object.entries(industryKeywords).forEach(([industry, keywords]) => {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      detectedIndustries.push(industry);
    }
  });

  // Detect categories
  const detectedCategories: string[] = [];
  const categoryKeywords: Record<string, string[]> = {
    'product-discovery': ['search', 'discover', 'find', 'product', 'catalog'],
    'logistics-operations': ['delivery', 'shipping', 'logistics', 'inventory', 'warehouse'],
    'personalization': ['personalize', 'recommend', 'customize', 'tailored'],
    'pricing-fraud': ['price', 'pricing', 'fraud', 'cost', 'margin', 'discount'],
    'marketing-intelligence': ['marketing', 'churn', 'segment', 'customer', 'campaign'],
    'product-intelligence': ['product', 'categorize', 'review', 'sentiment', 'description'],
    'creative-ar': ['image', 'visual', 'ar', 'augmented', 'try-on', 'background'],
    'gamification': ['game', 'quiz', 'gamify', 'engagement', 'reward'],
    'analytics': ['analytics', 'insight', 'forecast', 'predict', 'analyze'],
  };

  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      detectedCategories.push(category);
    }
  });

  // Find matching use cases
  const matchingUseCases: UseCaseCatalogItem[] = [];
  
  // Direct keyword matching
  aiCatalog.forEach(useCase => {
    const matchesKeyword = useCase.keywords.some(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    );
    const matchesIndustry = detectedIndustries.length === 0 || 
      detectedIndustries.includes(useCase.industry);
    const matchesCategory = detectedCategories.length === 0 || 
      detectedCategories.includes(useCase.category);

    if (matchesKeyword || (matchesIndustry && matchesCategory)) {
      matchingUseCases.push(useCase);
    }
  });

  // Remove duplicates
  const uniqueUseCases = Array.from(
    new Map(matchingUseCases.map(uc => [uc.id, uc])).values()
  ).slice(0, 5); // Limit to top 5

  // Generate contextual reply
  let reply = '';
  
  if (detectedIndustries.length > 0 && uniqueUseCases.length > 0) {
    const industryNames = detectedIndustries.map(id => {
      const industry = aiCatalog.find(uc => uc.industry === id);
      return industry?.industry || id;
    });
    reply = `I understand you're working in ${industryNames.join(' and ')}. `;
    reply += `Based on your needs, I'd recommend exploring these AI solutions:\n\n`;
    uniqueUseCases.forEach((uc, idx) => {
      reply += `${idx + 1}. **${uc.displayName}** — ${uc.shortDescription}\n`;
    });
  } else if (uniqueUseCases.length > 0) {
    reply = `Great question! Here are some relevant AI solutions that might help:\n\n`;
    uniqueUseCases.forEach((uc, idx) => {
      reply += `${idx + 1}. **${uc.displayName}** — ${uc.shortDescription}\n`;
    });
  } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help')) {
    reply = `Hello! I'm your RBM AI Industry Copilot. I can help you discover AI solutions across 9 industries and 30+ use cases.\n\n`;
    reply += `Tell me about your business challenges, and I'll recommend the best AI solutions for you. `;
    reply += `For example:\n`;
    reply += `• "I run an ecommerce store with pricing issues"\n`;
    reply += `• "We need better fraud detection"\n`;
    reply += `• "Help me reduce customer churn"`;
  } else {
    reply = `I understand you're looking for AI solutions. `;
    reply += `Could you tell me more about:\n`;
    reply += `• What industry are you in?\n`;
    reply += `• What specific challenges are you facing?\n`;
    reply += `• What outcomes are you trying to achieve?`;
  }

  // Build actions
  const actions: CopilotAction[] = [];
  
  if (uniqueUseCases.length > 0) {
    actions.push({
      type: 'SUGGEST_USE_CASES',
      useCases: uniqueUseCases.map(uc => uc.id),
      metadata: {
        useCaseDetails: uniqueUseCases,
      },
    });
  }

  // Update context
  const contextUpdate: CopilotContext = {
    industries: detectedIndustries.length > 0 ? detectedIndustries : context.industries,
    categories: detectedCategories.length > 0 ? detectedCategories : context.categories,
    mentionedUseCases: uniqueUseCases.map(uc => uc.id),
    conversationHistory: [
      ...(context.conversationHistory || []),
      message,
    ].slice(-10), // Keep last 10 messages
  };

  return {
    reply,
    actions,
    contextUpdate,
  };
}

