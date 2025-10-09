'use client';

import { useState, useEffect } from 'react';
import { getAuth, signOut, type User } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, LogOut } from 'lucide-react';
import { placeholderImages } from '@/lib/placeholder-images';

const auth = getAuth(app);

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
      // Optionally, show an error message to the user
    }
  };

  const userAvatar = placeholderImages.find((img) => img.id === 'user-avatar');

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // This is a fallback, as the useEffect should have already redirected.
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
                <Avatar className="h-24 w-24 border-2 border-primary/50">
                    {user.photoURL ? (
                        <AvatarImage src={user.photoURL} alt={user.displayName || 'User Avatar'} />
                    ) : (
                        userAvatar && <AvatarImage src={userAvatar.imageUrl} alt='Placeholder Avatar' />
                    )}
                    <AvatarFallback className="text-4xl">
                        {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                </Avatar>
            </div>
            <CardTitle className="font-headline">Your Profile</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
                <p className="font-semibold text-lg">{user.displayName || 'QuantPrep User'}</p>
                <p className="text-muted-foreground">{user.email}</p>
            </div>
            <Button className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
