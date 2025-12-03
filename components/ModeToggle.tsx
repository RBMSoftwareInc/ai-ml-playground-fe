'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ToggleButton, ToggleButtonGroup, Box, Toolbar, Link, Typography } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import ExploreIcon from '@mui/icons-material/TravelExplore';
import CMS from '@mui/icons-material/GraphicEq';


export default function ModeSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  // Determine active mode based on path
  const mode = pathname.startsWith('/ai-mode') ? 'ai' : 'classic';

  const handleChange = (_: any, newMode: string | null) => {
    if (newMode) {

      if(newMode === 'ai') {
        router.push('/dashboard/ai')
      } else if(newMode === 'classic') {
        router.push('/dashboard/conventional')
      } else {
        router.push('/dashboard/cms/login')
      }
    }
  };

  return (
    <Box pr={2}>
      <ToggleButtonGroup
        value={mode}
        exclusive
        onChange={handleChange}
        size="small"
        color="primary"
        sx={{ backgroundColor: '#f5f5f5', borderRadius: 2 }}
      >
    


      <ToggleButton value="cms">
        <CMS sx={{ mr: 1 }} />
         CMS
        </ToggleButton>

        <ToggleButton value="ai">
          <SmartToyIcon sx={{ mr: 1 }} />
          AI Mode
        </ToggleButton>
        <ToggleButton value="classic">
          <ExploreIcon sx={{ mr: 1 }} />
          Classic Mode
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
