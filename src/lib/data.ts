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
  
  export const learningPaths: LearningPath[] = [
    {
      id: 'linear-algebra-for-quantitative-finance',
      title: 'Linear Algebra for Quants',
      icon: Calculator,
      description: 'Master vectors, matrices, and eigenvalues for financial modeling.',
      modules: [
          { id: 'la-module-1', title: 'Module 1: Foundations of Vectors and Matrices', status: 'completed', duration: 75, lessons: allTopics.filter(t => t.parent === 'la-module-1')},
          { id: 'la-module-2', title: 'Module 2: Core Concepts & Decompositions', status: 'in-progress', duration: 105, lessons: allTopics.filter(t => t.parent === 'la-module-2') },
          { id: 'la-module-3', title: 'Module 3: Applications in ML & Statistics', status: 'not-started', duration: 105, lessons: allTopics.filter(t => t.parent === 'la-module-3') },
          { id: 'la-module-4', title: 'Module 4: Applications in Quantitative Finance', status: 'not-started', duration: 120, lessons: allTopics.filter(t => t.parent === 'la-module-4') },
      ],
    },
    {
      id: 'statistics-for-quantitative-finance',
      title: 'Advanced Statistics',
      icon: BarChart3,
      description: 'Deep dive into probability, distributions, and hypothesis testing.',
      modules: [
        { id: 'stats-module-1', title: 'Probability Theory', status: 'completed', duration: 60, lessons: []},
        { id: 'stats-module-2', title: 'Common Distributions', status: 'in-progress', duration: 75, lessons: [] },
        { id: 'stats-module-3', title: 'Hypothesis Testing', status: 'not-started', duration: 120, lessons: [] },
        { id: 'stats-module-4', title: 'Bayesian Statistics Intro', status: 'not-started', duration: 60, lessons: [] },
      ],
    },
    {
      id: 'time-series-analysis-for-quantitative-finance',
      title: 'Time Series Analysis',
      icon: AreaChart,
      description: 'Learn to model and forecast financial time series data.',
      modules: [],
    },
    {
      id: 'machine-learning-for-quantitative-finance',
      title: 'Machine Learning in Finance',
      icon: BrainCircuit,
      description: 'Apply ML algorithms to trading, risk, and asset management.',
      modules: [],
    },
    {
      id: 'algo-trading',
      title: 'Algorithmic Trading Strategies',
      icon: CandlestickChart,
      description: 'Design, backtest, and deploy automated trading strategies.',
      modules: [],
    },
  ];
  
  export * from './curriculum';
  