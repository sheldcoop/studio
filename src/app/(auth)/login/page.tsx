'use client';

import { useState } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  type AuthError,
  type User,
} from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
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

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const getFriendlyErrorMessage = (error: AuthError): string => {
    switch (error.code) {
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Invalid credentials. Please check your email and password.';
        case 'auth/email-already-in-use':
            return 'An account with this email address already exists.';
        case 'auth/weak-password':
            return 'The password must be at least 6 characters long.';
        case 'auth/popup-closed-by-user':
            return 'The sign-in popup was closed before completion. Please try again.';
        default:
            return 'An unexpected authentication error occurred. Please try again later.';
    }
}


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isResetMode, setIsResetMode] = useState(false);
  const router = useRouter();

  const handleSuccessfulLogin = (user: User) => {
    if (user.emailVerified) {
      router.push('/');
    } else {
      setError("Please verify your email address before logging in. We've sent you another verification link.");
      sendEmailVerification(user); // Resend verification email
      signOut(auth); // Sign out the non-verified user
    }
  }

  const handleAuthAction = async (action: 'signUp' | 'signIn') => {
    setError(null);
    setInfoMessage(null);
    try {
      if (action === 'signUp') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        await signOut(auth); // Sign out user immediately after registration
        setInfoMessage('Your account has been created. Please check your email to verify your account before logging in.');
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        handleSuccessfulLogin(userCredential.user);
      }
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err as AuthError));
    }
  };

  const handlePasswordReset = async () => {
    setError(null);
    setInfoMessage(null);
    if (!email) {
        setError('Please enter your email address to reset your password.');
        return;
    }
    try {
        await sendPasswordResetEmail(auth, email);
        setInfoMessage('A password reset link has been sent to your email address.');
        // Don't switch back immediately, let the user see the success message
    } catch (err: any) {
        setError(getFriendlyErrorMessage(err as AuthError));
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setInfoMessage(null);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      handleSuccessfulLogin(userCredential.user);
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err as AuthError));
    }
  }

  const renderContent = () => {
    if (isResetMode) {
      return (
        <>
            <CardHeader className="text-center">
              <CardTitle className="font-headline">Reset Your Password</CardTitle>
              <CardDescription>
                Enter your email to receive a reset link.
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
                <Button className="w-full" onClick={handlePasswordReset}>Send Reset Link</Button>
                <Button variant="link" className="text-sm" onClick={() => { setIsResetMode(false); setError(null); setInfoMessage(null); }}>
                    <ArrowLeft className="mr-2" />
                    Back to Login
                </Button>
            </CardFooter>
        </>
      )
    }

    return (
        <>
            <CardHeader className="text-center">
                <CardTitle className="font-headline">Welcome to QuantPrep</CardTitle>
                <CardDescription>
                    Sign in or create an account to continue
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
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
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Button variant="link" className="h-auto p-0 text-xs" onClick={() => setIsResetMode(true)}>
                                Forgot Password?
                            </Button>
                        </div>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
                <div className="flex w-full gap-2">
                    <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => handleAuthAction('signIn')}
                    >
                    Sign In
                    </Button>
                    <Button
                    className="w-full"
                    onClick={() => handleAuthAction('signUp')}
                    >
                    Sign Up
                    </Button>
                </div>
                <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>
                <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                    Continue with Google
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
              <AlertTitle>Authentication Error</AlertTitle>
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
    </div>
  );
}