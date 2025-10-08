
'use client';

import { useEffect } from 'react';

export default function RootPage() {
  useEffect(() => {
    console.log(
      'NEXT_PUBLIC_FIREBASE_API_KEY:',
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    );
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center p-4 md:p-8">
      <div className="my-12 max-w-3xl text-center">
        <h1 className="font-headline text-5xl font-bold tracking-tight md:text-6xl">
          Debugging Firebase Config
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Please check the browser's developer console. We are logging the value
          of the Firebase API Key to diagnose the issue.
        </p>
      </div>
    </div>
  );
}
