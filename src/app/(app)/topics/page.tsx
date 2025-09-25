import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { quantJourney } from '@/lib/data';
import Link from 'next/link';

export default function TopicsIndexPage() {
  return (
    <>
      <PageHeader
        title="All Topics"
        description="Browse all available topic pages."
      />
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quantJourney.map((topic) => (
              <Link
                key={topic.id}
                href={topic.href}
                className="group rounded-lg border p-4 transition-colors hover:bg-secondary"
              >
                <topic.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-2 font-semibold text-foreground/90 group-hover:text-foreground">
                  {topic.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {topic.description}
                </p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
