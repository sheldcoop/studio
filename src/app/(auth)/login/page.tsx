
'use client';

import { useState, useEffect, useRef } from 'react';
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
import { AlertTriangle, CheckCircle, ArrowLeft, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { type ConfirmationResult } from 'firebase/auth';

type AuthMode = 'signIn' | 'resetPassword' | 'magicLink' | 'phoneAuth' | 'phoneVerify';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('signIn');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const { 
    handleAuthAction, 
    handlePasswordReset, 
    handleGoogleSignIn, 
    handleSendSignInLink,
    handlePhoneSignIn,
    handleVerifyPhoneCode,
  } = useAuth();
  
  const performAuthAction = async (action: 'signUp' | 'signIn') => {
    setError(null);
    setInfoMessage(null);
    const result = await handleAuthAction(action, email, password);
    if(result.success) {
      setInfoMessage(action === 'signUp' ? 'Account created successfully! Welcome!' : 'Login successful!');
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

  const performMagicLinkSignIn = async () => {
    setError(null);
    setInfoMessage(null);
    const result = await handleSendSignInLink(email);
    if (result.success) {
      setInfoMessage(result.message);
    } else {
      setError(result.message);
    }
  };
  
  const performPhoneSignIn = async () => {
    setError(null);
    setInfoMessage(null);
    const result = await handlePhoneSignIn(phoneNumber, 'recaptcha-container');
    if (result.success && result.confirmationResult) {
      setConfirmationResult(result.confirmationResult);
      setAuthMode('phoneVerify');
      setInfoMessage('SMS sent! Please enter the verification code.');
    } else {
      setError(result.message);
    }
  };

  const performVerifyPhoneCode = async () => {
    setError(null);
    setInfoMessage(null);
    if (!confirmationResult) {
      setError("An error occurred. Please try sending the code again.");
      return;
    }
    const result = await handleVerifyPhoneCode(confirmationResult, verificationCode);
    if (result.success) {
      setInfoMessage('Phone number verified successfully! You are now logged in.');
    } else {
      setError(result.message);
    }
  };

  const performGoogleSignIn = async () => {
    setError(null);
    setInfoMessage(null);
    const result = await handleGoogleSignIn();
     if(!result.success) {
      setError(result.message);
    }
  }

  const clearMessages = () => {
    setError(null);
    setInfoMessage(null);
  }
  
  const changeMode = (newMode: AuthMode) => {
    clearMessages();
    setAuthMode(newMode);
  }

  const renderContent = () => {
    switch (authMode) {
      case 'phoneAuth':
        return (
          <>
            <CardHeader className="text-center">
              <CardTitle className="font-headline">Sign In with Phone</CardTitle>
              <CardDescription>
                Enter your phone number to receive a verification code.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+1 555-555-5555" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                </div>
                {/* This container is REQUIRED for the reCAPTCHA widget */}
                <div id="recaptcha-container"></div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
                <Button id="sign-in-button" className="w-full" onClick={performPhoneSignIn}>Send SMS Code</Button>
                <Button variant="link" className="text-sm" onClick={() => changeMode('signIn')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                </Button>
            </CardFooter>
          </>
        );

      case 'phoneVerify':
        return (
          <>
            <CardHeader className="text-center">
              <CardTitle className="font-headline">Enter Verification Code</CardTitle>
              <CardDescription>
                Check your SMS messages for the 6-digit code.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input id="code" type="text" placeholder="123456" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} />
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
                <Button className="w-full" onClick={performVerifyPhoneCode}>Verify & Sign In</Button>
                 <Button variant="link" className="text-sm" onClick={() => changeMode('phoneAuth')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to phone number entry
                </Button>
            </CardFooter>
          </>
        );

      case 'resetPassword':
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
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
                <Button className="w-full" onClick={performPasswordReset}>Send Reset Link</Button>
                <Button variant="link" className="text-sm" onClick={() => changeMode('signIn')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                </Button>
            </CardFooter>
          </>
        );

      case 'magicLink':
        return (
          <>
            <CardHeader className="text-center">
              <CardTitle className="font-headline">Sign In with a Magic Link</CardTitle>
              <CardDescription>
                We'll send a temporary sign-in link to your email. No password needed.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
                <Button className="w-full" onClick={performMagicLinkSignIn}><Mail className="mr-2 h-4 w-4" />Send Magic Link</Button>
                <Button variant="link" className="text-sm" onClick={() => changeMode('signIn')}>
                     <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                </Button>
            </CardFooter>
          </>
        );
      
      case 'signIn':
      default:
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
                            <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Button variant="link" className="h-auto p-0 text-xs" onClick={() => changeMode('resetPassword')}>
                                    Forgot Password?
                                </Button>
                            </div>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <div className="flex w-full gap-2">
                        <Button variant="secondary" className="w-full" onClick={() => performAuthAction('signIn')}>
                        Sign In
                        </Button>
                        <Button className="w-full" onClick={() => performAuthAction('signUp')}>
                        Sign Up
                        </Button>
                    </div>
                     <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or</span>
                        </div>
                    </div>
                    <div className='flex w-full gap-2'>
                        <Button variant="outline" className="w-full" onClick={performGoogleSignIn}>
                            Continue with Google
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => changeMode('magicLink')}>
                            <Mail className="mr-2 h-4 w-4" /> Email Link
                        </Button>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => changeMode('phoneAuth')}>
                        <Phone className="mr-2 h-4 w-4" /> Continue with Phone
                    </Button>
                </CardFooter>
            </>
        );
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

    