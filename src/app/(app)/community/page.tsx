

'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { Eye, MessageSquare, Loader2, AlertTriangle, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { communityPosts as staticPosts } from '@/lib/community';
import { Alert } from '@/components/ui/alert';

// Note: Metadata is not used in client components, but we keep it for reference
// export const metadata: Metadata = {
//   title: 'Community Forum',
//   description: 'Connect with peers, ask questions about quantitative finance, and grow your knowledge together in the QuantPrep community forum.',
// };

type CommunityPost = {
  id: string;
  topic: string;
  author: string;
  replies: number;
  views: number;
  lastPost: {
      author: string;
      time: string;
  };
};

function formatTimeAgo(time: string) {
  // This is a simplified formatter. In a real app, you'd use a library like date-fns.
  return time;
}

export default function CommunityPage() {
  const [posts] = useState<CommunityPost[]>(staticPosts);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [isRawDataOpen, setIsRawDataOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Community Forum"
        description="Connect with peers, ask questions, and grow together."
      >
      </PageHeader>
       <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <CardTitle>Authentication Disabled</CardTitle>
        <CardDescription>
          The community forum is currently using static placeholder data. User authentication and real-time database features are not yet implemented.
        </CardDescription>
      </Alert>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Latest Discussions</CardTitle>
          <CardDescription>
            Browse the latest topics from the community.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex h-60 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-destructive p-12 text-center h-60">
                <AlertTriangle className="h-12 w-12 text-destructive" />
                <p className="mt-4 font-semibold text-destructive">
                    Failed to load posts
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                    {error}
                </p>
            </div>
          )}
          {!loading && !error && (
            <ul className="space-y-4">
              {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <li
                    key={post.id}
                    className="flex flex-col gap-2 rounded-lg border p-4 transition-colors hover:bg-secondary/50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {post.author?.charAt(0).toUpperCase() || 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Link
                          href={`#`}
                          className="font-medium hover:underline"
                          rel="noopener noreferrer"
                        >
                          {post.topic}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          by <span className="font-medium text-foreground/80">{post.author || 'Anonymous'}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-6 border-t pt-2 sm:border-t-0 sm:pt-0">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-sm font-medium">{post.replies || 0}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        <span className="text-sm font-medium">{post.views || 0}</span>
                      </div>
                      <div className="hidden text-right lg:block" style={{ width: '150px' }}>
                        <p className="text-sm font-medium text-foreground/80">
                           {formatTimeAgo(post.lastPost.time)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <div className="flex h-60 flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
                    <p className="font-semibold">
                        No discussions yet!
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Be the first to start a conversation.
                    </p>
                </div>
              )}
            </ul>
          )}
        </CardContent>
      </Card>
      
      <Collapsible open={isRawDataOpen} onOpenChange={setIsRawDataOpen} className="mt-6">
        <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm">
                <Database className="h-4 w-4 mr-2"/>
                View Raw Data
            </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
             <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Static Data</CardTitle>
                    <CardDescription>
                        This is the static placeholder data for the community posts.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <pre className="mt-2 h-[400px] w-full overflow-auto rounded-md bg-muted p-4 text-xs">
                        {JSON.stringify(posts, null, 2)}
                    </pre>
                </CardContent>
            </Card>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
