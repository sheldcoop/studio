
'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Topic } from '@/lib/site';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DynamicAnimation } from './dynamic-animation';

interface AnimatedJourneyCardProps {
  item: Topic;
}

export function AnimatedJourneyCard({ item }: AnimatedJourneyCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={item.href}
      className="group rounded-lg ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <Card className="relative flex h-full min-h-[250px] transform-gpu flex-col justify-between overflow-hidden bg-gradient-to-br from-card to-card/60 text-left transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-primary/20">
        
        {/* Fading Text Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-6 opacity-100 transition-opacity duration-300 group-hover:opacity-0">
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

        {/* Full-size Animation Area */}
        <div className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100">
           {item.animation && (
             <DynamicAnimation animationId={item.animation} />
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
