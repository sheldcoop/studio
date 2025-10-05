
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Bot } from 'lucide-react';

export function InterviewGenerator() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          AI Features Temporarily Disabled
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
          <Bot className="h-12 w-12 text-muted-foreground" />
          <p className="mt-4 font-semibold">
            The AI Mock Interview feature is currently unavailable.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            We are working to resolve a technical issue with the deployment and will
            restore this feature soon.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
