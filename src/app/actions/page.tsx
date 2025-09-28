
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getAuth, applyActionCode, verifyPasswordResetCode } from 'firebase/auth';
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
      setMessage({ type: 'error', text: 'Invalid action link. Please try again.' });
      return;
    }

    const handleAction = async () => {
      try {
        switch (mode) {
          case 'resetPassword':
            // First, verify the code is valid. This prevents users from even seeing the
            // reset page if they have a bad link.
            await verifyPasswordResetCode(auth, oobCode);
            // If verification is successful, THEN we redirect to the page where they can enter a new password.
            // We forward the code so the next page can use it to complete the reset.
            router.push(`/reset-password?oobCode=${oobCode}`);
            break;

          case 'verifyEmail':
            // The link is for email verification. Handle it here directly.
            await applyActionCode(auth, oobCode);
            setIsProcessing(false);
            setMessage({ type: 'success', text: 'Your email has been verified! You will be redirected to the login page shortly.' });
            setTimeout(() => router.push('/login'), 4000);
            break;

          default:
            setIsProcessing(false);
            setMessage({ type: 'error', text: 'Unsupported action. The link is invalid.' });
            break;
        }
      } catch (error) {
        setIsProcessing(false);
        setMessage({ type: 'error', text: 'This link is invalid or has expired. Please request a new one.' });
      }
    };
    
    handleAction();

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
