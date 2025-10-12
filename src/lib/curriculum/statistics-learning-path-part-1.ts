
import type { Topic } from './types';
import { createTopic } from './utils';

export const statisticsLearningPathPart1: Topic[] = [
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
    
    // Lessons for Module 1
    createTopic({
        id: 'stats-set-theory-sample-spaces-and-events',
        parent: 'statistics-for-quantitative-finance',
        title: 'Set Theory, Sample Spaces, and Events',
        description: 'Understanding the building blocks of probability.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-axioms-of-probability-kolmogorov',
        parent: 'statistics-for-quantitative-finance',
        title: "Axioms of Probability (Kolmogorov)",
        description: 'The three fundamental rules that govern all of probability.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-conditional-probability-and-independence',
        parent: 'statistics-for-quantitative-finance',
        title: 'Conditional Probability and Independence',
        description: 'How the occurrence of one event affects another.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-law-of-total-probability-and-bayes-theorem',
        parent: 'statistics-for-quantitative-finance',
        title: "Law of Total Probability and Bayes' Theorem",
        description: 'Updating your beliefs in the face of new evidence.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-pmf-and-cdf',
        parent: 'statistics-for-quantitative-finance',
        title: 'Probability Mass Functions (PMF) and Cumulative Distribution Functions (CDF)',
        description: 'Describing the probabilities of discrete outcomes.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-ev-var-stddev',
        parent: 'statistics-for-quantitative-finance',
        title: 'Expected Value E[X], Variance Var[X], and Standard Deviation',
        description: 'Calculating the center and spread of a random variable.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-common-discrete-distributions',
        parent: 'statistics-for-quantitative-finance',
        title: 'Common Discrete Distributions (Binomial, Poisson, Geometric)',
        description: 'Exploring key models for discrete random events.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-mgfs-discrete',
        parent: 'statistics-for-quantitative-finance',
        title: 'Moment Generating Functions (MGFs) for Discrete R.V.s',
        description: 'A powerful tool for analyzing distributions.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-pdf-and-cdf-continuous',
        parent: 'statistics-for-quantitative-finance',
        title: 'Probability Density Functions (PDF) and CDF',
        description: 'Describing the probabilities of continuous outcomes.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-ev-var-integration',
        parent: 'statistics-for-quantitative-finance',
        title: 'Expected Value and Variance via Integration',
        description: 'Applying calculus to find the moments of continuous variables.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-common-continuous-distributions',
        parent: 'statistics-for-quantitative-finance',
        title: 'Common Continuous Distributions (Uniform, Exponential, Gamma)',
        description: 'Exploring key models for continuous random events.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-mgfs-continuous',
        parent: 'statistics-for-quantitative-finance',
        title: 'MGFs for Continuous R.V.s',
        description: 'Extending moment generating functions to continuous cases.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-joint-pmfs-and-pdfs',
        parent: 'statistics-for-quantitative-finance',
        title: 'Joint PMFs and Joint PDFs',
        description: 'Modeling the behavior of multiple random variables at once.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-marginal-and-conditional-distributions',
        parent: 'statistics-for-quantitative-finance',
        title: 'Marginal and Conditional Distributions',
        description: "Isolating one variable's behavior from a joint distribution.",
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-covariance-and-correlation',
        parent: 'statistics-for-quantitative-finance',
        title: 'Covariance Cov(X, Y) and Correlation ρ',
        description: 'Measuring how two random variables move together.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-independence-of-random-variables',
        parent: 'statistics-for-quantitative-finance',
        title: 'Independence of Random Variables',
        description: 'Defining when two variables have no influence on each other.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),

    // Lessons for Module 2
    createTopic({
        id: 'stats-normal-distribution-properties',
        parent: 'statistics-for-quantitative-finance',
        title: 'Properties of the Normal Distribution and the Z-Score',
        description: 'Mastering the bell curve and standardization.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-linear-combinations-of-normals',
        parent: 'statistics-for-quantitative-finance',
        title: 'Linear Combinations of Independent Normal Random Variables',
        description: 'Understanding how normal variables combine.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-multivariate-normal-distribution',
        parent: 'statistics-for-quantitative-finance',
        title: 'Multivariate Normal Distribution',
        description: 'The cornerstone of modern portfolio theory.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-multivariate-normal-marginals',
        parent: 'statistics-for-quantitative-finance',
        title: 'Marginal and Conditional Distributions of Multivariate Normal',
        description: 'Dissecting multi-asset models.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-multivariate-normal-applications',
        parent: 'statistics-for-quantitative-finance',
        title: 'Applications in Portfolio Theory and Financial Modeling',
        description: 'Putting the multivariate normal to practical use.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-t-distribution',
        parent: 'statistics-for-quantitative-finance',
        title: "The t-Distribution (Student's t)",
        description: 'The essential tool for inference with small samples.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-chi-squared-distribution',
        parent: 'statistics-for-quantitative-finance',
        title: 'The χ² (Chi-Squared) Distribution',
        description: 'The basis for tests of variance and goodness-of-fit.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-f-distribution',
        parent: 'statistics-for-quantitative-finance',
        title: 'The F-Distribution (Fisher–Snedecor)',
        description: 'The key to comparing variances between two groups (ANOVA).',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-wlln',
        parent: 'statistics-for-quantitative-finance',
        title: 'Convergence in Probability and the Weak Law of Large Numbers (WLLN)',
        description: 'Why casino averages are so stable.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-clt',
        parent: 'statistics-for-quantitative-finance',
        title: 'Convergence in Distribution and the Central Limit Theorem (CLT)',
        description: 'Why the normal distribution is everywhere.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-slutsky-and-delta',
        parent: 'statistics-for-quantitative-finance',
        title: "Slutsky's Theorem and the Delta Method",
        description: 'Tools for approximating the distribution of functions of random variables.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
];
