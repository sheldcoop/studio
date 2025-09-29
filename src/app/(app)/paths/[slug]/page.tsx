
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/app/page-header';
import { getPathById } from '@/lib/learning-paths';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

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
  
  // Check if there are any modules or lessons. If not, show a placeholder.
  if (!path.modules || path.modules.length === 0 || !path.modules[0] || path.modules[0].lessons.length === 0) {
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
      <Card>
        <CardContent className="p-6">
          <ul className="space-y-2">
            {path.modules[0].lessons.map((lesson) => (
              <li key={lesson.id}>
                <Link
                  href={lesson.href}
                  className="group flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-secondary/50"
                >
                  <span className="text-lg font-medium text-foreground/90 group-hover:text-foreground">
                    {lesson.title}
                  </span>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
