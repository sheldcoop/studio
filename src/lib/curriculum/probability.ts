
import type { Topic } from './types';
import { createTopic } from './utils';

export const probabilityTopics: Topic[] = [
    // --- Module 1: Foundations of Probability ---
    createTopic({
        parent: 'prob-quant-mod-1',
        title: 'The Basics: Sample Spaces & Events',
        icon: 'Dice3',
        description: "Understanding the building blocks of probability.",
        category: 'sub-topic',
        duration: 20,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'prob-sample-space-def', title: 'Defining a Sample Space' },
            { id: 'prob-events-sets', title: 'Events as Subsets' },
            { id: 'prob-set-operations', title: 'Set Operations on Events' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-1',
        title: 'Combinatorics: The Art of Counting',
        icon: 'Calculator',
        description: "Techniques for counting outcomes and possibilities.",
        category: 'sub-topic',
        duration: 25,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'prob-permutations', title: 'Permutations' },
            { id: 'prob-combinations', title: 'Combinations' },
            { id: 'prob-sampling', title: 'Sampling with/without Replacement' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-1',
        id: 'conditional-probability-and-independence',
        title: 'Conditional Probability & Independence',
        icon: 'GitBranch',
        description: "How the occurrence of one event affects another.",
        category: 'sub-topic',
        duration: 20,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'prob-conditional-def', title: 'Definition of Conditional Probability' },
            { id: 'prob-independence', title: 'Independence of Events' },
            { id: 'prob-multiplication-rule', title: 'The Multiplication Rule' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-1',
        id: 'bayes-theorem',
        title: "Bayes' Theorem",
        href: '/probability/bayes-theorem',
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

    // --- Module 2: Random Variables & Distributions ---
    createTopic({
        parent: 'prob-quant-mod-2',
        title: 'Random Variables (Discrete & Continuous)',
        icon: 'BarChart3',
        description: "Mapping outcomes of a random process to numbers.",
        category: 'sub-topic',
        duration: 20,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'rv-discrete', title: 'Discrete Random Variables' },
            { id: 'rv-continuous', title: 'Continuous Random Variables' },
            { id: 'rv-cdf', title: 'Cumulative Distribution Function (CDF)' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-2',
        title: 'Expectation, Variance & Moments',
        icon: 'Target',
        description: "Calculating the center, spread, and shape of a distribution.",
        category: 'sub-topic',
        duration: 25,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'rv-expected-value', title: 'Expected Value' },
            { id: 'rv-variance-stddev', title: 'Variance and Standard Deviation' },
            { id: 'rv-moments', title: 'Higher-Order Moments' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-2',
        id: 'common-discrete-distributions',
        title: 'Common Discrete Distributions',
        icon: 'Component',
        description: "Exploring Bernoulli, Binomial, and Poisson distributions.",
        category: 'sub-topic',
        duration: 30,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'dist-bernoulli', title: 'Bernoulli Distribution' },
            { id: 'dist-binomial', title: 'Binomial Distribution' },
            { id: 'dist-poisson', title: 'Poisson Distribution' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-2',
        id: 'common-continuous-distributions',
        title: 'Common Continuous Distributions',
        icon: 'AreaChart',
        description: "Exploring Uniform, Normal, and Exponential distributions.",
        category: 'sub-topic',
        duration: 25,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'dist-uniform', title: 'Uniform Distribution' },
            { id: 'dist-normal', title: 'Normal Distribution' },
            { id: 'dist-exponential', title: 'Exponential Distribution' },
        ]
    }),

    // --- Module 3: Multivariate Probability & Core Theorems ---
    createTopic({
        parent: 'prob-quant-mod-3',
        title: 'Joint, Marginal & Conditional Distributions',
        icon: 'Users',
        description: "Modeling the behavior of multiple random variables at once.",
        category: 'sub-topic',
        duration: 30,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'multi-joint-pdf', title: 'Joint Probability Distributions' },
            { id: 'multi-marginal', title: 'Marginal Distributions' },
            { id: 'multi-conditional', title: 'Conditional Distributions' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-3',
        id: 'law-of-large-numbers',
        title: 'The Law of Large Numbers (LLN)',
        href: '/topics/law-of-large-numbers',
        icon: 'Scale',
        description: "Why casino averages are so stable.",
        category: 'sub-topic',
        duration: 20,
        subTopics: [
            { id: 'lln-weak', title: 'Weak Law (WLLN)' },
            { id: 'lln-strong', title: 'Strong Law (SLLN)' },
            { id: 'lln-implications', title: 'Implications for Sampling' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-3',
        id: 'central-limit-theorem',
        title: 'The Central Limit Theorem (CLT)',
        href: '/topics/central-limit-theorem',
        icon: 'Bell',
        description: "Why the normal distribution is everywhere.",
        category: 'sub-topic',
        duration: 30,
        subTopics: [
            { id: 'clt-statement', title: 'The Theorem' },
            { id: 'clt-conditions', title: 'Conditions for CLT' },
            { id: 'clt-application', title: 'Applications in Inference' },
        ]
    }),

    // --- Module 4: Intermediate Topics & Generating Functions ---
    createTopic({
        parent: 'prob-quant-mod-4',
        title: 'Transformations of Random Variables',
        icon: 'Replace',
        description: "Finding the distribution of a function of a random variable.",
        category: 'sub-topic',
        duration: 30,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'trans-one-var', title: 'Functions of One Variable' },
            { id: 'trans-two-vars', title: 'Functions of Two Variables' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-4',
        title: 'Moment Generating Functions (MGFs)',
        icon: 'Sun',
        description: "A powerful tool for analyzing distributions.",
        category: 'sub-topic',
        duration: 30,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'mgf-definition', title: 'Definition and Properties' },
            { id: 'mgf-moments', title: 'Generating Moments' },
            { id: 'mgf-sums', title: 'Sums of Independent R.V.s' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-4',
        title: 'Introduction to Information Theory',
        icon: 'Binary',
        description: "Quantifying information with Entropy and KL Divergence.",
        category: 'sub-topic',
        duration: 30,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'info-entropy', title: 'Entropy' },
            { id: 'info-kl-divergence', title: 'KL Divergence' },
        ]
    }),

    // --- Module 5: Stochastic Processes ---
    createTopic({
        parent: 'prob-quant-mod-5',
        title: 'Introduction to Stochastic Processes & Stationarity',
        icon: 'Clock',
        description: "Understanding random phenomena that evolve over time.",
        category: 'sub-topic',
        duration: 20,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'stochastic-def', title: 'Defining a Stochastic Process' },
            { id: 'stochastic-stationarity', title: 'Stationarity' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-5',
        title: 'Discrete-Time Markov Chains',
        icon: 'Footprints',
        description: "Modeling memoryless state transitions.",
        category: 'sub-topic',
        duration: 40,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'markov-property', title: 'The Markov Property' },
            { id: 'markov-transition-matrix', title: 'Transition Matrices' },
            { id: 'markov-steady-state', title: 'Steady-State Distributions' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-5',
        title: 'The Poisson Process',
        href: '/probability/poisson-distribution',
        icon: 'Zap',
        description: "Modeling the timing of random events.",
        category: 'sub-topic',
        duration: 30,
        subTopics: [
            { id: 'poisson-process-def', title: 'Definition' },
            { id: 'poisson-inter-arrival', title: 'Inter-arrival Times' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-5',
        title: 'Random Walks & Brownian Motion',
        icon: 'TrendingDown',
        description: "The mathematical foundation of stock price movements.",
        category: 'sub-topic',
        duration: 30,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'brownian-random-walk', title: 'From Random Walks to Brownian Motion' },
            { id: 'brownian-properties', title: 'Properties of Brownian Motion' },
        ]
    }),

    // --- Module 6: Advanced & Measure-Theoretic Probability ---
    createTopic({
        parent: 'prob-quant-mod-6',
        title: 'Sigma-Algebras & Probability Measures',
        icon: 'Ruler',
        description: "The rigorous foundation of modern probability.",
        category: 'sub-topic',
        duration: 35,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'sigma-algebra-def', title: 'Sigma-Algebras' },
            { id: 'prob-measure-def', title: 'Probability Measures' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-6',
        title: 'The Lebesgue Integral & Rigorous Expectation',
        icon: 'PenTool',
        description: "A more powerful theory of integration.",
        category: 'sub-topic',
        duration: 35,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'lebesgue-intro', title: 'Motivation for Lebesgue' },
            { id: 'lebesgue-expectation', title: 'Expectation via Lebesgue' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-6',
        title: 'Martingales',
        icon: 'Scale',
        description: "The formal model of a fair game.",
        category: 'sub-topic',
        duration: 40,
        pathPrefix: 'topics',
        subTopics: [
            { id: 'martingale-def', title: 'Definition of a Martingale' },
            { id: 'martingale-stopping-times', title: 'Optional Stopping Theorem' },
        ]
    }),
    createTopic({
        parent: 'prob-quant-mod-6',
        id: 'stochastic-calculus-itos-lemma-deep-dive',
        title: "Introduction to Itô Calculus",
        href: '/topics/stochastic-calculus-itos-lemma',
        icon: 'AreaChart',
        description: "The calculus of random walks, essential for derivatives pricing.",
        category: 'sub-topic',
        duration: 40,
        subTopics: [
            { id: 'ito-integral', title: 'The Itô Integral' },
            { id: 'ito-lemma', title: "Itô's Lemma" },
        ]
    }),
    createTopic({
        id: 'bernoulli-distribution',
        title: 'Bernoulli Distribution',
        icon: 'FunctionSquare',
        description: 'Modeling a single trial with two outcomes.',
        category: 'probability',
        parent: 'prob-dist-discrete',
        pathPrefix: 'probability',
    }),
    createTopic({
        id: 'binomial-distribution',
        title: 'Binomial Distribution',
        icon: 'FunctionSquare',
        description: 'Modeling a series of success/fail trials.',
        category: 'probability',
        parent: 'prob-dist-discrete',
        pathPrefix: 'probability',
    }),
    createTopic({
        id: 'poisson-distribution',
        title: 'Poisson Distribution',
        icon: 'FunctionSquare',
        description: 'Modeling the frequency of rare events.',
        category: 'probability',
        parent: 'prob-dist-discrete',
        pathPrefix: 'probability',
    }),
    createTopic({
        id: 'geometric-distribution',
        title: 'Geometric Distribution',
        icon: 'FunctionSquare',
        description: 'Modeling trials until the first success.',
        category: 'probability',
        parent: 'prob-dist-discrete',
        pathPrefix: 'probability',
    }),
    createTopic({
        id: 'hypergeometric-distribution',
        title: 'Hypergeometric Distribution',
        icon: 'FunctionSquare',
        description: 'Modeling sampling without replacement.',
        category: 'probability',
        parent: 'prob-dist-discrete',
        pathPrefix: 'probability',
    }),
    createTopic({
        id: 'negative-binomial-distribution',
        title: 'Negative Binomial Distribution',
        icon: 'FunctionSquare',
        description: 'Modeling trials until a set number of successes.',
        category: 'probability',
        parent: 'prob-dist-discrete',
        pathPrefix: 'probability',
    }),
    createTopic({
        id: 'discrete-uniform-distribution',
        title: 'Discrete Uniform Distribution',
        icon: 'FunctionSquare',
        description: 'Modeling where all outcomes are equally likely.',
        category: 'probability',
        parent: 'prob-dist-discrete',
        pathPrefix: 'probability',
    }),
    createTopic({
        id: 'multinomial-distribution',
        title: 'Multinomial Distribution',
        icon: 'FunctionSquare',
        description: 'Generalizing the Binomial for multiple outcomes.',
        category: 'probability',
        parent: 'prob-dist-discrete',
        pathPrefix: 'probability',
    }),
    createTopic({
        id: 'gamma-distribution',
        title: 'Gamma Distribution',
        icon: 'FunctionSquare',
        description: 'Modeling waiting times and skewed data.',
        category: 'probability',
        parent: 'prob-dist-continuous',
        pathPrefix: 'probability',
    }),
    createTopic({
        id: 'beta-distribution',
        title: 'Beta Distribution',
        icon: 'FunctionSquare',
        description: 'Modeling probabilities, percentages, and proportions.',
        category: 'probability',
        parent: 'prob-dist-continuous',
        pathPrefix: 'probability',
    }),
    createTopic({
        id: 'exponential-distribution',
        title: 'Exponential Distribution',
        icon: 'FunctionSquare',
        description: 'Modeling the time between events in a Poisson process.',
        category: 'probability',
        parent: 'prob-dist-continuous',
        pathPrefix: 'probability',
    }),
    createTopic({
        id: 'cauchy-distribution',
        title: 'Cauchy Distribution',
        icon: 'FunctionSquare',
        description: "Modeling extreme events and 'fat-tailed' phenomena.",
        category: 'probability',
        parent: 'prob-dist-continuous',
        pathPrefix: 'probability',
    }),
    createTopic({
        id: 'laplace-distribution',
        title: 'Laplace Distribution',
        icon: 'FunctionSquare',
        description: "Modeling with a sharp peak and 'fat tails'.",
        category: 'probability',
        parent: 'prob-dist-continuous',
        pathPrefix: 'probability',
    }),
    createTopic({
        id: 'f-distribution',
        title: 'F-Distribution',
        icon: 'FunctionSquare',
        description: 'Comparing variances between two or more samples.',
        category: 'probability',
        parent: 'prob-dist-continuous',
        pathPrefix: 'probability',
    }),
    createTopic({
        id: 'students-t-distribution',
        title: "Student's t-Distribution",
        icon: 'FunctionSquare',
        description: 'The backbone of hypothesis testing with small sample sizes.',
        category: 'probability',
        parent: 'prob-dist-continuous',
        pathPrefix: 'probability',
    }),
    createTopic({
        id: 'weibull-distribution',
        title: 'Weibull Distribution',
        icon: 'FunctionSquare',
        description: 'Modeling time-to-failure and event durations.',
        category: 'probability',
        parent: 'prob-dist-continuous',
        pathPrefix: 'probability',
    }),
    createTopic({
        id: 'logistic-distribution',
        title: 'Logistic Distribution',
        icon: 'FunctionSquare',
        description: 'A key distribution in machine learning and growth modeling.',
        category: 'probability',
        parent: 'prob-dist-continuous',
        pathPrefix: 'probability',
    }),
    createTopic({
        id: 'chi-squared-distribution',
        title: 'Chi-Squared (χ²) Distribution',
        icon: 'FunctionSquare',
        description: 'The distribution of the sum of squared standard normal deviates.',
        category: 'probability',
        parent: 'prob-dist-continuous',
        pathPrefix: 'probability',
    }),
];
