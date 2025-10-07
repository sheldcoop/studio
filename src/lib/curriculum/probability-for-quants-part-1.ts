
import { type Topic } from './types';
import { createTopic } from './utils';

export const probabilityForQuantsPart1: Topic[] = [
    // --- Module 1: Foundations of Probability ---
    createTopic({
        id: 'prob-the-basics-sample-spaces-events',
        parent: 'prob-quant-mod-1',
        title: 'The Basics: Sample Spaces & Events',
        icon: 'Dice3',
        description: "Understanding the building blocks of probability.",
        category: 'sub-topic',
        duration: 20,
        pathPrefix: 'probability-for-quants',
        subTopics: [
            { id: 'prob-sample-space-def', title: 'Defining a Sample Space' },
            { id: 'prob-events-sets', title: 'Events as Subsets' },
            { id: 'prob-set-operations', title: 'Set Operations on Events' },
        ]
    }),
    createTopic({
        id: 'prob-combinatorics-the-art-of-counting',
        parent: 'prob-quant-mod-1',
        title: 'Combinatorics: The Art of Counting',
        icon: 'Calculator',
        description: "Techniques for counting outcomes and possibilities.",
        category: 'sub-topic',
        duration: 25,
        pathPrefix: 'probability-for-quants',
        subTopics: [
            { id: 'prob-permutations', title: 'Permutations' },
            { id: 'prob-combinations', title: 'Combinations' },
            { id: 'prob-sampling', title: 'Sampling with/without Replacement' },
        ]
    }),
    createTopic({
        id: 'prob-conditional-probability-independence',
        parent: 'prob-quant-mod-1',
        title: 'Conditional Probability & Independence',
        icon: 'GitBranch',
        description: "How the occurrence of one event affects another.",
        category: 'sub-topic',
        duration: 20,
        pathPrefix: 'probability-for-quants',
        subTopics: [
            { id: 'prob-conditional-def', title: 'Definition of Conditional Probability' },
            { id: 'prob-independence', title: 'Independence of Events' },
            { id: 'prob-multiplication-rule', title: 'The Multiplication Rule' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-1',
        id: 'bayes-theorem-deep-dive',
        href: '/paths/probability-for-quants/bayes-theorem-deep-dive',
        title: "Bayes' Theorem",
        icon: 'BrainCircuit',
        description: "Updating beliefs in the face of new evidence.",
        category: 'sub-topic',
        duration: 20,
        subTopics: [
            { id: 'bayes-formula', title: 'The Formula' },
            { id: 'bayes-prior-posterior', title: 'Priors, Likelihood, and Posteriors' },
            { id: 'bayes-application', title: 'Application: The Disease Test' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-1',
        id: 'python-normal-distribution',
        title: "Probability Distribution with Python",
        icon: 'Code',
        description: "Using Python to visualize the Normal Distribution.",
        category: 'sub-topic',
        duration: 15,
        pathPrefix: 'probability-for-quants'
    }),

    // --- Module 2: Random Variables & Distributions ---
    createTopic({
        id: 'prob-random-variables-discrete-continuous',
        parent: 'prob-quant-mod-2',
        title: 'Random Variables (Discrete & Continuous)',
        icon: 'BarChart3',
        description: "Mapping outcomes of a random process to numbers.",
        category: 'sub-topic',
        duration: 20,
        pathPrefix: 'probability-for-quants',
        subTopics: [
            { id: 'rv-discrete', title: 'Discrete Random Variables' },
            { id: 'rv-continuous', title: 'Continuous Random Variables' },
            { id: 'rv-cdf', title: 'Cumulative Distribution Function (CDF)' },
        ]
    }),
    createTopic({
        id: 'prob-expectation-variance-moments',
        parent: 'prob-quant-mod-2',
        title: 'Expectation, Variance & Moments',
        icon: 'Target',
        description: "Calculating the center, spread, and shape of a distribution.",
        category: 'sub-topic',
        duration: 25,
        pathPrefix: 'probability-for-quants',
        subTopics: [
            { id: 'rv-expected-value', title: 'Expected Value' },
            { id: 'rv-variance-stddev', title: 'Variance and Standard Deviation' },
            { id: 'rv-moments', title: 'Higher-Order Moments' },
        ]
    }),
    createTopic({
        id: 'prob-common-discrete-distributions',
        parent: 'prob-quant-mod-2',
        title: 'Common Discrete Distributions',
        icon: 'Component',
        description: "Exploring Bernoulli, Binomial, and Poisson distributions.",
        category: 'sub-topic',
        duration: 30,
        pathPrefix: 'probability-for-quants',
        subTopics: [
            { id: 'dist-bernoulli', title: 'Bernoulli Distribution' },
            { id: 'dist-binomial', title: 'Binomial Distribution' },
            { id: 'dist-poisson', title: 'Poisson Distribution' },
        ]
    }),
    createTopic({
        id: 'prob-common-continuous-distributions',
        parent: 'prob-quant-mod-2',
        title: 'Common Continuous Distributions',
        icon: 'AreaChart',
        description: "Exploring Uniform, Normal, and Exponential distributions.",
        category: 'sub-topic',
        duration: 25,
        pathPrefix: 'probability-for-quants',
        subTopics: [
            { id: 'dist-uniform', title: 'Uniform Distribution' },
            { id: 'dist-normal', title: 'Normal Distribution' },
            { id: 'dist-exponential', title: 'Exponential Distribution' },
        ]
    }),
];
