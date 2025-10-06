
'use client';

import { PageHeader } from "@/components/app/page-header";
import GramSchmidtVisualizer from "@/components/app/gram-schmidt-visualizer";

export default function GramSchmidtPage() {
  return (
    <>
      <PageHeader
        title="Gram-Schmidt: The Art of Tidying Up"
        description="An interactive visualizer for creating an orthogonal basis from any set of linearly independent vectors."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-7xl">
        <GramSchmidtVisualizer />
      </div>
    </>
  );
}
