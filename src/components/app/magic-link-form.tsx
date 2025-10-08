'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Mail } from 'lucide-react';

export function MagicLinkForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Store email in localStorage so we can retrieve it on the verification page
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('emailForSignIn', email);
      }

      const response = await fetch('/api/auth/magic-link/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSent(true);
      } else {
        setError(data.error || 'Failed to send magic link');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:bg-green-900/20 dark:border-green-500/30">
        <div className="flex items-start">
          <Mail className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 mr-3" />
          <div>
            <h3 className="font-semibold text-green-900 dark:text-green-300">Check your email</h3>
            <p className="text-sm text-green-700 dark:text-green-400/80 mt-1">
              We sent a magic link to <strong>{email}</strong>. Click the link to sign in.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      {error && <p className="text-sm text-center text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            Send magic link
          </>
        )}
      </Button>
    </form>
  );
}
