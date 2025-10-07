'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Topic } from '@/lib/curriculum';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DynamicAnimation } from './dynamic-animation';
import { cn } from '@/lib/utils';
import { TopicIcon } from './topic-icon';


interface JourneyCardProps {
  item: Topic;
}

export function JourneyCard({ item }: JourneyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  // If no animation is defined for the topic, render a simple static card.
  if (!item.animation) {
    return (
      <Link
        href={item.href}
        key={item.id}
        className="group rounded-lg ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Card className="flex h-full transform-gpu flex-col justify-between bg-gradient-to-br from-card to-card/60 text-left transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-primary/20">
          <CardHeader>
            <div className="mb-4">
              {item.icon && <TopicIcon iconName={item.icon} className="h-8 w-8 text-primary" />}
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

  // --- If animation IS defined, render the animated version ---

  const handleInteraction = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    setIsHovered(true);
    setTimeout(() => {
      router.push(item.href);
    }, 800);
  };

  return (
    <div
      className="group rounded-lg ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onClick={handleInteraction}
      onKeyDown={(e) => { if (e.key === 'Enter') handleInteraction(e); }}
      role="link"
      tabIndex={0}
      aria-label={`Navigate to ${item.title}`}
    >
      <Card className="relative flex h-full min-h-[250px] transform-gpu flex-col justify-between overflow-hidden bg-gradient-to-br from-card to-card/60 text-left transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-primary/20">
        
        {/* Full-size Animation Area */}
        <div className={cn(
          "absolute inset-0 h-full w-full transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
           <DynamicAnimation 
                animationId={item.animation}
                isHovered={isHovered}
              />
        </div>

        {/* Fading Text Content */}
        <div className={cn(
          "relative z-10 flex h-full flex-col justify-between p-6 transition-opacity duration-300",
          isHovered ? "opacity-0" : "opacity-100"
        )}>
            <CardHeader className="p-0">
                <div className="mb-4">
                  {item.icon && <TopicIcon iconName={item.icon} className="h-8 w-8 text-primary" />}
                </div>
                <CardTitle className="font-headline text-xl">
                  {item.title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <CardDescription>{item.description}</CardDescription>
            </CardContent>
        </div>
      </Card>
    </div>
  );
}
