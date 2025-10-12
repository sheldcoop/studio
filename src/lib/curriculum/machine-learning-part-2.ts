
import { type Topic } from './types';
import { createTopic } from './utils';

export const machineLearningPart2: Topic[] = [
  // --- Module 2: Time-Series Forecasting for Trading ---
  createTopic({
    parent: 'ml-module-2',
    title: 'Classical Time-Series Models (ARIMA, GARCH)',
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
    parent: 'ml-module-2',
    title: 'Deep Learning for Sequences (LSTMs, Transformers)',
    duration: 40,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
        { id: 'theory', title: 'Core Theory' },
        { id: 'application', title: 'Financial Application' },
        { id: 'interactive', title: 'Interactive Demo' },
        { id: 'problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    parent: 'ml-module-2',
    title: 'Stationarity & Memory in Markets (ADF Test, Frac. Diff.)',
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
    parent: 'ml-module-2',
    title: 'Building Trading Signals from Predictions (Meta-Labeling)',
    duration: 30,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
        { id: 'theory', title: 'Core Theory' },
        { id: 'application', title: 'Financial Application' },
        { id: 'interactive', title: 'Interactive Demo' },
        { id: 'problems', title: 'Practice Problems' },
    ]
  }),

  // --- Module 3: Machine Learning for Risk Management ---
  createTopic({
    parent: 'ml-module-3',
    title: 'Credit Default Prediction & Scoring',
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
    parent: 'ml-module-3',
    title: 'Anomaly & Financial Fraud Detection (Isolation Forests, Autoencoders)',
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
    parent: 'ml-module-3',
    title: 'Modeling Volatility & Value-at-Risk (VaR)',
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
    parent: 'ml-module-3',
    title: 'Model Explainability & Interpretability (SHAP, LIME)',
    duration: 30,
    category: 'sub-topic', description: '', status: 'not-started',
    subTopics: [
        { id: 'theory', title: 'Core Theory' },
        { id: 'application', title: 'Financial Application' },
        { id: 'interactive', title: 'Interactive Demo' },
        { id: 'problems', title: 'Practice Problems' },
    ]
  }),
];
