import { PageHeader } from '@/components/app/page-header';
import { quantJourney } from '@/lib/data';
import { notFound } from 'next/navigation';

export default function TopicPage({ params }: { params: { slug: string } }) {
  const topic = quantJourney.find((item) => item.id === params.slug);

  if (!topic) {
    notFound();
  }

  return (
    <div className="p-4 md:p-8">
      <PageHeader
        title={topic.title}
        description={`Learn all about ${topic.description.toLowerCase()}`}
      />
       <div className="flex h-96 items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">Topic content will go here.</p>
      </div>
    </div>
  );
}
