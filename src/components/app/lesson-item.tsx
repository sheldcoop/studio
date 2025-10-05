
import Link from 'next/link';
import { type Topic } from '@/lib/curriculum';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { TopicIcon } from './topic-icon';

interface LessonItemProps {
  lesson: Topic;
  isLast: boolean;
}

const statusIcons = {
  completed: 'CheckCircle',
  'in-progress': 'PlayCircle',
  'not-started': 'Clock',
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
  const iconName = statusIcons[lesson.status || 'not-started'];
  const label = statusLabels[lesson.status || 'not-started'];
  const variant = statusVariants[lesson.status || 'not-started'] as "completed" | "inProgress" | "notStarted";

  return (
    <li
      className={cn(
        'relative flex items-center gap-4 px-6 py-4',
        !isLast && 'border-b border-border/50'
      )}
    >
      <div className="absolute left-9 top-0 h-full w-px bg-border/50"></div>
      <div className="relative z-10">
        <TopicIcon
          iconName={iconName}
          className={cn(
            'h-6 w-6 rounded-full bg-background',
            lesson.status === 'completed' && 'text-green-500',
            lesson.status === 'in-progress' && 'text-teal-500',
            lesson.status === 'not-started' && 'text-muted-foreground'
          )}
        />
      </div>
      <div className="flex flex-1 items-center justify-between">
        <Link href={lesson.href} className="font-medium hover:underline">
          {lesson.title}
        </Link>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Badge variant={variant} className="hidden w-24 justify-center sm:inline-flex">{label}</Badge>
          <span>{lesson.duration} min</span>
        </div>
      </div>
    </li>
  );
}
