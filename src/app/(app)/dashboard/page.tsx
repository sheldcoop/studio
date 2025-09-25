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

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8">
      <div className="mb-12 max-w-2xl text-center">
        <AnimatedTagline />
        <p className="mt-4 text-lg text-muted-foreground">
          Master the core pillars of quantitative finance and data science, from
          foundational theory to practical application.
        </p>
      </div>
      <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quantJourney.map((item) => (
          <Link
            href={item.href}
            key={item.id}
            className="rounded-lg ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Card className="flex h-full transform-gpu flex-col bg-card/50 text-left transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20">
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
        ))}
      </div>
    </div>
  );
}
