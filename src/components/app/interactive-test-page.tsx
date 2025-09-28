
'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  ChartComponent: ComponentType;
};

interface InteractiveTestPageProps {
  title: string;
  description: string;
  coreConcepts: CoreConcept[];
  examples: Example[];
}

// --- Main Page Component ---

export function InteractiveTestPage({
  title,
  description,
  coreConcepts,
  examples,
}: InteractiveTestPageProps) {
  // Use next/dynamic to ensure charts are client-side only
  const DynamicCharts = examples.map(example => ({
    ...example,
    DynamicChart: dynamic(() => Promise.resolve(example.ChartComponent), { ssr: false })
  }));

  const hasMultipleExamples = examples.length > 1;

  return (
    <>
      <PageHeader title={title} description={description} />
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
                <TabsList className={`grid w-full grid-cols-${examples.length}`}>
                  {examples.map((example) => (
                    <TabsTrigger key={example.id} value={example.id}>
                      {example.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {DynamicCharts.map((example) => (
                  <TabsContent key={example.id} value={example.id} className="mt-6">
                    <ExampleContent example={example} />
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
                DynamicCharts.map((example) => (
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


// --- Sub-component for Example Content ---

function ExampleContent({ example }: { example: Example & { DynamicChart: ComponentType } }) {
  const { DynamicChart } = example;
  return (
    <>
      {example.title && example.description && (
        <div className="mb-4">
             {example.description && <p className="mt-2 text-muted-foreground">{example.description}</p>}
        </div>
      )}
      {example.exampleText && (
        <p className="mb-4 text-sm">
          <span className="font-semibold text-foreground">Example:</span>{' '}
          {example.exampleText}
        </p>
      )}
      <div className="mt-4 rounded-lg bg-background/50 p-4">
        <DynamicChart />
      </div>
    </>
  );
}
