
import { type Topic } from './types';
import { createTopic } from './utils';

export const machineLearningPart1: Topic[] = [
  // --- Module 0: The Absolute Basics of Machine Learning ---
  createTopic({
    parent: 'ml-module-0',
    title: 'The Language of ML: Data, Features & Labels',
    duration: 20,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
      { id: 'theory', title: 'Core Theory' },
      { id: 'application', title: 'Financial Application' },
      { id: 'interactive', title: 'Interactive Demo' },
      { id: 'problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    parent: 'ml-module-0',
    title: 'The Three Flavors of Learning (Supervised, Unsupervised, Reinforcement)',
    duration: 25,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
      { id: 'theory', title: 'Core Theory' },
      { id: 'application', title: 'Financial Application' },
      { id: 'interactive', title: 'Interactive Demo' },
      { id: 'problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    parent: 'ml-module-0',
    title: 'Your First Models: An Intuitive Look (KNN & Simple Linear Regression)',
    duration: 30,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
      { id: 'theory', title: 'Core Theory' },
      { id: 'application', title: 'Financial Application' },
      { id: 'interactive', title: 'Interactive Demo' },
      { id: 'problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    parent: 'ml-module-0',
    title: 'The Golden Rule: How to Split Your Data (Train, Validate, Test)',
    duration: 25,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
      { id: 'theory', title: 'Core Theory' },
      { id: 'application', title: 'Financial Application' },
      { id: 'interactive', title: 'Interactive Demo' },
      { id: 'problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    parent: 'ml-module-0',
    title: 'How Do We Score a Model? (Accuracy, Confusion Matrix, MSE)',
    duration: 20,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
      { id: 'theory', title: 'Core Theory' },
      { id: 'application', title: 'Financial Application' },
      { id: 'interactive', title: 'Interactive Demo' },
      { id: 'problems', title: 'Practice Problems' },
    ]
  }),
  {
    id: 'mental-math',
    title: 'Mental Math for Interviews',
    icon: 'Brain',
    description: "Sharpen your calculation speed and accuracy for interviews.",
    category: 'sub-topic',
    parent: 'ml-module-0', 
    href: '/topics/mental-math'
  },

  // --- Module 1: Foundations of ML in Finance ---
  createTopic({
    parent: 'ml-module-1',
    title: 'The Financial ML Landscape (Alpha, Risk, Execution)',
    duration: 20,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
        { id: 'theory', title: 'Core Theory' },
        { id: 'application', title: 'Financial Application' },
        { id: 'interactive', title: 'Interactive Demo' },
        { id: 'problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    parent: 'ml-module-1',
    title: 'Feature Engineering for Financial Data (Price, Volume, Order Books)',
    duration: 35,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
        { id: 'theory', title: 'Core Theory' },
        { id: 'application', title: 'Financial Application' },
        { id: 'interactive', title: 'Interactive Demo' },
        { id: 'problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    parent: 'ml-module-1',
    title: 'Core Predictive Models (Trees, Boosting, Regularization)',
    duration: 30,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
        { id: 'theory', title: 'Core Theory' },
        { id: 'application', title: 'Financial Application' },
        { id: 'interactive', title: 'Interactive Demo' },
        { id: 'problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    parent: 'ml-module-1',
    title: 'Backtesting & Model Validation (Walk-Forward, Sharpe Ratio)',
    duration: 25,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
        { id: 'theory', title: 'Core Theory' },
        { id: 'application', title: 'Financial Application' },
        { id: 'interactive', title: 'Interactive Demo' },
        { id: 'problems', title: 'Practice Problems' },
    ]
  }),
];
