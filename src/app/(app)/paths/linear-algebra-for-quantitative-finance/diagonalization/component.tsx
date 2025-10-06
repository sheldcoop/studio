
'use client';

import { PageHeader } from "@/components/app/page-header";
import DiagonalizationVisualizer from "@/components/app/diagonalization-visualizer";

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
