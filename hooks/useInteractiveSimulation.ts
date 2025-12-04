import { useState, useCallback, useEffect, useRef } from 'react';
import { interactiveApiClient, StreamEvent, PipelineUpdate } from '../lib/interactiveApiClient';

export type SimulationPhase = 'brief' | 'scenario' | 'simulation' | 'impact';

export interface SimulationState {
  phase: SimulationPhase;
  selectedScenario: string | null;
  decisions: Record<string, string>;
  pipelineProgress: number[];
  simulationId: string | null;
  loading: boolean;
  error: string | null;
  metrics: Record<string, any>;
  visualizationData: any;
}

export function useInteractiveSimulation() {
  const [state, setState] = useState<SimulationState>({
    phase: 'brief',
    selectedScenario: null,
    decisions: {},
    pipelineProgress: [],
    simulationId: null,
    loading: false,
    error: null,
    metrics: {},
    visualizationData: null,
  });

  const [viewMode, setViewMode] = useState<'business' | 'tech'>('business');
  const streamCleanupRef = useRef<(() => void) | null>(null);

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (streamCleanupRef.current) {
        streamCleanupRef.current();
      }
    };
  }, []);

  const handleStreamEvent = useCallback((event: StreamEvent) => {
    setState(prev => {
      const updates: Partial<SimulationState> = {};

      switch (event.type) {
        case 'pipeline_update':
          const pipelineUpdate = event.data as PipelineUpdate;
          // Update pipeline progress based on step status
          if (pipelineUpdate.status === 'completed') {
            // Find step index and add to progress
            // This would need pipeline config to map stepId to index
            updates.pipelineProgress = [...prev.pipelineProgress];
          }
          break;

        case 'metric_update':
          updates.metrics = { ...prev.metrics, ...event.data };
          break;

        case 'visualization_update':
          updates.visualizationData = event.data;
          break;

        case 'error':
          updates.error = event.data?.message || 'An error occurred';
          updates.loading = false;
          break;

        case 'complete':
          updates.loading = false;
          break;
      }

      return { ...prev, ...updates };
    });
  }, []);

  const goToPhase = useCallback((phase: SimulationPhase) => {
    setState(prev => ({ ...prev, phase, error: null }));
  }, []);

  const selectScenario = useCallback(
    async (scenarioId: string, industry?: string, solutionId?: string) => {
      setState(prev => ({
        ...prev,
        selectedScenario: scenarioId,
        phase: 'simulation',
        loading: true,
        error: null,
      }));

      // Start simulation via API
      if (industry && solutionId) {
        try {
          const response = await interactiveApiClient.startSimulation({
            industry,
            solutionId,
            scenarioId,
          });

          if (response.success && response.pipelineUpdates) {
            // Connect to real-time stream
            const simulationId = `sim_${Date.now()}`;
            const cleanup = interactiveApiClient.connectWebSocket(
              simulationId,
              handleStreamEvent
            );
            streamCleanupRef.current = cleanup;

            setState(prev => ({
              ...prev,
              simulationId,
              loading: false,
              pipelineProgress: response.pipelineUpdates
                ? response.pipelineUpdates
                    .filter((u: PipelineUpdate) => u.status === 'completed')
                    .map((u: PipelineUpdate, idx: number) => idx)
                : [],
            }));
          } else {
            setState(prev => ({
              ...prev,
              loading: false,
              error: response.error || 'Failed to start simulation',
            }));
          }
        } catch (error) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          }));
        }
      } else {
        // No API call, just update state
        setState(prev => ({ ...prev, loading: false }));
      }
    },
    [handleStreamEvent]
  );

  const makeDecision = useCallback(
    async (decisionId: string, outcome: string, decisionData?: Record<string, any>) => {
      setState(prev => ({
        ...prev,
        decisions: {
          ...prev.decisions,
          [decisionId]: outcome,
        },
        loading: true,
      }));

      // Make decision via API
      if (state.simulationId) {
        try {
          const response = await interactiveApiClient.makeDecision(
            state.simulationId,
            decisionId,
            decisionData || {}
          );

          if (response.success) {
            setState(prev => ({
              ...prev,
              loading: false,
              metrics: { ...prev.metrics, ...response.metrics },
            }));
          } else {
            setState(prev => ({
              ...prev,
              loading: false,
              error: response.error || 'Decision failed',
            }));
          }
        } catch (error) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          }));
        }
      } else {
        // No API call, just update state
        setState(prev => ({ ...prev, loading: false }));
      }
    },
    [state.simulationId]
  );

  const updatePipelineProgress = useCallback((stepIds: number[]) => {
    setState(prev => ({
      ...prev,
      pipelineProgress: stepIds,
    }));
  }, []);

  const completeSimulation = useCallback(() => {
    // Cleanup stream
    if (streamCleanupRef.current) {
      streamCleanupRef.current();
      streamCleanupRef.current = null;
    }

    setState(prev => ({
      ...prev,
      phase: 'impact',
      loading: false,
    }));
  }, []);

  const reset = useCallback(() => {
    // Cleanup stream
    if (streamCleanupRef.current) {
      streamCleanupRef.current();
      streamCleanupRef.current = null;
    }

    setState({
      phase: 'brief',
      selectedScenario: null,
      decisions: {},
      pipelineProgress: [],
      simulationId: null,
      loading: false,
      error: null,
      metrics: {},
      visualizationData: null,
    });
  }, []);

  return {
    state,
    viewMode,
    setViewMode,
    goToPhase,
    selectScenario,
    makeDecision,
    updatePipelineProgress,
    completeSimulation,
    reset,
  };
}
