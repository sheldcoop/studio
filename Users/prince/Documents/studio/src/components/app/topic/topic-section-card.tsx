
'use client';

import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TopicSectionCardProps {
    icon: LucideIcon;
    title: string;
    isEmpty?: boolean;
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 m-6 mt-0">
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    )
}

export function TopicSectionCard({ icon: Icon, title, isEmpty = false }: TopicSectionCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Icon className="text-primary"/> {title}</CardTitle>
            </CardHeader>
            <CardContent>
                {isEmpty ? <EmptyState message={`${title} content coming soon.`} /> : null}
            </CardContent>
        </Card>
    );
}
