
import type { Metadata } from 'next';
import { PageHeader } from '@/components/app/page-header';
import { getPathById } from '@/lib/learning-paths';
import { Accordion } from '@/components/ui/accordion';
import { LearningPathCard } from '@/components/app/learning-path-card';

export const metadata: Metadata = {
  title: 'QuantLab',
  description: 'Explore interactive tools and visualizations for core quantitative finance concepts, from probability distributions to statistical analysis.',
};

export default async function QuantLabPage() {
  const quantLabPath = getPathById('quantlab');

  if (!quantLabPath || !quantLabPath.modules) {
    return (
      <div>
        <PageHeader
          title="QuantLab"
          description="Interactive tools for hands-on probability, statistics, and financial modeling."
          variant="aligned-left"
        />
        <p>No tools available at the moment.</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="QuantLab"
        description="Interactive tools for hands-on probability, statistics, and financial modeling."
        variant="aligned-left"
      />
      <Accordion type="multiple" className="w-full space-y-4" defaultValue={['prob-core-tools']}>
        {quantLabPath.modules.map(module => (
          <LearningPathCard key={module.id} module={module} iconName={quantLabPath.icon} />
        ))}
      </Accordion>
    </>
  );
}
