import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/app/page-header';
import { learningPaths } from '@/lib/learning-paths';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { TopicIcon } from '@/components/app/topic-icon';

export const metadata: Metadata = {
  title: 'Learning Paths',
  description: 'Follow curated learning paths designed to build a solid foundation in key areas of quantitative finance, from linear algebra to machine learning.',
};

export default function PathsPage() {
  return (
    <>
      <PageHeader
        title="Learning Paths"
        description="Follow our curated paths to build a solid foundation in quantitative finance."
        variant="aligned-left"
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {learningPaths.filter(p => p.id !== 'quantlab').map((path) => (
           <Link
            key={path.id}
            href={`/${path.id}`}
            className="group rounded-lg ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Card className="flex h-full transform-gpu flex-col transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20">
              <CardHeader className="flex-row items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <TopicIcon iconName={path.icon} className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-headline text-lg">
                    {path.title}
                  </CardTitle>
                  <CardDescription className="mt-1">{path.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
