
import type { Topic } from './types';

export const mainTopics: Topic[] = [
   {
    id: 'quantlab',
    title: 'QuantLab',
    description: 'Interactive tools for hands-on probability and statistics analysis.',
    icon: 'FlaskConical',
    href: '/quantlab',
    category: 'main',
    animation: 'probability-toolkit',
  },
  {
    id: 'linear-algebra-for-quantitative-finance',
    title: 'Linear Algebra',
    description: 'Vectors, matrices, and eigenvalues. The language of data.',
    icon: 'Pi',
    href: '/linear-algebra-for-quantitative-finance',
    category: 'main',
    animation: 'linear-algebra',
  },
  {
    id: 'statistics-for-quantitative-finance',
    title: 'Advanced Statistics',
    description: 'The science of collecting, analyzing, and interpreting data.',
    icon: 'BarChart3',
    href: '/statistics-for-quantitative-finance',
    category: 'main',
    animation: 'statistics',
  },
  {
    id: 'probability-for-quants',
    title: 'Probability for Quants',
    description: 'Master random variables, distributions, and stochastic processes.',
    icon: 'Percent',
    href: '/probability-for-quants',
    category: 'main',
    animation: 'probability',
  },
  {
    id: 'time-series-analysis',
    title: 'Time Series Analysis',
    description: 'ARIMA, GARCH, and forecasting market movements.',
    icon: 'LineChart',
    href: '/time-series-analysis-for-quantitative-finance',
    category: 'main',
    animation: 'time-series-analysis',
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning',
    description: 'Building predictive models for financial markets.',
    icon: 'Cpu',
    href: '/machine-learning-for-quantitative-finance',
    category: 'main',
    animation: 'machine-learning',
  },
  {
    id: 'linear-algebra-animations',
    title: 'Linear Algebra Animations',
    description: 'Interactive WebGL visualizations of core linear algebra concepts.',
    icon: 'Orbit',
    href: '/linear-algebra-animations',
    category: 'main',
    animation: 'linear-algebra',
  }
];
