
import { TopicPageClient } from '@/components/app/topic-page-client';
import { allTopics, type Topic } from '@/lib/data';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// This is the main server component for the page.
export default async function ChangeOfBasisPage() {
  // Find the topic by its unique ID.
  const topicInfo = allTopics.find((t) => t.id === 'change-of-basis');
  
  if (!topicInfo) {
    notFound();
  }

  return <TopicPageClient topicInfo={topicInfo} />;
}

export async function generateMetadata(): Promise<Metadata> {
  const topicInfo = allTopics.find((t) => t.id === 'change-of-basis');

  if (!topicInfo) {
    return {
      title: 'Topic Not Found',
    };
  }

  return {
    title: topicInfo.title,
    description: topicInfo.description,
  };
}
