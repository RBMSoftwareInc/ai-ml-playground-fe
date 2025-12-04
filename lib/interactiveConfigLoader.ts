import fraudDetectionConfig from '../data/interactive/fintech/fraud-detection.json';
import dynamicPricingConfig from '../data/interactive/ecommerce/dynamic-pricing.json';
import lossPreventionConfig from '../data/interactive/retail/loss-prevention.json';

export interface SolutionConfig {
  metadata: {
    id: string;
    title: string;
    tagline: string;
    icon: string;
    industry: string;
  };
  businessStory: string;
  impact: {
    revenue_saved?: string;
    fraud_reduction?: string;
    margin_improvement?: string;
    shrinkage_reduction?: string;
    roi: string;
  };
  scenarios: Array<{
    id: string;
    label: string;
    description: string;
    recommended: boolean;
    visualization: string;
    decisions: Array<{
      id: string;
      label: string;
      outcome: string;
    }>;
  }>;
  pipeline: Array<{
    id: string;
    label: string;
    description: string;
  }>;
  impactMetrics: Record<string, { label: string; value: string; change: string }>;
}

const configs: Record<string, SolutionConfig> = {
  'fintech/fraud-detection': fraudDetectionConfig as SolutionConfig,
  'ecommerce/dynamic-pricing': dynamicPricingConfig as SolutionConfig,
  'retail/loss-prevention': lossPreventionConfig as SolutionConfig,
};

export function getInteractiveConfig(industry: string, solutionId: string): SolutionConfig | null {
  const key = `${industry}/${solutionId}`;
  return configs[key] || null;
}

export function getAllConfigs(): SolutionConfig[] {
  return Object.values(configs);
}

