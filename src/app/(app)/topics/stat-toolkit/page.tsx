
import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { statsToolkitTiers } from '@/lib/data';
import { CheckCircle, Route } from 'lucide-react';
import Link from 'next/link';

// Helper to convert title to a URL-friendly slug
const toSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/ & /g, '-') // Handle " & " case
    .replace(/[ /]/g, '-') // Handle spaces and slashes
    .replace(/[^\w-]+/g, ''); // Remove all non-word chars except -
};

export default function StatToolkitPage() {
  return (
    <>
      <PageHeader
        title="Statistician's Toolkit"
        description="Explore and understand the core concepts of statistics for quantitative analysis."
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statsToolkitTiers.map((tier) => (
          <Card key={tier.title} className="flex flex-col bg-card/70">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary">
                {tier.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ul className="flex-1 space-y-2">
                {tier.concepts.map((concept) => (
                  <li key={concept}>
                    <Link
                      href={`/topics/${toSlug(concept)}`}
                      className="group flex items-center gap-3 rounded-md p-2 text-sm transition-colors hover:bg-secondary"
                    >
                      <CheckCircle className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                      <span className="font-medium text-foreground/80 group-hover:text-foreground">
                        {concept}
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
