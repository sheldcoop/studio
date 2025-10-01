'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { type Topic, type SubTopic } from '@/lib/curriculum';
import { cn } from '@/lib/utils';
import { InteractiveTestWrapper } from '@/components/app/interactive-test-wrapper';

function TableOfContents({ subTopics }: { subTopics: SubTopic[] }) {
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            let currentId: string | null = null;
            for (const subTopic of subTopics) {
                const element = document.getElementById(subTopic.id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // Check if the top of the element is within a certain range of the viewport top
                    if (rect.top >= 0 && rect.top <= 200) {
                        currentId = subTopic.id;
                        break;
                    }
                }
            }
             if (!currentId && window.scrollY === 0) {
                currentId = subTopics[0]?.id || null;
            }
            setActiveId(currentId);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Set initial active link

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [subTopics]);

    return (
        <aside className="sticky top-24 h-fit w-64 flex-shrink-0">
            <h3 className="font-semibold mb-2">On this page</h3>
            <ul className="space-y-2">
                {subTopics.map((sub) => (
                    <li key={sub.id}>
                        <a 
                            href={`#${sub.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(sub.id)?.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start'
                                });
                            }}
                            className={cn(
                                "block text-sm text-muted-foreground transition-colors hover:text-foreground",
                                activeId === sub.id && "font-medium text-primary"
                            )}
                        >
                            {sub.title}
                        </a>
                    </li>
                ))}
            </ul>
        </aside>
    )
}

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
  const { title, description, subTopics, interactiveExamples, content } = topicInfo;

  // Render interactive test page if examples are available
  if (interactiveExamples) {
      return <InteractiveTestWrapper topic={topicInfo} />;
  }

  // If there ARE sub-topics, render the two-column layout with a table of contents.
  if (subTopics && subTopics.length > 0) {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:gap-16">
                <div className="flex-1 min-w-0">
                    <PageHeader title={title} description={description} variant="aligned-left" />
                    <article className="prose prose-invert max-w-none space-y-12">
                        {subTopics.map(sub => (
                            <section key={sub.id} id={sub.id} className="scroll-mt-24">
                                <h2 className="font-headline text-2xl font-semibold">{sub.title}</h2>
                                <div className="my-8 flex h-60 items-center justify-center rounded-lg border border-dashed">
                                    <p className="text-sm text-muted-foreground/50">Content for this section is under construction.</p>
                                </div>
                            </section>
                        ))}
                    </article>
                </div>
                <TableOfContents subTopics={subTopics} />
            </div>
        </div>
    );
  }

  // If there are no sub-topics and no interactive examples, treat it as a simple content page.
  // This will now correctly render the placeholder.
  return <SimpleContentPage topicInfo={topicInfo} />;
}
