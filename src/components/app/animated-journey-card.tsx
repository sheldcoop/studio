
'use client';

import Link from 'next/link';
import { useState, useRef, type ComponentType, useEffect } from 'react';
import type { Topic } from '@/lib/topics';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useInView } from 'react-intersection-observer';


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
  const { ref, inView } = useInView({
    triggerOnce: true, // Only trigger this once
    threshold: 0.1, // Trigger when 10% of the element is visible
  });

  return (
    <div
      ref={ref}
      key={item.id}
      className="group rounded-lg ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Link href={item.href} className="h-full w-full">
        <Card className="flex h-full transform-gpu flex-col overflow-hidden bg-gradient-to-br from-card to-card/60 text-left transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-primary/20">
          <div className="flex h-full">
            {/* Text Content Area */}
            <div className="flex w-1/2 flex-col justify-between p-6">
                 <div>
                    <div className="mb-4">
                        <item.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="font-headline text-xl">
                        {item.title}
                    </CardTitle>
                 </div>
                <CardDescription className="text-muted-foreground">
                    {item.description}
                </CardDescription>
            </div>

            {/* Animation Area */}
            <div className="relative w-1/2">
                {inView ? (
                    <AnimationComponent
                        onPointerEnter={() => {}}
                        onPointerLeave={() => {}}
                    />
                ) : (
                    <Skeleton className="h-full w-full" />
                )}
            </div>
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
