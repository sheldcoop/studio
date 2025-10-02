
import { type Topic } from './curriculum';
  
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
    icon: string;
    description: string;
    modules: Module[];
  };
  
  export * from './curriculum';
