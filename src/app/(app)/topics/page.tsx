'use client';

import { useState, useMemo } from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/app/page-header';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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


export default function AllTopicsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTopics = useMemo(() => {
    // We only want to show actual, visitable topic pages
    const visitableTopics = allTopics.filter(topic => topic.href !== '#');
    
    if (!searchTerm) {
      return visitableTopics;
    }

    const lowercasedTerm = searchTerm.toLowerCase();
    
    return visitableTopics.filter(
        topic =>
          topic.title.toLowerCase().includes(lowercasedTerm) ||
          topic.description.toLowerCase().includes(lowercasedTerm)
      );

  }, [searchTerm]);

  return (
    <>
      <PageHeader
        title="All Topics"
        description="Browse every topic available on QuantPrep. Use the search to find exactly what you're looking for."
        variant="aligned-left"
      >
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
                placeholder="Search all topics..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </PageHeader>
      
      <div className="space-y-12">
        {filteredTopics.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTopics.map(topic => (
                <TopicCard key={topic.id} topic={topic} />
            ))}
            </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center h-60">
            <p className="font-semibold">
              No topics found for &quot;{searchTerm}&quot;
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
