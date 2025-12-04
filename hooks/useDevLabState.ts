/**
 * DevLab State Management Hook
 * 
 * TODO (Phase 2): Replace with real state management (Zustand/Redux)
 * TODO (Phase 2): Add persistence layer (localStorage/IndexedDB)
 * TODO (Phase 2): Add real-time sync with backend
 * 
 * This hook manages:
 * - Active project/session
 * - Selected language
 * - Open files
 * - Recent commands
 * - User permissions
 * - Environment (Dev/Staging/Prod)
 */

import { useState, useCallback } from 'react';

export interface DevSession {
  userId: string;
  projectId: string | null;
  selectedLanguage: string;
  activeFile: string | null;
  recentCommands: string[];
  environment: 'dev' | 'staging' | 'prod';
  permissions: {
    canExecute: boolean;
    canModify: boolean;
    canDeploy: boolean;
  };
}

const initialSession: DevSession = {
  userId: 'dev-user-001',
  projectId: null,
  selectedLanguage: 'node',
  activeFile: null,
  recentCommands: [],
  environment: 'dev',
  permissions: {
    canExecute: true,
    canModify: true,
    canDeploy: false,
  },
};

export function useDevLabState() {
  const [session, setSession] = useState<DevSession>(initialSession);

  const updateLanguage = useCallback((language: string) => {
    setSession((prev) => ({ ...prev, selectedLanguage: language }));
  }, []);

  const setActiveFile = useCallback((filePath: string | null) => {
    setSession((prev) => ({ ...prev, activeFile: filePath }));
  }, []);

  const addCommand = useCallback((command: string) => {
    setSession((prev) => ({
      ...prev,
      recentCommands: [command, ...prev.recentCommands.slice(0, 9)],
    }));
  }, []);

  const setEnvironment = useCallback((env: 'dev' | 'staging' | 'prod') => {
    setSession((prev) => ({ ...prev, environment: env }));
  }, []);

  const setProject = useCallback((projectId: string | null) => {
    setSession((prev) => ({ ...prev, projectId }));
  }, []);

  return {
    session,
    updateLanguage,
    setActiveFile,
    addCommand,
    setEnvironment,
    setProject,
  };
}

