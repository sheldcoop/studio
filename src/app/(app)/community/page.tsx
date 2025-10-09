
'use client';

import type { Metadata } from 'next';
import { PageHeader } from '@/components/app/page-header';
// import { useCollection } from '@/firebase/firestore/use-collection';
import { Eye, MessageSquare, Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { NewPostDialog } from '@/components/app/community/new-post-dialog';

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
  // const { data: posts, loading, error } = useCollection<CommunityPost>('communityPosts');

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
            <div className="flex h-60 flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
                <p className="font-semibold">
                    This page has been temporarily disconnected from the database for a build test.
                </p>
            </div>
        </CardContent>
      </Card>
    </>
  );
}
