import type { LearningPath } from '@/lib/data';
import {
  Accordion,
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
    <AccordionItem
      value={path.id}
      className="rounded-lg border bg-card text-card-foreground shadow-sm"
    >
      <AccordionTrigger className="p-6 text-left hover:no-underline">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <path.icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-headline text-xl font-semibold">
              {path.title}
            </h3>
            <p className="text-sm text-muted-foreground">{path.description}</p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <Accordion
          type="single"
          collapsible
          className="w-full divide-y divide-border"
        >
          {path.modules.map((module) => (
            <AccordionItem value={module.id} key={module.id} className="border-none">
              <AccordionTrigger className="px-6 text-base hover:no-underline">
                <div className="flex flex-1 items-center justify-between">
                  <span>{module.title}</span>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
          ))}
        </Accordion>
      </AccordionContent>
    </AccordionItem>
  );
}
