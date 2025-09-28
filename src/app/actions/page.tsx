
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getAuth, applyActionCode } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const auth = getAuth(app);

function ActionHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');

    if (!mode || !oobCode) {
      setIsProcessing(false);
      setMessage({ type: 'error', text: 'Invalid link. Please try again.' });
      return;
    }

    switch (mode) {
      case 'resetPassword':
        // The link is for a password reset. Redirect to the dedicated reset page,
        // forwarding the necessary action code.
        router.push(`/reset-password?oobCode=${oobCode}`);
        break;

      case 'verifyEmail':
        // The link is for email verification. Handle it here.
        applyActionCode(auth, oobCode)
          .then(() => {
            setIsProcessing(false);
            setMessage({ type: 'success', text: 'Your email has been verified! You will be redirected to the login page shortly.' });
            setTimeout(() => router.push('/login'), 4000);
          })
          .catch(() => {
            setIsProcessing(false);
            setMessage({ type: 'error', text: 'The verification link is invalid or has expired. Please try signing up again.' });
          });
        break;

      default:
        setIsProcessing(false);
        setMessage({ type: 'error', text: 'Unsupported action. The link is invalid.' });
        break;
    }
  }, [searchParams, router]);

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
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
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
