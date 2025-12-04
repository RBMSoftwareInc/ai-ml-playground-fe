/**
 * API Client for Interactive AI Simulations
 * Supports REST, WebSocket, and SSE for real-time updates
 */

export interface SimulationRequest {
  industry: string;
  solutionId: string;
  scenarioId: string;
  decisionId?: string;
  decisionData?: Record<string, any>;
}

export interface PipelineUpdate {
  stepId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress?: number;
  data?: any;
  timestamp: Date;
}

export interface SimulationResponse {
  success: boolean;
  pipelineUpdates?: PipelineUpdate[];
  metrics?: Record<string, any>;
  visualization?: any;
  error?: string;
}

export interface StreamEvent {
  type: 'pipeline_update' | 'metric_update' | 'visualization_update' | 'error' | 'complete';
  data: any;
  timestamp: Date;
}

class InteractiveApiClient {
  private baseUrl: string;
  private wsConnection: WebSocket | null = null;
  private eventSource: EventSource | null = null;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_API_URL || '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Start a simulation - REST API call
   */
  async startSimulation(request: SimulationRequest): Promise<SimulationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/interactive/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error starting simulation:', error);
      // Return mock response for development
      return this.getMockResponse(request);
    }
  }

  /**
   * Make a decision - REST API call
   */
  async makeDecision(
    simulationId: string,
    decisionId: string,
    decisionData: Record<string, any>
  ): Promise<SimulationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/interactive/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simulationId, decisionId, decisionData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error making decision:', error);
      return this.getMockDecisionResponse(decisionId);
    }
  }

  /**
   * Connect to WebSocket for real-time updates
   */
  connectWebSocket(
    simulationId: string,
    onEvent: (event: StreamEvent) => void
  ): () => void {
    if (this.wsConnection) {
      this.wsConnection.close();
    }

    const wsUrl = `${this.baseUrl.replace('http', 'ws')}/ws/interactive/${simulationId}`;
    
    try {
      this.wsConnection = new WebSocket(wsUrl);

      this.wsConnection.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onEvent({
          type: data.type,
          data: data.payload,
          timestamp: new Date(data.timestamp),
        });
      };

      this.wsConnection.onerror = (error) => {
        console.error('WebSocket error:', error);
        onEvent({
          type: 'error',
          data: { message: 'Connection error' },
          timestamp: new Date(),
        });
      };

      this.wsConnection.onclose = () => {
        console.log('WebSocket closed');
      };
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      // Fallback to polling
      this.startPolling(simulationId, onEvent);
    }

    return () => {
      if (this.wsConnection) {
        this.wsConnection.close();
        this.wsConnection = null;
      }
    };
  }

  /**
   * Connect to SSE for real-time updates (fallback)
   */
  connectSSE(
    simulationId: string,
    onEvent: (event: StreamEvent) => void
  ): () => void {
    if (this.eventSource) {
      this.eventSource.close();
    }

    const sseUrl = `${this.baseUrl}/api/interactive/stream/${simulationId}`;
    
    try {
      this.eventSource = new EventSource(sseUrl);

      this.eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onEvent({
          type: data.type,
          data: data.payload,
          timestamp: new Date(data.timestamp),
        });
      };

      this.eventSource.onerror = () => {
        console.error('SSE error');
        this.eventSource?.close();
        // Fallback to polling
        this.startPolling(simulationId, onEvent);
      };
    } catch (error) {
      console.error('SSE connection failed:', error);
      this.startPolling(simulationId, onEvent);
    }

    return () => {
      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
    };
  }

  /**
   * Polling fallback for real-time updates
   */
  private startPolling(
    simulationId: string,
    onEvent: (event: StreamEvent) => void
  ): () => void {
    let intervalId: NodeJS.Timeout | null = null;

    const poll = async () => {
      try {
        const response = await fetch(`${this.baseUrl}/api/interactive/status/${simulationId}`);
        const data = await response.json();
        
        if (data.updates) {
          data.updates.forEach((update: any) => {
            onEvent({
              type: update.type,
              data: update.data,
              timestamp: new Date(update.timestamp),
            });
          });
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    intervalId = setInterval(poll, 2000); // Poll every 2 seconds

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }

  /**
   * Mock responses for development
   */
  private getMockResponse(request: SimulationRequest): SimulationResponse {
    return {
      success: true,
      pipelineUpdates: [
        {
          stepId: 'detection',
          status: 'completed',
          progress: 100,
          timestamp: new Date(),
        },
      ],
      metrics: {
        status: 'initialized',
      },
    };
  }

  private getMockDecisionResponse(decisionId: string): SimulationResponse {
    return {
      success: true,
      pipelineUpdates: [
        {
          stepId: 'action',
          status: 'completed',
          progress: 100,
          timestamp: new Date(),
        },
      ],
      metrics: {
        outcome: decisionId,
      },
    };
  }
}

export const interactiveApiClient = new InteractiveApiClient();

