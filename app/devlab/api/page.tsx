'use client';

import DevLabLayout from '../../../components/devlab/DevLabLayout';
import ApiBuilderCanvas from '../../../components/devlab/ApiBuilderCanvas';

export default function ApiPage() {
  return (
    <DevLabLayout title="API & Database Studio">
      <ApiBuilderCanvas />
    </DevLabLayout>
  );
}

