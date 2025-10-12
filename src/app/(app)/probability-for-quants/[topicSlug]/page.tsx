
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/data';
import { TopicPageClient } from '@/components/app/topic-page-client';

const PATH_ID = 'probability-for-quants';

type TopicPageProps = {
  params: Promise<{ topicSlug: string }>;
};

// This function tells Next.js which slugs to pre-render at build time.
export async function generateStaticParams() {
  return allTopics
    .filter(topic => {
        // This logic finds the ultimate ancestor of a topic to match it to the path.
        let current = topic;
        let topLevelParent = current.parent;
        while(current.parent) {
            const parentTopic = allTopics.find(t => t.id === current.parent);
            if (parentTopic && parentTopic.parent) {
                current = parentTopic;
            } else {
                topLevelParent = current.parent;
                break;
            }
        }
        return topLevelParent === PATH_ID;
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
