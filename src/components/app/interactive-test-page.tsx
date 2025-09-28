
'use client';

import dynamic from 'next/dynamic';
import React, { type ComponentType } from 'react';
import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';

// --- Component Props ---

type CoreConcept = {
  title: string;
  description: string;
};

type Example = {
  id: string;
  title: string;
  description: string;
  exampleText: string;
  ChartComponent: ComponentType<{ generateData: () => void }>;
  buttonText: string;
};

interface InteractiveTestPageProps {
  title: string;
  description: string;
  coreConcepts: CoreConcept[];
  examples: Example[];
}

// --- Sub-component for Example Content ---

function ExampleContent({ example }: { example: Example }) {
    const [key, setKey] = React.useState(0);
    const generateData = () => setKey(prev => prev + 1);

    const DynamicChart = dynamic(() => Promise.resolve(example.ChartComponent), {
      ssr: false,
      loading: () => <Skeleton className="h-[420px] w-full" />,
    });
  
    return (
      <div className="flex h-full flex-col">
        {example.description && (
          <div className="mb-4">
            <p className="mt-2 text-muted-foreground">{example.description}</p>
          </div>
        )}
        {example.exampleText && (
          <p className="mb-4 text-sm">
            <span className="font-semibold text-foreground">Example:</span>{' '}
            {example.exampleText}
          </p>
        )}
        <div className="mt-4 flex flex-1 flex-col rounded-lg bg-background/50 p-4">
          <div className="flex-grow">
            <DynamicChart key={key} generateData={generateData} />
          </div>
          <div className="mt-4 flex-shrink-0 text-center">
            <Button onClick={generateData}>{example.buttonText}</Button>
          </div>
        </div>
      </div>
    );
  }


// --- Main Page Component ---

export function InteractiveTestPage({
  title,
  description,
  coreConcepts,
  examples,
}: InteractiveTestPageProps) {
  const hasMultipleExamples = examples.length > 1;

  return (
    <>
      <PageHeader title={title} description={description} variant="aligned-left" />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Core Concepts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-6 ${coreConcepts.length > 1 ? 'md:grid-cols-2' : ''}`}>
              {coreConcepts.map((concept) => (
                <div key={concept.title}>
                  <h3 className="mb-1 font-semibold text-primary">
                    {concept.title}
                  </h3>
                  <p className="text-muted-foreground">{concept.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            {hasMultipleExamples ? (
              <Tabs defaultValue={examples[0].id}>
                <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${examples.length}, 1fr)` }}>
                  {examples.map((example) => (
                    <TabsTrigger key={example.id} value={example.id}>
                      {example.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {examples.map((example) => (
                  <TabsContent key={example.id} value={example.id} className="mt-6">
                    <ExampleContent example={example} />
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
                examples.map((example) => (
                    <div key={example.id}>
                         <CardHeader className="p-0 pb-4">
                            <CardTitle>{example.title}</CardTitle>
                         </CardHeader>
                        <ExampleContent example={example} />
                    </div>
                ))
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
