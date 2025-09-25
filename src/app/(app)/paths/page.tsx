import { PageHeader } from '@/components/app/page-header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { learningPaths } from '@/lib/data';
import { CheckCircle2, Clock, PlayCircle } from 'lucide-react';

const statusIcons = {
  completed: <CheckCircle2 className="text-green-500" />,
  'in-progress': <PlayCircle className="text-blue-500" />,
  'not-started': <Clock className="text-muted-foreground" />,
};

const statusBadges = {
    completed: 'secondary',
    'in-progress': 'default',
    'not-started': 'outline',
} as const;

export default function PathsPage() {
  return (
    <>
      <PageHeader
        title="Learning Paths"
        description="Follow our curated paths to build a solid foundation in quantitative finance."
      />
      <Accordion type="single" collapsible className="w-full space-y-4">
        {learningPaths.map((path) => (
          <AccordionItem
            key={path.id}
            value={path.id}
            className="rounded-lg border bg-card"
          >
            <AccordionTrigger className="px-6 text-lg hover:no-underline">
              <div className="flex items-center gap-4">
                <path.icon className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <h3 className="font-headline font-semibold">{path.title}</h3>
                  <p className="text-sm font-normal text-muted-foreground">
                    {path.description}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="border-t">
              <ul className="divide-y divide-border">
                {path.lessons.map((lesson) => (
                  <li
                    key={lesson.title}
                    className="flex items-center justify-between p-4 px-6 transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex items-center gap-4">
                      {statusIcons[lesson.status]}
                      <span className="font-medium">{lesson.title}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant={statusBadges[lesson.status]} className="capitalize w-24 justify-center hidden sm:flex">
                            {lesson.status.replace('-', ' ')}
                        </Badge>
                      <span className="text-sm text-muted-foreground">
                        {lesson.duration} min
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
