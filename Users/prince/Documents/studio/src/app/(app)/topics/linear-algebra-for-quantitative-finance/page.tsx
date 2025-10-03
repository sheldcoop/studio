
import type { Metadata } from 'next';
import { PageHeader } from '@/components/app/page-header';
import { allTopics } from '@/lib/data';
import { Accordion } from '@/components/ui/accordion';
import { LearningPathCard } from '@/components/app/learning-path-card';
import type { Topic, Module } from '@/lib/data';


export const metadata: Metadata = {
  title: 'Linear Algebra for Quants',
  description: 'Master vectors, matrices, eigenvalues and their application in financial modeling.',
};

const getLessonsForModule = (moduleId: string): Topic[] => {
    return allTopics.filter(topic => topic.parent === moduleId);
};

export default function LinearAlgebraPage() {
    const modules: Omit<Module, 'lessons'>[] = [
        { id: 'la-module-1', title: 'Module 1: Foundations', duration: 45, status: 'completed' },
        { id: 'la-module-2', title: 'Module 2: Solving Systems & Regression', duration: 60, status: 'in-progress' },
        { id: 'la-module-3', title: 'Module 3: Eigen-everything', duration: 75, status: 'not-started' },
        { id: 'la-module-4', title: 'Module 4: Applications in Finance', duration: 90, status: 'not-started' },
    ];

    const modulesWithLessons = modules.map(mod => ({
        ...mod,
        lessons: getLessonsForModule(mod.id),
    }));

  return (
    <>
      <PageHeader
        title="Linear Algebra for Quants"
        description="The language of data and the backbone of modern quantitative finance."
        variant="aligned-left"
      />
      <Accordion type="single" collapsible className="w-full space-y-4" defaultValue={modulesWithLessons[0].id}>
        {modulesWithLessons.map((module) => (
          <LearningPathCard key={module.id} module={module} iconName="Calculator" />
        ))}
      </Accordion>
    </>
  );
}
