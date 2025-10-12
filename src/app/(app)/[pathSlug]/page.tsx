
import { notFound } from 'next/navigation';
import { getPathById, learningPaths } from '@/lib/learning-paths';
import { PageHeader } from '@/components/app/page-header';
import { Accordion } from '@/components/ui/accordion';
import { LearningPathCard } from '@/components/app/learning-path-card';
import type { Metadata } from 'next';

type PathPageProps = {
  params: { pathSlug: string };
};

// Generate static pages for all known learning paths
export async function generateStaticParams() {
  return learningPaths.map((path) => ({
    pathSlug: path.id,
  }));
}

// Generate metadata for the page
export async function generateMetadata({ params }: PathPageProps): Promise<Metadata> {
  const path = getPathById(params.pathSlug);
  if (!path) {
    return { title: 'Path Not Found' };
  }
  return {
    title: path.title,
    description: `Explore the modules and lessons in the ${path.title} learning path. ${path.description}`,
  };
}


export default function PathPage({ params }: PathPageProps) {
  const { pathSlug } = params;
  const path = getPathById(pathSlug);

  if (!path) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title={path.title}
        description={path.description}
        variant="aligned-left"
      />
      <Accordion type="multiple" className="w-full space-y-4">
        {path.modules.map((module) => (
          <LearningPathCard key={module.id} module={module} iconName={path.icon} />
        ))}
      </Accordion>
    </div>
  );
}
