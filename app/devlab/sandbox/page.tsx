'use client';

import { Suspense } from 'react';
import { Box } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import DevLabLayout from '../../../components/devlab/DevLabLayout';
import SandboxEditor from '../../../components/devlab/SandboxEditor';

function SandboxContent() {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang');
  const project = searchParams.get('project');

  return (
    <SandboxEditor initialLanguage={lang || undefined} initialProject={project || undefined} />
  );
}

export default function SandboxPage() {
  return (
    <DevLabLayout title="Sandbox">
      <Suspense fallback={<Box sx={{ p: 3 }}>Loading...</Box>}>
        <SandboxContent />
      </Suspense>
    </DevLabLayout>
  );
}

