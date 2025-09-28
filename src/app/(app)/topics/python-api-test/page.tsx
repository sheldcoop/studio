'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/app/page-header';
import { Loader2 } from 'lucide-react';

async function callPythonApi(): Promise<string> {
    'use server';
    try {
        // In production, this would be the absolute URL of your deployed API
        const apiUrl = process.env.NODE_ENV === 'production'
            ? 'https://quantprep-backend-i7bh.vercel.app/api'
            : 'http://127.0.0.1:9002/api';
            
        const res = await fetch(apiUrl);

        if (!res.ok) {
            const errorText = await res.text();
            return `Error: ${res.status} ${res.statusText} - ${errorText}`;
        }
        const data = await res.json();
        return data.message;
    } catch (error: any) {
        console.error('Failed to fetch from Python API:', error);
        return `Failed to connect to API: ${error.message}`;
    }
}

export default function PythonApiTestPage() {
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    setResponse('');
    const message = await callPythonApi();
    setResponse(message);
    setIsLoading(false);
  };

  return (
    <>
      <PageHeader
        title="Python API Integration Test"
        description="A proof-of-concept for calling a Python backend from a Next.js application."
      />
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Python Greeter</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={handleClick} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Calling API...
              </>
            ) : (
              'Call Python API'
            )}
          </Button>
          {response && (
            <div className="mt-6 rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Response from Python:</p>
              <p className="font-mono text-lg font-semibold text-primary">{response}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
