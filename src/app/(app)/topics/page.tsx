
'use client';

import { useState, useMemo } from 'react';
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
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';


export default function AllTopicsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTopics = useMemo(() => {
    if (!searchTerm) {
      return allTopics;
    }
    return allTopics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const groupedTopics = useMemo(() => {
    return filteredTopics.reduce((acc, topic) => {
        if (topic.category && !['parent', 'main'].includes(topic.category)) {
        const categoryTitle = topic.category.charAt(0).toUpperCase() + topic.category.slice(1).replace(/-/g, ' ');
        if (!acc[categoryTitle]) {
            acc[categoryTitle] = [];
        }
        acc[categoryTitle].push(topic);
        }
        return acc;
    }, {} as Record<string, typeof allTopics>);
  }, [filteredTopics]);


  return (
    <>
      <PageHeader
        title="All Topics"
        description="A comprehensive list of all concepts available on QuantPrep."
        variant="aligned-left"
      />

      <div className="relative mb-8 w-full max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search topics by title or description..."
          className="w-full pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>


      <div className="space-y-12">
        {Object.keys(groupedTopics).length > 0 ? (
            Object.entries(groupedTopics).map(([category, topics]) => (
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
            ))
        ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center h-60">
                <Search className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 font-semibold">
                    No topics found for "{searchTerm}"
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                    Try searching for something else.
                </p>
          </div>
        )}
      </div>
    </>
  );
}
