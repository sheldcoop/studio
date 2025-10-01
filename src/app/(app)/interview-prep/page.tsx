import type { Metadata } from 'next';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Interview Question Generator',
  description: 'Practice questions for your upcoming quantitative finance interviews.',
};

export default function InterviewPrepPage() {
  return (
    <>
      <PageHeader
        title="Interview Question Generator"
        description="Practice questions for your upcoming quant interviews."
      />
       <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Feature Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
            <Bot className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-semibold">
              The AI Interview Generator is currently under development.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              This feature will be available in a future update. Stay tuned!
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
