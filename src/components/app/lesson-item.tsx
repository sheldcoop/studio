
import Link from 'next/link';
import { type Topic } from '@/lib/curriculum';
import { cn } from '@/lib/utils';
import {
  CheckCircle,
  PlayCircle,
  Clock,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

interface LessonItemProps {
  lesson: Topic;
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

export function LessonItem({ lesson }: LessonItemProps) {
  const Icon = statusIcons[lesson.status || 'not-started'];
  const label = statusLabels[lesson.status || 'not-started'];
  const variant = statusVariants[lesson.status || 'not-started'] as "completed" | "inProgress" | "notStarted";

  return (
    <li key={lesson.id}>
        <Link
            href={lesson.href}
            className="group mx-2 flex items-center justify-between rounded-lg p-4 transition-colors hover:bg-secondary/50"
            >
            <div className="flex items-center gap-4">
                <Icon className={cn("h-6 w-6 transition-colors group-hover:text-primary", 
                    lesson.status === 'completed' && 'text-green-500',
                    lesson.status === 'in-progress' && 'text-teal-500',
                    lesson.status === 'not-started' && 'text-muted-foreground'
                )} />
                <span className="text-lg font-medium text-foreground/90 group-hover:text-foreground">
                    {lesson.title}
                </span>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </Link>
    </li>
  );
}
