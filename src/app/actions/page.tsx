
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { applyActionCode, verifyPasswordResetCode, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { useFirebaseAuth } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

function ActionHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useFirebaseAuth();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (!auth) {
        // Auth service is not available yet.
        // The provider will re-render this component when it is.
        return;
    }
    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');
    const continueUrl = searchParams.get('continueUrl');
    const lang = searchParams.get('lang') || 'en';

    if (!mode || !oobCode) {
      setIsProcessing(false);
      setMessage({ type: 'error', text: 'Invalid action link. Please try again.' });
      return;
    }

    const handleAction = async () => {
      try {
        switch (mode) {
          case 'resetPassword':
            await verifyPasswordResetCode(auth, oobCode);
            router.push(`/reset-password?oobCode=${oobCode}`);
            break;

          case 'verifyEmail':
            await applyActionCode(auth, oobCode);
            setIsProcessing(false);
            setMessage({ type: 'success', text: 'Your email has been verified! You will be redirected to the login page shortly.' });
            setTimeout(() => router.push('/login'), 4000);
            break;
            
          case 'signIn':
            if (isSignInWithEmailLink(auth, window.location.href)) {
              let email = window.localStorage.getItem('emailForSignIn');
              if (!email) {
                email = window.prompt('Please provide your email for confirmation');
              }
              if (email) {
                const result = await signInWithEmailLink(auth, email, window.location.href);
                window.localStorage.removeItem('emailForSignIn');
                setIsProcessing(false);
                setMessage({ type: 'success', text: 'Sign-in successful! Redirecting...' });
                // The onAuthStateChanged listener in AuthProvider will handle the redirect.
              } else {
                 throw new Error("Email not provided for sign-in link.");
              }
            } else {
                throw new Error("Invalid sign-in link.");
            }
            break;

          default:
            setIsProcessing(false);
            setMessage({ type: 'error', text: 'Unsupported action. The link is invalid.' });
            break;
        }
      } catch {
        setIsProcessing(false);
        setMessage({ type: 'error', text: 'This link is invalid or has expired. Please request a new one.' });
      }
    };
    
    handleAction();

  }, [searchParams, router, auth]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Processing Your Request</CardTitle>
          <CardDescription>Please wait while we handle your request.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-8">
          {isProcessing && <Loader2 className="h-12 w-12 animate-spin text-primary" />}
          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className={message.type === 'success' ? 'border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-700 dark:[&>svg]:text-green-400' : ''}>
              <AlertTitle>{message.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Wrap the component in a Suspense boundary because it uses useSearchParams.
export default function ActionHandlerPage() {
    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>}>
            <ActionHandler />
        </Suspense>
    )
}
