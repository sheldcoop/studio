
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/curriculum';
import { TopicPageClient } from '@/components/app/topic-page-client';

const siteUrl = process.env.SITE_URL || 'https://quantfinancelab.com';

type TopicPageProps = {
  params: { slug: string };
};

// Statically generate all topic pages at build time.
// This is crucial for performance and SEO.
export async function generateStaticParams() {
  return allTopics
    .filter(topic => !topic.href.includes('/paths/')) // Only generate for the /topics/ route segment
    .map(topic => ({
      slug: topic.id,
    }));
}

// Enable Incremental Static Regeneration (ISR).
// This allows pages to be updated after deployment without a full rebuild.
// A value of 60 means pages can be revalidated at most once every 60 seconds.
export const revalidate = 60;

// This function generates metadata for the page based on the slug.
export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { slug } = params;
  const topicInfo = allTopics.find((t) => t.id === slug);

  if (!topicInfo) {
    return {
      title: 'Topic Not Found',
    };
  }

  const topicUrl = `${siteUrl}${topicInfo.href}`;

  return {
    title: topicInfo.title,
    description: topicInfo.description,
    alternates: {
        canonical: topicUrl,
    },
    openGraph: {
        title: `${topicInfo.title} | QuantPrep`,
        description: topicInfo.description,
        url: topicUrl,
        type: 'article',
    }
  };
}

// This is the main server component for the page.
export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = params;
  
  // Find the topic by its unique ID, which is the slug.
  const topicInfo = allTopics.find((t) => t.id === slug);
  
  if (!topicInfo) {
    notFound();
  }

  return <TopicPageClient topicInfo={topicInfo} />;
}
