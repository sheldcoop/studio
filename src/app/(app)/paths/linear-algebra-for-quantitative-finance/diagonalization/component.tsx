
'use client';

import { PageHeader } from "@/components/app/page-header";
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const DiagonalizationVisualizer = dynamic(
  () => import('@/components/app/diagonalization-visualizer'),
  { 
    ssr: false,
    loading: () => <Skeleton className="h-[500px] w-full" />,
  }
);

export default function DiagonalizationPage() {
  return (
    <>
      <PageHeader
        title="Diagonalization: A New Perspective"
        description="Decomposing a complex transformation into three simple steps."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-7xl">
        <DiagonalizationVisualizer />
      </div>
    </>
  );
}
