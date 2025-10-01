
import {
  Calculator,
  BarChart3,
  AreaChart,
  BrainCircuit,
  CandlestickChart,
  type LucideIcon,
  FlaskConical
} from 'lucide-react';
import { allTopics, type Topic } from '@/lib/curriculum';

export type Module = {
  id: string;
  title: string;
  status?: 'completed' | 'in-progress' | 'not-started';
  duration: number;
  lessons: Topic[];
};

export type LearningPath = {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
  modules: Module[];
};

export const learningPaths: Omit<LearningPath, 'modules'>[] = [
  {
    id: 'linear-algebra-for-quantitative-finance',
    title: 'Linear Algebra for Quants',
    icon: Calculator,
    description: 'Master vectors, matrices, and eigenvalues for financial modeling.',
  },
  {
    id: 'statistics-for-quantitative-finance',
    title: 'Advanced Statistics',
    icon: BarChart3,
    description: 'Deep dive into probability, distributions, and hypothesis testing.',
  },
  {
    id: 'time-series-analysis-for-quantitative-finance',
    title: 'Time Series Analysis',
    icon: AreaChart,
    description: 'Learn to model and forecast financial time series data.',
  },
  {
    id: 'machine-learning-for-quantitative-finance',
    title: 'Machine Learning in Finance',
    icon: BrainCircuit,
    description: 'Apply ML algorithms to trading, risk, and asset management.',
  },
  {
    id: 'probability-toolkit',
    title: 'Probability Toolkit',
    icon: FlaskConical,
    description: 'Interactive tools for hands-on probability analysis.',
  },
];

export const getPathById = (id: string): LearningPath | undefined => {
  const pathInfo = learningPaths.find(p => p.id === id);
  if (!pathInfo) return undefined;

  const allModules: (Omit<Module, 'lessons'>)[] = [
    { id: 'la-module-1', title: 'Module 1: Foundations', status: 'completed', duration: 45 },
    { id: 'la-module-2', title: 'Module 2: Solving Systems & Regression', status: 'in-progress', duration: 60 },
    { id: 'la-module-3', title: 'Module 3: Eigen-everything', status: 'not-started', duration: 75 },
    { id: 'la-module-4', title: 'Module 4: Applications in Finance', status: 'not-started', duration: 90 },
    { id: 'stats-mod-1', title: 'Module 1: Foundations in Probability & Random Variables', status: 'completed', duration: 180 },
    { id: 'stats-mod-2', title: 'Module 2: Key Distributions & Asymptotic Theory', status: 'in-progress', duration: 150 },
    { id: 'stats-mod-3', title: 'Module 3: Statistical Inference & Estimation Theory', status: 'not-started', duration: 200 },
    { id: 'stats-mod-4', title: 'Module 4: Linear Modeling & Econometrics', status: 'not-started', duration: 240 },
    { id: 'stats-mod-5', title: 'Module 5: Time Series Analysis & Computational Methods', status: 'not-started', duration: 180 },
    { id: 'stats-mod-6', title: 'Module 6: Advanced Quant Modeling & Numerical Methods', status: 'not-started', duration: 210 },
    { id: 'prob-core-tools', title: 'Core Probability Concepts', status: 'in-progress', duration: 40 },
    { id: 'prob-dist-discrete', title: 'Discrete Distributions', status: 'in-progress', duration: 30},
    { id: 'prob-dist-continuous', title: 'Continuous Distributions', status: 'in-progress', duration: 90},
  ];

  const pathModules: Module[] = allModules.filter(m => allTopics.some(t => t.parent === m.id && t.href.includes(id))).map(module => {
    const lessons: Topic[] = allTopics.filter((t: Topic) => t.parent === module.id).map((lesson: Topic) => ({
        ...lesson,
        status: module.status, // Inherit status from parent module
        duration: Math.floor(Math.random() * 20) + 5, // Assign random duration for now
    }));
    return { ...module, lessons };
  });

  return {
    ...pathInfo,
    modules: pathModules,
  }
}
