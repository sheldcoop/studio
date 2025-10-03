

import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { allTopics } from '@/lib/curriculum';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const STATS_TIERS = [
  'stats-foundations',
  'stats-intermediate',
  'stats-advanced',
] as const;

export default function StatToolkitPage() {
  const tiers = STATS_TIERS.map(tierId => {
    const tierInfo = allTopics.find(t => t.id === tierId);
    const concepts = allTopics.filter(t => t.parent === tierId);
    return {
      ...tierInfo,
      concepts,
    };
  });
  
  const hypothesisTestingTopic = allTopics.find(t => t.id === 'hypothesis-testing');
  const beginnerGuideTopic = allTopics.find(t => t.id === 'demystifying-hypothesis-testing');

  return (
    <>
      <PageHeader
        title="Statistician's Toolkit"
        description="Explore and understand the core concepts of statistics for quantitative analysis."
      />

      <div className="space-y-6">
        {beginnerGuideTopic && (
          <Link href={beginnerGuideTopic.href} className="group block">
            <Card className="transform-gpu transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20">
              <CardHeader>
                <CardTitle className="font-headline text-lg text-primary">Demystifying Hypothesis Testing: A Beginner's Guide</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div>
                    <p className="font-semibold">A step-by-step guide to making decisions from data.</p>
                    <p className="text-sm text-muted-foreground">Is it a real effect or just random chance? Let's find out.</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-primary transition-transform group-hover:translate-x-1">
                    Read Guide <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        )}

        {hypothesisTestingTopic && (
          <Link href='/hypothesis-testing-p-values' className="group block">
             <Card className="transform-gpu transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20">
               <CardHeader>
                <CardTitle className="font-headline text-lg text-primary">A Quant's Detective Kit: Interactive Tests</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{hypothesisTestingTopic.title}</p>
                  <p className="text-sm text-muted-foreground">{hypothesisTestingTopic.description}</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-primary transition-transform group-hover:translate-x-1">
                    Explore Tests <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
        {tiers.map((tier) => (
          tier.title && tier.concepts ? (
            <Card key={tier.id} className="flex flex-col bg-card/70">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-primary">
                  {tier.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <ul className="flex-1 space-y-2">
                  {tier.concepts.map((concept) => (
                    <li key={`${tier.id}-${concept.id}`}>
                      <Link
                        href={concept.href}
                        className="group flex items-center gap-3 rounded-md p-2 text-sm transition-colors hover:bg-secondary"
                      >
                        <CheckCircle className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                        <span className="font-medium text-foreground/80 group-hover:text-foreground">
                          {concept.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null
        ))}
      </div>
    </>
  );
}
