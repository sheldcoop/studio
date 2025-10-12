

import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/data';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Hourglass } from 'lucide-react';
import type { Metadata } from 'next';
import { TopicPageClient } from '@/components/app/topic-page-client';
import { type Topic } from '@/lib/curriculum';

type TopicPageProps = {
  params: {
    topicSlug: string;
    pathSlug: string;
  };
};

export async function generateStaticParams() {
  // Generate params for all visitable topics that don't have a dedicated file.
  // This is now safer because this page only handles `/topics/...` routes.
  return allTopics
    .filter(topic => {
      // We only want to generate params for topics that are designed to use this dynamic template.
      // The `createTopic` utility now adds `/topics/` to the href for these.
      return topic.href.startsWith('/topics/');
    })
    .map(topic => {
      const parts = topic.href.split('/').filter(Boolean);
      // Expected structure: /topics/[pathSlug]/[topicSlug]
      if (parts.length === 3 && parts[0] === 'topics') {
        return {
          pathSlug: parts[1],
          topicSlug: parts[2],
        };
      }
      return null;
    })
    .filter(p => p !== null);
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { topicSlug } = params;
  const topicInfo = allTopics.find(t => t.id === topicSlug);

  if (!topicInfo) {
    return { title: 'Topic Not Found' };
  }

  const title = topicInfo.seoTitle || topicInfo.title;
  const description = topicInfo.metaDescription || `Learn about ${topicInfo.title}. ${topicInfo.description}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: topicInfo.href,
    },
  };
}

const findTopic = (topicSlug: string): Topic | undefined => {
    return allTopics.find(t => t.id === topicSlug);
}

export default function TopicPage({ params }: TopicPageProps) {
  const { topicSlug } = params;
  const topicInfo = findTopic(topicSlug);

  if (!topicInfo) {
    notFound();
  }

  // If the topic has detailed sub-topics or interactive examples, use the full-featured client component.
  if ((topicInfo.subTopics && topicInfo.subTopics.length > 0) || topicInfo.interactiveExamples) {
      return <TopicPageClient topicInfo={topicInfo} />;
  }

  // Otherwise, render the simple placeholder.
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title={topicInfo.title}
        description={topicInfo.description}
        variant="aligned-left"
      />
      <Card>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center h-96">
            <Hourglass className="h-12 w-12 text-muted-foreground animate-spin" />
            <p className="mt-4 font-semibold">
              Full Lesson Coming Soon!
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              This interactive lesson is currently under development. Check back later for in-depth theory, applications, and practice problems.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
