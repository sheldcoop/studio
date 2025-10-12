
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
        id: 'stats-statistic-and-estimator',
        parent: 'statistics-for-quantitative-finance',
        title: 'Definition of a Statistic and an Estimator',
        description: 'Distinguishing between a function of data and a guess for a parameter.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-unbiasedness',
        parent: 'statistics-for-quantitative-finance',
        title: 'Unbiasedness, Bias, and Asymptotic Unbiasedness',
        description: 'Evaluating the accuracy of estimators.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-efficiency-and-crlb',
        parent: 'statistics-for-quantitative-finance',
        title: 'Efficiency and the Cramér-Rao Lower Bound (CRLB)',
        description: 'Finding the "best" possible unbiased estimator.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-consistency-and-sufficiency',
        parent: 'statistics-for-quantitative-finance',
        title: 'Consistency and Sufficiency',
        description: 'Properties of estimators that improve with more data.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-method-of-moments',
        parent: 'statistics-for-quantitative-finance',
        title: 'Method of Moments (MoM) Estimation',
        description: 'A straightforward technique for finding estimators.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-mle',
        parent: 'statistics-for-quantitative-finance',
        title: 'Maximum Likelihood Estimation (MLE)',
        description: 'The most important method for parameter estimation in finance.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-mle-optimization',
        parent: 'statistics-for-quantitative-finance',
        title: 'Finding MLE Estimates via Optimization',
        description: 'The practical side of implementing MLE.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-ci-construction',
        parent: 'statistics-for-quantitative-finance',
        title: 'General Construction of Confidence Intervals (CIs)',
        description: 'A framework for creating intervals for any parameter.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-ci-derivation',
        parent: 'statistics-for-quantitative-finance',
        title: 'Deriving CIs for Mean and Variance',
        description: 'Using t, χ², and Z pivotal quantities to build intervals.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-hypothesis-testing-framework',
        parent: 'statistics-for-quantitative-finance',
        title: 'Null vs. Alternative Hypotheses, Type I and II Errors',
        description: 'The fundamental setup of all hypothesis tests.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-neyman-pearson-lemma',
        parent: 'statistics-for-quantitative-finance',
        title: 'Neyman-Pearson Lemma for Optimal Tests',
        description: 'Finding the most powerful test for a given significance level.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-lrt-and-wilks-theorem',
        parent: 'statistics-for-quantitative-finance',
        title: "Likelihood Ratio Tests (LRT) and Wilks' Theorem",
        description: 'A general method for comparing nested models.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-p-values-and-critical-regions',
        parent: 'statistics-for-quantitative-finance',
        title: 'Testing with p-values and Critical Regions',
        description: 'The two equivalent approaches to making a statistical decision.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),

    // Lessons for Module 4
    createTopic({
        id: 'stats-slr',
        parent: 'statistics-for-quantitative-finance',
        title: 'Simple Linear Regression (SLR)',
        description: 'Modeling the relationship between two variables.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-ols-derivation',
        parent: 'statistics-for-quantitative-finance',
        title: 'Derivation of the OLS Estimators',
        description: 'The calculus behind finding the "best fit" line.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-model-properties',
        parent: 'statistics-for-quantitative-finance',
        title: 'Properties of the Fitted Model (R-Squared, Residuals)',
        description: 'Assessing how well your linear model fits the data.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-mlr-matrix-form',
        parent: 'statistics-for-quantitative-finance',
        title: 'Multiple Linear Regression (MLR) in Matrix Form',
        description: 'Extending SLR to multiple predictors using linear algebra.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-mlr-ols-derivation',
        parent: 'statistics-for-quantitative-finance',
        title: 'Derivation of the MLR OLS Estimator',
        description: 'The matrix algebra for solving a multiple regression problem.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-gauss-markov-theorem',
        parent: 'statistics-for-quantitative-finance',
        title: 'Gauss-Markov Theorem and the BLUE Property',
        description: 'The theoretical justification for using OLS.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-t-tests-coefficients',
        parent: 'statistics-for-quantitative-finance',
        title: 't-tests for Individual Coefficients',
        description: 'Testing the significance of a single predictor.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-f-tests-joint-hypotheses',
        parent: 'statistics-for-quantitative-finance',
        title: 'F-tests for Joint Hypotheses and Overall Model Significance',
        description: 'Testing the significance of a group of predictors or the entire model.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-model-assumptions',
        parent: 'statistics-for-quantitative-finance',
        title: 'Model Assumptions (Linearity, Exogeneity, Homoskedasticity)',
        description: 'The critical assumptions that must hold for OLS to be valid.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-multicollinearity-and-vif',
        parent: 'statistics-for-quantitative-finance',
        title: 'Multicollinearity and Variance Inflation Factor (VIF)',
        description: 'Diagnosing when predictors are too correlated with each other.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-heteroskedasticity',
        parent: 'statistics-for-quantitative-finance',
        title: 'Heteroskedasticity: Detection and Robust Standard Errors',
        description: 'Handling non-constant variance in the error terms.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-autocorrelation-durbin-watson',
        parent: 'statistics-for-quantitative-finance',
        title: 'Autocorrelation: Durbin-Watson Test',
        description: 'Detecting patterns in the error terms over time.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
];
