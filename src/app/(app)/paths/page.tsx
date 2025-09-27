
import { PageHeader } from '@/components/app/page-header';
import { LearningPathCard } from '@/components/app/learning-path-card';
import { learningPaths } from '@/lib/data';

export default function PathsPage() {
  return (
    <>
      <PageHeader
        title="Learning Paths"
        description="Follow our curated paths to build a solid foundation in quantitative finance."
        variant="aligned-left"
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {learningPaths.map((path) => (
          <LearningPathCard key={path.id} path={path} />
        ))}
      </div>
    </>
  );
}
