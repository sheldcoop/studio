'use client';

import { PageHeader } from '@/components/app/page-header';

export default function MonteCarloSimulationPage() {
  return (
    <div className="mx-auto max-w-4xl">
        <PageHeader title="Monte Carlo Simulation" description="Using randomness to solve problems that are difficult or impossible to solve analytically." variant="aligned-left" />
        <div className="flex h-96 items-center justify-center rounded-lg border border-dashed mt-8">
            <p className="text-muted-foreground">This topic is under construction. Content will be added here soon.</p>
        </div>
    </div>
  );
}
