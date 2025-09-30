
'use client';

import Link from 'next/link';
import { useState, useRef, type ComponentType } from 'react';
import type { Topic } from '@/lib/topics';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';


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
  const [hasLoaded, setHasLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerEnter = () => {
    // Trigger the load only on the first hover
    if (!hasLoaded) {
      setHasLoaded(true);
    }
  }
  
  const handlePointerLeave = () => {
    // No action needed on leave anymore
  }


  return (
    <div
      ref={cardRef}
      key={item.id}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className="group relative rounded-lg ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Link href={item.href} className="h-full w-full">
        <Card className="flex h-full transform-gpu flex-col overflow-hidden bg-gradient-to-br from-card to-card/60 text-left transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-primary/20">
          <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            {hasLoaded ? (
              <AnimationComponent
                onPointerEnter={() => {}}
                onPointerLeave={() => {}}
              />
            ) : (
                <Skeleton className="h-full w-full" />
            )}
          </div>
          <div className="relative z-10 flex h-full flex-col justify-between p-6 opacity-100 transition-opacity duration-500 group-hover:opacity-0">
            <div>
              <div className="mb-4">
                <item.icon
                  className='h-8 w-8 text-primary'
                />
              </div>
              <CardTitle
                className='font-headline text-xl'
              >
                {item.title}
              </CardTitle>
            </div>
            <CardDescription
              className='text-muted-foreground'
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
