
import type { Topic } from './types';
import { createTopic } from './utils';

export const statisticsLearningPath: Topic[] = [
    // Main Advanced Statistics Learning Path Modules (Parents)
    createTopic({
        id: 'stats-mod-1',
        parent: 'statistics-for-quantitative-finance',
        title: 'Module 1: Foundations in Probability & Random Variables',
        href: '#', description: '', category: 'parent'
    }),
    createTopic({
        id: 'stats-mod-2',
        parent: 'statistics-for-quantitative-finance',
        title: 'Module 2: Key Distributions & Asymptotic Theory',
        href: '#', description: '', category: 'parent'
    }),
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

    // Lessons for the main Advanced Statistics Learning Path
    // Module 1
    createTopic({
        id: 'stats-set-theory-sample-spaces-and-events',
        parent: 'stats-mod-1',
        title: 'Set Theory, Sample Spaces, and Events',
        description: 'Understanding the building blocks of probability.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-axioms-of-probability-kolmogorov',
        parent: 'stats-mod-1',
        title: "Axioms of Probability (Kolmogorov)",
        description: 'The three fundamental rules that govern all of probability.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-conditional-probability-and-independence',
        parent: 'stats-mod-1',
        title: 'Conditional Probability and Independence',
        description: 'How the occurrence of one event affects another.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-law-of-total-probability-and-bayes-theorem',
        parent: 'stats-mod-1',
        title: "Law of Total Probability and Bayes' Theorem",
        description: 'Updating your beliefs in the face of new evidence.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-pmf-and-cdf',
        parent: 'stats-mod-1',
        title: 'Probability Mass Functions (PMF) and Cumulative Distribution Functions (CDF)',
        description: 'Describing the probabilities of discrete outcomes.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-ev-var-stddev',
        parent: 'stats-mod-1',
        title: 'Expected Value E[X], Variance Var[X], and Standard Deviation',
        description: 'Calculating the center and spread of a random variable.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-common-discrete-distributions',
        parent: 'stats-mod-1',
        title: 'Common Discrete Distributions (Binomial, Poisson, Geometric)',
        description: 'Exploring key models for discrete random events.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-mgfs-discrete',
        parent: 'stats-mod-1',
        title: 'Moment Generating Functions (MGFs) for Discrete R.V.s',
        description: 'A powerful tool for analyzing distributions.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-pdf-and-cdf-continuous',
        parent: 'stats-mod-1',
        title: 'Probability Density Functions (PDF) and CDF',
        description: 'Describing the probabilities of continuous outcomes.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-ev-var-integration',
        parent: 'stats-mod-1',
        title: 'Expected Value and Variance via Integration',
        description: 'Applying calculus to find the moments of continuous variables.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-common-continuous-distributions',
        parent: 'stats-mod-1',
        title: 'Common Continuous Distributions (Uniform, Exponential, Gamma)',
        description: 'Exploring key models for continuous random events.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-mgfs-continuous',
        parent: 'stats-mod-1',
        title: 'MGFs for Continuous R.V.s',
        description: 'Extending moment generating functions to continuous cases.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-joint-pmfs-and-pdfs',
        parent: 'stats-mod-1',
        title: 'Joint PMFs and Joint PDFs',
        description: 'Modeling the behavior of multiple random variables at once.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-marginal-and-conditional-distributions',
        parent: 'stats-mod-1',
        title: 'Marginal and Conditional Distributions',
        description: "Isolating one variable's behavior from a joint distribution.",
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-covariance-and-correlation',
        parent: 'stats-mod-1',
        title: 'Covariance Cov(X, Y) and Correlation ρ',
        description: 'Measuring how two random variables move together.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-independence-of-random-variables',
        parent: 'stats-mod-1',
        title: 'Independence of Random Variables',
        description: 'Defining when two variables have no influence on each other.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    
    // Module 2
    createTopic({
        id: 'stats-normal-distribution-properties',
        parent: 'stats-mod-2',
        title: 'Properties of the Normal Distribution and the Z-Score',
        description: 'Mastering the bell curve and standardization.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-linear-combinations-of-normals',
        parent: 'stats-mod-2',
        title: 'Linear Combinations of Independent Normal Random Variables',
        description: 'Understanding how normal variables combine.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-multivariate-normal-distribution',
        parent: 'stats-mod-2',
        title: 'Multivariate Normal Distribution',
        description: 'The cornerstone of modern portfolio theory.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-multivariate-normal-marginals',
        parent: 'stats-mod-2',
        title: 'Marginal and Conditional Distributions of Multivariate Normal',
        description: 'Dissecting multi-asset models.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-multivariate-normal-applications',
        parent: 'stats-mod-2',
        title: 'Applications in Portfolio Theory and Financial Modeling',
        description: 'Putting the multivariate normal to practical use.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-t-distribution',
        parent: 'stats-mod-2',
        title: "The t-Distribution (Student's t)",
        description: 'The essential tool for inference with small samples.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-chi-squared-distribution',
        parent: 'stats-mod-2',
        title: 'The χ² (Chi-Squared) Distribution',
        description: 'The basis for tests of variance and goodness-of-fit.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-f-distribution',
        parent: 'stats-mod-2',
        title: 'The F-Distribution (Fisher–Snedecor)',
        description: 'The key to comparing variances between two groups (ANOVA).',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-wlln',
        parent: 'stats-mod-2',
        title: 'Convergence in Probability and the Weak Law of Large Numbers (WLLN)',
        description: 'Why casino averages are so stable.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-clt',
        parent: 'stats-mod-2',
        title: 'Convergence in Distribution and the Central Limit Theorem (CLT)',
        description: 'Why the normal distribution is everywhere.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-slutsky-and-delta',
        parent: 'stats-mod-2',
        title: "Slutsky's Theorem and the Delta Method",
        description: 'Tools for approximating the distribution of functions of random variables.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),

    // Module 3
    createTopic({
        id: 'stats-statistic-and-estimator',
        parent: 'stats-mod-3',
        title: 'Definition of a Statistic and an Estimator',
        description: 'Distinguishing between a function of data and a guess for a parameter.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-unbiasedness',
        parent: 'stats-mod-3',
        title: 'Unbiasedness, Bias, and Asymptotic Unbiasedness',
        description: 'Evaluating the accuracy of estimators.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-efficiency-and-crlb',
        parent: 'stats-mod-3',
        title: 'Efficiency and the Cramér-Rao Lower Bound (CRLB)',
        description: 'Finding the "best" possible unbiased estimator.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-consistency-and-sufficiency',
        parent: 'stats-mod-3',
        title: 'Consistency and Sufficiency',
        description: 'Properties of estimators that improve with more data.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-method-of-moments',
        parent: 'stats-mod-3',
        title: 'Method of Moments (MoM) Estimation',
        description: 'A straightforward technique for finding estimators.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-mle',
        parent: 'stats-mod-3',
        title: 'Maximum Likelihood Estimation (MLE)',
        description: 'The most important method for parameter estimation in finance.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-mle-optimization',
        parent: 'stats-mod-3',
        title: 'Finding MLE Estimates via Optimization',
        description: 'The practical side of implementing MLE.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-ci-construction',
        parent: 'stats-mod-3',
        title: 'General Construction of Confidence Intervals (CIs)',
        description: 'A framework for creating intervals for any parameter.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-ci-derivation',
        parent: 'stats-mod-3',
        title: 'Deriving CIs for Mean and Variance',
        description: 'Using t, χ², and Z pivotal quantities to build intervals.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-hypothesis-testing-framework',
        parent: 'stats-mod-3',
        title: 'Null vs. Alternative Hypotheses, Type I and II Errors',
        description: 'The fundamental setup of all hypothesis tests.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-neyman-pearson-lemma',
        parent: 'stats-mod-3',
        title: 'Neyman-Pearson Lemma for Optimal Tests',
        description: 'Finding the most powerful test for a given significance level.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-lrt-and-wilks-theorem',
        parent: 'stats-mod-3',
        title: "Likelihood Ratio Tests (LRT) and Wilks' Theorem",
        description: 'A general method for comparing nested models.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-p-values-and-critical-regions',
        parent: 'stats-mod-3',
        title: 'Testing with p-values and Critical Regions',
        description: 'The two equivalent approaches to making a statistical decision.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),

    // Module 4
    createTopic({
        id: 'stats-slr',
        parent: 'stats-mod-4',
        title: 'Simple Linear Regression (SLR)',
        description: 'Modeling the relationship between two variables.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-ols-derivation',
        parent: 'stats-mod-4',
        title: 'Derivation of the OLS Estimators',
        description: 'The calculus behind finding the "best fit" line.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-model-properties',
        parent: 'stats-mod-4',
        title: 'Properties of the Fitted Model (R-Squared, Residuals)',
        description: 'Assessing how well your linear model fits the data.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-mlr-matrix-form',
        parent: 'stats-mod-4',
        title: 'Multiple Linear Regression (MLR) in Matrix Form',
        description: 'Extending SLR to multiple predictors using linear algebra.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-mlr-ols-derivation',
        parent: 'stats-mod-4',
        title: 'Derivation of the MLR OLS Estimator',
        description: 'The matrix algebra for solving a multiple regression problem.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-gauss-markov-theorem',
        parent: 'stats-mod-4',
        title: 'Gauss-Markov Theorem and the BLUE Property',
        description: 'The theoretical justification for using OLS.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-t-tests-coefficients',
        parent: 'stats-mod-4',
        title: 't-tests for Individual Coefficients',
        description: 'Testing the significance of a single predictor.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-f-tests-joint-hypotheses',
        parent: 'stats-mod-4',
        title: 'F-tests for Joint Hypotheses and Overall Model Significance',
        description: 'Testing the significance of a group of predictors or the entire model.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-model-assumptions',
        parent: 'stats-mod-4',
        title: 'Model Assumptions (Linearity, Exogeneity, Homoskedasticity)',
        description: 'The critical assumptions that must hold for OLS to be valid.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-multicollinearity-and-vif',
        parent: 'stats-mod-4',
        title: 'Multicollinearity and Variance Inflation Factor (VIF)',
        description: 'Diagnosing when predictors are too correlated with each other.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-heteroskedasticity',
        parent: 'stats-mod-4',
        title: 'Heteroskedasticity: Detection and Robust Standard Errors',
        description: 'Handling non-constant variance in the error terms.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-autocorrelation-durbin-watson',
        parent: 'stats-mod-4',
        title: 'Autocorrelation: Durbin-Watson Test',
        description: 'Detecting patterns in the error terms over time.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    
    // Module 5
    createTopic({
        id: 'stats-time-series-characteristics',
        parent: 'stats-mod-5',
        title: 'Characteristics of Time Series: Trend, Seasonality, Cycles',
        description: 'Decomposing the components of a time series.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-stationarity',
        parent: 'stats-mod-5',
        title: 'Strict vs. Weak Stationarity',
        description: 'The most important property for modeling time series data.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-acf-pacf',
        parent: 'stats-mod-5',
        title: 'Autocorrelation Function (ACF) and Partial Autocorrelation Function (PACF)',
        description: 'The key tools for identifying the structure of a time series.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-arima-models',
        parent: 'stats-mod-5',
        title: 'ARIMA Models',
        description: 'A class of models for forecasting time series data.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-garch-models',
        parent: 'stats-mod-5',
        title: 'GARCH Models for Volatility',
        description: 'Modeling the changing volatility of financial returns.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-monte-carlo-simulation',
        parent: 'stats-mod-5',
        title: 'Monte Carlo Simulation for Pricing and Risk',
        description: 'Using random simulation to solve complex problems.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-bootstrapping',
        parent: 'stats-mod-5',
        title: 'Bootstrapping for Estimating Standard Errors',
        description: 'A powerful resampling method for inference.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-jackknife-resampling',
        parent: 'stats-mod-5',
        title: 'Jackknife Resampling Techniques',
        description: 'A related method for bias and variance estimation.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-random-walks-and-martingales',
        parent: 'stats-mod-5',
        title: 'Introduction to Random Walks and Martingales',
        description: 'The mathematical foundation of efficient markets.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-geometric-brownian-motion',
        parent: 'stats-mod-5',
        title: 'Geometric Brownian Motion (GBM)',
        description: 'The standard model for stock price paths.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    
    // Module 6
    createTopic({
        id: 'stats-glms',
        parent: 'stats-mod-6',
        title: 'Generalized Linear Models (GLMs)',
        description: 'Extending linear models to non-normal data.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-logistic-regression-binary',
        parent: 'stats-mod-6',
        title: 'Logistic Regression for Binary Outcomes',
        description: 'Modeling probabilities, such as the probability of default.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-poisson-regression-count',
        parent: 'stats-mod-6',
        title: 'Poisson Regression for Count Data',
        description: 'Modeling the frequency of events.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-ridge-regression',
        parent: 'stats-mod-6',
        title: 'Ridge Regression (L2 Penalty)',
        description: "A technique to handle multicollinearity and prevent overfitting.",
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-lasso-regression',
        parent: 'stats-mod-6',
        title: 'LASSO Regression (L1 Penalty) for Feature Selection',
        description: 'A powerful method for automatically selecting important variables.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-cross-validation',
        parent: 'stats-mod-6',
        title: 'Cross-Validation for Hyperparameter Tuning',
        description: 'The gold standard for selecting model parameters.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-bayesian-inference',
        parent: 'stats-mod-6',
        title: 'Bayesian Inference: Priors, Likelihood, and Posteriors',
        description: 'An alternative framework for statistical inference.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-mcmc',
        parent: 'stats-mod-6',
        title: 'Markov Chain Monte Carlo (MCMC)',
        description: 'The computational engine behind modern Bayesian analysis.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-numerical-optimization',
        parent: 'stats-mod-6',
        title: 'Numerical Optimization: Newton-Raphson & Gradient Descent',
        description: 'The algorithms that power MLE and machine learning.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-ols-mle-implementation',
        parent: 'stats-mod-6',
        title: 'Implementing OLS and MLE in Python/R',
        description: 'Practical coding examples of core statistical techniques.',
        category: 'sub-topic', pathPrefix: 'statistics-for-quantitative-finance',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
];
