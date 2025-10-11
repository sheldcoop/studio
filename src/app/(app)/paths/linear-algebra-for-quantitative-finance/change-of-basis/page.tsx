
import { allTopics } from '@/lib/curriculum';
import { TopicPageClient } from '@/components/app/topic-page-client';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type TopicPageProps = {
  params: Promise<{ pathSlug: string; topicSlug: string }>;
};

// This function generates metadata for the page based on the slug.
export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { topicSlug } = await params;
  const topicInfo = allTopics.find((t) => t.id === topicSlug);

  if (!topicInfo) {
    return {
      title: 'Topic Not Found',
    };
  }

  return {
    title: topicInfo.seoTitle || topicInfo.title,
    description: topicInfo.metaDescription || topicInfo.description,
  };
}

export default async function ChangeOfBasisPage({ params }: TopicPageProps) {
  const { topicSlug } = await params;
  // Find the topic by its unique ID, which is the slug.
  const topicInfo = allTopics.find((t) => t.id === topicSlug);
  
  if (!topicInfo) {
    notFound();
  }

  // Render the generic client page with the structured content.
  return (
      <TopicPageClient topicInfo={topicInfo} />
  );
}
