'use client';

import { useState } from 'react';
import { getAuth, sendSignInLinkToEmail, type AuthError } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/app/logo';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const auth = getAuth(app);

const getFriendlyErrorMessage = (error: AuthError): string => {
    // Log the full error to the console for detailed debugging
    console.error('Authentication Error:', error);

    switch (error.code) {
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        default:
             // For any other error, display a more specific message if available
            return `An unexpected error occurred. Code: ${error.code}. Please check the console for more details.`;
    }
}

const actionCodeSettings = {
  url: typeof window !== 'undefined' ? `${window.location.origin}/login` : 'http://localhost:9002/login',
  handleCodeInApp: true,
};


export default function MagicLinkPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);

  const handleMagicLinkSignIn = async () => {
    setError(null);
    setInfoMessage(null);
    if (!email) {
        setError('Please enter your email address to receive a magic link.');
        return;
    }
    try {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        window.localStorage.setItem('emailForSignIn', email);
        setInfoMessage(`A magic link has been sent to ${email}. Please check your inbox.`);
        setIsMagicLinkSent(true);
    } catch (err) {
        setError(getFriendlyErrorMessage(err as AuthError));
    }
  };

  const renderContent = () => {
    if (isMagicLinkSent) {
        return (
          <>
              <CardHeader className="text-center">
                <CardTitle className="font-headline">Check Your Inbox</CardTitle>
                <CardDescription>
                  We've sent a magic link to your email address. Click the link to sign in.
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex-col gap-4">
                  <Button variant="link" className="text-sm" asChild>
                      <Link href="/login">
                          <ArrowLeft className="mr-2" />
                          Back to Login
                      </Link>
                  </Button>
              </CardFooter>
          </>
        )
    }

    return (
        <>
            <CardHeader className="text-center">
                <CardTitle className="font-headline">Sign In with Magic Link</CardTitle>
                <CardDescription>
                    Enter your email to receive a secure, passwordless sign-in link.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
                <Button className="w-full" onClick={handleMagicLinkSignIn}>Send Magic Link</Button>
                <Button variant="link" className="text-sm" asChild>
                    <Link href="/login">
                        <ArrowLeft className="mr-2" />
                        Back to Login
                    </Link>
                </Button>
            </CardFooter>
        </>
    )
  }

  return (
    <div className="w-full max-w-md">
       <div className="mb-6 flex justify-center">
        <Logo />
      </div>
      <Card>
        {error && (
            <Alert variant="destructive" className="m-4 mb-0">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {infoMessage && (
            <Alert variant="default" className="m-4 mb-0 border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-700 dark:[&>svg]:text-green-400">
               <CheckCircle className="h-4 w-4" />
               <AlertTitle>Success!</AlertTitle>
               <AlertDescription>{infoMessage}</AlertDescription>
            </Alert>
          )}
        {renderContent()}
      </Card>
      <Button variant="link" className="mt-4 text-muted-foreground" asChild>
        <Link href="/">Back to homepage</Link>
      </Button>
    </div>
  );
}
