
import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/app/page-header';
import { allTopics } from '@/lib/curriculum';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { TopicIcon } from '@/components/app/topic-icon';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'All Topics',
  description: 'Explore a comprehensive list of all topics available on QuantPrep, from foundational statistics to advanced machine learning concepts.',
};

export default function AllTopicsPage() {
  // Filter out parent categories or topics without a direct page
  const displayableTopics = allTopics.filter(
    (topic) => topic.category !== 'parent' && topic.href !== '#'
  );

  // Group topics by their category for better organization
  const groupedTopics = displayableTopics.reduce((acc, topic) => {
    const category = topic.parent || topic.category || 'general';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(topic);
    return acc;
  }, {} as Record<string, typeof displayableTopics>);

  const categoryTitles: Record<string, string> = {
    'stat-toolkit': 'Statistician\'s Toolkit',
    'stats-foundations': 'Statistical Foundations',
    'parametric': 'Parametric Tests',
    'non-parametric': 'Non-Parametric Tests',
    'probability-toolkit': 'Probability Toolkit',
    'prob-core-tools': 'Core Probability Concepts',
    'prob-dist-discrete': 'Discrete Distributions',
    'prob-dist-continuous': 'Continuous Distributions',
    'main': 'Core Concepts'
  };


  return (
    <>
      <PageHeader
        title="All Topics"
        description="Browse every concept and tool available on the platform."
        variant="aligned-left"
      />

      <div className="space-y-12">
        {Object.entries(groupedTopics).map(([category, topics]) => (
          <section key={category}>
            <h2 className="font-headline text-2xl font-bold mb-4 capitalize">
              {categoryTitles[category] || category.replace(/-/g, ' ')}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {topics.map((topic) => (
                <Link
                  key={topic.id}
                  href={topic.href}
                  className="group rounded-lg ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Card className="flex h-full transform-gpu flex-col text-left transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20">
                    <CardHeader>
                      <div className="mb-3 flex items-center justify-between">
                         <TopicIcon iconName={topic.icon} className="h-6 w-6 text-primary" />
                         {topic.category && <Badge variant="secondary">{topic.category}</Badge>}
                      </div>
                      <CardTitle className="text-lg leading-tight">
                        {topic.title}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
