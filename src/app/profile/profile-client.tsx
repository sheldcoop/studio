
'use client';

import { useState, useEffect } from 'react';
import { getAuth, signOut, type User, sendPasswordResetEmail, deleteUser } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, LogOut, Pencil, KeyRound, Trash2, ArrowLeft } from 'lucide-react';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { toast } from '@/hooks/use-toast';
const auth = getAuth(app);

export default function ProfileClient() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userAvatar, setUserAvatar] = useState<ImagePlaceholder | undefined>();
  const router = useRouter();
  
  useEffect(() => {
    async function loadAvatar() {
        const images = await PlaceHolderImages;
        const avatar = images.find((img) => img.id === 'user-avatar');
        setUserAvatar(avatar);
    }
    loadAvatar();
  }, []);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setIsLoading(false);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
      toast({ title: 'Error', description: 'Could not log you out. Please try again.', variant: 'destructive' });
    }
  };
  
  const handlePasswordReset = async () => {
    if (user?.email) {
      try {
        await sendPasswordResetEmail(auth, user.email);
        toast({ title: 'Success', description: `A password reset link has been sent to ${user.email}.` });
      } catch (error) {
        console.error('Error sending password reset email: ', error);
        toast({ title: 'Error', description: 'Could not send password reset email. Please try again.', variant: 'destructive' });
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (user) {
      const confirmation = confirm('Are you sure you want to delete your account? This action cannot be undone.');
      if (confirmation) {
        try {
          await deleteUser(user);
          toast({ title: 'Success', description: 'Your account has been successfully deleted.' });
          router.push('/login');
        } catch (error) {
          console.error('Error deleting account: ', error);
          toast({ title: 'Error', description: 'Could not delete your account. Please try again.', variant: 'destructive' });
        }
      }
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
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
                        userAvatar && <AvatarImage src={(userAvatar as any).imageUrl} alt='Placeholder Avatar' />
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
            <div className="space-y-2">
              <Button className="w-full" variant="outline" onClick={() => router.push('/settings')}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
              <Button className="w-full" variant="outline" onClick={handlePasswordReset}>
                <KeyRound className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </div>
            <Button className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
            <Button className="w-full" variant="destructive" onClick={handleDeleteAccount}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
