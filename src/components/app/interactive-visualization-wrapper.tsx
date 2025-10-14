
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { ReactNode } from 'react';

interface InteractiveVisualizationWrapperProps {
  title: string;
  description: string;
  children: ReactNode;
  controls?: ReactNode;
}

export function InteractiveVisualizationWrapper({ title, description, children, controls }: InteractiveVisualizationWrapperProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-background">
            {children}
        </div>
        {controls && (
            <div className="mt-4 flex justify-center gap-8">
                {controls}
            </div>
        )}
      </CardContent>
    </Card>
  )
}
