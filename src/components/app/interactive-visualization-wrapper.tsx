
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { ReactNode } from 'react';

interface InteractiveVisualizationWrapperProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function InteractiveVisualizationWrapper({ title, description, children }: InteractiveVisualizationWrapperProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}
