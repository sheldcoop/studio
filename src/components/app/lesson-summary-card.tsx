
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ReactNode } from 'react';

interface LessonSummaryCardProps {
    title?: string;
    children: ReactNode;
}

export function LessonSummaryCard({ title = "Summary: The Key Ideas", children }: LessonSummaryCardProps) {
  return (
    <Card className="bg-primary/10 border-primary">
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-6 space-y-2">
            {children}
        </ul>
      </CardContent>
    </Card>
  );
}
