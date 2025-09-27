
import { PageHeader } from '@/components/app/page-header';
import { LearningPathCard } from '@/components/app/learning-path-card';
import { learningPaths } from '@/lib/data';
import {
  Accordion
} from '@/components/ui/accordion';

export default function PathsPage() {
  return (
    <>
      <PageHeader
        title="Learning Paths"
        description="Follow our curated paths to build a solid foundation in quantitative finance."
        variant="aligned-left"
      />
      <Accordion type="single" collapsible className="w-full space-y-4">
        {learningPaths.map((path) => (
          <LearningPathCard key={path.id} path={path} />
        ))}
      </Accordion>
    </>
  );
}
