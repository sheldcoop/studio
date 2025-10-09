'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { Logo } from '@/components/app/logo';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const auth = getAuth(app);

export default function ActionsPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const handleAction = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }
        if (email) {
          try {
            const result = await signInWithEmailLink(auth, email, window.location.href);
            window.localStorage.removeItem('emailForSignIn');
            setSuccess('Successfully signed in! Redirecting...');
            router.push('/profile');
          } catch (err) {
            setError('Failed to sign in. The link may have expired or already been used.');
          }
        }
      }
    };
    handleAction();
  }, [router]);

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 flex justify-center">
        <Logo />
      </div>
      {
        error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )
      }
      {
        success && (
          <Alert variant="default">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )
      }
    </div>
  );
}
