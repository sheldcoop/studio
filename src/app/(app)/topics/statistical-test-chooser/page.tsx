
'use client';

import { ReactFlowProvider } from 'reactflow';
import { Flow } from '@/components/app/statistical-test-flow';

export default function StatisticalTestChooserPage() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  )
}
