/**
 * Solutions Client - Helper for executing AI solution demos
 * 
 * This client handles API calls to the backend for interactive AI solutions.
 * Backend endpoint: POST /api/use-cases/:id/execute
 */

import axios from 'axios';
import { z } from 'zod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

// Response schema validation
const PipelineStepSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  input: z.any().optional(),
  output: z.any().optional(),
  latency_ms: z.number().optional(),
  confidence: z.number().optional(),
});

const SolutionResponseSchema = z.object({
  success: z.boolean(),
  result: z.any(),
  pipeline: z.array(PipelineStepSchema).optional(),
  metrics: z.object({
    latency_ms: z.number().optional(),
    confidence: z.number().optional(),
    tokens_consumed: z.number().optional(),
  }).optional(),
  trace: z.any().optional(),
});

export type PipelineStep = z.infer<typeof PipelineStepSchema>;
export type SolutionResponse = z.infer<typeof SolutionResponseSchema>;

export interface ExecuteSolutionParams {
  id: string;
  scenario: string;
  payload: Record<string, any>;
  mode?: 'business' | 'tech';
}

/**
 * Execute a solution demo scenario
 * 
 * @param params - Execution parameters
 * @returns Promise with solution response
 */
export async function executeSolution(
  params: ExecuteSolutionParams
): Promise<SolutionResponse> {
  const { id, scenario, payload, mode = 'business' } = params;

  try {
    const response = await axios.post<SolutionResponse>(
      `${API_BASE_URL}/api/use-cases/${id}/execute`,
      {
        scenario,
        payload,
        mode,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      }
    );

    // Validate response with Zod
    const validated = SolutionResponseSchema.parse(response.data);
    return validated;
  } catch (error) {
    // Handle axios errors
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error
        throw new Error(
          `API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`
        );
      } else if (error.request) {
        // Request made but no response
        throw new Error('Network Error: No response from server');
      }
    }

    // Fallback error
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
}

/**
 * Get solution configuration
 * 
 * @param id - Solution ID
 * @returns Promise with solution config
 */
export async function getSolutionConfig(id: string) {
  try {
    // In production, this could fetch from API
    // For now, we'll use static imports
    const config = await import(`../data/solutions/${id}.json`);
    return config.default || config;
  } catch (error) {
    throw new Error(`Solution config not found: ${id}`);
  }
}

/**
 * Get all available solutions
 * 
 * @returns Promise with array of solution configs
 */
export async function getAllSolutions() {
  const solutionIds = ['fraud-detection', 'dynamic-pricing', 'loss-prevention'];
  
  const solutions = await Promise.all(
    solutionIds.map(async (id) => {
      try {
        const config = await getSolutionConfig(id);
        return config;
      } catch (error) {
        console.error(`Failed to load solution ${id}:`, error);
        return null;
      }
    })
  );

  return solutions.filter(Boolean);
}

