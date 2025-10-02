
import type { Metadata } from 'next';
import { PageHeader } from '@/components/app/page-header';
import { Accordion } from '@/components/ui/accordion';
import { LearningPathCard } from '@/components/app/learning-path-card';
import { allTopics, type Topic, type Module } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Probability for Quants',
  description: 'The mathematical foundation for understanding randomness and uncertainty.',
};

const getLessonsForModule = (moduleId: string): Topic[] => {
    return allTopics.filter(topic => topic.parent === moduleId && topic.category === 'probability').map(lesson => ({
        ...lesson,
        status: 'not-started', // Default status for this path
        duration: Math.floor(Math.random() * 15) + 5,
    }));
};

export default function ProbabilityPage() {
    const modules: Omit<Module, 'lessons'>[] = [
        { id: 'prob-core-tools', title: 'Module 1: Core Probability Concepts', status: 'in-progress', duration: 40 },
        { id: 'prob-dist-discrete', title: 'Module 2: Discrete Distributions', status: 'not-started', duration: 90},
        { id: 'prob-dist-continuous', title: 'Module 3: Continuous Distributions', status: 'not-started', duration: 120},
    ];

    const modulesWithLessons = modules.map(mod => ({
        ...mod,
        lessons: getLessonsForModule(mod.id),
    }));

  return (
    <>
      <PageHeader
        title="Probability for Quants"
        description="The mathematical foundation for understanding randomness and uncertainty."
        variant="aligned-left"
      />
      <Accordion type="single" collapsible className="w-full space-y-4" defaultValue={modulesWithLessons[0].id}>
        {modulesWithLessons.map((module) => (
          <LearningPathCard key={module.id} module={module} iconName="Percent" />
        ))}
      </Accordion>
    </>
  );
}
