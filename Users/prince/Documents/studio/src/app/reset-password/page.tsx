
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
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
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

const auth = getAuth(app);

function ResetPasswordComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [oobCode, setOobCode] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const code = searchParams.get('oobCode');
    if (!code) {
      setError('Invalid password reset link. Please try again from the login page.');
      setIsLoading(false);
      return;
    }

    setOobCode(code);

    // Verify the code is valid
    verifyPasswordResetCode(auth, code)
      .then(() => {
        // Code is valid
        setIsLoading(false);
      })
      .catch(() => {
        setError('This password reset link is invalid or has expired. Please request a new one.');
        setIsLoading(false);
      });
  }, [searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    if (!oobCode) {
        setError('An unexpected error occurred. No reset code found.');
        return;
    }

    setIsResetting(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setSuccessMessage('Your password has been successfully reset. You can now log in with your new password.');
      setTimeout(() => router.push('/login'), 4000);
    } catch (err) {
      setError('An error occurred. The link may have expired. Please try again.');
    } finally {
        setIsResetting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-headline">Reset Your Password</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {successMessage && (
               <Alert variant="default" className="mb-4 border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-700 dark:[&>svg]:text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>{successMessage}</AlertDescription>
               </Alert>
            )}

            {isLoading ? (
               <div className="flex justify-center items-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
               </div>
            ) : (
              !successMessage && !error && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isResetting}>
                    {isResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Reset Password
                  </Button>
                </form>
              )
            )}
          </CardContent>
          <CardFooter>
              <Button variant="link" className="w-full" onClick={() => router.push('/login')}>
                  Back to Login
              </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

// Next.js's Pages that use `useSearchParams` must be wrapped in a `<Suspense>`
// boundary. This is the standard way to structure such pages.
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>}>
      <ResetPasswordComponent />
    </Suspense>
  )
}
