
import { type ComponentType } from 'react';

export type SubTopic = {
  id: string;
  title: string;
};

export type InteractiveExample = {
  id: string;
  title: string;
  description: string;
  exampleText: string;
  ChartComponent: ComponentType<{ generateData: () => void }>;
  buttonText: string;
};

export type CoreConcept = {
  title: string;
  description: string;
};

export type Topic = {
  id: string;
  title: string;
  href: string;
  icon?: string;
  description: string;
  category: 'main' | 'sub-topic' | 'parametric' | 'non-parametric' | 'parent' | 'probability';
  parent?: string; // id of parent topic
  status?: 'completed' | 'in-progress' | 'not-started';
  duration?: number; // in minutes
  subTopics?: SubTopic[];
   content?: string; // Added for simple content pages
  interactiveExamples?: {
    coreConcepts: CoreConcept[];
    examples: InteractiveExample[];
  };
  animation?: string; // ID for the animation component
};
