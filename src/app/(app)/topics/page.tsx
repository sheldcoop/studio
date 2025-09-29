

'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { allTopics } from '@/lib/curriculum';
import Link from 'next/link';
import { Folder } from 'lucide-react';

export default function TopicsIndexPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTopics = allTopics.filter(
    (topic) =>
      !topic.parent && // Only show top-level topics or topics without a parent
      (topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (topic.description &&
        topic.description.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <>
      <PageHeader
        title="All Topics"
        description="Browse all available topic pages."
        variant="aligned-left"
      />
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTopics.map((topic) => {
              const Icon = topic.icon || Folder;
              return (
                <Link
                  key={topic.id}
                  href={topic.href}
                  className="group rounded-lg border p-4 transition-colors hover:bg-secondary"
                >
                  <Icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-2 font-semibold text-foreground/90 group-hover:text-foreground">
                    {topic.title}
                  </h3>
                  {topic.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {topic.description}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
          {filteredTopics.length === 0 && (
            <div className="flex h-40 items-center justify-center text-center">
              <p className="text-muted-foreground">
                No topics found matching your search.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
