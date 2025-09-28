
'use client';

import { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/app/page-header';
import { allTopics, type SubTopic } from '@/lib/curriculum';
import { notFound, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';


// Note: generateMetadata is a server-side function and cannot use hooks.
// We are keeping this simple for now. For dynamic metadata based on the client-side
// determined topic, you would typically fetch metadata in a client component
// and update the document head using a library like 'react-helmet' or Next.js's 'Head'.
// export async function generateMetadata({
//   params,
// }: {
//   params: { slug: string, topic: string };
// }): Promise<Metadata> {
//   const { slug, topic: topicSlug } = params;
//   const path = `/${topicSlug}/${slug}`;
//   const topicInfo = allTopics.find((t) => t.href === path);

//   if (!topicInfo) {
//     return {
//       title: 'Topic Not Found',
//     };
//   }

//   return {
//     title: topicInfo.title,
//     description: topicInfo.description,
//   };
// }

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

export default function TopicPage() {
  const pathname = usePathname();
  const topicInfo = allTopics.find((t) => t.href === pathname);
  
  if (!topicInfo) {
    notFound();
  }
  
  const { title, description, subTopics } = topicInfo;

  // If there are no sub-topics, just render the simple placeholder.
  if (!subTopics || subTopics.length === 0) {
      return (
        <div className="mx-auto max-w-4xl">
            <PageHeader title={title} description={description} variant="aligned-left" />
            <div className="flex h-96 items-center justify-center rounded-lg border border-dashed mt-8">
                <p className="text-muted-foreground">Topic content will go here.</p>
            </div>
        </div>
      );
  }

  // If there ARE sub-topics, render the two-column layout
  return (
    <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:gap-16">
            <div className="flex-1 min-w-0">
                <PageHeader title={title} description={description} variant="aligned-left" />
                <article className="prose prose-invert max-w-none space-y-12">
                    {subTopics.map(sub => (
                        <section key={sub.id} id={sub.id} className="scroll-mt-24">
                            <h2 className="font-headline text-2xl font-semibold">{sub.title}</h2>
                            <p className="text-muted-foreground">
                                Placeholder content for {sub.title}. In a real application, this section would contain detailed explanations, examples, and interactive components related to this specific sub-topic. This structure allows for a rich, comprehensive guide on a single page, which is great for user experience and SEO.
                            </p>
                             <div className="my-8 flex h-60 items-center justify-center rounded-lg border border-dashed">
                                <p className="text-sm text-muted-foreground/50">Visual or interactive element</p>
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
