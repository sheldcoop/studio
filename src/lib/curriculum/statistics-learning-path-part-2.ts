
import type { Topic } from './types';
import { createTopic } from './utils';

export const statisticsLearningPathPart2: Topic[] = [
    // Main Advanced Statistics Learning Path Modules (Parents)
    createTopic({
        id: 'stats-mod-3',
        parent: 'statistics-for-quantitative-finance',
        title: 'Module 3: Statistical Inference & Estimation Theory',
        href: '#', description: '', category: 'parent'
    }),
    createTopic({
        id: 'stats-mod-4',
        parent: 'statistics-for-quantitative-finance',
        title: 'Module 4: Linear Modeling & Econometrics',
        href: '#', description: '', category: 'parent'
    }),

    // Lessons for Module 3
    createTopic({
        parent: 'stats-mod-3',
        title: 'Definition of a Statistic and an Estimator',
        description: 'Distinguishing between a function of data and a guess for a parameter.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-3',
        title: 'Unbiasedness, Bias, and Asymptotic Unbiasedness',
        description: 'Evaluating the accuracy of estimators.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-3',
        title: 'Efficiency and the Cramér-Rao Lower Bound (CRLB)',
        description: 'Finding the "best" possible unbiased estimator.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-3',
        title: 'Consistency and Sufficiency',
        description: 'Properties of estimators that improve with more data.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-3',
        title: 'Method of Moments (MoM) Estimation',
        description: 'A straightforward technique for finding estimators.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-3',
        title: 'Maximum Likelihood Estimation (MLE)',
        description: 'The most important method for parameter estimation in finance.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-3',
        title: 'Finding MLE Estimates via Optimization',
        description: 'The practical side of implementing MLE.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-3',
        title: 'General Construction of Confidence Intervals (CIs)',
        description: 'A framework for creating intervals for any parameter.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-3',
        title: 'Deriving CIs for Mean and Variance',
        description: 'Using t, χ², and Z pivotal quantities to build intervals.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-3',
        title: 'Null vs. Alternative Hypotheses, Type I and II Errors',
        description: 'The fundamental setup of all hypothesis tests.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-3',
        title: 'Neyman-Pearson Lemma for Optimal Tests',
        description: 'Finding the most powerful test for a given significance level.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-3',
        title: "Likelihood Ratio Tests (LRT) and Wilks' Theorem",
        description: 'A general method for comparing nested models.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-3',
        title: 'Testing with p-values and Critical Regions',
        description: 'The two equivalent approaches to making a statistical decision.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),

    // Lessons for Module 4
    createTopic({
        parent: 'stats-mod-4',
        title: 'Simple Linear Regression (SLR)',
        description: 'Modeling the relationship between two variables.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-4',
        title: 'Derivation of the OLS Estimators',
        description: 'The calculus behind finding the "best fit" line.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-4',
        title: 'Properties of the Fitted Model (R-Squared, Residuals)',
        description: 'Assessing how well your linear model fits the data.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-4',
        title: 'Multiple Linear Regression (MLR) in Matrix Form',
        description: 'Extending SLR to multiple predictors using linear algebra.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-4',
        title: 'Derivation of the MLR OLS Estimator',
        description: 'The matrix algebra for solving a multiple regression problem.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-4',
        title: 'Gauss-Markov Theorem and the BLUE Property',
        description: 'The theoretical justification for using OLS.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-4',
        title: 't-tests for Individual Coefficients',
        description: 'Testing the significance of a single predictor.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-4',
        title: 'F-tests for Joint Hypotheses and Overall Model Significance',
        description: 'Testing the significance of a group of predictors or the entire model.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-4',
        title: 'Model Assumptions (Linearity, Exogeneity, Homoskedasticity)',
        description: 'The critical assumptions that must hold for OLS to be valid.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-4',
        title: 'Multicollinearity and Variance Inflation Factor (VIF)',
        description: 'Diagnosing when predictors are too correlated with each other.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-4',
        title: 'Heteroskedasticity: Detection and Robust Standard Errors',
        description: 'Handling non-constant variance in the error terms.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-4',
        title: 'Autocorrelation: Durbin-Watson Test',
        description: 'Detecting patterns in the error terms over time.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
];
