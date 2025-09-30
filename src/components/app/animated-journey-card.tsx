
'use client';

import Link from 'next/link';
import { useState, type ComponentType } from 'react';
import type { Topic } from '@/lib/site';
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
  const [isHovered, setIsHovered] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const handlePointerEnter = () => {
    setIsHovered(true);
    if (!hasLoaded) {
      setHasLoaded(true);
    }
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
  };

  return (
    <Link
      href={item.href}
      className="group rounded-lg ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <Card className="relative flex h-full min-h-[250px] transform-gpu flex-col justify-between overflow-hidden bg-gradient-to-br from-card to-card/60 text-left transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-primary/20">
        
        {/* Text Content Area */}
        <div className={cn("flex h-full flex-col justify-between p-6 transition-opacity duration-300", isHovered ? "opacity-0" : "opacity-100")}>
          <CardHeader className="p-0">
            <div className="mb-4">
              <item.icon className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-xl">
              {item.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <CardDescription>{item.description}</CardDescription>
          </CardContent>
        </div>

        {/* Animation Area */}
        <div className={cn("absolute inset-0 h-full w-full transition-opacity duration-300", isHovered ? "opacity-100" : "opacity-0")}>
          {hasLoaded ? (
            <AnimationComponent
              onPointerEnter={() => {}}
              onPointerLeave={() => {}}
              className="h-full w-full"
            />
          ) : (
             <div className="h-full w-full" />
          )}
        </div>
      </Card>
    </Link>
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
