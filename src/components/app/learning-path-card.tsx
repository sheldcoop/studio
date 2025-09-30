
import type { LearningPath, Module } from '@/lib/learning-paths';
import type { LucideIcon } from 'lucide-react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { LessonItem } from './lesson-item';
import { Progress } from '../ui/progress';

interface LearningPathCardProps {
  module: Module;
  icon: LucideIcon;
}

export function LearningPathCard({ module, icon: Icon }: LearningPathCardProps) {
  const totalLessons = module.lessons.length;
  const completedLessons = module.lessons.filter(
    (l) => l.status === 'completed'
  ).length;
  const progress =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const totalDuration = module.duration;

  return (
    <AccordionItem
      value={module.id}
      className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm"
    >
      <AccordionTrigger className="p-6 text-left hover:no-underline">
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-headline text-xl font-semibold">
                  {module.title}
                </h3>
              </div>
            </div>
          </div>
           <div className="mt-2 flex items-center gap-4 text-sm">
             <div className="flex-1">
                <Progress value={progress} className="h-2" />
             </div>
             <div className="flex w-40 shrink-0 items-center justify-end gap-6 text-muted-foreground">
                <div className="text-right">
                  <span className="font-semibold text-foreground">{totalLessons}</span> Lessons
                </div>
                 <div className="text-right">
                  <span className="font-semibold text-foreground">{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</span>
                 </div>
             </div>
           </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="p-0">
        <ul className="flex flex-col">
            {module.lessons.map((lesson, index) => (
                <LessonItem
                    key={lesson.id}
                    lesson={lesson}
                    isLast={index === module.lessons.length - 1}
                />
            ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}
