
import { type Topic } from './types';
import { createTopic } from './utils';

const PATH_PREFIX = 'machine-learning-for-quantitative-finance';

export const machineLearningPart2: Topic[] = [
  // --- Module 2: Time-Series Forecasting for Trading ---
  createTopic({
    id: 'ml-classical-time-series-models',
    parent: 'ml-module-2',
    title: 'Classical Time-Series Models (ARIMA, GARCH)',
    duration: 30,
    category: 'sub-topic', pathPrefix: PATH_PREFIX, description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-classical-time-series-models-arima-garch-theory', title: 'Core Theory' },
        { id: 'ml-classical-time-series-models-arima-garch-application', title: 'Financial Application' },
        { id: 'ml-classical-time-series-models-arima-garch-interactive', title: 'Interactive Demo' },
        { id: 'ml-classical-time-series-models-arima-garch-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    id: 'ml-deep-learning-for-sequences',
    parent: 'ml-module-2',
    title: 'Deep Learning for Sequences (LSTMs, Transformers)',
    duration: 40,
    category: 'sub-topic', pathPrefix: PATH_PREFIX, description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-deep-learning-for-sequences-lstms-transformers-theory', title: 'Core Theory' },
        { id: 'ml-deep-learning-for-sequences-lstms-transformers-application', title: 'Financial Application' },
        { id: 'ml-deep-learning-for-sequences-lstms-transformers-interactive', title: 'Interactive Demo' },
        { id: 'ml-deep-learning-for-sequences-lstms-transformers-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    id: 'ml-stationarity-and-memory',
    parent: 'ml-module-2',
    title: 'Stationarity & Memory in Markets (ADF Test, Frac. Diff.)',
    duration: 30,
    category: 'sub-topic', pathPrefix: PATH_PREFIX, description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-stationarity-memory-in-markets-adf-test-frac-diff-theory', title: 'Core Theory' },
        { id: 'ml-stationarity-memory-in-markets-adf-test-frac-diff-application', title: 'Financial Application' },
        { id: 'ml-stationarity-memory-in-markets-adf-test-frac-diff-interactive', title: 'Interactive Demo' },
        { id: 'ml-stationarity-memory-in-markets-adf-test-frac-diff-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    id: 'ml-building-trading-signals',
    parent: 'ml-module-2',
    title: 'Building Trading Signals from Predictions (Meta-Labeling)',
    duration: 30,
    category: 'sub-topic', pathPrefix: PATH_PREFIX, description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-building-trading-signals-from-predictions-meta-labeling-theory', title: 'Core Theory' },
        { id: 'ml-building-trading-signals-from-predictions-meta-labeling-application', title: 'Financial Application' },
        { id: 'ml-building-trading-signals-from-predictions-meta-labeling-interactive', title: 'Interactive Demo' },
        { id: 'ml-building-trading-signals-from-predictions-meta-labeling-problems', title: 'Practice Problems' },
    ]
  }),

  // --- Module 3: Machine Learning for Risk Management ---
  createTopic({
    id: 'ml-credit-default-prediction',
    parent: 'ml-module-3',
    title: 'Credit Default Prediction & Scoring',
    duration: 35,
    category: 'sub-topic', pathPrefix: PATH_PREFIX, description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-credit-default-prediction-scoring-theory', title: 'Core Theory' },
        { id: 'ml-credit-default-prediction-scoring-application', title: 'Financial Application' },
        { id: 'ml-credit-default-prediction-scoring-interactive', title: 'Interactive Demo' },
        { id: 'ml-credit-default-prediction-scoring-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    id: 'ml-anomaly-and-fraud-detection',
    parent: 'ml-module-3',
    title: 'Anomaly & Financial Fraud Detection (Isolation Forests, Autoencoders)',
    duration: 30,
    category: 'sub-topic', pathPrefix: PATH_PREFIX, description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-anomaly-financial-fraud-detection-isolation-forests-autoencoders-theory', title: 'Core Theory' },
        { id: 'ml-anomaly-financial-fraud-detection-isolation-forests-autoencoders-application', title: 'Financial Application' },
        { id: 'ml-anomaly-financial-fraud-detection-isolation-forests-autoencoders-interactive', title: 'Interactive Demo' },
        { id: 'ml-anomaly-financial-fraud-detection-isolation-forests-autoencoders-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    id: 'ml-modeling-volatility-and-var',
    parent: 'ml-module-3',
    title: 'Modeling Volatility & Value-at-Risk (VaR)',
    duration: 30,
    category: 'sub-topic', pathPrefix: PATH_PREFIX, description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-modeling-volatility-value-at-risk-var-theory', title: 'Core Theory' },
        { id: 'ml-modeling-volatility-value-at-risk-var-application', title: 'Financial Application' },
        { id: 'ml-modeling-volatility-value-at-risk-var-interactive', title: 'Interactive Demo' },
        { id: 'ml-modeling-volatility-value-at-risk-var-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    id: 'ml-model-explainability',
    parent: 'ml-module-3',
    title: 'Model Explainability & Interpretability (SHAP, LIME)',
    duration: 30,
    category: 'sub-topic', pathPrefix: PATH_PREFIX, description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-model-explainability-interpretability-shap-lime-theory', title: 'Core Theory' },
        { id: 'ml-model-explainability-interpretability-shap-lime-application', title: 'Financial Application' },
        { id: 'ml-model-explainability-interpretability-shap-lime-interactive', title: 'Interactive Demo' },
        { id: 'ml-model-explainability-interpretability-shap-lime-problems', title: 'Practice Problems' },
    ]
  }),
];
