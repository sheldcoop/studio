import type { Metadata } from 'next';
import { PageHeader } from '@/components/app/page-header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { allTopics, type Topic } from '@/lib/curriculum';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TopicIcon } from '@/components/app/topic-icon';

export const metadata: Metadata = {
  title: 'QuantLab | Interactive Tools',
  description: 'Hands-on interactive labs and simulations for core quantitative finance and statistics concepts. Experiment with distributions, theorems, and statistical tests.',
};

const getTopicsForParent = (parentId: string): Topic[] => {
  return allTopics.filter((topic) => topic.parent === parentId && topic.category === 'probability');
};

const coreConcepts = getTopicsForParent('prob-core-tools');
const discreteDistributions = getTopicsForParent('prob-dist-discrete');
const continuousDistributions = getTopicsForParent('prob-dist-continuous');

function LabCard({ lab }: { lab: Topic }) {
  return (
    <Link href={lab.href} className="group block rounded-lg">
      <Card className="h-full border bg-background/50 transition-all duration-300 group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/10">
        <CardHeader className="flex-row items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <TopicIcon iconName={lab.icon} className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">{lab.title}</CardTitle>
            <CardDescription className="mt-1 text-xs">{lab.description}</CardDescription>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}


export default function QuantLabPage() {

  return (
    <>
      <PageHeader
        title="QuantLab"
        description="Run experiments, build intuition, and see quantitative concepts in action with these interactive tools."
      />
      <div className="mx-auto max-w-5xl">
        <Accordion type="multiple" defaultValue={['core-concepts', 'discrete-distributions']} className="w-full space-y-4">
          <AccordionItem value="core-concepts" className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <AccordionTrigger className="p-6 text-lg font-semibold hover:no-underline">
              Core Concepts & Theorems
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {coreConcepts.map((lab) => (
                  <LabCard key={lab.id} lab={lab} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="discrete-distributions" className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <AccordionTrigger className="p-6 text-lg font-semibold hover:no-underline">
              Discrete Probability Distributions
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                 {discreteDistributions.map((lab) => (
                  <LabCard key={lab.id} lab={lab} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="continuous-distributions" className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <AccordionTrigger className="p-6 text-lg font-semibold hover:no-underline">
              Continuous Probability Distributions
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                 {continuousDistributions.map((lab) => (
                  <LabCard key={lab.id} lab={lab} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
