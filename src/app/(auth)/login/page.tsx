'use client';

import { useState } from 'react';
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
import { AlertTriangle, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/app/auth-provider';
import { GoogleSignInButton } from '@/components/app/google-sign-in-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MagicLinkForm } from '@/components/app/magic-link-form';
import { PhoneSignInForm } from '@/components/app/phone-sign-in-form';

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<'signIn' | 'signUp'>('signIn');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setInfoMessage(null);

    const url = authMode === 'signIn' ? '/api/auth/login' : '/api/auth/signup';
    const body = authMode === 'signIn' 
      ? JSON.stringify({ email, password })
      : JSON.stringify({ email, password, displayName });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      const data = await response.json();

      if (response.ok) {
        if (authMode === 'signUp') {
          setInfoMessage('Account created successfully! Please sign in.');
          setAuthMode('signIn');
        } else {
          await refreshUser();
          router.push('/');
        }
      } else {
        setError(data.error || 'An unexpected error occurred.');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const changeMode = (newMode: 'signIn' | 'signUp') => {
    setError(null);
    setInfoMessage(null);
    setEmail('');
    setPassword('');
    setDisplayName('');
    setAuthMode(newMode);
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 flex justify-center">
        <Link href="/" aria-label="Back to homepage">
          <Logo />
        </Link>
      </div>
      <Card>
        <Tabs defaultValue="social" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="social">Social & Magic Link</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            
            <TabsContent value="social">
                <CardHeader>
                    <CardTitle className="font-headline text-center">Welcome</CardTitle>
                    <CardDescription className="text-center">Sign in with your preferred provider.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <GoogleSignInButton />
                     <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
                    </div>
                    <MagicLinkForm />
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
                    </div>
                    <PhoneSignInForm />
                </CardContent>
            </TabsContent>
            
            <TabsContent value="password">
                <form onSubmit={handleEmailPasswordSubmit}>
                  {error && (
                    <Alert variant="destructive" className="mx-6 mb-0 mt-6">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {infoMessage && (
                    <Alert variant="default" className="mx-6 mb-0 mt-6 border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-700 dark:[&>svg]:text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Success!</AlertTitle>
                      <AlertDescription>{infoMessage}</AlertDescription>
                    </Alert>
                  )}
                  
                  {authMode === 'signIn' ? (
                     <>
                        <CardHeader className="text-center">
                        <CardTitle className="font-headline">Welcome Back</CardTitle>
                        <CardDescription>Sign in with your email and password.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                        </CardContent>
                        <CardFooter className="flex-col gap-4">
                          <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign In'}
                          </Button>
                          <div className="text-center text-sm">
                            No account?{' '}
                            <Button variant="link" type="button" className="p-0 h-auto" onClick={() => changeMode('signUp')}>
                              Sign up now
                            </Button>
                          </div>
                        </CardFooter>
                      </>
                  ) : (
                     <>
                        <CardHeader className="text-center">
                          <CardTitle className="font-headline">Create an Account</CardTitle>
                          <CardDescription>Enter your details below to get started.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="displayName">Display Name</Label>
                            <Input id="displayName" type="text" placeholder="Jane Doe" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email-signup">Email Address</Label>
                            <Input id="email-signup" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password-signup">Password</Label>
                            <Input id="password-signup" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                          </div>
                        </CardContent>
                        <CardFooter className="flex-col gap-4">
                          <Button type="submit" className="w-full" disabled={isLoading}>
                             {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Account'}
                          </Button>
                          <Button variant="link" type="button" className="text-sm" onClick={() => changeMode('signIn')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Sign In
                          </Button>
                        </CardFooter>
                      </>
                  )}
                </form>
            </TabsContent>
        </Tabs>
      </Card>
      <div id="recaptcha-container" className="fixed bottom-0 right-0"></div>
    </div>
  );
}
