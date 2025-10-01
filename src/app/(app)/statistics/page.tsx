
import type { Metadata } from 'next';
import { PageHeader } from '@/components/app/page-header';
import { allTopics, type Topic, type Module } from '@/lib/data';
import { Accordion } from '@/components/ui/accordion';
import { LearningPathCard } from '@/components/app/learning-path-card';
import { BarChart3 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Advanced Statistics for Quants',
  description: 'A comprehensive guide to probability, distributions, inference, and modeling.',
};

const getLessonsForModule = (moduleId: string): Topic[] => {
    return allTopics.filter(topic => topic.parent === moduleId);
};

export default function StatisticsPage() {
    const modules: Omit<Module, 'lessons'>[] = [
        { id: 'stats-mod-1', title: 'Module 1: Foundations in Probability & Random Variables', duration: 180, status: 'completed' },
        { id: 'stats-mod-2', title: 'Module 2: Key Distributions & Asymptotic Theory', duration: 150, status: 'in-progress' },
        { id: 'stats-mod-3', title: 'Module 3: Statistical Inference & Estimation Theory', duration: 200, status: 'not-started' },
        { id: 'stats-mod-4', title: 'Module 4: Linear Modeling & Econometrics', duration: 240, status: 'not-started' },
        { id: 'stats-mod-5', title: 'Module 5: Time Series Analysis & Computational Methods', duration: 180, status: 'not-started' },
        { id: 'stats-mod-6', title: 'Module 6: Advanced Quant Modeling & Numerical Methods', duration: 210, status: 'not-started' },
    ];

    const modulesWithLessons = modules.map(mod => ({
        ...mod,
        lessons: getLessonsForModule(mod.id),
    }));

  return (
    <>
      <PageHeader
        title="Advanced Statistics for Quants"
        description="From the axioms of probability to advanced modeling techniques, this is your complete guide."
        variant="aligned-left"
      />
      <Accordion type="single" collapsible className="w-full space-y-4" defaultValue={modulesWithLessons[1].id}>
        {modulesWithLessons.map((module) => (
          <LearningPathCard key={module.id} module={module} icon={BarChart3} />
        ))}
      </Accordion>
    </>
  );
}
