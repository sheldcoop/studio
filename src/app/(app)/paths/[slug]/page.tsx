
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/app/page-header';
import { getPathById } from '@/lib/learning-paths';
import { Accordion } from '@/components/ui/accordion';
import { LearningPathCard } from '@/components/app/learning-path-card';

type PathPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PathPageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = getPathById(slug);

  if (!path) {
    return {
      title: 'Learning Path Not Found',
    };
  }

  return {
    title: path.title,
    description: path.description,
  };
}

export default async function PathPage({ params }: PathPageProps) {
  const { slug } = await params;
  const path = getPathById(slug);

  if (!path) {
    notFound();
  }
  
  // Check if there are any modules or lessons. If not, show a placeholder.
  if (!path.modules || path.modules.length === 0) {
    return (
       <>
        <PageHeader
          title={path.title}
          description={path.description}
          variant="aligned-left"
        />
        <div className="flex h-96 items-center justify-center rounded-lg border border-dashed mt-8">
            <p className="text-muted-foreground">This learning path is under construction. Content will be added here soon.</p>
        </div>
      </>
    )
  }


  return (
    <>
      <PageHeader
        title={path.title}
        description={path.description}
        variant="aligned-left"
      />
      <Accordion type="single" collapsible className="w-full space-y-4" defaultValue={path.modules[0].id}>
        {path.modules.map((module) => (
          <LearningPathCard key={module.id} module={module} icon={path.icon} />
        ))}
      </Accordion>
    </>
  );
}
