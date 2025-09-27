
import type { LearningPath } from '@/lib/data';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { LessonItem } from './lesson-item';

interface LearningPathCardProps {
  path: LearningPath;
}

export function LearningPathCard({ path }: LearningPathCardProps) {
  return (
    <AccordionItem value={path.id} className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <AccordionTrigger className="p-6 text-left hover:no-underline">
            <div className='flex items-start gap-4'>
                 <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <path.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex flex-col gap-1">
                    <h3 className="font-headline text-xl font-semibold">{path.title}</h3>
                    <p className="text-sm text-muted-foreground">{path.description}</p>
                </div>
            </div>
        </AccordionTrigger>
        <AccordionContent>
            <ul className="flex flex-col">
                {path.lessons.map((lesson, index) => (
                    <LessonItem key={lesson.id} lesson={lesson} isLast={index === path.lessons.length - 1} />
                ))}
            </ul>
        </AccordionContent>
    </AccordionItem>
  );
}
