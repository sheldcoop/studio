'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getAuth, verifyPasswordResetCode, confirmPasswordReset, type AuthError } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/app/logo';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

const auth = getAuth(app);

const getFriendlyErrorMessage = (error: AuthError): string => {
    console.error("Password Reset Error:", error);
    switch (error.code) {
        case 'auth/expired-action-code':
            return 'This password reset link has expired. Please request a new one from the login page.';
        case 'auth/invalid-action-code':
            return 'This password reset link is invalid or has already been used. Please request a new one.';
        case 'auth/user-disabled':
            return 'Your account has been disabled. Please contact support.';
        case 'auth/user-not-found':
            return 'There is no user corresponding to this password reset link. The account may have been deleted.';
        case 'auth/weak-password':
            return 'The new password is too weak. It must be at least 6 characters long.';
        default:
            return `An unexpected error occurred (Code: ${error.code}). Please try again.`;
    }
}

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
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  useEffect(() => {
    const code = searchParams.get('oobCode');
    if (!code) {
      setError('Invalid URL. The password reset code is missing.');
      setIsLoading(false);
      return;
    }

    setOobCode(code);

    verifyPasswordResetCode(auth, code)
      .then(() => {
        setIsCodeVerified(true);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(getFriendlyErrorMessage(err as AuthError));
        setIsLoading(false);
      });
  }, [searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (newPassword !== confirmPassword) {
      setError('The passwords do not match. Please re-enter them.');
      return;
    }
    if (newPassword.length < 6) {
        setError('For security, your password must be at least 6 characters long.');
        return;
    }
    if (!oobCode) {
        setError('An unexpected error occurred. No reset code was found in the URL.');
        return;
    }

    setIsResetting(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setSuccessMessage('Your password has been successfully reset. You will be redirected to the login page shortly.');
      setTimeout(() => router.push('/login'), 4000);
    } catch (err) {
      setError(getFriendlyErrorMessage(err as AuthError));
    } finally {
        setIsResetting(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
             <Alert variant="destructive" className="mb-4">
               <AlertTriangle className="h-4 w-4" />
               <AlertTitle>Error</AlertTitle>
               <AlertDescription>{error}</AlertDescription>
             </Alert>
        );
    }
    
    if (successMessage) {
        return (
            <Alert variant="default" className="mb-4 border-green-500/50 text-green-700 dark:text-green-400 [&>svg]:text-green-700 dark:[&>svg]:text-green-400">
               <CheckCircle className="h-4 w-4" />
               <AlertTitle>Success!</AlertTitle>
               <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
        );
    }

    if (isCodeVerified) {
        return (
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
        );
    }

    return null; // Should not be reached if logic is correct
  }

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
             {renderContent()}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>}>
      <ResetPasswordComponent />
    </Suspense>
  )
}
