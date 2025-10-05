
import type { Topic } from './types';
import { createTopic } from './utils';

export const statisticsTopics: Topic[] = [
  // Parent "topic" for Hypothesis testing
  createTopic({
    id: 'hypothesis-testing',
    title: 'Hypothesis Testing & P-Values',
    href: '/hypothesis-testing-p-values',
    icon: 'FunctionSquare',
    description: 'The detective work of data science.',
    category: 'sub-topic',
    parent: 'stat-toolkit',
  }),

  // Parametric Tests (sub-topics of hypothesis testing)
  createTopic({
    id: 't-test',
    title: 'T-Test',
    icon: 'FunctionSquare',
    description: 'Compares the means of two groups, assuming normal distribution.',
    category: 'parametric',
    pathPrefix: 'topics'
  }),
  createTopic({
    id: 'z-test',
    title: 'Z-Test',
    icon: 'FunctionSquare',
    description:
      'Compares means of large samples (n>30) with known population variance.',
    category: 'parametric',
    pathPrefix: 'topics'
  }),
  createTopic({
    id: 'anova',
    title: 'ANOVA',
    icon: 'FunctionSquare',
    description: 'Compares the averages of three or more groups.',
    category: 'parametric',
    pathPrefix: 'topics'
  }),
  createTopic({
    id: 'f-test',
    title: 'F-Test',
    icon: 'FunctionSquare',
    description: 'Compares the variances (spread) of two or more groups.',
    category: 'parametric',
    pathPrefix: 'topics'
  }),
  createTopic({
    id: 'pearson-correlation',
    title: 'Pearson Correlation',
    icon: 'FunctionSquare',
    description:
      'Measures the linear relationship between two continuous variables.',
    category: 'parametric',
    pathPrefix: 'topics'
  }),
  createTopic({
    id: 'chi-squared-test',
    title: 'Chi-Squared Test',
    icon: 'FunctionSquare',
    description:
      'Analyzes categorical data to find significant relationships.',
    category: 'non-parametric',
    pathPrefix: 'topics'
  }),

  // Non-Parametric Tests (sub-topics of hypothesis testing)
  createTopic({
    id: 'mann-whitney-u-test',
    title: 'Mann-Whitney U Test',
    icon: 'FunctionSquare',
    description:
      'Alternative to the T-Test when data is not normally distributed.',
    category: 'non-parametric',
    pathPrefix: 'topics'
  }),
  createTopic({
    id: 'kruskal-wallis-test',
    title: 'Kruskal-Wallis Test',
    icon: 'FunctionSquare',
    description: 'Alternative to ANOVA for comparing three or more groups.',
    category: 'non-parametric',
    pathPrefix: 'topics'
  }),
  createTopic({
    id: 'wilcoxon-signed-rank-test',
    title: 'Wilcoxon Signed-Rank Test',
    icon: 'FunctionSquare',
    description:
      'Alternative to the paired T-Test for repeated measurements.',
    category: 'non-parametric',
    pathPrefix: 'topics'
  }),
  createTopic({
    id: 'spearmans-rank-correlation',
    title: "Spearman's Rank Correlation",
    icon: 'FunctionSquare',
    description:
      'Measures the monotonic relationship between two ranked variables.',
    category: 'non-parametric',
    pathPrefix: 'topics'
  }),
  createTopic({
    id: 'friedman-test',
    title: 'Friedman Test',
    icon: 'FunctionSquare',
    description:
      'The non-parametric alternative to a repeated-measures ANOVA.',
    category: 'non-parametric',
    pathPrefix: 'topics'
  }),
  createTopic({
    id: 'kolmogorov-smirnov-k-s-test',
    title: 'Kolmogorov-Smirnov (K-S) Test',
    icon: 'FunctionSquare',
    description: 'Tests if a sample is drawn from a specific distribution.',
    category: 'non-parametric',
    pathPrefix: 'topics'
  }),

  // Stat Toolkit Parent Categories
  createTopic({
    id: 'stats-foundations',
    title: 'Tier 1: The Absolute Foundations',
    href: '#',
    icon: 'FolderKanban',
    description: '',
    category: 'parent',
  }),
  createTopic({
    id: 'stats-intermediate',
    title: 'Tier 2: Intermediate & Specialized Tools',
    href: '#',
    icon: 'FolderKanban',
    description: '',
    category: 'parent',
  }),
  createTopic({
    id: 'stats-advanced',
    title: 'Tier 3: Advanced & Quant-Specific Concepts',
    href: '#',
    icon: 'FolderKanban',
    description: '',
    category: 'parent',
  }),
    
  // Stat Toolkit Tier 1
  createTopic({
    id: 'demystifying-hypothesis-testing',
    title: "Demystifying Hypothesis Testing: A Beginner's Guide",
    icon: 'FunctionSquare',
    description: 'A step-by-step guide to making decisions from data.',
    category: 'sub-topic',
    parent: 'stats-foundations',
    pathPrefix: 'topics'
  }),
  createTopic({
    id: 'confidence-intervals',
    title: 'Confidence Intervals',
    icon: 'FunctionSquare',
    description: 'Understanding the range where a true value likely lies.',
    category: 'sub-topic',
    parent: 'stats-foundations',
    pathPrefix: 'topics'
  }),
  createTopic({
    id: 'z-table',
    title: 'Z-Table Calculator',
    icon: 'FunctionSquare',
    description: 'Calculate probabilities from Z-scores and vice-versa.',
    category: 'sub-topic',
    parent: 'stats-foundations',
    pathPrefix: 'topics'
  }),
  createTopic({
    id: 'descriptive-statistics-explorer',
    title: 'Descriptive Statistics Explorer',
    icon: 'FunctionSquare',
    description: 'Interactive guide to mean, median, mode, variance, skewness, and kurtosis.',
    category: 'sub-topic',
    parent: 'stats-foundations',
    pathPrefix: 'statistics'
  }),
  createTopic({
    id: 'normal-distribution',
    title: 'The Normal Distribution',
    icon: 'FunctionSquare',
    description: 'The ubiquitous "bell curve."',
    category: 'sub-topic',
    parent: 'stats-foundations',
    pathPrefix: 'statistics'
  }),
  createTopic({
    id: 'lognormal-distribution',
    title: 'Lognormal Distribution',
    icon: 'FunctionSquare',
    description: 'Modeling variables that cannot be negative, like stock prices.',
    category: 'sub-topic',
    parent: 'stats-foundations',
    pathPrefix: 'statistics'
  }),
  createTopic({
    id: 'type-i-and-type-ii-errors',
    title: 'Type I & Type II Errors',
    icon: 'FunctionSquare',
    description: 'The trade-off between false alarms and missed signals.',
    category: 'sub-topic',
    parent: 'stats-foundations',
    pathPrefix: 'topics'
  }),
  createTopic({
    id: 'correlation-vs-causation',
    title: 'Correlation vs. Causation',
    icon: 'FunctionSquare',
    description: "Don't confuse association with influence.",
    category: 'sub-topic',
    parent: 'stats-foundations',
    pathPrefix: 'topics'
  }),
  createTopic({
    id: 'linear-regression',
    title: 'Linear Regression',
    icon: 'FunctionSquare',
    description: 'Modeling the relationship between variables.',
    category: 'sub-topic',
    parent: 'stats-foundations',
    pathPrefix: 'topics'
  }),

  // Stat Toolkit Tier 2
  createTopic({
    id: 'logistic-regression',
    title: 'Logistic Regression',
    icon: 'FunctionSquare',
    description: '',
    category: 'sub-topic',
    parent: 'stats-intermediate',
    pathPrefix: 'topics'
  }),

  // Stat Toolkit Tier 3
  createTopic({
    id: 'monte-carlo-simulation',
    title: 'Monte Carlo Simulation',
    icon: 'FunctionSquare',
    description: '',
    category: 'sub-topic',
    parent: 'stats-advanced',
    pathPrefix: 'topics'
  }),
  createTopic({
    id: 'time-series-decomposition',
    title: 'Time Series Decomposition',
    icon: 'FunctionSquare',
    description: '',
    category: 'sub-topic',
    parent: 'stats-advanced',
    pathPrefix: 'topics'
  }),
  createTopic({
    id: 'autocorrelation-acf-pacf',
    title: 'Autocorrelation (ACF & PACF)',
    icon: 'FunctionSquare',
    description: '',
    category: 'sub-topic',
    parent: 'stats-advanced',
    pathPrefix: 'topics'
  }),
  createTopic({
    id: 'volatility-garch',
    title: 'Volatility &amp; Standard Deviation (GARCH)',
    icon: 'FunctionSquare',
    description: '',
    category: 'sub-topic',
    parent: 'stats-advanced',
    pathPrefix: 'topics'
  }),
  createTopic({
    id: 'efficient-frontier-sharpe-ratio',
    title: 'Efficient Frontier &amp; Sharpe Ratio',
    icon: 'FunctionSquare',
    description: '',
    category: 'sub-topic',
    parent: 'stats-advanced',
    pathPrefix: 'topics'
  }),
  createTopic({
    id: 'kalman-filters',
    title: 'Kalman Filters',
    icon: 'FunctionSquare',
    description: '',
    category: 'sub-topic',
    parent: 'stats-advanced',
    pathPrefix: 'topics'
  }),
  createTopic({
    id: 'stochastic-calculus-itos-lemma',
    title: "Stochastic Calculus &amp; Ito's Lemma",
    icon: 'FunctionSquare',
    description: '',
    category: 'sub-topic',
    parent: 'stats-advanced',
    pathPrefix: 'topics'
  }),
];
