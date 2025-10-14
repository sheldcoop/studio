
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ReactNode } from 'react';

interface DefinitionCardProps {
  title: string;
  children: ReactNode;
}

export function DefinitionCard({ title, children }: DefinitionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-invert max-w-none text-muted-foreground">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
