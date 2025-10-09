'use client';

import { useState, useEffect } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult, 
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
import { AlertTriangle, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const getFriendlyErrorMessage = (error: AuthError): string => {
    console.error('Authentication Error:', error);
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
            return 'The sign-in popup was closed. Please try again.';
        case 'auth/captcha-check-failed':
            return 'The reCAPTCHA verification failed. Please try again.';
        case 'auth/invalid-phone-number':
            return 'Please enter a valid phone number, including the country code (e.g., +1).';
        case 'auth/missing-phone-number':
            return 'Please enter a phone number.';
        case 'auth/quota-exceeded':
            return 'SMS quota exceeded. Please try again later or use another method.';
        case 'auth/code-expired':
            return 'The verification code has expired. Please request a new one.';
        case 'auth/invalid-verification-code':
            return 'Invalid verification code. Please check the code and try again.';
        default:
            return `An unexpected error occurred (Code: ${error.code}). Please try again.`;
    }
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  
  const [view, setView] = useState('main'); // 'main', 'reset', 'phone', 'phoneCode'
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // General purpose loading state
  
  const router = useRouter();

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let emailFromStore = window.localStorage.getItem('emailForSignIn');
      if (!emailFromStore) {
        emailFromStore = window.prompt('Please provide your email for confirmation');
      }
      if(emailFromStore){
        signInWithEmailLink(auth, emailFromStore, window.location.href)
            .then((result) => {
                window.localStorage.removeItem('emailForSignIn');
                handleSuccessfulLogin(result.user);
            })
            .catch((err) => setError(getFriendlyErrorMessage(err as AuthError)));
      }
    }
  }, []);

  useEffect(() => {
    // Ensure the container exists and is visible before initializing.
    const recaptchaContainer = document.getElementById('recaptcha-container');
    if (view === 'phone' && recaptchaContainer && !window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainer, {
            'size': 'invisible',
            'callback': (response: any) => { /* reCAPTCHA solved */ }
        });
    } else if (view !== 'phone' && window.recaptchaVerifier) {
        // Cleanup if view changes
        window.recaptchaVerifier.clear();
    }
  }, [view]);


  const handleSuccessfulLogin = (user: User) => {
    if (user.providerData.some(p => p.providerId === 'password') && !user.emailVerified) {
      setError("Please verify your email address. Another verification link has been sent.");
      sendEmailVerification(user);
      signOut(auth);
    } else {
      router.push('/');
    }
  }

  const handleAuthAction = async (action: 'signUp' | 'signIn') => {
    setError(null);
    setInfoMessage(null);
    setIsSubmitting(true);
    try {
      if (action === 'signUp') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        await signOut(auth);
        setInfoMessage('Account created. Please check your email to verify your account.');
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        handleSuccessfulLogin(userCredential.user);
      }
    } catch (err) {
      setError(getFriendlyErrorMessage(err as AuthError));
    } finally {
        setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    setError(null);
    setInfoMessage(null);
    if (!email) {
        setError('Please enter your email address to reset your password.');
        return;
    }
    setIsSubmitting(true);
    try {
        await sendPasswordResetEmail(auth, email);
        setInfoMessage('A password reset link has been sent to your email address.');
    } catch (err) {
        setError(getFriendlyErrorMessage(err as AuthError));
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setInfoMessage(null);
    setIsSubmitting(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      handleSuccessfulLogin(userCredential.user);
    } catch (err) {
      setError(getFriendlyErrorMessage(err as AuthError));
    } finally {
        setIsSubmitting(false);
    }
  }

  const handlePhoneSignIn = async () => {
    setError(null);
    setInfoMessage(null);
    if (!phoneNumber) {
        setError('Please enter your phone number.');
        return;
    }
    setIsSubmitting(true);
    try {
        const verifier = window.recaptchaVerifier;
        const result = await signInWithPhoneNumber(auth, phoneNumber, verifier);
        setConfirmationResult(result);
        setInfoMessage('A verification code has been sent to your phone.');
        setView('phoneCode');
    } catch (err) {
        setError(getFriendlyErrorMessage(err as AuthError));
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async () => {
    setError(null);
    setInfoMessage(null);
    if (!verificationCode) {
        setError('Please enter the 6-digit verification code.');
        return;
    }
    if (!confirmationResult) {
        setError('An unexpected error occurred. Please try sending the code again.');
        return;
    }
    setIsSubmitting(true);
    try {
        const userCredential = await confirmationResult.confirm(verificationCode);
        handleSuccessfulLogin(userCredential.user);
    } catch (err) {
        setError(getFriendlyErrorMessage(err as AuthError));
    } finally {
        setIsSubmitting(false);
    }
  };


  const renderContent = () => {
    switch (view) {
      case 'reset':
        return (
            <>
                <CardHeader className="text-center">
                <CardTitle className="font-headline">Reset Your Password</CardTitle>
                <CardDescription>Enter your email to receive a reset link.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <Button className="w-full" onClick={handlePasswordReset} disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Send Reset Link
                    </Button>
                    <Button variant="link" className="text-sm" onClick={() => { setView('main'); setError(null); setInfoMessage(null); }}>
                        <ArrowLeft className="mr-2" /> Back to Login
                    </Button>
                </CardFooter>
            </>
        )
       case 'phone':
        return (
            <>
                <CardHeader className="text-center">
                    <CardTitle className="font-headline">Sign In With Phone</CardTitle>
                    <CardDescription>Enter your phone number to receive a verification code.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+1 123 456 7890" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        <p className="text-xs text-muted-foreground px-1 pt-1">Security notice: For your protection, do not use a public or shared phone number. SMS-based verification may not be fully secure.</p>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <Button id="sign-in-button" className="w-full" onClick={handlePhoneSignIn} disabled={isSubmitting}>
                         {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Send Verification Code
                    </Button>
                    <Button variant="link" className="text-sm" onClick={() => { setView('main'); setError(null); setInfoMessage(null); }}>
                        <ArrowLeft className="mr-2" /> Back to Login
                    </Button>
                </CardFooter>
            </>
        )
        case 'phoneCode':
            return (
                <>
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline">Enter Verification Code</CardTitle>
                        <CardDescription>We've sent a 6-digit code to {phoneNumber}.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="code">Verification Code</Label>
                            <Input id="code" type="text" maxLength={6} placeholder="_ _ _ _ _ _" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-4">
                        <Button className="w-full" onClick={handleVerifyCode} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Confirm & Sign In
                        </Button>
                        <Button variant="link" className="text-sm" onClick={() => { setView('phone'); setError(null); setInfoMessage(null); }}>
                            <ArrowLeft className="mr-2" /> Back
                        </Button>
                    </CardFooter>
                </>
            )
      case 'main':
      default:
        return (
            <>
                <CardHeader className="text-center">
                    <CardTitle className="font-headline">Welcome to QuantPrep</CardTitle>
                    <CardDescription>Sign in or create an account to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Button variant="link" className="h-auto p-0 text-xs" onClick={() => setView('reset')}>Forgot Password?</Button>
                            </div>
                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <div className="flex w-full gap-2">
                        <Button variant="secondary" className="w-full" onClick={() => handleAuthAction('signIn')} disabled={isSubmitting}>
                           {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Sign In
                        </Button>
                        <Button className="w-full" onClick={() => handleAuthAction('signUp')} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Sign Up
                        </Button>
                    </div>
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or continue with</span></div>
                    </div>
                    <Button asChild variant="outline" className="w-full" disabled={isSubmitting}>
                      <Link href="/magic-link">Sign in with Magic Link</Link>
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isSubmitting}>Continue with Google</Button>
                    <Button variant="outline" className="w-full" onClick={() => setView('phone')} disabled={isSubmitting}>Sign in with Phone</Button>
                </CardFooter>
            </>
        )
    }
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
      <div id="recaptcha-container" className="my-4"></div>
      <Button variant="link" className="mt-4 text-muted-foreground" asChild>
        <Link href="/">Back to homepage</Link>
      </Button>
    </div>
  );
}

declare global {
    interface Window { 
        recaptchaVerifier: any;
    }
}
