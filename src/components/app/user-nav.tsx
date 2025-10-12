
'use client';

import {
  getAuth,
  signOut,
} from 'firebase/auth';
import { app } from '@/lib/firebase';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { useAuth } from '@/app/auth-provider';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const auth = getAuth(app);

export function UserNav() {
  const { user } = useAuth();
  const [userAvatar, setUserAvatar] = useState<ImagePlaceholder | undefined>();

  useEffect(() => {
    async function loadAvatar() {
        const images = await PlaceHolderImages;
        const avatar = images.find((img) => img.id === 'user-avatar');
        setUserAvatar(avatar);
    }
    loadAvatar();
  }, []);


  const handleLogout = async () => {
    await signOut(auth);
  };

  if (!user) {
    return (
      <Button asChild>
        <Link href="/login">Login</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            {user.photoURL ? (
              <AvatarImage
                src={user.photoURL}
                alt={user.displayName || 'User Avatar'}
              />
            ) : (
              userAvatar && (
                <AvatarImage
                  src={userAvatar.imageUrl}
                  alt="User Avatar"
                  data-ai-hint={userAvatar.imageHint}
                />
              )
            )}
            <AvatarFallback>
              {user.email ? user.email.charAt(0).toUpperCase() : 'A'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.displayName || 'Quant Aspirant'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
