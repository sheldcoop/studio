
'use client';

import { PageHeader } from "@/components/app/page-header";
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// This component is ALREADY dynamically imported by the [slug] page.
// The dynamic import for the visualizer itself should be here.
const GaussianEliminationVisualizer = dynamic(
  () => import('@/components/app/gaussian-elimination-visualizer'),
  { 
    ssr: false,
    loading: () => <Skeleton className="h-[500px] w-full" />,
  }
);

export default function GaussianEliminationPage() {
  return (
    <>
      <PageHeader
        title="Gaussian Elimination: A Dance of Lines"
        description="An interactive visualizer for solving systems of linear equations using row operations."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-7xl">
        <GaussianEliminationVisualizer />
      </div>
    </>
  );
}
