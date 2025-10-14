
import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ExampleStepProps {
  stepNumber: number;
  title: string;
  children: ReactNode;
}

export function ExampleStep({ stepNumber, title, children }: ExampleStepProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-headline text-2xl font-semibold tracking-tight">
        <span className="text-primary">{`Step ${stepNumber}:`}</span> {title}
      </h3>
      <div className="pl-4 border-l-2 border-primary/20 space-y-4">
        {children}
      </div>
    </div>
  );
}
