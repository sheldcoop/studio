
import Link from 'next/link';
import { PageHeader } from '@/components/app/page-header';
import { learningPaths } from '@/lib/learning-paths';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TopicIcon } from '@/components/app/topic-icon';

export default function LearningPathsPage() {
  return (
    <>
      <PageHeader
        title="Learning Paths"
        description="Follow a structured path to master the core concepts of quantitative finance."
        variant="aligned-left"
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {learningPaths.map((path) => (
          <Link key={path.id} href={path.href} className="group block rounded-lg">
            <Card className="h-full border-b-2 border-border bg-background/50 transition-all duration-300 ease-in-out group-hover:border-primary group-hover:bg-accent/50 group-hover:shadow-lg">
              <CardHeader>
                 <div className="mb-4">
                    <TopicIcon iconName={path.icon} className="h-8 w-8 text-primary" />
                 </div>
                <CardTitle className="font-headline text-xl">{path.title}</CardTitle>
                <CardDescription>{path.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
