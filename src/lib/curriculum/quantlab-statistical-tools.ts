
import type { Topic } from './types';
import { createTopic } from './utils';

export const quantlabStatisticalTools: Topic[] = [
  // Parent "topic" for Hypothesis testing, mainly for grouping in other files
  createTopic({
    id: 'hypothesis-testing',
    href: '/quantlab/hypothesis-testing-guide',
    parent: 'quantlab',
    title: 'Hypothesis Testing & P-Values',
    icon: 'FunctionSquare',
    description: 'The detective work of data science.',
    category: 'sub-topic',
  }),
  // Tier 1 Lessons
  createTopic({
    id: 'descriptive-statistics-explorer-interactive-guide',
    parent: 'quantlab',
    title: 'Descriptive Statistics Explorer',
    icon: 'BarChartHorizontal',
    description: 'Interactive guide to mean, median, skewness, and kurtosis.',
    category: 'probability',
  }),
  createTopic({
    id: 'central-limit-theorem-interactive-guide',
    parent: 'quantlab',
    title: 'The Central Limit Theorem (CLT)',
    icon: 'Bell',
    description: 'Discover how order emerges from chaos.',
    category: 'probability',
  }),
  createTopic({
    id: 'confidence-intervals-interactive-guide',
    parent: 'quantlab',
    title: 'Confidence Intervals',
    icon: 'Target',
    description: 'Understanding the range where a true value likely lies.',
    category: 'sub-topic',
  }),
  createTopic({
    id: 'z-table-interactive-guide',
    parent: 'quantlab',
    title: 'Z-Table Calculator',
    icon: 'Table',
    description: 'Calculate probabilities from Z-scores and vice-versa.',
    category: 'sub-topic',
  }),
  createTopic({
    id: 'normal-distribution-interactive-guide',
    parent: 'quantlab',
    title: 'The Normal Distribution',
    icon: 'Bell',
    description: 'The ubiquitous "bell curve."',
    category: 'probability',
  }),

  // Tier 3 Lessons
  createTopic({
    id: 'monte-carlo-simulation-interactive-guide',
    parent: 'quantlab',
    title: 'Monte Carlo Simulation',
    icon: 'Dice',
    description: 'Using random simulation to solve complex problems.',
    category: 'sub-topic',
  }),
  createTopic({
    id: 'time-series-decomposition-interactive-guide',
    parent: 'quantlab',
    title: 'Time Series Decomposition',
    icon: 'Layers',
    description: 'Breaking down a time series into its core components.',
    category: 'sub-topic',
  }),
  createTopic({
    id: 'autocorrelation-acf-pacf-interactive-guide',
    parent: 'quantlab',
    title: 'Autocorrelation (ACF & PACF)',
    icon: 'Signal',
    description: 'Measuring how a time series correlates with its past values.',
    category: 'sub-topic',
  }),
  createTopic({
    id: 'volatility-garch-interactive-guide',
    parent: 'quantlab',
    title: 'Volatility & Standard Deviation (GARCH)',
    icon: 'Flame',
    description: 'Modeling the changing volatility of financial returns.',
    category: 'sub-topic',
  }),
  createTopic({
    id: 'efficient-frontier-sharpe-ratio-interactive-guide',
    parent: 'quantlab',
    title: 'Efficient Frontier & Sharpe Ratio',
    icon: 'Target',
    description: 'Finding the optimal portfolio for a given level of risk.',
    category: 'sub-topic',
  }),
  createTopic({
    id: 'kalman-filters-interactive-guide',
    parent: 'quantlab',
    title: 'Kalman Filters',
    icon: 'Filter',
    description: 'Dynamically estimating the state of a system from noisy data.',
    category: 'sub-topic',
  }),
  createTopic({
    id: 'stochastic-calculus-itos-lemma-interactive-guide',
    parent: 'quantlab',
    title: "Stochastic Calculus & Ito's Lemma",
    icon: 'Calculator',
    description: 'The calculus of random walks, essential for derivatives pricing.',
    category: 'sub-topic',
  }),
];
