import { FunctionSquare } from 'lucide-react';
import type { Topic } from './types';

export const probabilityTopics: Topic[] = [
  {
    id: 'bayes-theorem',
    title: "Bayes' Theorem",
    href: '/probability/bayes-theorem',
    icon: FunctionSquare,
    description: 'A framework for updating beliefs with new evidence.',
    category: 'probability',
    parent: 'probability',
  },
  {
    id: 'law-of-large-numbers',
    title: 'The Law of Large Numbers',
    href: '/probability/law-of-large-numbers',
    icon: FunctionSquare,
    description: '',
    category: 'probability',
    parent: 'probability',
  },
  {
    id: 'binomial-distribution',
    title: 'Binomial Distribution',
    href: '/probability/binomial-distribution',
    icon: FunctionSquare,
    description: '',
    category: 'probability',
    parent: 'probability',
  },
  {
    id: 'poisson-distribution',
    title: 'Poisson Distribution',
    href: '/probability/poisson-distribution',
    icon: FunctionSquare,
    description: '',
    category: 'probability',
    parent: 'probability',
  },
  {
    id: 'moment-generating-functions',
    title: 'Moment Generating Functions',
    href: '/probability/moment-generating-functions',
    icon: FunctionSquare,
    description: '',
    category: 'probability',
    parent: 'probability',
  },
  {
    id: 'maximum-likelihood-estimation',
    title: 'Maximum Likelihood Estimation (MLE)',
    href: '/probability/maximum-likelihood-estimation',
    icon: FunctionSquare,
    description: '',
    category: 'probability',
    parent: 'probability',
  },
];
