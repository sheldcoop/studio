'use client';

import { useState, useEffect } from 'react';
import { getAuth, updateProfile, type User } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const auth = getAuth(app);

export default function SettingsClient() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setDisplayName(user.displayName || '');
        setPhotoURL(user.photoURL || '');
        setIsLoading(false);
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleUpdateProfile = async () => {
    if (user) {
      try {
        await updateProfile(user, { displayName, photoURL });
        toast({ title: 'Success', description: 'Your profile has been updated.' });
        router.push('/profile');
      } catch (error) {
        console.error('Error updating profile: ', error);
        toast({ title: 'Error', description: 'Could not update your profile. Please try again.', variant: 'destructive' });
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
          <CardHeader>
            <CardTitle className="font-headline">Edit Profile</CardTitle>
            <CardDescription>Update your display name and avatar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={photoURL} alt={displayName} />
                <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      if (event.target && event.target.result) {
                        setPhotoURL(event.target.result as string);
                      }
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="displayName" className="text-sm font-medium">Display Name</label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="link" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile}>Save Changes</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
