
'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { allTopics, type Topic } from '@/lib/curriculum';
import { Chef, Campfire } from 'lucide-react';

const TestCard = ({ test }: { test: Topic }) => {
  return (
    <Link href={test.href} className="group block rounded-lg">
      <Card className="h-full border-b-2 border-border bg-background/50 transition-all duration-300 group-hover:border-primary group-hover:bg-accent/50">
        <CardHeader>
          <CardTitle className="text-base font-semibold">{test.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{test.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default function HypothesisTestingGuidePage() {
  const parametricTests = allTopics.filter(t => t.category === 'parametric');
  const nonParametricTests = allTopics.filter(t => t.category === 'non-parametric');

  return (
    <>
      <PageHeader
        title="The Quant's Detective Kit"
        description="A complete guide to statistical tests for hypothesis testing."
      />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Parametric Tests Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Chef className="h-8 w-8 text-primary" />
            <div>
              <h2 className="font-headline text-2xl font-bold">Parametric Tests</h2>
              <p className="text-muted-foreground">
                The Professional Chef: Assumes data meets certain standards (e.g., normal distribution). Precise and powerful when assumptions are met.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {parametricTests.map(test => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        </div>

        {/* Non-Parametric Tests Column */}
        <div className="space-y-4">
           <div className="flex items-center gap-3">
            <Campfire className="h-8 w-8 text-primary" />
            <div>
              <h2 className="font-headline text-2xl font-bold">Non-Parametric Tests</h2>
              <p className="text-muted-foreground">
                The Campfire Cook: Makes no strict assumptions. More flexible and robust, especially with unusual, ranked, or non-normal data.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {nonParametricTests.map(test => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
