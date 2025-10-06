
'use client';

import dynamic from "next/dynamic";
import { PageHeader } from "@/components/app/page-header";
import { Skeleton } from "@/components/ui/skeleton";

const VectorProjectionVisualizer = dynamic(
  () => import('@/components/app/vector-projection-visualizer'),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-[700px]" />,
  }
);

export default function VectorProjectionComponent() {
  return (
    <>
      <PageHeader
        title="Vector Projection: The Story of a Shadow"
        description="Understand how to decompose vectors into orthogonal components by visualizing them as shadows."
        variant="aligned-left"
      />
      <VectorProjectionVisualizer />
    </>
  );
}
