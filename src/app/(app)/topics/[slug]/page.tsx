
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/curriculum';
import { TopicPageClient } from '@/components/app/topic-page-client';

type TopicPageProps = {
  params: Promise<{ slug: string }>;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

// This function generates metadata for the page based on the slug.
export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  // Find the topic by its unique ID, which is the slug.
  const topicInfo = allTopics.find((t) => t.id === slug);

  if (!topicInfo) {
    return {
      title: 'Topic Not Found',
    };
  }

  const pageUrl = new URL(topicInfo.href, SITE_URL).toString();

  return {
    title: topicInfo.seoTitle || topicInfo.title,
    description: topicInfo.metaDescription || topicInfo.description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: topicInfo.ogTitle || topicInfo.title,
      description: topicInfo.ogDescription || topicInfo.description,
      url: pageUrl,
      type: 'article',
      images: [
        {
          url: topicInfo.ogImage || new URL('/og-image.png', SITE_URL).toString(),
          width: 1200,
          height: 630,
          alt: topicInfo.title,
        },
      ],
    },
  };
}

// Statically generate all topic pages at build time
export async function generateStaticParams() {
  return allTopics
    .filter(topic => topic.href.startsWith('/topics/')) // Only generate for this route segment
    .map(topic => ({
      slug: topic.id,
    }));
}

// This is the main server component for the page.
export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  
  // Find the topic by its unique ID, which is now the slug. This is the correct way.
  const topicInfo = allTopics.find((t) => t.id === slug);
  
  if (!topicInfo) {
    notFound();
  }

  return <TopicPageClient topicInfo={topicInfo} />;
}
