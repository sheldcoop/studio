
import { type Topic } from './types';
import { createTopic } from './utils';

export const machineLearningPart1: Topic[] = [
  // --- Module 0: The Absolute Basics of Machine Learning ---
  createTopic({
    id: 'ml-language-of-ml',
    parent: 'ml-module-0',
    title: 'The Language of ML: Data, Features & Labels',
    duration: 20,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
      { id: 'ml-the-language-of-ml-data-features-labels-theory', title: 'Core Theory' },
      { id: 'ml-the-language-of-ml-data-features-labels-application', title: 'Financial Application' },
      { id: 'ml-the-language-of-ml-data-features-labels-interactive', title: 'Interactive Demo' },
      { id: 'ml-the-language-of-ml-data-features-labels-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    id: 'ml-three-flavors-of-learning',
    parent: 'ml-module-0',
    title: 'The Three Flavors of Learning (Supervised, Unsupervised, Reinforcement)',
    duration: 25,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
      { id: 'ml-the-three-flavors-of-learning-supervised-unsupervised-reinforcement-theory', title: 'Core Theory' },
      { id: 'ml-the-three-flavors-of-learning-supervised-unsupervised-reinforcement-application', title: 'Financial Application' },
      { id: 'ml-the-three-flavors-of-learning-supervised-unsupervised-reinforcement-interactive', title: 'Interactive Demo' },
      { id: 'ml-the-three-flavors-of-learning-supervised-unsupervised-reinforcement-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    id: 'ml-your-first-models',
    parent: 'ml-module-0',
    title: 'Your First Models: An Intuitive Look (KNN & Simple Linear Regression)',
    duration: 30,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
      { id: 'ml-your-first-models-an-intuitive-look-knn-simple-linear-regression-theory', title: 'Core Theory' },
      { id: 'ml-your-first-models-an-intuitive-look-knn-simple-linear-regression-application', title: 'Financial Application' },
      { id: 'ml-your-first-models-an-intuitive-look-knn-simple-linear-regression-interactive', title: 'Interactive Demo' },
      { id: 'ml-your-first-models-an-intuitive-look-knn-simple-linear-regression-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    id: 'ml-how-to-split-your-data',
    parent: 'ml-module-0',
    title: 'The Golden Rule: How to Split Your Data (Train, Validate, Test)',
    duration: 25,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
      { id: 'ml-the-golden-rule-how-to-split-your-data-train-validate-test-theory', title: 'Core Theory' },
      { id: 'ml-the-golden-rule-how-to-split-your-data-train-validate-test-application', title: 'Financial Application' },
      { id: 'ml-the-golden-rule-how-to-split-your-data-train-validate-test-interactive', title: 'Interactive Demo' },
      { id: 'ml-the-golden-rule-how-to-split-your-data-train-validate-test-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    id: 'ml-how-do-we-score-a-model',
    parent: 'ml-module-0',
    title: 'How Do We Score a Model? (Accuracy, Confusion Matrix, MSE)',
    duration: 20,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
      { id: 'ml-how-do-we-score-a-model-accuracy-confusion-matrix-mse-theory', title: 'Core Theory' },
      { id: 'ml-how-do-we-score-a-model-accuracy-confusion-matrix-mse-application', title: 'Financial Application' },
      { id: 'ml-how-do-we-score-a-model-accuracy-confusion-matrix-mse-interactive', title: 'Interactive Demo' },
      { id: 'ml-how-do-we-score-a-model-accuracy-confusion-matrix-mse-problems', title: 'Practice Problems' },
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
    id: 'ml-financial-ml-landscape',
    parent: 'ml-module-1',
    title: 'The Financial ML Landscape (Alpha, Risk, Execution)',
    duration: 20,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-the-financial-ml-landscape-alpha-risk-execution-theory', title: 'Core Theory' },
        { id: 'ml-the-financial-ml-landscape-alpha-risk-execution-application', title: 'Financial Application' },
        { id: 'ml-the-financial-ml-landscape-alpha-risk-execution-interactive', title: 'Interactive Demo' },
        { id: 'ml-the-financial-ml-landscape-alpha-risk-execution-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    id: 'ml-feature-engineering',
    parent: 'ml-module-1',
    title: 'Feature Engineering for Financial Data (Price, Volume, Order Books)',
    duration: 35,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-feature-engineering-for-financial-data-price-volume-order-books-theory', title: 'Core Theory' },
        { id: 'ml-feature-engineering-for-financial-data-price-volume-order-books-application', title: 'Financial Application' },
        { id: 'ml-feature-engineering-for-financial-data-price-volume-order-books-interactive', title: 'Interactive Demo' },
        { id: 'ml-feature-engineering-for-financial-data-price-volume-order-books-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    id: 'ml-core-predictive-models',
    parent: 'ml-module-1',
    title: 'Core Predictive Models (Trees, Boosting, Regularization)',
    duration: 30,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-core-predictive-models-trees-boosting-regularization-theory', title: 'Core Theory' },
        { id: 'ml-core-predictive-models-trees-boosting-regularization-application', title: 'Financial Application' },
        { id: 'ml-core-predictive-models-trees-boosting-regularization-interactive', title: 'Interactive Demo' },
        { id: 'ml-core-predictive-models-trees-boosting-regularization-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    id: 'ml-backtesting-and-validation',
    parent: 'ml-module-1',
    title: 'Backtesting & Model Validation (Walk-Forward, Sharpe Ratio)',
    duration: 25,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-backtesting-model-validation-walk-forward-sharpe-ratio-theory', title: 'Core Theory' },
        { id: 'ml-backtesting-model-validation-walk-forward-sharpe-ratio-application', title: 'Financial Application' },
        { id: 'ml-backtesting-model-validation-walk-forward-sharpe-ratio-interactive', title: 'Interactive Demo' },
        { id: 'ml-backtesting-model-validation-walk-forward-sharpe-ratio-problems', title: 'Practice Problems' },
    ]
  }),
];
