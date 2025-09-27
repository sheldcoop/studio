
import Link from 'next/link';
import type { Topic } from '@/lib/data';
import { cn } from '@/lib/utils';
import {
  CheckCircle,
  PlayCircle,
  Clock,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LessonItemProps {
  lesson: Topic;
  isLast: boolean;
}

const statusIcons = {
  completed: CheckCircle,
  'in-progress': PlayCircle,
  'not-started': Clock,
};

const statusLabels = {
    completed: 'Completed',
    'in-progress': 'In Progress',
    'not-started': 'Not Started',
}

const statusVariants = {
    completed: 'completed',
    'in-progress': 'inProgress',
    'not-started': 'notStarted',
}

export function LessonItem({ lesson, isLast }: LessonItemProps) {
  const Icon = statusIcons[lesson.status || 'not-started'];
  const label = statusLabels[lesson.status || 'not-started'];
  const variant = statusVariants[lesson.status || 'not-started'] as "completed" | "inProgress" | "notStarted";

  return (
    <li className={cn('mx-6 border-t border-border/50', isLast && 'border-b')}>
        <Link href={lesson.href} className="group flex items-center justify-between p-4 transition-colors hover:bg-secondary/30">
            <div className="flex items-center gap-4">
                <Icon className={cn("h-6 w-6", 
                    lesson.status === 'completed' && 'text-green-500',
                    lesson.status === 'in-progress' && 'text-teal-500',
                    lesson.status === 'not-started' && 'text-muted-foreground'
                )} />
                <span className="font-medium text-foreground/90 group-hover:text-foreground">{lesson.title}</span>
            </div>
            <div className="flex items-center gap-6">
                <Badge variant={variant} className="hidden w-24 justify-center sm:flex">{label}</Badge>
                <span className="w-16 text-right text-sm text-muted-foreground">{lesson.duration} min</span>
            </div>
        </Link>
    </li>
  );
}
