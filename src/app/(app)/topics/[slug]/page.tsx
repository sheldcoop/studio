
import { PageHeader } from '@/components/app/page-header';
import { allTopics } from '@/lib/data';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function TopicPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  if (!slug) {
    notFound();
  }

  // A list of slugs that have their own dedicated, custom-built page.
  // This prevents this dynamic route from rendering over a specific, static page.
  const dedicatedPages = [
    'confidence-intervals',
    'hypothesis-testing-p-values',
    'mental-math',
    'linear-algebra-for-quantitative-finance',
    't-test',
    'z-test',
    'anova',
    'f-test',
    'chi-squared-test',
    'pearson-correlation',
    'mann-whitney-u-test',
    'kruskal-wallis-test',
    'wilcoxon-signed-rank-test',
    'spearmans-rank-correlation',
    'friedman-test',
    'kolmogorov-smirnov-k-s-test',
    'stat-toolkit',
    'maximum-likelihood-estimation',
  ];

  if (dedicatedPages.includes(slug)) {
    return null;
  }

  const topicInfo = allTopics.find((t) => t.id === slug);
  const subTopics = allTopics.filter((t) => t.parent === slug);
  
  if (!topicInfo) {
    notFound();
  }
  
  const { title, description } = topicInfo;

  return (
    <div>
      <PageHeader title={title} description={description} variant="aligned-left" />

      {subTopics.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {subTopics.map((topic) => (
            <Link
              key={topic.title}
              href={topic.href}
              className="block rounded-lg ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Card className="flex h-full transform-gpu flex-col transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20">
                <CardHeader className="flex-row items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <topic.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="font-headline text-lg">
                      {topic.title}
                    </CardTitle>
                    {topic.description && (
                       <CardDescription className="mt-1">{topic.description}</CardDescription>
                    )}
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex h-96 items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">Topic content will go here.</p>
        </div>
      )}
    </div>
  );
}
