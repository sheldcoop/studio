
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
        parent: 'stats-mod-1',
        title: 'Set Theory, Sample Spaces, and Events',
        description: 'Understanding the building blocks of probability.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-1',
        title: "Axioms of Probability (Kolmogorov)",
        description: 'The three fundamental rules that govern all of probability.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        id: 'stats-conditional-probability-and-independence',
        parent: 'stats-mod-1',
        title: 'Conditional Probability and Independence',
        description: 'How the occurrence of one event affects another.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-1',
        title: "Law of Total Probability and Bayes' Theorem",
        description: 'Updating your beliefs in the face of new evidence.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-1',
        title: 'Probability Mass Functions (PMF) and Cumulative Distribution Functions (CDF)',
        description: 'Describing the probabilities of discrete outcomes.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-1',
        title: 'Expected Value E[X], Variance Var[X], and Standard Deviation',
        description: 'Calculating the center and spread of a random variable.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-1',
        title: 'Common Discrete Distributions (Binomial, Poisson, Geometric)',
        description: 'Exploring key models for discrete random events.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-1',
        title: 'Moment Generating Functions (MGFs) for Discrete R.V.s',
        description: 'A powerful tool for analyzing distributions.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-1',
        title: 'Probability Density Functions (PDF) and CDF',
        description: 'Describing the probabilities of continuous outcomes.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-1',
        title: 'Expected Value and Variance via Integration',
        description: 'Applying calculus to find the moments of continuous variables.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-1',
        title: 'Common Continuous Distributions (Uniform, Exponential, Gamma)',
        description: 'Exploring key models for continuous random events.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-1',
        title: 'MGFs for Continuous R.V.s',
        description: 'Extending moment generating functions to continuous cases.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-1',
        title: 'Joint PMFs and Joint PDFs',
        description: 'Modeling the behavior of multiple random variables at once.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-1',
        title: 'Marginal and Conditional Distributions',
        description: "Isolating one variable's behavior from a joint distribution.",
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-1',
        title: 'Covariance Cov(X, Y) and Correlation ρ',
        description: 'Measuring how two random variables move together.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-1',
        title: 'Independence of Random Variables',
        description: 'Defining when two variables have no influence on each other.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),

    // Lessons for Module 2
    createTopic({
        parent: 'stats-mod-2',
        title: 'Properties of the Normal Distribution and the Z-Score',
        description: 'Mastering the bell curve and standardization.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-2',
        title: 'Linear Combinations of Independent Normal Random Variables',
        description: 'Understanding how normal variables combine.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-2',
        title: 'Multivariate Normal Distribution',
        description: 'The cornerstone of modern portfolio theory.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-2',
        title: 'Marginal and Conditional Distributions of Multivariate Normal',
        description: 'Dissecting multi-asset models.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-2',
        title: 'Applications in Portfolio Theory and Financial Modeling',
        description: 'Putting the multivariate normal to practical use.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-2',
        title: "The t-Distribution (Student's t)",
        description: 'The essential tool for inference with small samples.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-2',
        title: 'The χ² (Chi-Squared) Distribution',
        description: 'The basis for tests of variance and goodness-of-fit.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-2',
        title: 'The F-Distribution (Fisher–Snedecor)',
        description: 'The key to comparing variances between two groups (ANOVA).',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-2',
        title: 'Convergence in Probability and the Weak Law of Large Numbers (WLLN)',
        description: 'Why casino averages are so stable.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-2',
        title: 'Convergence in Distribution and the Central Limit Theorem (CLT)',
        description: 'Why the normal distribution is everywhere.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
    createTopic({
        parent: 'stats-mod-2',
        title: "Slutsky's Theorem and the Delta Method",
        description: 'Tools for approximating the distribution of functions of random variables.',
        category: 'sub-topic',
        subTopics: [ { id: 'theory', title: 'Core Theory' }, { id: 'application', title: 'Financial Application' }, { id: 'interactive', title: 'Interactive Demo' }, { id: 'problems', title: 'Practice Problems' } ]
    }),
];
