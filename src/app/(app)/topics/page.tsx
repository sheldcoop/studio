import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { allTopics } from '@/lib/topics';
import Link from 'next/link';

export default function TopicsIndexPage() {
  return (
    <>
      <PageHeader
        title="All Topics"
        description="Browse all available topic pages."
        variant="aligned-left"
      />
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allTopics.map((topic) => (
              <Link
                key={topic.id}
                href={topic.href}
                className="group rounded-lg border p-4 transition-colors hover:bg-secondary"
              >
                <topic.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-2 font-semibold text-foreground/90 group-hover:text-foreground">
                  {topic.title}
                </h3>
                {topic.description && <p className="mt-1 text-sm text-muted-foreground">
                  {topic.description}
                </p>}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
