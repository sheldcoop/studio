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
    id: 'algo-trading',
    title: 'Algorithmic Trading Strategies',
    icon: CandlestickChart,
    description: 'Design, backtest, and deploy automated trading strategies.',
  },
];

export const getPathById = (id: string): LearningPath | undefined => {
  const pathInfo = learningPaths.find(p => p.id === id);
  if (!pathInfo) return undefined;

  const allModules = [
    { id: 'la-main-chapters', parent: 'linear-algebra-for-quantitative-finance', title: 'Chapters', status: 'in-progress', duration: 0 },
    { id: 'stats-module-1', parent: 'statistics-for-quantitative-finance', title: 'Probability Theory', status: 'completed', duration: 60},
    { id: 'stats-module-2', parent: 'statistics-for-quantitative-finance', title: 'Common Distributions', status: 'in-progress', duration: 75 },
    { id: 'stats-module-3', parent: 'statistics-for-quantitative-finance', title: 'Hypothesis Testing', status: 'not-started', duration: 120 },
    { id: 'stats-module-4', parent: 'statistics-for-quantitative-finance', title: 'Bayesian Statistics Intro', status: 'not-started', duration: 60 },
  ];

  const pathModules = allModules.filter(m => m.parent === id).map(module => ({
    ...module,
    lessons: allTopics.filter(t => t.parent === module.id)
  }));

  return {
    ...pathInfo,
    modules: pathModules,
  }
}
