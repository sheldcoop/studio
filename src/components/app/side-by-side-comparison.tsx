
import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ComparisonItemProps {
    title: string;
    children: ReactNode;
}

export function SideBySideComparison({ children }: { children: ReactNode }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {children}
        </div>
    )
}

export function ComparisonItem({ title, children }: ComparisonItemProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">{title}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none text-muted-foreground">
                {children}
            </CardContent>
        </Card>
    )
}
