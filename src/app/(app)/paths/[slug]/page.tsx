import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/app/page-header';
import { LearningPathCard } from '@/components/app/learning-path-card';
import { getPathById } from '@/lib/learning-paths';
import { Accordion } from '@/components/ui/accordion';

type PathPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: PathPageProps): Promise<Metadata> {
  const path = getPathById(params.slug);

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

export default function PathPage({ params }: PathPageProps) {
  const path = getPathById(params.slug);

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
      <Accordion type="single" collapsible className="w-full space-y-4">
        <LearningPathCard path={path} />
      </Accordion>
    </>
  );
}
