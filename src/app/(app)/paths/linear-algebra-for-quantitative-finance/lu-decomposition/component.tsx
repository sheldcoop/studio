
'use client';

import { PageHeader } from "@/components/app/page-header";
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const LUDecompositionVisualizer = dynamic(
  () => import('@/components/app/lu-decomposition-visualizer'),
  { 
    ssr: false,
    loading: () => <Skeleton className="h-[500px] w-full" />,
  }
);

export default function LUDecompositionPage() {
  return (
    <>
      <PageHeader
        title="LU Decomposition: A Tale of Two Steps"
        description="Factoring a complex problem into two simple ones."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-7xl">
        <LUDecompositionVisualizer />
      </div>
    </>
  );
}
