import Image from 'next/image';
import Link from 'next/link';
import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, BookOpenCheck, BotMessageSquare, Users } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const featureCards = [
  {
    id: 'paths',
    title: 'Explore Learning Paths',
    description: 'Follow curated paths to master key quant topics.',
    href: '/paths',
    icon: BookOpenCheck,
    imageId: 'learning-path',
  },
  {
    id: 'interview',
    title: 'AI Interview Prep',
    description: 'Generate and practice with unlimited interview questions.',
    href: '/interview-prep',
    icon: BotMessageSquare,
    imageId: 'interview-prep',
  },
  {
    id: 'community',
    title: 'Join the Community',
    description: 'Discuss, ask questions, and learn with peers.',
    href: '/community',
    icon: Users,
    imageId: 'community-forum',
  },
];

export default function DashboardPage() {
  const progressValue = 35; // Example progress

  return (
    <>
      <PageHeader
        title="Welcome Back!"
        description="Let's continue your journey to becoming a top quant."
      />
      <div className="grid gap-8">
        <Card className="bg-gradient-to-br from-card to-secondary">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Your Overall Progress
            </CardTitle>
            <CardDescription>You're on the right track. Keep going!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-primary">{progressValue}%</span>
              <Progress value={progressValue} className="flex-1" />
            </div>
          </CardContent>
        </Card>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featureCards.map((feature) => {
            const image = PlaceHolderImages.find(img => img.id === feature.imageId);
            return (
              <Card key={feature.id} className="flex flex-col overflow-hidden">
                <div className="relative h-48 w-full">
                  {image && (
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="object-cover"
                      data-ai-hint={image.imageHint}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40" />
                </div>
                <CardHeader className="relative">
                  <div className="absolute -top-8 right-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-background shadow-md">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="font-headline pt-2">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <Button asChild variant="outline" className="w-full">
                    <Link href={feature.href}>
                      Go to Section <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}
