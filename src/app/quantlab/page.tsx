'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { getPathById } from '@/lib/learning-paths';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TopicIcon } from '@/components/app/topic-icon';
import Link from 'next/link';
import { allTopics, type Topic } from '@/lib/data';
import { Search } from 'lucide-react';

const TopicCard = ({ topic }: { topic: Topic }) => (
  <Link href={topic.href} className="group block rounded-lg">
    <Card className="h-full border-b-2 border-border bg-background/50 transition-all duration-300 ease-in-out group-hover:border-primary group-hover:bg-accent/50 group-hover:shadow-lg">
      <CardHeader className="flex-row items-start gap-4">
        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <TopicIcon iconName={topic.icon} className="h-5 w-5 text-primary" />
        </div>
        <div>
            <CardTitle className="text-base font-semibold">{topic.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{topic.description}</p>
      </CardContent>
    </Card>
  </Link>
);


export default function QuantLabPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const quantLabPath = useMemo(() => getPathById('quantlab'), []);

  const filteredModules = useMemo(() => {
    if (!quantLabPath || !quantLabPath.modules) {
      return [];
    }

    if (!searchTerm) {
      return quantLabPath.modules;
    }

    const lowercasedTerm = searchTerm.toLowerCase();
    
    // Filter modules and the lessons within them
    return quantLabPath.modules.map(module => {
      const filteredLessons = module.lessons.filter(
        lesson =>
          lesson.title.toLowerCase().includes(lowercasedTerm) ||
          lesson.description.toLowerCase().includes(lowercasedTerm)
      );
      // Return a new module object with only the filtered lessons
      return { ...module, lessons: filteredLessons };
    }).filter(module => module.lessons.length > 0); // Only include modules that have matching lessons

  }, [quantLabPath, searchTerm]);
  
  if (!quantLabPath) {
    return (
      <div>
        <PageHeader
          title="QuantLab"
          description="Interactive tools for hands-on probability, statistics, and financial modeling."
          variant="aligned-left"
        />
        <p>QuantLab curriculum not found.</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="QuantLab"
        description="Interactive tools for hands-on probability, statistics, and financial modeling."
        variant="aligned-left"
      >
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
                placeholder="Search tools..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </PageHeader>
      
      <div className="space-y-12">
        {filteredModules.length > 0 ? (
          filteredModules.map(module => (
            <div key={module.id}>
              <h2 className="font-headline text-2xl font-bold mb-6 border-b pb-2">{module.title}</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {module.lessons.map(lesson => (
                  <TopicCard key={lesson.id} topic={lesson} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center h-60">
            <p className="font-semibold">
              No tools found for "{searchTerm}"
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try searching for a different term.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
