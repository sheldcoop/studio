
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/curriculum';
import { TopicPageClient } from '@/components/app/topic-page-client';

type TopicPageProps = {
  params: { slug: string };
};

// This function MUST be in a server component.
export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const path = `/topics/${params.slug}`;
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

// This is now a Server Component.
// It fetches the data on the server and passes it to the client component.
export default function TopicPage({ params }: TopicPageProps) {
  const path = `/topics/${params.slug}`;
  const topicInfo = allTopics.find((t) => t.href === path);
  
  if (!topicInfo) {
    notFound();
  }

  // Destructure the topicInfo object to remove the non-serializable 'icon' property
  // before passing it to the client component. This prevents server/client prop errors.
  const { icon, ...serializableTopicInfo } = topicInfo;
  
  return <TopicPageClient topicInfo={serializableTopicInfo} />;
}
