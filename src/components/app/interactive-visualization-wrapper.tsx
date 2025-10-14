
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { ReactNode } from 'react';

interface InteractiveVisualizationWrapperProps {
  title: string;
  children: ReactNode;
}

export function InteractiveVisualizationWrapper({ title, children }: InteractiveVisualizationWrapperProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}
