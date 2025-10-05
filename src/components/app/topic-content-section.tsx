
'use client';

import { type SubTopic } from '@/lib/curriculum';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BookOpen, Code, BrainCircuit, BarChart } from 'lucide-react';

interface TopicContentSectionProps {
    subTopic: SubTopic;
}

export function TopicContentSection({ subTopic }: TopicContentSectionProps) {
    return (
        <section key={subTopic.id} id={subTopic.id} className="scroll-mt-24">
            <h2 className="font-headline text-3xl font-bold border-b pb-4 mb-8">{subTopic.title}</h2>
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BookOpen className="text-primary"/> Theory</CardTitle>
                    </CardHeader>
                    <CardContent className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 m-6 mt-0">
                        <p className="text-sm text-muted-foreground">Theory explanation coming soon.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Code className="text-primary"/> Interactive Demo</CardTitle>
                    </CardHeader>
                    <CardContent className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 m-6 mt-0">
                        <p className="text-sm text-muted-foreground">Interactive demo coming soon.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                            <CardTitle className="flex items-center gap-2"><BrainCircuit className="text-primary"/> Practice Problems</CardTitle>
                    </CardHeader>
                    <CardContent className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 m-6 mt-0">
                        <p className="text-sm text-muted-foreground">Practice problems coming soon.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart className="text-primary"/> Quant Finance Application</CardTitle>
                    </CardHeader>
                    <CardContent className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 m-6 mt-0">
                        <p className="text-sm text-muted-foreground">Application examples coming soon.</p>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
