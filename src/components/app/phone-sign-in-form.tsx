'use client';

import React, { useState, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Phone } from 'lucide-react';
import { useAuth } from '@/app/auth-provider';
import PhoneInput from 'react-phone-number-input';
import { useFirebaseAuth } from '@/firebase';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
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
  const auth = useFirebaseAuth();
  
  useEffect(() => {
    if (!auth || typeof window === 'undefined' || window.recaptchaVerifier) return;

    const recaptchaContainer = document.getElementById('recaptcha-container');
    if (recaptchaContainer) {
       window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainer, {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved
        }
      });
    }
  }, [auth]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!auth) {
        setError("Authentication service is not available.");
        setLoading(false);
        return;
    }

    try {
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
        setError('Failed to send verification code. Please ensure reCAPTCHA is working.');
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
        setLoading(false);
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
            className="text-center tracking-widest text-lg"
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
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Code'
            )}
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
            disabled={loading}
            className="phone-input-custom"
        />
      </div>
      {error && <p className="text-sm text-center text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading || !phoneNumber}>
        {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending code...
            </>
          ) : (
            <>
              <Phone className="mr-2 h-4 w-4" />
              Send verification code
            </>
          )}
      </Button>
    </form>
  );
}
