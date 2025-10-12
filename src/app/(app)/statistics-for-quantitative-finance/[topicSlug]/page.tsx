
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/data';
import { TopicPageClient } from '@/components/app/topic-page-client';

const PATH_ID = 'statistics-for-quantitative-finance';

type TopicPageProps = {
  params: Promise<{ topicSlug: string }>;
};

// This function tells Next.js which slugs to pre-render at build time.
export async function generateStaticParams() {
  return allTopics
    .filter(topic => {
      // Find the ultimate parent path for each topic
      let current = topic;
      let topLevelParent = current.parent;
      while (current.parent) {
        const parentTopic = allTopics.find(t => t.id === current.parent);
        if (parentTopic && parentTopic.parent) {
          current = parentTopic;
          topLevelParent = parentTopic.parent;
        } else {
          break;
        }
      }
      return topLevelParent === PATH_ID || topic.parent === PATH_ID;
    })
    .map(topic => ({
      topicSlug: topic.id,
    }));
}

// This function generates metadata for the page based on the slug.
export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { topicSlug } = await params;
  const topicInfo = allTopics.find((t) => t.id === topicSlug);
  
  if (!topicInfo) {
    return { title: 'Topic Not Found' };
  }

  return {
    title: topicInfo.title,
    description: topicInfo.description,
  };
}

// This is the main server component for the page.
export default async function TopicPage({ params }: TopicPageProps) {
  const { topicSlug } = await params;
  const topicInfo = allTopics.find((t) => t.id === topicSlug);
  
  if (!topicInfo) {
    notFound();
  }

  return <TopicPageClient topicInfo={topicInfo} />;
}
