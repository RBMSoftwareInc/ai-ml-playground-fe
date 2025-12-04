'use client';

import { useState } from 'react';
import { Box, Select, MenuItem, FormControl, Button, IconButton, Tabs, Tab } from '@mui/material';
import { motion } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import HistoryIcon from '@mui/icons-material/History';
import FileTree from './FileTree';
import MonacoPlaceholder from './MonacoPlaceholder';
import MockTerminal from './MockTerminal';
import { useDevLabState } from '../../hooks/useDevLabState';
import sandboxMocks from '../../data/devlab/sandbox-mocks.json';
import reverseSample from '../../data/devlab/reverse-sample.json';

interface SandboxEditorProps {
  initialLanguage?: string;
  initialProject?: string;
}

export default function SandboxEditor({ initialLanguage, initialProject }: SandboxEditorProps) {
  const { session, updateLanguage, setActiveFile, addCommand } = useDevLabState();
  const [running, setRunning] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<any>(null);
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [codeVersions, setCodeVersions] = useState<string[]>(['Current', 'Refactor v1 (cleaner)', 'Optimized v2 (performance)']);
  const [selectedVersion, setSelectedVersion] = useState('Current');

  const language = initialLanguage || session.selectedLanguage;

  const handleRun = async () => {
    setRunning(true);
    setTerminalOutput(null);
    addCommand(`run ${language}`);

    // Mock execution
    setTimeout(() => {
      const mockOutput = (sandboxMocks as any)[language] || sandboxMocks.error;
      setTerminalOutput(mockOutput);
      setRunning(false);
    }, 1500);
  };

  const handleStop = () => {
    setRunning(false);
    setTerminalOutput(null);
  };

  const handleFileSelect = (path: string) => {
    setActiveFile(path);
  };

  const sampleCode = `// Sample ${language} code
function main() {
  console.log("Hello, World!");
  return 0;
}

main();`;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Toolbar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          bgcolor: 'rgba(0,0,0,0.3)',
        }}
      >
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={language}
            onChange={(e) => updateLanguage(e.target.value)}
            sx={{
              color: '#fff',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255,255,255,0.2)',
              },
            }}
          >
            <MenuItem value="python">Python</MenuItem>
            <MenuItem value="node">Node.js</MenuItem>
            <MenuItem value="java">Java</MenuItem>
            <MenuItem value="go">Go</MenuItem>
            <MenuItem value="sql">SQL</MenuItem>
            <MenuItem value="bash">Bash</MenuItem>
          </Select>
        </FormControl>

        <Button
          startIcon={running ? <StopIcon /> : <PlayArrowIcon />}
          onClick={running ? handleStop : handleRun}
          disabled={running}
          sx={{
            bgcolor: running ? '#f44336' : '#ff0000',
            color: '#fff',
            textTransform: 'none',
            '&:hover': {
              bgcolor: running ? '#d32f2f' : '#cc0000',
            },
            '&:disabled': {
              bgcolor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          {running ? 'Stop' : 'Run'}
        </Button>

        <Button
          startIcon={<LightbulbIcon />}
          sx={{
            textTransform: 'none',
            color: 'rgba(255,255,255,0.8)',
            '&:hover': {
              bgcolor: 'rgba(255,0,0,0.1)',
            },
          }}
        >
          AI Suggestions
        </Button>

        <FormControl size="small" sx={{ minWidth: 200, ml: 'auto' }}>
          <Select
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value)}
            startAdornment={<HistoryIcon sx={{ mr: 1, fontSize: 16 }} />}
            sx={{
              color: '#fff',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255,255,255,0.2)',
              },
            }}
          >
            {codeVersions.map((version) => (
              <MenuItem key={version} value={version}>
                {version}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Main Editor Area */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: File Tree */}
        <Box sx={{ width: 250, borderRight: '1px solid rgba(255,255,255,0.1)' }}>
          <FileTree
            tree={{
              'index.js': { name: 'index.js', type: 'file' as const },
              'utils.js': { name: 'utils.js', type: 'file' as const },
              'config.js': { name: 'config.js', type: 'file' as const },
            }}
            onFileSelect={handleFileSelect}
            selectedFile={session.activeFile}
          />
        </Box>

        {/* Center: Editor */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            sx={{
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.6)',
                textTransform: 'none',
                minHeight: 40,
                '&.Mui-selected': {
                  color: '#ff0000',
                },
              },
            }}
          >
            <Tab label="index.js" />
            <Tab label="utils.js" />
            <Tab label="config.js" />
          </Tabs>

          {/* Editor */}
          <Box sx={{ flex: 1, position: 'relative' }}>
            <MonacoPlaceholder language={language} value={sampleCode} />
          </Box>

          {/* Terminal */}
          {terminalOpen && (
            <Box sx={{ height: 200, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <MockTerminal output={terminalOutput} loading={running} />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

