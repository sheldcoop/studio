'use client';

import React, { useState, useEffect } from 'react';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Phone } from 'lucide-react';
import { useAuth } from '@/app/auth-provider';
import PhoneInput from 'react-phone-number-input';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export function PhoneSignInForm() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const router = useRouter();
  const { refreshUser } = useAuth();
  
  useEffect(() => {
    const auth = getAuth();
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved
        }
      });
    }
  }, []);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const auth = getAuth();
      const appVerifier = window.recaptchaVerifier!;
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      setStep('code');
    } catch (error: any) {
      console.error('Phone sign-in error:', error);
      if (error.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number. Use format: +1234567890');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many requests. Please try again later.');
      } else {
        setError('Failed to send verification code');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!confirmationResult) {
        setError('No confirmation result found');
        return;
      }

      const result = await confirmationResult.confirm(verificationCode);
      const user = result.user;
      const idToken = await user.getIdToken();

      const response = await fetch('/api/auth/phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        await refreshUser();
        router.push('/');
      } else {
        setError(data.error || 'Verification failed');
      }
    } catch (error: any) {
      console.error('Code verification error:', error);
      if (error.code === 'auth/invalid-verification-code') {
        setError('Invalid verification code');
      } else if (error.code === 'auth/code-expired') {
        setError('Code expired. Please request a new one.');
      } else {
        setError('Failed to verify code');
      }
    } finally {
      setLoading(false);
    }
  };

  if (step === 'code') {
    return (
      <form onSubmit={handleVerifyCode} className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground text-center">
            Enter the code sent to {phoneNumber}
          </p>
          <Input
            type="text"
            placeholder="123456"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
            disabled={loading}
            maxLength={6}
          />
        </div>
        {error && <p className="text-sm text-center text-destructive">{error}</p>}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setStep('phone');
              setVerificationCode('');
              setError('');
            }}
            disabled={loading}
          >
            Back
          </Button>
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Verify Code'}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSendCode} className="space-y-4">
      <div className="space-y-2">
        <PhoneInput
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(value) => setPhoneNumber(value || '')}
            international
            countryCallingCodeEditable={false}
            defaultCountry="US"
        />
      </div>
      {error && <p className="text-sm text-center text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <><Phone className="mr-2 h-4 w-4" /> Send Code</>}
      </Button>
    </form>
  );
}
