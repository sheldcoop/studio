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
import { AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type AuthMode = 'signIn' | 'signUp';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('signIn');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
          router.push('/'); // Redirect to dashboard on successful login
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

  const changeMode = (newMode: AuthMode) => {
    setError(null);
    setInfoMessage(null);
    setEmail('');
    setPassword('');
    setDisplayName('');
    setAuthMode(newMode);
  };

  const renderContent = () => {
    switch (authMode) {
      case 'signUp':
        return (
          <>
            <CardHeader className="text-center">
              <CardTitle className="font-headline">Create an Account</CardTitle>
              <CardDescription>Enter your details below to get started.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Jane Doe"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
              <Button variant="link" className="text-sm" onClick={() => changeMode('signIn')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Button>
            </CardFooter>
          </>
        );

      case 'signIn':
      default:
        return (
          <>
            <CardHeader className="text-center">
              <CardTitle className="font-headline">Welcome Back</CardTitle>
              <CardDescription>Sign in to continue your journey.</CardDescription>
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
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
              <div className="text-center text-sm">
                No account?{' '}
                <Button variant="link" className="p-0 h-auto" onClick={() => changeMode('signUp')}>
                  Sign up now
                </Button>
              </div>
            </CardFooter>
          </>
        );
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 flex justify-center">
        <Link href="/" aria-label="Back to homepage">
          <Logo />
        </Link>
      </div>
      <Card>
        <form onSubmit={handleSubmit}>
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
        </form>
      </Card>
    </div>
  );
}
