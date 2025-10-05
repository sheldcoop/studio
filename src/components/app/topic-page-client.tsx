
'use client';

import { PageHeader } from '@/components/app/page-header';
import { type Topic, type SubTopic } from '@/lib/curriculum';
import { InteractiveTestWrapper } from '@/components/app/interactive-test-wrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TableOfContents } from './table-of-contents';
import { TopicRoadmap } from './topic-roadmap';
import { TopicContentSection } from './topic-content-section';
import { TopicResources } from './topic-resources';
import { TopicCommunityQA } from './topic-community-qa';


function SimpleContentPage({ topicInfo }: { topicInfo: Topic }) {
  const { title, description, content } = topicInfo;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
        <PageHeader title={title} description={description} variant="aligned-left" />
        {content ? (
             <div className="prose prose-invert max-w-none space-y-8" dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
            <div className="flex h-96 items-center justify-center rounded-lg border border-dashed mt-8">
                <p className="text-muted-foreground">This topic is under construction. Content will be added here soon.</p>
            </div>
        )}
    </div>
  );
}


export function TopicPageClient({ topicInfo }: { topicInfo: Topic }) {
  const { title, description, subTopics } = topicInfo;

  // Render interactive test page if examples are available
  if (topicInfo.interactiveExamples) {
      return <InteractiveTestWrapper topic={topicInfo} />;
  }

  // If there ARE sub-topics, render the new, detailed structure.
  if (subTopics && subTopics.length > 0) {
    const completedConcepts = subTopics.length > 3 ? 1 : 0; // Simulate some progress
    const totalConcepts = subTopics.length;
    const progress = (completedConcepts / totalConcepts) * 100;
    const estimatedTime = totalConcepts * 15; // Placeholder time

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:gap-16">
                <div className="flex-1 min-w-0">
                    {/* 1. Hero Section */}
                    <PageHeader title={title} description={description} variant="aligned-left" />
                    <Card className="mb-8">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Progress</p>
                                <p className="font-bold text-lg text-primary">{completedConcepts}/{totalConcepts} Concepts Completed</p>
                            </div>
                            <div className="w-1/3">
                                <Progress value={progress} />
                            </div>
                            <div className="text-right">
                                 <p className="text-sm font-medium text-muted-foreground">Est. Time</p>
                                <p className="font-bold text-lg">{Math.floor(estimatedTime / 60)}h {estimatedTime % 60}m</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2. Learning Path / Table of Contents (Visual Roadmap) */}
                     <div className="mb-12">
                        <h2 className="font-headline text-2xl font-bold mb-4">Learning Roadmap</h2>
                        <TopicRoadmap subTopics={subTopics} completedConcepts={completedConcepts} />
                    </div>


                    {/* 3. Content Area */}
                    <article className="space-y-16">
                        {subTopics.map(sub => (
                           <TopicContentSection key={sub.id} subTopic={sub} />
                        ))}
                    </article>
                    
                    {/* 4. Additional Resources & Q&A */}
                    <div className="mt-16 space-y-12">
                        <TopicResources />
                        <TopicCommunityQA />
                    </div>

                </div>
                {/* 5. Sticky Sidebar */}
                <TableOfContents subTopics={subTopics} />
            </div>
        </div>
    );
  }

  // If there are no sub-topics and no interactive examples, treat it as a simple content page.
  return <SimpleContentPage topicInfo={topicInfo} />;
}
