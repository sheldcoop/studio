
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/app/page-header';
import { getPathById } from '@/lib/learning-paths';
import { Accordion } from '@/components/ui/accordion';
import { LearningPathCard } from '@/components/app/learning-path-card';

type PathPageProps = {
  params: Promise<{
    pathSlug: string;
  }>;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';


export async function generateMetadata({ params }: PathPageProps): Promise<Metadata> {
  const { pathSlug } = await params;
  const path = getPathById(pathSlug);

  if (!path) {
    return {
      title: 'Learning Path Not Found',
    };
  }

  const pageUrl = new URL(`/paths/${pathSlug}`, SITE_URL).toString();

  return {
    title: path.title,
    description: path.description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: path.title,
      description: path.description,
      url: pageUrl,
      type: 'website',
       images: [
        {
          url: new URL('/og-image.png', SITE_URL).toString(),
          width: 1200,
          height: 630,
          alt: path.title,
        },
      ],
    },
  };
}

export default async function PathPage({ params }: PathPageProps) {
  const { pathSlug } = await params;
  const path = getPathById(pathSlug);

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
          <LearningPathCard key={module.id} module={module} iconName={path.icon} />
        ))}
      </Accordion>
    </>
  );
}
