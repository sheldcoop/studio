
import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { allTopics } from '@/lib/data';
import { CheckCircle } from 'lucide-react';
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
  
  return (
    <>
      <PageHeader
        title="Statistician's Toolkit"
        description="Explore and understand the core concepts of statistics for quantitative analysis."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier) => (
          <Card key={tier.id} className="flex flex-col bg-card/70">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary">
                {tier.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ul className="flex-1 space-y-2">
                {tier.concepts.map((concept) => (
                  <li key={concept.id}>
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
        ))}
      </div>
    </>
  );
}
