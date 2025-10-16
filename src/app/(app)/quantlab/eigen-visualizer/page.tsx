
'use client';

import { PageHeader } from '@/components/app/page-header';
import { EigenvectorAnimation } from '@/components/linear-algebra-animations/EigenvectorAnimation';

export default function EigenVisualizerPage() {
  return (
    <>
      <PageHeader
        title="Eigenvectors & Eigenvalues"
        description="An Interactive Visualization"
        variant="aligned-left"
      />
      <div className="mx-auto max-w-7xl">
        <EigenvectorAnimation />
      </div>
    </>
  );
}
