
'use client';

import { useAuth } from '@/app/auth-provider';
import { Header } from '@/components/app/header';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    // You can replace this with a better loading skeleton component
    return (
       <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <p className="text-muted-foreground">Loading your learning environment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
