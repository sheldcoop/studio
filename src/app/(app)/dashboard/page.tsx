'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { quantJourney } from '@/lib/data';
import { AnimatedTagline } from '@/components/app/animated-tagline';
import { LinearAlgebraAnimation } from '@/components/app/linear-algebra-animation';
import { MentalMathAnimation } from '@/components/app/mental-math-animation';
import { TimeSeriesAnimation } from '@/components/app/time-series-animation';
import { StatisticsAnimation } from '@/components/app/statistics-animation';
import { MachineLearningAnimation } from '@/components/app/machine-learning-animation';
import { useState, ComponentType, FC } from 'react';
import { cn } from '@/lib/utils';
import { ConfidenceIntervalAnimation } from '@/components/app/confidence-interval-animation';

const animationComponents: Record<string, FC<any>> = {
  'linear-algebra': LinearAlgebraAnimation,
  'mental-math': MentalMathAnimation,
  'time-series': TimeSeriesAnimation,
  'stats-prob': StatisticsAnimation,
  'machine-learning': MachineLearningAnimation,
  'stat-toolkit': ConfidenceIntervalAnimation,
};

export default function DashboardPage() {
  const [activeCard, setActiveCard] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8">
      <div className="mb-12 max-w-3xl text-center">
        <AnimatedTagline />
        <p className="mt-4 text-lg text-muted-foreground">
          Master the core pillars of quantitative finance and data science, from
          foundational theory to practical application.
        </p>
      </div>
      <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quantJourney.map((item) => {
          const AnimationComponent = animationComponents[item.id];
          const isCardActive = activeCard === item.id;

          if (AnimationComponent) {
            return (
              <div
                key={item.id}
                className="group relative rounded-lg ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onPointerEnter={() => setActiveCard(item.id)}
                onPointerLeave={() => setActiveCard(null)}
              >
                <Link href={item.href} className="h-full w-full">
                  <Card className="flex h-full transform-gpu flex-col overflow-hidden bg-gradient-to-br from-card to-card/60 text-left transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:shadow-primary/20">
                    <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <AnimationComponent />
                    </div>
                    <div className="relative z-10 flex h-full flex-col justify-between p-6">
                      <div>
                        <div className="mb-4">
                          <item.icon
                            className={cn(
                              'h-8 w-8 text-primary transition-colors',
                              isCardActive && 'text-primary-foreground/80'
                            )}
                          />
                        </div>
                        <CardTitle
                          className={cn(
                            'font-headline text-xl transition-colors',
                            isCardActive && 'text-card'
                          )}
                        >
                          {item.title}
                        </CardTitle>
                      </div>
                      <CardDescription
                        className={cn(
                          'transition-colors',
                          isCardActive && 'text-primary-foreground/70'
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
        })}
      </div>
    </div>
  );
}

    