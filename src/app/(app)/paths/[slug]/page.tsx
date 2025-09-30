
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/app/page-header';
import { getPathById } from '@/lib/learning-paths';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { LessonItem } from '@/components/app/lesson-item';

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
        {path.modules.map(module => (
          <AccordionItem value={module.id} key={module.id} className="rounded-lg border bg-card text-card-foreground shadow-sm">
             <AccordionTrigger className="p-6 text-left hover:no-underline">
                <h3 className="font-headline text-xl font-semibold">{module.title}</h3>
             </AccordionTrigger>
             <AccordionContent className="p-0 pt-2">
                <ul className="divide-y divide-border">
                    {module.lessons.map((lesson) => (
                      <LessonItem key={lesson.id} lesson={lesson} />
                    ))}
                </ul>
             </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
