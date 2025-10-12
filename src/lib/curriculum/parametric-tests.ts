
import type { Topic } from './types';
import { createTopic } from './utils';

export const parametricTests: Topic[] = [
  createTopic({
    id: 't-test',
    parent: 'quantlab',
    title: 'T-Test',
    icon: 'FunctionSquare',
    description: 'Compares the means of two groups, assuming normal distribution.',
    category: 'parametric',
  }),
  createTopic({
    id: 'z-test',
    parent: 'quantlab',
    title: 'Z-Test',
    icon: 'FunctionSquare',
    description:
      'Compares means of large samples (n>30) with known population variance.',
    category: 'parametric',
  }),
  createTopic({
    id: 'anova',
    parent: 'quantlab',
    title: 'ANOVA',
    icon: 'FunctionSquare',
    description: 'Compares the averages of three or more groups.',
    category: 'parametric',
  }),
  createTopic({
    id: 'f-test',
    parent: 'quantlab',
    title: 'F-Test',
    icon: 'FunctionSquare',
    description: 'Compares the variances (spread) of two or more groups.',
    category: 'parametric',
  }),
  createTopic({
    id: 'pearson-correlation',
    parent: 'quantlab',
    title: 'Pearson Correlation',
    icon: 'FunctionSquare',
    description:
      'Measures the linear relationship between two continuous variables.',
    category: 'parametric',
  }),
];
