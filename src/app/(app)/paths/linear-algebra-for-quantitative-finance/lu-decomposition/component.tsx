
'use client';

import { PageHeader } from "@/components/app/page-header";
import LUDecompositionVisualizer from "@/components/app/lu-decomposition-visualizer";

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
