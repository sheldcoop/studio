
import type { Topic } from './types';
import { createTopic } from './utils';

export const parametricTests: Topic[] = [
  createTopic({
    id: 't-test',
    title: 'T-Test',
    icon: 'FunctionSquare',
    description: 'Compares the means of two groups, assuming normal distribution.',
    category: 'parametric',
    pathPrefix: 'quantlab',
  }),
  createTopic({
    id: 'z-test',
    title: 'Z-Test',
    icon: 'FunctionSquare',
    description:
      'Compares means of large samples (n>30) with known population variance.',
    category: 'parametric',
    pathPrefix: 'quantlab',
  }),
  createTopic({
    id: 'anova',
    title: 'ANOVA',
    icon: 'FunctionSquare',
    description: 'Compares the averages of three or more groups.',
    category: 'parametric',
    pathPrefix: 'quantlab',
  }),
  createTopic({
    id: 'f-test',
    title: 'F-Test',
    icon: 'FunctionSquare',
    description: 'Compares the variances (spread) of two or more groups.',
    category: 'parametric',
    pathPrefix: 'quantlab',
  }),
  createTopic({
    id: 'pearson-correlation',
    title: 'Pearson Correlation',
    icon: 'FunctionSquare',
    description:
      'Measures the linear relationship between two continuous variables.',
    category: 'parametric',
    pathPrefix: 'quantlab',
  }),
];
