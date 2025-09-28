
import type { Metadata } from 'next';
import { PageHeader } from '@/components/app/page-header';
import { allTopics } from '@/lib/topics';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: { slug: string, topic: string };
}): Promise<Metadata> {
  const { slug, topic } = params;
  const path = `/${topic}/${slug}`;
  const topicInfo = allTopics.find((t) => t.href === path);

  if (!topicInfo) {
    return {
      title: 'Topic Not Found',
      description: 'The requested topic could not be found.',
    };
  }

  return {
    title: topicInfo.title,
    description: topicInfo.description,
  };
}

export default async function TopicPage({
  params,
}: {
  params: { slug: string, topic: string };
}) {
  const { slug, topic } = params;
  const path = `/${topic}/${slug}`;

  const topicInfo = allTopics.find((t) => t.href === path);
  
  if (!topicInfo) {
    notFound();
  }
  
  const { title, description } = topicInfo;

  return (
    <div>
      <PageHeader title={title} description={description} variant="aligned-left" />

      <div className="flex h-96 items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">Topic content will go here.</p>
      </div>
    </div>
  );
}
