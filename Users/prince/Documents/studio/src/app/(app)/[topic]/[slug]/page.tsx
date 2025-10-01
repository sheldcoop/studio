
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/curriculum';
import { TopicPageClient } from '@/components/app/topic-page-client';

type TopicPageProps = {
  params: { topic: string; slug: string };
};

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const path = `/${params.topic}/${params.slug}`;
  const topicInfo = allTopics.find((t) => t.href === path);

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

export default function TopicPage({ params }: TopicPageProps) {
  const path = `/${params.topic}/${params.slug}`;
  const topicInfo = allTopics.find((t) => t.href === path);
  
  if (!topicInfo) {
    notFound();
  }

  const { icon, ...serializableTopicInfo } = topicInfo;
  
  return <TopicPageClient topicInfo={serializableTopicInfo} />;
}
