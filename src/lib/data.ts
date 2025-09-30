import {
    Calculator,
    BarChart3,
    AreaChart,
    BrainCircuit,
    CandlestickChart,
    type LucideIcon,
  } from 'lucide-react';
  import { allTopics, type Topic } from './curriculum';
  
  export type Module = {
    id: string;
    title: string;
    lessons: Topic[];
    status?: 'completed' | 'in-progress' | 'not-started';
    duration: number;
  };
  
  export type LearningPath = {
    id: string;
    title: string;
    icon: LucideIcon;
    description: string;
    modules: Module[];
  };
  
  // This export is no longer needed as the logic has moved to src/lib/learning-paths.ts
  // export const learningPaths: LearningPath[] = [ ... ];
  
  export * from './curriculum';
  
