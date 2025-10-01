
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
  icon: string;
  description: string;
  modules: Module[];
};

export const learningPaths: Omit<LearningPath, 'modules'>[] = [
  {
    id: 'linear-algebra-for-quantitative-finance',
    title: 'Linear Algebra for Quants',
    icon: 'Calculator',
    description: 'Master vectors, matrices, and eigenvalues for financial modeling.',
  },
  {
    id: 'statistics-for-quantitative-finance',
    title: 'Advanced Statistics',
    icon: 'BarChart3',
    description: 'Deep dive into probability, distributions, and hypothesis testing.',
  },
  {
    id: 'time-series-analysis-for-quantitative-finance',
    title: 'Time Series Analysis',
    icon: 'AreaChart',
    description: 'Learn to model and forecast financial time series data.',
  },
  {
    id: 'machine-learning-for-quantitative-finance',
    title: 'Machine Learning in Finance',
    icon: 'BrainCircuit',
    description: 'Apply ML algorithms to trading, risk, and asset management.',
  },
  {
    id: 'probability-toolkit',
    title: 'Probability Toolkit',
    icon: 'FlaskConical',
    description: 'Interactive tools for hands-on probability analysis.',
  },
];

export const getPathById = (id: string): LearningPath | undefined => {
  const pathInfo = learningPaths.find(p => p.id === id);
  if (!pathInfo) return undefined;

  const allModules: (Omit<Module, 'lessons'> & { parent: string })[] = [
    { id: 'la-module-1', parent: 'linear-algebra-for-quantitative-finance', title: 'Module 1: Foundations', status: 'completed', duration: 45 },
    { id: 'la-module-2', parent: 'linear-algebra-for-quantitative-finance', title: 'Module 2: Solving Systems & Regression', status: 'in-progress', duration: 60 },
    { id: 'la-module-3', parent: 'linear-algebra-for-quantitative-finance', title: 'Module 3: Eigen-everything', status: 'not-started', duration: 75 },
    { id: 'la-module-4', parent: 'linear-algebra-for-quantitative-finance', title: 'Module 4: Applications in Finance', status: 'not-started', duration: 90 },
    { id: 'stats-mod-1', parent: 'statistics-for-quantitative-finance', title: 'Module 1: Foundations in Probability & Random Variables', status: 'completed', duration: 180 },
    { id: 'stats-mod-2', parent: 'statistics-for-quantitative-finance', title: 'Module 2: Key Distributions & Asymptotic Theory', status: 'in-progress', duration: 150 },
    { id: 'stats-mod-3', parent: 'statistics-for-quantitative-finance', title: 'Module 3: Statistical Inference & Estimation Theory', status: 'not-started', duration: 200 },
    { id: 'stats-mod-4', parent: 'statistics-for-quantitative-finance', title: 'Module 4: Linear Modeling & Econometrics', status: 'not-started', duration: 240 },
    { id: 'stats-mod-5', parent: 'statistics-for-quantitative-finance', title: 'Module 5: Time Series Analysis & Computational Methods', status: 'not-started', duration: 180 },
    { id: 'stats-mod-6', parent: 'statistics-for-quantitative-finance', title: 'Module 6: Advanced Quant Modeling & Numerical Methods', status: 'not-started', duration: 210 },
    { id: 'prob-core-tools', parent: 'probability-toolkit', title: 'Core Probability Concepts', status: 'in-progress', duration: 40 },
    { id: 'prob-dist-discrete', parent: 'probability-toolkit', title: 'Discrete Distributions', status: 'in-progress', duration: 30},
    { id: 'prob-dist-continuous', parent: 'probability-toolkit', title: 'Continuous Distributions', status: 'in-progress', duration: 90},
  ];

  const pathModules: Module[] = allModules.filter(m => m.parent === id).map(module => {
    const lessons: Topic[] = allTopics.filter(t => t.parent === module.id).map(lesson => ({
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
