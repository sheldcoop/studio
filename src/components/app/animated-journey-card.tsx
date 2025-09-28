
'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Topic } from '@/lib/topics';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ComponentType } from 'react';

interface AnimationProps {
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  className?: string;
}

interface AnimatedJourneyCardProps {
  item: Topic;
  AnimationComponent: ComponentType<AnimationProps>;
}

export function AnimatedJourneyCard({ item, AnimationComponent }: AnimatedJourneyCardProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      key={item.id}
      className="group relative rounded-lg ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Link href={item.href} className="h-full w-full">
        <Card className="flex h-full transform-gpu flex-col overflow-hidden bg-gradient-to-br from-card to-card/60 text-left transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-primary/20">
          <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <AnimationComponent
              onPointerEnter={() => setIsActive(true)}
              onPointerLeave={() => setIsActive(false)}
            />
          </div>
          <div className="relative z-10 flex h-full flex-col justify-between p-6">
            <div>
              <div className="mb-4">
                <item.icon
                  className={cn(
                    'h-8 w-8 text-primary transition-colors',
                    isActive && 'text-primary-foreground/80'
                  )}
                />
              </div>
              <CardTitle
                className={cn(
                  'font-headline text-xl transition-colors',
                  isActive && 'text-card'
                )}
              >
                {item.title}
              </CardTitle>
            </div>
            <CardDescription
              className={cn(
                'transition-colors',
                isActive && 'text-primary-foreground/70'
              )}
            >
              {item.description}
            </CardDescription>
          </div>
        </Card>
      </Link>
    </div>
  );
}

export function StaticJourneyCard({ item }: { item: Topic }) {
  return (
    <Link
      href={item.href}
      key={item.id}
      className="group rounded-lg ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card className="flex h-full transform-gpu flex-col bg-gradient-to-br from-card to-card/60 text-left transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-primary/20">
        <CardHeader>
          <div className="mb-4">
            <item.icon className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-xl">
            {item.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>{item.description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
