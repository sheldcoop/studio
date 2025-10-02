
import { type Topic } from './types';

<<<<<<< HEAD
const createMLTopic = (moduleId: string, title: string, description: string, duration: number, icon: string, subTopics?: { id: string; title: string }[]): Topic => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return {
        id: `ml-${slug}`,
        title,
        href: `/paths/machine-learning-for-quantitative-finance/ml-${slug}`,
        icon,
        description,
        category: 'sub-topic',
        parent: moduleId,
        duration,
        subTopics: subTopics || [
            { id: `ml-${slug}-theory`, title: 'Core Theory' },
            { id: `ml-${slug}-application`, title: 'Financial Application' },
            { id: `ml-${slug}-interactive`, title: 'Interactive Demo' },
            { id: `ml-${slug}-problems`, title: 'Practice Problems' },
        ]
    };
};

export const machineLearningTopics: Topic[] = [
    // --- Module 0: The Absolute Basics of Machine Learning ---
    createMLTopic('ml-module-0', 'The Language of ML: Data, Features & Labels', '', 20, 'Languages'),
    createMLTopic('ml-module-0', 'The Three Flavors of Learning', 'Supervised, Unsupervised, Reinforcement', 25, 'BrainCircuit'),
    createMLTopic('ml-module-0', 'Your First Models: An Intuitive Look', 'KNN & Simple Linear Regression', 30, 'Shapes'),
    createMLTopic('ml-module-0', 'The Golden Rule: How to Split Your Data', 'Train, Validate, Test', 25, 'GitCommitHorizontal'),
    createMLTopic('ml-module-0', 'How Do We Score a Model?', 'Accuracy, Confusion Matrix, MSE', 20, 'Target'),

    // --- Module 1: Foundations of ML in Finance ---
    createMLTopic('ml-module-1', 'The Financial ML Landscape', 'Alpha, Risk, Execution', 20, 'Globe'),
    createMLTopic('ml-module-1', 'Feature Engineering for Financial Data', 'Price, Volume, Order Books', 35, 'Wrench'),
    createMLTopic('ml-module-1', 'Core Predictive Models', 'Trees, Boosting, Regularization', 30, 'Binary'),
    createMLTopic('ml-module-1', 'Backtesting & Model Validation', 'Walk-Forward, Sharpe Ratio', 25, 'History'),

    // --- Module 2: Time-Series Forecasting for Trading ---
    createMLTopic('ml-module-2', 'Classical Time-Series Models', 'ARIMA, GARCH', 30, 'AreaChart'),
    createMLTopic('ml-module-2', 'Deep Learning for Sequences', 'LSTMs, Transformers', 40, 'BrainCircuit'),
    createMLTopic('ml-module-2', 'Stationarity & Memory in Markets', 'ADF Test, Frac. Diff.', 30, 'MemoryStick'),
    createMLTopic('ml-module-2', 'Building Trading Signals from Predictions', 'Meta-Labeling', 30, 'Signal'),

    // --- Module 3: Machine Learning for Risk Management ---
    createMLTopic('ml-module-3', 'Credit Default Prediction & Scoring', '', 35, 'CreditCard'),
    createMLTopic('ml-module-3', 'Anomaly & Financial Fraud Detection', 'Isolation Forests, Autoencoders', 30, 'ShieldAlert'),
    createMLTopic('ml-module-3', 'Modeling Volatility & Value-at-Risk (VaR)', '', 30, 'Flame'),
    createMLTopic('ml-module-3', 'Model Explainability & Interpretability', 'SHAP, LIME', 30, 'Lightbulb'),

    // --- Module 4: NLP for Alpha Generation ---
    createMLTopic('ml-module-4', 'Financial Sentiment Analysis', 'News, Earnings Reports, Tweets', 35, 'Newspaper'),
    createMLTopic('ml-module-4', 'Information Extraction', 'NER, Topic Modeling', 30, 'Search'),
    createMLTopic('ml-module-4', 'Advanced Text Representation', 'Word2Vec, Transformers - BERT', 25, 'Speech'),
    createMLTopic('ml-module-4', 'Integrating NLP Signals into Trading Models', '', 25, 'Waypoints'),

    // --- Module 5: Advanced Topics & Modern Frontiers ---
    createMLTopic('ml-module-5', 'Reinforcement Learning for Optimal Trading', '', 40, 'Bot'),
    createMLTopic('ml-module-5', 'Portfolio Optimization with ML', 'Covariance Estimation', 35, 'Scale'),
    createMLTopic('ml-module-5', 'Leveraging Alternative Data', 'Satellite Imagery, Web Data', 35, 'Satellite'),
    createMLTopic('ml-module-5', 'AI Ethics & Regulation in Finance', '', 30, 'Landmark'),
];
=======
const createMLTopic = (
  moduleId: string,
  id: string,
  title: string,
  duration: number
): Topic => {
  const slug = `ml-${id}`;
  return {
    id: slug,
    title,
    href: `/machine-learning/${slug}`,
    icon: 'BrainCircuit',
    description: '', // Placeholder, as it's not in the provided table
    category: 'sub-topic',
    parent: moduleId,
    duration: duration,
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
  // Module 0: The Absolute Basics of Machine Learning
  createMLTopic('ml-mod-0', 'language-of-ml', 'The Language of ML: Data, Features & Labels', 20),
  createMLTopic('ml-mod-0', 'three-flavors', 'The Three Flavors of Learning', 25),
  createMLTopic('ml-mod-0', 'first-models', 'Your First Models: An Intuitive Look', 30),
  createMLTopic('ml-mod-0', 'golden-rule', 'The Golden Rule: How to Split Your Data', 25),
  createMLTopic('ml-mod-0', 'score-a-model', 'How Do We Score a Model?', 20),

  // Module 1: Foundations of ML in Finance
  createMLTopic('ml-mod-1', 'financial-ml-landscape', 'The Financial ML Landscape', 20),
  createMLTopic('ml-mod-1', 'feature-engineering', 'Feature Engineering for Financial Data', 35),
  createMLTopic('ml-mod-1', 'core-predictive-models', 'Core Predictive Models', 30),
  createMLTopic('ml-mod-1', 'backtesting', 'Backtesting & Model Validation', 25),

  // Module 2: Time-Series Forecasting for Trading
  createMLTopic('ml-mod-2', 'classical-ts-models', 'Classical Time-Series Models', 30),
  createMLTopic('ml-mod-2', 'deep-learning-for-sequences', 'Deep Learning for Sequences', 40),
  createMLTopic('ml-mod-2', 'stationarity-memory', 'Stationarity & Memory in Markets', 30),
  createMLTopic('ml-mod-2', 'building-trading-signals', 'Building Trading Signals from Predictions', 30),
  
  // Module 3: Machine Learning for Risk Management
  createMLTopic('ml-mod-3', 'credit-default-prediction', 'Credit Default Prediction & Scoring', 35),
  createMLTopic('ml-mod-3', 'fraud-detection', 'Anomaly & Financial Fraud Detection', 30),
  createMLTopic('ml-mod-3', 'modeling-volatility-var', 'Modeling Volatility & Value-at-Risk (VaR)', 30),
  createMLTopic('ml-mod-3', 'model-explainability', 'Model Explainability & Interpretability', 30),

  // Module 4: NLP for Alpha Generation
  createMLTopic('ml-mod-4', 'financial-sentiment-analysis', 'Financial Sentiment Analysis', 35),
  createMLTopic('ml-mod-4', 'information-extraction', 'Information Extraction', 30),
  createMLTopic('ml-mod-4', 'advanced-text-representation', 'Advanced Text Representation', 25),
  createMLTopic('ml-mod-4', 'integrating-nlp-signals', 'Integrating NLP Signals into Trading Models', 25),

  // Module 5: Advanced Topics & Modern Frontiers
  createMLTopic('ml-mod-5', 'reinforcement-learning', 'Reinforcement Learning for Optimal Trading', 40),
  createMLTopic('ml-mod-5', 'portfolio-optimization-ml', 'Portfolio Optimization with ML', 35),
  createMLTopic('ml-mod-5', 'alternative-data', 'Leveraging Alternative Data', 35),
  createMLTopic('ml-mod-5', 'ai-ethics-regulation', 'AI Ethics & Regulation in Finance', 30),
];

>>>>>>> working-3.0
