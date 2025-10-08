
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/app/page-header';
import { useCollection } from '@/firebase/firestore/use-collection';
import { Eye, MessageSquare, Loader2, AlertTriangle, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { NewPostDialog } from '@/components/app/community/new-post-dialog';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Note: Metadata is not used in client components, but we keep it for reference
// export const metadata: Metadata = {
//   title: 'Community Forum',
//   description: 'Connect with peers, ask questions about quantitative finance, and grow your knowledge together in the QuantPrep community forum.',
// };

type CommunityPost = {
  id: string;
  topic: string;
  author: {
    uid: string;
    displayName: string;
    photoURL?: string;
  };
  replies: number;
  views: number;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
};

function formatTimeAgo(timestamp: { seconds: number; nanoseconds: number }) {
  if (!timestamp) return 'Just now';
  const postDate = new Date(timestamp.seconds * 1000);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function CommunityPage() {
  const { data: posts, loading, error } = useCollection<CommunityPost>('communityPosts');
  const [isRawDataOpen, setIsRawDataOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Community Forum"
        description="Connect with peers, ask questions, and grow together."
      >
        <NewPostDialog />
      </PageHeader>
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
                    Could not connect to the database. Please check your connection or try again later.
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
                        {post.author.photoURL && <img src={post.author.photoURL} alt={post.author.displayName} className="h-full w-full object-cover" />}
                        <AvatarFallback>
                          {post.author.displayName?.charAt(0).toUpperCase() || 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Link
                          href={`/community/${post.id}`}
                          className="font-medium hover:underline"
                          rel="noopener noreferrer"
                        >
                          {post.topic}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          by <span className="font-medium text-foreground/80">{post.author.displayName || 'Anonymous'}</span>
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
                           {formatTimeAgo(post.createdAt)}
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
                View Raw Database Content
            </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
             <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Live Firestore Data</CardTitle>
                    <CardDescription>
                        This is the raw JSON data for the `communityPosts` collection, fetched in real-time.
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
