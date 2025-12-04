import billNegotiator from '../data/discovery/bill-negotiator.json';
import websiteSpeed from '../data/discovery/website-speed.json';
import careerAutomation from '../data/discovery/career-automation.json';
import cityRisk from '../data/discovery/city-risk.json';
import ideaBooster from '../data/discovery/idea-booster.json';
import colorPredictor from '../data/discovery/color-predictor.json';

export interface DiscoveryTool {
  metadata: {
    id: string;
    name: string;
    icon: string;
    description: string;
    category: string;
  };
  interaction: {
    type: 'input' | 'textarea' | 'select' | 'dragdrop';
    placeholder?: string;
    label: string;
    options?: string[];
  };
  model: {
    message: string;
    prompt: string;
  };
  visualization: {
    type: string;
    animation: string;
  };
  surprise: {
    type: string;
    message: string;
  };
}

const allTools: Record<string, DiscoveryTool> = {
  'bill-negotiator': billNegotiator as DiscoveryTool,
  'website-speed': websiteSpeed as DiscoveryTool,
  'career-automation': careerAutomation as DiscoveryTool,
  'city-risk': cityRisk as DiscoveryTool,
  'idea-booster': ideaBooster as DiscoveryTool,
  'color-predictor': colorPredictor as DiscoveryTool,
};

export function getDiscoveryTool(toolId: string): DiscoveryTool | null {
  return allTools[toolId] || null;
}

export function getAllDiscoveryTools(): DiscoveryTool[] {
  return Object.values(allTools);
}

/**
 * Personalization algorithm - returns 3-6 tools based on context
 */
export function getPersonalizedTools(context?: {
  lastIndustry?: string;
  deviceType?: 'mobile' | 'desktop';
  behaviorTags?: string[];
}): DiscoveryTool[] {
  const tools = getAllDiscoveryTools();
  
  // Simple randomization for now (can be enhanced with ML)
  const shuffled = [...tools].sort(() => Math.random() - 0.5);
  
  // Return 3-6 tools
  const count = Math.floor(Math.random() * 4) + 3; // 3-6
  return shuffled.slice(0, count);
}

