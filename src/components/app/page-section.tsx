
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageSectionProps {
    id?: string;
    title: string;
    children: ReactNode;
    className?: string;
}

export function PageSection({ id, title, children, className }: PageSectionProps) {
    return (
        <section id={id} className={cn("scroll-mt-24 space-y-8", className)}>
            <h2 className="font-headline text-3xl font-bold border-b pb-4">
                {title}
            </h2>
            {children}
        </section>
    )
}
