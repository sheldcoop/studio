
'use client';

import { useState, useEffect } from 'react';
import type { SubTopic } from '@/lib/curriculum';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

export function TableOfContents({ subTopics }: { subTopics: SubTopic[] }) {
    const [activeId, setActiveId] = useState<string | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-20% 0px -80% 0px' }
        );

        const elements = subTopics.map(sub => document.getElementById(sub.id)).filter(Boolean);
        elements.forEach(el => el && observer.observe(el));

        return () => {
            elements.forEach(el => el && observer.unobserve(el));
        };
    }, [subTopics]);

    return (
        <aside className="sticky top-24 h-fit w-64 flex-shrink-0 hidden lg:block">
            <h3 className="font-semibold mb-4">On this page</h3>
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
                                "flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
                                activeId === sub.id && "font-medium text-primary"
                            )}
                        >
                            <CheckCircle className={cn("h-4 w-4", activeId === sub.id ? "text-primary" : "text-muted-foreground/50")} />
                            <span>{sub.title}</span>
                        </a>
                    </li>
                ))}
            </ul>
             <div className="mt-8">
                <h4 className="font-semibold mb-2 text-sm">Related Topics</h4>
                 <div className="flex h-20 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
                    <p className="text-xs text-muted-foreground">Coming Soon</p>
                </div>
             </div>
        </aside>
    )
}
