
import { type Topic } from './types';

// Helper to create slugs from titles
const toSlug = (title: string) => title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const createMachineLearningTopic = (
  module: string,
  title: string,
  duration: number
): Topic => {
  const slug = `ml-${toSlug(title)}`;
  return {
    id: slug,
    title,
    href: `/paths/machine-learning-for-quantitative-finance/${slug}`,
    description: '', // Descriptions are handled on the page itself
    category: 'sub-topic',
    parent: module,
    duration,
    status: 'not-started',
    subTopics: [
      { id: `${slug}-theory`, title: 'Core Theory' },
      { id: `${slug}-application`, title: 'Financial Application' },
      { id: `${slug}-interactive`, title: 'Interactive Demo' },
      { id: `${slug}-problems`, title: 'Practice Problems' },
    ]
  };
};

export const machineLearningTopics: Topic[] = [
  // --- Module 0: The Absolute Basics of Machine Learning ---
  createMachineLearningTopic('ml-module-0', 'The Language of ML: Data, Features & Labels', 20),
  createMachineLearningTopic('ml-module-0', 'The Three Flavors of Learning (Supervised, Unsupervised, Reinforcement)', 25),
  createMachineLearningTopic('ml-module-0', 'Your First Models: An Intuitive Look (KNN & Simple Linear Regression)', 30),
  createMachineLearningTopic('ml-module-0', 'The Golden Rule: How to Split Your Data (Train, Validate, Test)', 25),
  createMachineLearningTopic('ml-module-0', 'How Do We Score a Model? (Accuracy, Confusion Matrix, MSE)', 20),

  // --- Module 1: Foundations of ML in Finance ---
  createMachineLearningTopic('ml-module-1', 'The Financial ML Landscape (Alpha, Risk, Execution)', 20),
  createMachineLearningTopic('ml-module-1', 'Feature Engineering for Financial Data (Price, Volume, Order Books)', 35),
  createMachineLearningTopic('ml-module-1', 'Core Predictive Models (Trees, Boosting, Regularization)', 30),
  createMachineLearningTopic('ml-module-1', 'Backtesting & Model Validation (Walk-Forward, Sharpe Ratio)', 25),

  // --- Module 2: Time-Series Forecasting for Trading ---
  createMachineLearningTopic('ml-module-2', 'Classical Time-Series Models (ARIMA, GARCH)', 30),
  createMachineLearningTopic('ml-module-2', 'Deep Learning for Sequences (LSTMs, Transformers)', 40),
  createMachineLearningTopic('ml-module-2', 'Stationarity & Memory in Markets (ADF Test, Frac. Diff.)', 30),
  createMachineLearningTopic('ml-module-2', 'Building Trading Signals from Predictions (Meta-Labeling)', 30),

  // --- Module 3: Machine Learning for Risk Management ---
  createMachineLearningTopic('ml-module-3', 'Credit Default Prediction & Scoring', 35),
  createMachineLearningTopic('ml-module-3', 'Anomaly & Financial Fraud Detection (Isolation Forests, Autoencoders)', 30),
  createMachineLearningTopic('ml-module-3', 'Modeling Volatility & Value-at-Risk (VaR)', 30),
  createMachineLearningTopic('ml-module-3', 'Model Explainability & Interpretability (SHAP, LIME)', 30),

  // --- Module 4: NLP for Alpha Generation ---
  createMachineLearningTopic('ml-module-4', 'Financial Sentiment Analysis (News, Earnings Reports, Tweets)', 35),
  createMachineLearningTopic('ml-module-4', 'Information Extraction (NER, Topic Modeling)', 30),
  createMachineLearningTopic('ml-module-4', 'Advanced Text Representation (Word2Vec, Transformers - BERT)', 25),
  createMachineLearningTopic('ml-module-4', 'Integrating NLP Signals into Trading Models', 25),

  // --- Module 5: Advanced Topics & Modern Frontiers ---
  createMachineLearningTopic('ml-module-5', 'Reinforcement Learning for Optimal Trading', 40),
  createMachineLearningTopic('ml-module-5', 'Portfolio Optimization with ML (Covariance Estimation)', 35),
  createMachineLearningTopic('ml-module-5', 'Leveraging Alternative Data (Satellite Imagery, Web Data)', 35),
  createMachineLearningTopic('ml-module-5', 'AI Ethics & Regulation in Finance', 30),
];
