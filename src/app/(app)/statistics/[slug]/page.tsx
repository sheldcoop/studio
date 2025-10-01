
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/curriculum';
import { TopicPageClient } from '@/components/app/topic-page-client';

// This function MUST be in a server component.
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const path = `/statistics/${params.slug}`;
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
export default function TopicPage({ params }: { params: { slug: string } }) {
  const path = `/statistics/${params.slug}`;
  const topicInfo = allTopics.find((t) => t.href === path);
  
  if (!topicInfo) {
    notFound();
  }

  // Destructure the topicInfo object to remove the non-serializable 'icon' property
  // before passing it to the client component.
  const { icon, ...serializableTopicInfo } = topicInfo;
  
  return <TopicPageClient topicInfo={serializableTopicInfo} />;
}
