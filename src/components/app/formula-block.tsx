
import { Card, CardContent } from '@/components/ui/card';
import type { ReactNode } from 'react';

interface FormulaBlockProps {
  children: ReactNode;
}

export function FormulaBlock({ children }: FormulaBlockProps) {
  return (
    <Card className="bg-muted/50">
      <CardContent className="p-4 text-center">
        {children}
      </CardContent>
    </Card>
  );
}
