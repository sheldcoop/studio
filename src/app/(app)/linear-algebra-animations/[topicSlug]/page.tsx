
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/data';
import { TopicPageClient } from '@/components/app/topic-page-client';
import VisualizingDeterminantPage from '@/app/(app)/linear-algebra-animations/visualizing-determinant/page';

const componentMap: { [key: string]: React.ComponentType } = {
  'visualizing-determinant': VisualizingDeterminantPage,
};


type TopicPageProps = {
  params: Promise<{ topicSlug: string }>;
};

// This function tells Next.js which slugs to pre-render at build time.
export async function generateStaticParams() {
  return allTopics
    .filter(topic => topic.parent === 'la-anim-module-1' || topic.parent === 'la-module-3') // Include our new topic
    .filter(topic => topic.id === 'visualizing-determinant') // Only generate for this specific page for now
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

  const ComponentToRender = componentMap[topicSlug];

  if (ComponentToRender) {
    return <ComponentToRender />;
  }
  
  return <TopicPageClient topicInfo={topicInfo} />;
}
