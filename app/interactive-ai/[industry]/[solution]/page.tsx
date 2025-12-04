'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Paper, Typography, Button } from '@mui/material';
import InteractiveLayout from '../../../../components/interactive/InteractiveLayout';
import PhaseBrief from '../../../../components/interactive/phases/PhaseBrief';
import PhaseScenario from '../../../../components/interactive/phases/PhaseScenario';
import PhaseSimulation from '../../../../components/interactive/phases/PhaseSimulation';
import PhaseImpact from '../../../../components/interactive/phases/PhaseImpact';
import PipelineVisualization from '../../../../components/interactive/PipelineVisualization';
import { useInteractiveSimulation } from '../../../../hooks/useInteractiveSimulation';
import { getInteractiveConfig, SolutionConfig } from '../../../../lib/interactiveConfigLoader';
import { motion } from 'framer-motion';

export default function InteractiveSimulatorPage() {
  const params = useParams();
  const router = useRouter();
  const industry = params.industry as string;
  const solutionId = params.solution as string;

  const [config, setConfig] = useState<SolutionConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    state,
    viewMode,
    setViewMode,
    goToPhase,
    selectScenario,
    makeDecision,
    updatePipelineProgress,
    completeSimulation,
    reset,
  } = useInteractiveSimulation();

  useEffect(() => {
    // Load config
    const loadedConfig = getInteractiveConfig(industry, solutionId);
    if (loadedConfig) {
      setConfig(loadedConfig);
    } else {
      console.error(`Config not found for ${industry}/${solutionId}`);
    }
    setLoading(false);
  }, [industry, solutionId]);

  if (loading || !config) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%)',
        }}
      >
        <Typography sx={{ color: '#fff' }}>Loading simulation...</Typography>
      </Box>
    );
  }

  const selectedScenarioData = config.scenarios.find(
    s => s.id === state.selectedScenario
  );

  // Render center panel based on phase
  const renderCenterPanel = () => {
    switch (state.phase) {
      case 'brief':
        return (
          <PhaseBrief
            title={config.metadata.title}
            tagline={config.metadata.tagline}
            icon={config.metadata.icon}
            businessStory={config.businessStory}
            impact={config.impact}
            onStart={() => goToPhase('scenario')}
          />
        );
      case 'scenario':
        return (
          <PhaseScenario
            scenarios={config.scenarios}
            selectedScenario={state.selectedScenario}
            onSelectScenario={(scenarioId) => selectScenario(scenarioId, industry, solutionId)}
            onStartWithRecommended={() => {
              const recommended = config.scenarios.find(s => s.recommended);
              if (recommended) {
                selectScenario(recommended.id, industry, solutionId);
              }
            }}
          />
        );
      case 'simulation':
        return selectedScenarioData ? (
          <PhaseSimulation
            scenarioLabel={selectedScenarioData.label}
            visualization={selectedScenarioData.visualization}
            decisions={selectedScenarioData.decisions}
            pipeline={config.pipeline}
            onDecision={makeDecision}
            onComplete={completeSimulation}
            pipelineProgress={state.pipelineProgress}
            loading={state.loading}
            error={state.error}
            visualizationData={state.visualizationData}
          />
        ) : null;
      case 'impact':
        return (
          <PhaseImpact
            impactMetrics={config.impactMetrics}
            selectedScenario={state.selectedScenario || ''}
            onReplay={() => {
              reset();
              goToPhase('scenario');
            }}
          />
        );
      default:
        return null;
    }
  };

  // Render left panel (scenario context)
  const renderLeftPanel = () => {
    if (state.phase === 'simulation' && selectedScenarioData) {
      return (
        <Paper
          sx={{
            p: 3,
            bgcolor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#fff',
              fontWeight: 600,
              mb: 2,
              fontSize: '1rem',
            }}
          >
            Scenario Context
          </Typography>
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.9rem',
              lineHeight: 1.6,
            }}
          >
            {selectedScenarioData.description}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  // Render right panel (pipeline)
  const renderRightPanel = () => {
    if (state.phase === 'simulation') {
      return (
        <PipelineVisualization
          pipeline={config.pipeline}
          activeSteps={state.pipelineProgress}
        />
      );
    }
    return null;
  };

  return (
    <InteractiveLayout
      industry={industry}
      solutionId={solutionId}
      solutionTitle={config.metadata.title}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      centerPanel={renderCenterPanel()}
      leftPanel={renderLeftPanel()}
      rightPanel={renderRightPanel()}
    />
  );
}

