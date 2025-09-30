
import {
  Pi,
  Sigma,
  BrainCircuit,
  LineChart,
  Cpu,
  CandlestickChart,
  Boxes,
  Percent,
} from 'lucide-react';
import type { Topic } from './types';

export const mainTopics: Topic[] = [
  {
    id: 'linear-algebra',
    title: 'Linear Algebra',
    description: 'Vectors, matrices, and tensors. The language of data.',
    icon: Pi,
    href: '/topics/linear-algebra-for-quantitative-finance',
    category: 'main',
  },
  {
    id: 'statistics',
    title: 'Statistics',
    description: 'Quantifying uncertainty and making sense of distributions.',
    icon: Sigma,
    href: '/stat-toolkit',
    category: 'main',
  },
  {
    id: 'probability',
    title: 'Probability',
    description: 'Understanding chance and modeling random events.',
    icon: Percent,
    href: '/paths/probability-toolkit',
    category: 'main',
  },
  {
    id: 'mental-math',
    title: 'Mental Math',
    description: 'Train your calculation speed and accuracy for interviews.',
    icon: BrainCircuit,
    href: '/topics/mental-math',
    category: 'main',
  },
  {
    id: 'time-series-analysis',
    title: 'Time Series Analysis',
    description: 'ARIMA, GARCH, and forecasting market movements.',
    icon: LineChart,
    href: '/paths/time-series-analysis-for-quantitative-finance',
    category: 'main',
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning',
    description: 'Building predictive models for financial markets.',
    icon: Cpu,
    href: '/paths/machine-learning-for-quantitative-finance',
    category: 'main',
  },
];
