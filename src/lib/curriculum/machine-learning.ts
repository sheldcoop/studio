
import { type Topic } from './types';
import { createTopic } from './utils';

const PATH_PREFIX = 'paths/machine-learning-for-quantitative-finance';

export const machineLearningTopics: Topic[] = [
  // --- Module 0: The Absolute Basics of Machine Learning ---
  createTopic({
    parent: 'ml-module-0',
    title: 'The Language of ML: Data, Features & Labels',
    duration: 20,
    category: 'sub-topic', pathPrefix: PATH_PREFIX, description: '', status: 'not-started',
    subTopics: [
      { id: 'ml-the-language-of-ml-data-features-labels-theory', title: 'Core Theory' },
      { id: 'ml-the-language-of-ml-data-features-labels-application', title: 'Financial Application' },
      { id: 'ml-the-language-of-ml-data-features-labels-interactive', title: 'Interactive Demo' },
      { id: 'ml-the-language-of-ml-data-features-labels-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    parent: 'ml-module-0',
    title: 'The Three Flavors of Learning (Supervised, Unsupervised, Reinforcement)',
    duration: 25,
    category: 'sub-topic', pathPrefix: PATH_PREFIX, description: '', status: 'not-started',
    subTopics: [
      { id: 'ml-the-three-flavors-of-learning-supervised-unsupervised-reinforcement-theory', title: 'Core Theory' },
      { id: 'ml-the-three-flavors-of-learning-supervised-unsupervised-reinforcement-application', title: 'Financial Application' },
      { id: 'ml-the-three-flavors-of-learning-supervised-unsupervised-reinforcement-interactive', title: 'Interactive Demo' },
      { id: 'ml-the-three-flavors-of-learning-supervised-unsupervised-reinforcement-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    parent: 'ml-module-0',
    title: 'Your First Models: An Intuitive Look (KNN & Simple Linear Regression)',
    duration: 30,
    category: 'sub-topic', pathPrefix: PATH_PREFIX, description: '', status: 'not-started',
    subTopics: [
      { id: 'ml-your-first-models-an-intuitive-look-knn-simple-linear-regression-theory', title: 'Core Theory' },
      { id: 'ml-your-first-models-an-intuitive-look-knn-simple-linear-regression-application', title: 'Financial Application' },
      { id: 'ml-your-first-models-an-intuitive-look-knn-simple-linear-regression-interactive', title: 'Interactive Demo' },
      { id: 'ml-your-first-models-an-intuitive-look-knn-simple-linear-regression-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    parent: 'ml-module-0',
    title: 'The Golden Rule: How to Split Your Data (Train, Validate, Test)',
    duration: 25,
    category: 'sub-topic', pathPrefix: PATH_PREFIX, description: '', status: 'not-started',
    subTopics: [
      { id: 'ml-the-golden-rule-how-to-split-your-data-train-validate-test-theory', title: 'Core Theory' },
      { id: 'ml-the-golden-rule-how-to-split-your-data-train-validate-test-application', title: 'Financial Application' },
      { id: 'ml-the-golden-rule-how-to-split-your-data-train-validate-test-interactive', title: 'Interactive Demo' },
      { id: 'ml-the-golden-rule-how-to-split-your-data-train-validate-test-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    parent: 'ml-module-0',
    title: 'How Do We Score a Model? (Accuracy, Confusion Matrix, MSE)',
    duration: 20,
    category: 'sub-topic', pathPrefix: PATH_PREFIX, description: '', status: 'not-started',
    subTopics: [
      { id: 'ml-how-do-we-score-a-model-accuracy-confusion-matrix-mse-theory', title: 'Core Theory' },
      { id: 'ml-how-do-we-score-a-model-accuracy-confusion-matrix-mse-application', title: 'Financial Application' },
      { id: 'ml-how-do-we-score-a-model-accuracy-confusion-matrix-mse-interactive', title: 'Interactive Demo' },
      { id: 'ml-how-do-we-score-a-model-accuracy-confusion-matrix-mse-problems', title: 'Practice Problems' },
    ]
  }),

  // --- Module 1: Foundations of ML in Finance ---
  createTopic({
    parent: 'ml-module-1',
    title: 'The Financial ML Landscape (Alpha, Risk, Execution)',
    duration: 20,
    category: 'sub-topic', pathPrefix: PATH_PREFIX, description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-the-financial-ml-landscape-alpha-risk-execution-theory', title: 'Core Theory' },
        { id: 'ml-the-financial-ml-landscape-alpha-risk-execution-application', title: 'Financial Application' },
        { id: 'ml-the-financial-ml-landscape-alpha-risk-execution-interactive', title: 'Interactive Demo' },
        { id: 'ml-the-financial-ml-landscape-alpha-risk-execution-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    parent: 'ml-module-1',
    title: 'Feature Engineering for Financial Data (Price, Volume, Order Books)',
    duration: 35,
    category: 'sub-topic', pathPrefix: PATH_PREFIX, description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-feature-engineering-for-financial-data-price-volume-order-books-theory', title: 'Core Theory' },
        { id: 'ml-feature-engineering-for-financial-data-price-volume-order-books-application', title: 'Financial Application' },
        { id: 'ml-feature-engineering-for-financial-data-price-volume-order-books-interactive', title: 'Interactive Demo' },
        { id: 'ml-feature-engineering-for-financial-data-price-volume-order-books-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    parent: 'ml-module-1',
    title: 'Core Predictive Models (Trees, Boosting, Regularization)',
    duration: 30,
    category: 'sub-topic', pathPrefix: PATH_PREFIX, description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-core-predictive-models-trees-boosting-regularization-theory', title: 'Core Theory' },
        { id: 'ml-core-predictive-models-trees-boosting-regularization-application', title: 'Financial Application' },
        { id: 'ml-core-predictive-models-trees-boosting-regularization-interactive', title: 'Interactive Demo' },
        { id: 'ml-core-predictive-models-trees-boosting-regularization-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    parent: 'ml-module-1',
    title: 'Backtesting & Model Validation (Walk-Forward, Sharpe Ratio)',
    duration: 25,
    category: 'sub-topic', pathPrefix: PATH_PREFIX, description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-backtesting-model-validation-walk-forward-sharpe-ratio-theory', title: 'Core Theory' },
        { id: 'ml-backtesting-model-validation-walk-forward-sharpe-ratio-application', title: 'Financial Application' },
        { id: 'ml-backtesting-model-validation-walk-forward-sharpe-ratio-interactive', title: 'Interactive Demo' },
        { id: 'ml-backtesting-model-validation-walk-forward-sharpe-ratio-problems', title: 'Practice Problems' },
    ]
  }),

  // --- Module 2: Time-Series Forecasting for Trading ---
  createTopic({
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

  // --- Module 4: NLP for Alpha Generation ---
  createTopic({
    parent: 'ml-module-4',
    title: 'Financial Sentiment Analysis (News, Earnings Reports, Tweets)',
    duration: 35,
    category: 'sub-topic', pathPrefix: PATH_PREFIX, description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-financial-sentiment-analysis-news-earnings-reports-tweets-theory', title: 'Core Theory' },
        { id: 'ml-financial-sentiment-analysis-news-earnings-reports-tweets-application', title: 'Financial Application' },
        { id: 'ml-financial-sentiment-analysis-news-earnings-reports-tweets-interactive', title: 'Interactive Demo' },
        { id: 'ml-financial-sentiment-analysis-news-earnings-reports-tweets-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    parent: 'ml-module-4',
    title: 'Information Extraction (NER, Topic Modeling)',
    duration: 30,
    category: 'sub-topic', pathPrefix: PATH_PREFIX, description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-information-extraction-ner-topic-modeling-theory', title: 'Core Theory' },
        { id: 'ml-information-extraction-ner-topic-modeling-application', title: 'Financial Application' },
        { id: 'ml-information-extraction-ner-topic-modeling-interactive', title: 'Interactive Demo' },
        { id: 'ml-information-extraction-ner-topic-modeling-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    parent: 'ml-module-4',
    title: 'Advanced Text Representation (Word2Vec, Transformers - BERT)',
    duration: 25,
    category: 'sub-topic', pathPrefix: PATH_PREFIX, description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-advanced-text-representation-word2vec-transformers-bert-theory', title: 'Core Theory' },
        { id: 'ml-advanced-text-representation-word2vec-transformers-bert-application', title: 'Financial Application' },
        { id: 'ml-advanced-text-representation-word2vec-transformers-bert-interactive', title: 'Interactive Demo' },
        { id: 'ml-advanced-text-representation-word2vec-transformers-bert-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    parent: 'ml-module-4',
    title: 'Integrating NLP Signals into Trading Models',
    duration: 25,
    category: 'sub-topic', pathPrefix: PATH_PREFIX, description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-integrating-nlp-signals-into-trading-models-theory', title: 'Core Theory' },
        { id: 'ml-integrating-nlp-signals-into-trading-models-application', title: 'Financial Application' },
        { id: 'ml-integrating-nlp-signals-into-trading-models-interactive', title: 'Interactive Demo' },
        { id: 'ml-integrating-nlp-signals-into-trading-models-problems', title: 'Practice Problems' },
    ]
  }),

  // --- Module 5: Advanced Topics & Modern Frontiers ---
  createTopic({
    parent: 'ml-module-5',
    title: 'Reinforcement Learning for Optimal Trading',
    duration: 40,
    category: 'sub-topic', pathPrefix: PATH_PREFIX, description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-reinforcement-learning-for-optimal-trading-theory', title: 'Core Theory' },
        { id: 'ml-reinforcement-learning-for-optimal-trading-application', title: 'Financial Application' },
        { id: 'ml-reinforcement-learning-for-optimal-trading-interactive', title: 'Interactive Demo' },
        { id: 'ml-reinforcement-learning-for-optimal-trading-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    parent: 'ml-module-5',
    title: 'Portfolio Optimization with ML (Covariance Estimation)',
    duration: 35,
    category: 'sub-topic', pathPrefix: PATH_PREFIX, description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-portfolio-optimization-with-ml-covariance-estimation-theory', title: 'Core Theory' },
        { id: 'ml-portfolio-optimization-with-ml-covariance-estimation-application', title: 'Financial Application' },
        { id: 'ml-portfolio-optimization-with-ml-covariance-estimation-interactive', title: 'Interactive Demo' },
        { id: 'ml-portfolio-optimization-with-ml-covariance-estimation-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    parent: 'ml-module-5',
    title: 'Leveraging Alternative Data (Satellite Imagery, Web Data)',
    duration: 35,
    category: 'sub-topic', pathPrefix: PATH_PREFIX, description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-leveraging-alternative-data-satellite-imagery-web-data-theory', title: 'Core Theory' },
        { id: 'ml-leveraging-alternative-data-satellite-imagery-web-data-application', title: 'Financial Application' },
        { id: 'ml-leveraging-alternative-data-satellite-imagery-web-data-interactive', title: 'Interactive Demo' },
        { id: 'ml-leveraging-alternative-data-satellite-imagery-web-data-problems', title: 'Practice Problems' },
    ]
  }),
  createTopic({
    parent: 'ml-module-5',
    title: 'AI Ethics & Regulation in Finance',
    duration: 30,
    category: 'sub-topic', pathPrefix: PATH_PREFIX, description: '', status: 'not-started',
    subTopics: [
        { id: 'ml-ai-ethics-regulation-in-finance-theory', title: 'Core Theory' },
        { id: 'ml-ai-ethics-regulation-in-finance-application', title: 'Financial Application' },
        { id: 'ml-ai-ethics-regulation-in-finance-interactive', title: 'Interactive Demo' },
        { id: 'ml-ai-ethics-regulation-in-finance-problems', title: 'Practice Problems' },
    ]
  }),
];
