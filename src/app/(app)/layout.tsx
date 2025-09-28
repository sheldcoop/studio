
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
    if (!loading) {
      if (!user) {
        // If not logged in, redirect to login
        router.replace('/login');
      } else if (!user.emailVerified) {
        // If logged in but email is not verified, force them back to login.
        // The login page will show them a message.
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  // Show a loading state while auth is being checked, or if the user is not verified yet.
  if (loading || !user || !user.emailVerified) {
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
