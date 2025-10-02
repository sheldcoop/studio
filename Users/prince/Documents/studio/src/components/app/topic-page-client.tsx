
'use client';

import { type Topic } from '@/lib/curriculum';
import { InteractiveTestWrapper } from '@/components/app/interactive-test-wrapper';
import { TopicPageSkeleton } from './topic/topic-page-skeleton';
import { PageHeader } from '@/components/app/page-header';
import { ProgressCard } from './topic/progress-card';
import { LearningRoadmap } from './topic/learning-roadmap';
import { TopicSection } from './topic/topic-section';
import { ResourcesAndQA } from './topic/resources-and-qa';
import { TableOfContents } from './topic/table-of-contents';

function SimpleContentPage({ topicInfo }: { topicInfo: Topic }) {
  const { title, description, content } = topicInfo;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
        <PageHeader title={title} description={description} variant="aligned-left" />
        {content ? (
             <div className="prose prose-invert max-w-none space-y-8">
                {/* 
                  SECURITY FIX: Replaced dangerouslySetInnerHTML.
                  A proper markdown rendering solution (e.g., react-markdown) should be used here.
                  For now, we render the content as plain text to mitigate XSS risk.
                */}
                <p>{content.replace(/<[^>]*>?/gm, '')}</p>
             </div>
        ) : (
            <div className="flex h-96 items-center justify-center rounded-lg border border-dashed mt-8">
                <p className="text-muted-foreground">This topic is under construction. Content will be added here soon.</p>
            </div>
        )}
    </div>
  );
}


export function TopicPageClient({ topicInfo }: { topicInfo: Topic }) {
  // 4. Proper Error Boundary Check
  if (!topicInfo) {
      return (
          <div className="flex h-96 items-center justify-center rounded-lg border border-dashed mt-8">
              <p className="text-destructive">Error: Topic data could not be loaded.</p>
          </div>
      );
  }

  const { title, description, subTopics, interactiveExamples, content } = topicInfo;

  // Render interactive test page if examples are available
  if (interactiveExamples) {
      return <InteractiveTestWrapper topic={topicInfo} />;
  }

  // If there ARE sub-topics, render the new, detailed structure.
  if (subTopics && subTopics.length > 0) {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:gap-16">
                <div className="flex-1 min-w-0">
                    <PageHeader title={title} description={description} variant="aligned-left" />
                    <ProgressCard subTopics={subTopics} />
                    <LearningRoadmap subTopics={subTopics} />
                    <article className="space-y-16">
                        {subTopics.map(sub => (
                            <TopicSection key={sub.id} subTopic={sub} />
                        ))}
                    </article>
                    <ResourcesAndQA />
                </div>
                <TableOfContents subTopics={subTopics} />
            </div>
        </div>
    );
  }

  // If there are no sub-topics and no interactive examples, treat it as a simple content page.
  return <SimpleContentPage topicInfo={topicInfo} />;
}
