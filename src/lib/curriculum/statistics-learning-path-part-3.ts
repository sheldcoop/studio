
import type { Topic } from './types';
import { createTopic } from './utils';

export const statisticsLearningPathPart3: Topic[] = [
    // Main Advanced Statistics Learning Path Modules (Parents)
    createTopic({
        id: 'stats-mod-5',
        parent: 'statistics-for-quantitative-finance',
        title: 'Module 5: Time Series Analysis & Computational Methods',
        href: '#', description: '', category: 'parent'
    }),
    createTopic({
        id: 'stats-mod-6',
        parent: 'statistics-for-quantitative-finance',
        title: 'Module 6: Advanced Quant Modeling & Numerical Methods',
        href: '#', description: '', category: 'parent'
    }),

    // Lessons for Module 5
    createTopic({
        parent: 'stats-mod-5',
        title: 'Characteristics of Time Series: Trend, Seasonality, Cycles',
        description: 'Decomposing the components of a time series.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-5',
        title: 'Strict vs. Weak Stationarity',
        description: 'The most important property for modeling time series data.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-5',
        title: 'Autocorrelation Function (ACF) and Partial Autocorrelation Function (PACF)',
        description: 'The key tools for identifying the structure of a time series.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-5',
        title: 'ARIMA Models',
        description: 'A class of models for forecasting time series data.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-5',
        title: 'GARCH Models for Volatility',
        description: 'Modeling the changing volatility of financial returns.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-5',
        title: 'Monte Carlo Simulation for Pricing and Risk',
        description: 'Using random simulation to solve complex problems.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-5',
        title: 'Bootstrapping for Estimating Standard Errors',
        description: 'A powerful resampling method for inference.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-5',
        title: 'Jackknife Resampling Techniques',
        description: 'A related method for bias and variance estimation.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-5',
        title: 'Introduction to Random Walks and Martingales',
        description: 'The mathematical foundation of efficient markets.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-5',
        title: 'Geometric Brownian Motion (GBM)',
        description: 'The standard model for stock price paths.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    
    // Lessons for Module 6
    createTopic({
        parent: 'stats-mod-6',
        title: 'Generalized Linear Models (GLMs)',
        description: 'Extending linear models to non-normal data.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-6',
        title: 'Logistic Regression for Binary Outcomes',
        description: 'Modeling probabilities, such as the probability of default.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-6',
        title: 'Poisson Regression for Count Data',
        description: 'Modeling the frequency of events.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-6',
        title: 'Ridge Regression (L2 Penalty)',
        description: "A technique to handle multicollinearity and prevent overfitting.",
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-6',
        title: 'LASSO Regression (L1 Penalty) for Feature Selection',
        description: 'A powerful method for automatically selecting important variables.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-6',
        title: 'Cross-Validation for Hyperparameter Tuning',
        description: 'The gold standard for selecting model parameters.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-6',
        title: 'Bayesian Inference: Priors, Likelihood, and Posteriors',
        description: 'An alternative framework for statistical inference.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-6',
        title: 'Markov Chain Monte Carlo (MCMC)',
        description: 'The computational engine behind modern Bayesian analysis.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-6',
        title: 'Numerical Optimization: Newton-Raphson & Gradient Descent',
        description: 'The algorithms that power MLE and machine learning.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-6',
        title: 'Implementing OLS and MLE in Python/R',
        description: 'Practical coding examples of core statistical techniques.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
];
