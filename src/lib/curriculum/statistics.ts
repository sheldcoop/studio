
import { type Topic } from './types';
import { createTopic } from './utils';
import { parametricTests } from './parametric-tests';
import { nonParametricTests } from './non-parametric-tests';
import { quantlabStatisticalTools } from './quantlab-statistical-tools';
import { statisticsLearningPath } from './statistics-learning-path';

export const statisticsTopics: Topic[] = [
  // This topic is a navigational link on the hypothesis testing guide page.
  createTopic({
    id: 'hypothesis-testing-guide',
    href: '/quantlab/hypothesis-testing-guide',
    parent: 'quantlab',
    title: 'Hypothesis Testing Guide',
    icon: 'Beaker',
    description: "A comprehensive guide to choosing the right statistical test.",
    category: 'sub-topic',
  }),
  // This is the introductory article that explains hypothesis testing.
  createTopic({
    id: 'introduction-to-hypothesis-testing',
    parent: 'quantlab',
    title: 'An Introduction to Hypothesis Testing',
    description: 'A practical guide to deciding if your results are a real breakthrough or just random noise.',
    category: 'sub-topic',
    icon: 'HelpCircle'
  }),
  ...parametricTests,
  ...nonParametricTests,
  ...quantlabStatisticalTools,
  ...statisticsLearningPath,
];
