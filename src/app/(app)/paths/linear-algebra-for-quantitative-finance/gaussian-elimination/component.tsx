
'use client';

import { PageHeader } from "@/components/app/page-header";
import GaussianEliminationVisualizer from "@/components/app/gaussian-elimination-visualizer";

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
