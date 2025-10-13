
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/data';
import { TopicPageClient } from '@/components/app/topic-page-client';

const PATH_ID = 'linear-algebra-for-quantitative-finance';

// Define slugs that have dedicated pages and should be excluded from this generic route.
const EXCLUDED_SLUGS = new Set(['the-two-views-of-a-vector']);

type TopicPageProps = {
  params: Promise<{ topicSlug: string }>;
};

// This function tells Next.js which slugs to pre-render at build time.
export async function generateStaticParams() {
  return allTopics
    .filter(topic => {
      // Exclude the slugs that have their own dedicated page files.
      if (EXCLUDED_SLUGS.has(topic.id)) {
        return false;
      }
      
      // Find the ultimate parent path for each topic
      let current = topic;
      while (current.parent) {
        const parentTopic = allTopics.find(t => t.id === current.parent);
        if (!parentTopic) break;
        if (parentTopic.id === PATH_ID) {
          return true;
        }
        current = parentTopic;
      }
      return topic.parent === PATH_ID || current.id === PATH_ID;
    })
    .map(topic => ({
      topicSlug: topic.id,
    }));
}


// This function generates metadata for the page based on the slug.
export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { topicSlug } = await params;
  const topicInfo = allTopics.find((t) => t.id === topicSlug);
  
  if (!topicInfo || EXCLUDED_SLUGS.has(topicSlug)) {
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
  
  // If the slug is for a dedicated page, trigger a 404 to let Next.js find the dedicated page.
  if (EXCLUDED_SLUGS.has(topicSlug)) {
    notFound();
  }

  const topicInfo = allTopics.find((t) => t.id === topicSlug);
  
  if (!topicInfo) {
    notFound();
  }

  return <TopicPageClient topicInfo={topicInfo} />;
}
