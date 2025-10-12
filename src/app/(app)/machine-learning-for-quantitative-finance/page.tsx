
import { getPathById } from '@/lib/learning-paths';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/app/page-header';
import { Accordion } from '@/components/ui/accordion';
import { LearningPathCard } from '@/components/app/learning-path-card';

export default function LearningPathPage() {
  const path = getPathById('machine-learning-for-quantitative-finance');

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
      <Accordion type="single" collapsible defaultValue={path.modules[0]?.id}>
        <div className="space-y-4">
          {path.modules.map((module) => (
            <LearningPathCard key={module.id} module={module} iconName={path.icon} />
          ))}
        </div>
      </Accordion>
    </>
  );
}
