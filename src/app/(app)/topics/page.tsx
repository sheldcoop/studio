
import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/app/page-header';
import { allTopics } from '@/lib/curriculum';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { TopicIcon } from '@/components/app/topic-icon';

export const metadata: Metadata = {
  title: 'All Topics',
  description: 'Browse all available topics and concepts in the QuantPrep curriculum.',
};

export default function AllTopicsPage() {
  // Group topics by their category, excluding main 'parent' topics used for structure
  const groupedTopics = allTopics.reduce((acc, topic) => {
    if (topic.category && !['parent', 'main'].includes(topic.category)) {
      const categoryTitle = topic.category.charAt(0).toUpperCase() + topic.category.slice(1).replace(/-/g, ' ');
      if (!acc[categoryTitle]) {
        acc[categoryTitle] = [];
      }
      acc[categoryTitle].push(topic);
    }
    return acc;
  }, {} as Record<string, typeof allTopics>);

  return (
    <>
      <PageHeader
        title="All Topics"
        description="A comprehensive list of all concepts available on QuantPrep."
        variant="aligned-left"
      />
      <div className="space-y-12">
        {Object.entries(groupedTopics).map(([category, topics]) => (
          <div key={category}>
            <h2 className="font-headline text-2xl font-bold mb-6">{category}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {topics.map((topic) => (
                <Link
                  key={topic.id}
                  href={topic.href}
                  className="group rounded-lg ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Card className="flex h-full transform-gpu flex-col transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20">
                    <CardHeader className="flex-row items-center gap-4">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <TopicIcon iconName={topic.icon || 'FunctionSquare'} className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="font-semibold text-lg leading-tight">
                          {topic.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{topic.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
