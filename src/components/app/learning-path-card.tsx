import type { LearningPath, Module } from '@/lib/data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { LessonItem } from './lesson-item';
import { Badge } from '../ui/badge';
import { CheckCircle, CircleDot, Clock } from 'lucide-react';
import { Progress } from '../ui/progress';

interface LearningPathCardProps {
  path: LearningPath;
}

const statusIcons = {
    completed: CheckCircle,
    'in-progress': CircleDot,
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

function ModuleItem({ module }: { module: Module }) {
    const Icon = statusIcons[module.status || 'not-started'];
    const label = statusLabels[module.status || 'not-started'];
    const variant = statusVariants[module.status || 'not-started'] as "completed" | "inProgress" | "notStarted";

    return (
        <AccordionItem value={module.id} key={module.id} className="border-t border-border/50">
            <AccordionTrigger className="px-6 text-base hover:no-underline">
                <div className="flex flex-1 items-center justify-between">
                    <span className="font-medium">{module.title}</span>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Badge variant={variant} className="hidden w-24 justify-center sm:inline-flex">{label}</Badge>
                        <span>{module.duration} min</span>
                    </div>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
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
    )
}

export function LearningPathCard({ path }: LearningPathCardProps) {
  const totalLessons = path.modules.reduce(
    (acc, module) => acc + module.lessons.length,
    0
  );
  const completedLessons = path.modules.reduce(
    (acc, module) =>
      acc +
      module.lessons.filter((l) => l.status === 'completed').length,
    0
  );
  const progress =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const totalDuration = path.modules.reduce((acc, m) => acc + m.duration, 0);

  return (
    <AccordionItem
      value={path.id}
      className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm"
    >
      <AccordionTrigger className="p-6 text-left hover:no-underline">
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <path.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-headline text-xl font-semibold">
                  {path.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {path.description}
                </p>
              </div>
            </div>
          </div>
           <div className="mt-2 flex items-center gap-4 text-sm">
             <div className="flex-1">
                <Progress value={progress} className="h-2" />
             </div>
             <div className="flex w-40 shrink-0 items-center justify-end gap-6 text-muted-foreground">
                <div className="text-right">
                  <span className="font-semibold text-foreground">{path.modules.length}</span> Modules
                </div>
                 <div className="text-right">
                  <span className="font-semibold text-foreground">{Math.floor(totalDuration / 60)}h {totalDuration % 60}m</span>
                 </div>
             </div>
           </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="p-0">
        <Accordion
          type="single"
          collapsible
          className="w-full"
        >
          {path.modules.map((module) => (
            <ModuleItem key={module.id} module={module} />
          ))}
        </Accordion>
      </AccordionContent>
    </AccordionItem>
  );
}
