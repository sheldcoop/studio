
import Link from 'next/link';
import type { LearningPath } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface LearningPathCardProps {
  path: LearningPath;
}

export function LearningPathCard({ path }: LearningPathCardProps) {
  const totalLessons = path.lessons.length;
  const completedLessons = path.lessons.filter(
    (l) => l.status === 'completed'
  ).length;
  const progress =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const totalDuration = path.lessons.reduce(
    (acc, lesson) => acc + (lesson.duration || 0),
    0
  );

  return (
    <Link href={path.lessons[0]?.href || '#'} className="group block h-full">
      <Card className="flex h-full flex-col transition-all duration-300 ease-in-out group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/10">
        <CardHeader>
          <div className="mb-4">
            <path.icon className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-xl">{path.title}</CardTitle>
          <CardDescription>{path.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          {/* Content can be added here if needed in the future */}
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
          <div className="w-full">
            <div className="mb-2 flex justify-between text-xs text-muted-foreground">
              <span>
                Progress: {completedLessons} / {totalLessons}
              </span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="flex w-full justify-between text-sm text-muted-foreground">
            <Badge variant="outline" className="flex items-center gap-2">
              <BookOpen className="h-3 w-3" />
              <span>{totalLessons} Lessons</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>~{totalDuration} min</span>
            </Badge>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
