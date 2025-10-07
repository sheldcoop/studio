'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/auth-provider';
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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isResetMode, setIsResetMode] = useState(false);
  const { handleAuthAction, handlePasswordReset, handleGoogleSignIn } = useAuth();
  
  const performAuthAction = async (action: 'signUp' | 'signIn') => {
    setError(null);
    setInfoMessage(null);
    const result = await handleAuthAction(action, email, password);
    if(result.success) {
      setInfoMessage(result.message);
    } else {
      setError(result.message);
    }
  }

  const performPasswordReset = async () => {
    setError(null);
    setInfoMessage(null);
    const result = await handlePasswordReset(email);
    if(result.success) {
      setInfoMessage(result.message);
    } else {
      setError(result.message);
    }
  }

  const performGoogleSignIn = async () => {
    setError(null);
    setInfoMessage(null);
    const result = await handleGoogleSignIn();
     if(!result.success) {
      setError(result.message);
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
                <Button className="w-full" onClick={performPasswordReset}>Send Reset Link</Button>
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
                    onClick={() => performAuthAction('signIn')}
                    >
                    Sign In
                    </Button>
                    <Button
                    className="w-full"
                    onClick={() => performAuthAction('signUp')}
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
                <Button variant="outline" className="w-full" onClick={performGoogleSignIn}>
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
      <Button variant="link" className="mt-4 text-muted-foreground" asChild>
        <Link href="/">Back to homepage</Link>
      </Button>
    </div>
  );
}