
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type Topic } from '@/lib/curriculum';

interface InteractiveTestWrapperProps {
    topic: Topic;
}

export function InteractiveTestWrapper({ topic }: InteractiveTestWrapperProps) {
    if (!topic.interactiveExamples) {
        return <p>No interactive examples available for this topic.</p>;
    }

    const { coreConcepts, examples } = topic.interactiveExamples;

    return (
        <div className="mx-auto max-w-5xl space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Core Concepts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                        {coreConcepts.map((concept) => (
                            <div key={concept.title}>
                                <h3 className="mb-1 font-semibold text-primary">{concept.title}</h3>
                                <p className="text-muted-foreground">{concept.description}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <Tabs defaultValue={examples[0].id}>
                        <TabsList className={`grid w-full grid-cols-${examples.length}`}>
                            {examples.map((example) => (
                                <TabsTrigger key={example.id} value={example.id}>
                                    {example.title}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {examples.map((example) => (
                            <TabsContent key={example.id} value={example.id} className="mt-6">
                                <h3 className="text-xl font-bold">{example.title}</h3>
                                <p className="mt-2 text-muted-foreground">{example.description}</p>
                                <p className="mt-4 text-sm">
                                    <span className="font-semibold text-foreground">Example:</span>{' '}
                                    {example.exampleText}
                                </p>
                                <div className="mt-4 rounded-lg bg-background/50 p-4">
                                    <example.ChartComponent />
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
