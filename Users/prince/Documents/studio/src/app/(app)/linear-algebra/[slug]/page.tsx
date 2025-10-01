
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/curriculum';
import { TopicPageClient } from '@/components/app/topic-page-client';

type TopicPageProps = {
  params: { slug: string };
};

// This function generates metadata for the page based on the slug.
export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const path = `/linear-algebra-for-quantitative-finance/${params.slug}`;
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

// This is the main server component for the page.
export default function TopicPage({ params }: TopicPageProps) {
  const path = `/linear-algebra-for-quantitative-finance/${params.slug}`;
  const topicInfo = allTopics.find((t) => t.href === path);
  
  if (!topicInfo) {
    notFound();
  }

  // Destructure to remove non-serializable 'icon' property before passing to client.
  const { icon, ...serializableTopicInfo } = topicInfo;
  
  return <TopicPageClient topicInfo={serializableTopicInfo} />;
}
