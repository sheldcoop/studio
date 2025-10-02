
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/app/page-header';
import { getPathById } from '@/lib/learning-paths';
import { Accordion } from '@/components/ui/accordion';
import { LearningPathCard } from '@/components/app/learning-path-card';

export const metadata: Metadata = {
  title: 'Probability for Quants & Data Scientists',
  description: 'Master random variables, distributions, and stochastic processes for modeling and analysis.',
};

export default function ProbabilityPage() {
    const path = getPathById('probability-for-quants');

    if (!path) {
        notFound();
    }

  return (
    <>
      <PageHeader
        title={path.title}
        description={path.description}
        variant="aligned-left"
      />
      <Accordion type="single" collapsible className="w-full space-y-4" defaultValue={path.modules[0]?.id}>
        {path.modules.map((module) => (
          <LearningPathCard key={module.id} module={module} iconName={path.icon} />
        ))}
      </Accordion>
    </>
  );
}
