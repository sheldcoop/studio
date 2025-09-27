import type { Metadata } from 'next';
import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button';
import { communityPosts } from '@/lib/data';
import { PlusCircle, MessageSquare, Eye } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Community Forum',
  description: 'Connect with peers, ask questions about quantitative finance, and grow your knowledge together in the QuantPrep community forum.',
};

export default function CommunityPage() {
  return (
    <>
      <PageHeader
        title="Community Forum"
        description="Connect with peers, ask questions, and grow together."
      >
        <Button asChild>
          <Link href="/community">
            <PlusCircle className="mr-2" />
            Start a Discussion
          </Link>
        </Button>
      </PageHeader>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Latest Discussions</CardTitle>
          <CardDescription>
            Browse the latest topics from the community.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {communityPosts.map((post) => (
              <li
                key={post.id}
                className="flex flex-col gap-2 rounded-lg border p-4 transition-colors hover:bg-secondary/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {post.author.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Link
                      href="/community"
                      className="font-medium hover:underline"
                      rel="noopener noreferrer"
                    >
                      {post.topic}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      by <span className="font-medium text-foreground/80">{post.author}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-6 border-t pt-2 sm:border-t-0 sm:pt-0">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm font-medium">{post.replies}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm font-medium">{post.views}</span>
                  </div>
                  <div className="hidden text-right lg:block" style={{ width: '150px' }}>
                    <p className="text-sm font-medium text-foreground/80">
                      {post.lastPost.author}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {post.lastPost.time}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
