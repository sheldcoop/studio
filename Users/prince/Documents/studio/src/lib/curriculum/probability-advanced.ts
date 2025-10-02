
import { type Topic } from './types';

export const probabilityAdvancedTopics: Topic[] = [
    // --- Module 1: Foundations of Probability ---
    {
        id: 'prob-foundations-sample-spaces',
        title: 'The Basics: Sample Spaces & Events',
        href: '/topics/prob-foundations-sample-spaces',
        icon: 'Dice3',
        description: "Understanding the building blocks of probability.",
        category: 'sub-topic',
        parent: 'prob-quant-mod-1',
        duration: 20,
        subTopics: [
            { id: 'prob-sample-space-def', title: 'Defining a Sample Space' },
            { id: 'prob-events-sets', title: 'Events as Subsets' },
            { id: 'prob-set-operations', title: 'Set Operations on Events' },
        ]
    },
    {
        id: 'prob-foundations-combinatorics',
        title: 'Combinatorics: The Art of Counting',
        href: '/topics/prob-foundations-combinatorics',
        icon: 'Calculator',
        description: "Techniques for counting outcomes and possibilities.",
        category: 'sub-topic',
        parent: 'prob-quant-mod-1',
        duration: 25,
        subTopics: [
            { id: 'prob-permutations', title: 'Permutations' },
            { id: 'prob-combinations', title: 'Combinations' },
            { id: 'prob-sampling', title: 'Sampling with/without Replacement' },
        ]
    },
    {
        id: 'prob-foundations-conditional',
        title: 'Conditional Probability & Independence',
        href: '/topics/prob-foundations-conditional',
        icon: 'GitBranch',
        description: "How the occurrence of one event affects another.",
        category: 'sub-topic',
        parent: 'prob-quant-mod-1',
        duration: 20,
        subTopics: [
            { id: 'prob-conditional-def', title: 'Definition of Conditional Probability' },
            { id: 'prob-independence', title: 'Independence of Events' },
            { id: 'prob-multiplication-rule', title: 'The Multiplication Rule' },
        ]
    },
    {
        id: 'prob-foundations-bayes',
        title: "Bayes' Theorem",
        href: '/topics/bayes-theorem', // CORRECTED
        icon: 'BrainCircuit',
        description: "Updating beliefs in the face of new evidence.",
        category: 'sub-topic',
        parent: 'prob-quant-mod-1',
        duration: 20,
        subTopics: [
            { id: 'bayes-formula', title: 'The Formula' },
            { id: 'bayes-prior-posterior', title: 'Priors, Likelihood, and Posteriors' },
            { id: 'bayes-application', title: 'Application: The Disease Test' },
        ]
    },

    // --- Module 2: Random Variables & Distributions ---
    {
        id: 'prob-rv-definition',
        title: 'Random Variables (Discrete & Continuous)',
        href: '/topics/prob-rv-definition',
        icon: 'BarChart3',
        description: "Mapping outcomes of a random process to numbers.",
        category: 'sub-topic',
        parent: 'prob-quant-mod-2',
        duration: 20,
        subTopics: [
            { id: 'rv-discrete', title: 'Discrete Random Variables' },
            { id: 'rv-continuous', title: 'Continuous Random Variables' },
            { id: 'rv-cdf', title: 'Cumulative Distribution Function (CDF)' },
        ]
    },
    {
        id: 'prob-rv-expectation',
        title: 'Expectation, Variance & Moments',
        href: '/topics/prob-rv-expectation',
        icon: 'Target',
        description: "Calculating the center, spread, and shape of a distribution.",
        category: 'sub-topic',
        parent: 'prob-quant-mod-2',
        duration: 25,
        subTopics: [
            { id: 'rv-expected-value', title: 'Expected Value' },
            { id: 'rv-variance-stddev', title: 'Variance and Standard Deviation' },
            { id: 'rv-moments', title: 'Higher-Order Moments' },
        ]
    },
    {
        id: 'prob-rv-discrete-dist',
        title: 'Common Discrete Distributions',
        href: '/topics/prob-rv-discrete-dist',
        icon: 'Component',
        description: "Exploring Bernoulli, Binomial, and Poisson distributions.",
        category: 'sub-topic',
        parent: 'prob-quant-mod-2',
        duration: 30,
        subTopics: [
            { id: 'dist-bernoulli', title: 'Bernoulli Distribution' },
            { id: 'dist-binomial', title: 'Binomial Distribution' },
            { id: 'dist-poisson', title: 'Poisson Distribution' },
        ]
    },
    {
        id: 'prob-rv-continuous-dist',
        title: 'Common Continuous Distributions',
        href: '/topics/prob-rv-continuous-dist',
        icon: 'AreaChart',
        description: "Exploring Uniform, Normal, and Exponential distributions.",
        category: 'sub-topic',
        parent: 'prob-quant-mod-2',
        duration: 25,
        subTopics: [
            { id: 'dist-uniform', title: 'Uniform Distribution' },
            { id: 'dist-normal', title: 'Normal Distribution' },
            { id: 'dist-exponential', title: 'Exponential Distribution' },
        ]
    },

    // --- Module 3: Multivariate Probability & Core Theorems ---
    {
        id: 'prob-multi-joint',
        title: 'Joint, Marginal & Conditional Distributions',
        href: '/topics/prob-multi-joint',
        icon: 'Users',
        description: "Modeling the behavior of multiple random variables at once.",
        category: 'sub-topic',
        parent: 'prob-quant-mod-3',
        duration: 30,
        subTopics: [
            { id: 'multi-joint-pdf', title: 'Joint Probability Distributions' },
            { id: 'multi-marginal', title: 'Marginal Distributions' },
            { id: 'multi-conditional', title: 'Conditional Distributions' },
        ]
    },
    {
        id: 'prob-multi-covariance',
        title: 'Covariance & Correlation',
        href: '/topics/pearson-correlation',
        icon: 'TrendingUp',
        description: "Measuring how two random variables move together.",
        category: 'sub-topic',
        parent: 'prob-quant-mod-3',
        duration: 25,
        subTopics: [
            { id: 'multi-covariance-def', title: 'Defining Covariance' },
            { id: 'multi-correlation-def', title: 'Defining Correlation' },
            { id: 'multi-portfolio-app', title: 'Application in Portfolio Theory' },
        ]
    },
    {
        id: 'prob-multi-lln',
        title: 'The Law of Large Numbers (LLN)',
        href: '/topics/law-of-large-numbers',
        icon: 'Scale',
        description: "Why casino averages are so stable.",
        category: 'sub-topic',
        parent: 'prob-quant-mod-3',
        duration: 20,
        subTopics: [
            { id: 'lln-weak', title: 'Weak Law (WLLN)' },
            { id: 'lln-strong', title: 'Strong Law (SLLN)' },
            { id: 'lln-implications', title: 'Implications for Sampling' },
        ]
    },
    {
        id: 'prob-multi-clt',
        title: 'The Central Limit Theorem (CLT)',
        href: '/topics/central-limit-theorem',
        icon: 'Bell',
        description: "Why the normal distribution is everywhere.",
        category: 'sub-topic',
        parent: 'prob-quant-mod-3',
        duration: 30,
        subTopics: [
            { id: 'clt-statement', title: 'The Theorem' },
            { id: 'clt-conditions', title: 'Conditions for CLT' },
            { id: 'clt-application', title: 'Applications in Inference' },
        ]
    },

    // --- Module 4: Intermediate Topics & Generating Functions ---
    {
        id: 'prob-inter-transformations',
        title: 'Transformations of Random Variables',
        href: '/topics/prob-inter-transformations',
        icon: 'Replace',
        description: "Finding the distribution of a function of a random variable.",
        category: 'sub-topic',
        parent: 'prob-quant-mod-4',
        duration: 30,
        subTopics: [
            { id: 'trans-one-var', title: 'Functions of One Variable' },
            { id: 'trans-two-vars', title: 'Functions of Two Variables' },
        ]
    },
    {
        id: 'prob-inter-mgf',
        title: 'Moment Generating Functions (MGFs)',
        href: '/topics/prob-inter-mgf',
        icon: 'Sun',
        description: "A powerful tool for analyzing distributions.",
        category: 'sub-topic',
        parent: 'prob-quant-mod-4',
        duration: 30,
        subTopics: [
            { id: 'mgf-definition', title: 'Definition and Properties' },
            { id: 'mgf-moments', title: 'Generating Moments' },
            { id: 'mgf-sums', title: 'Sums of Independent R.V.s' },
        ]
    },
    {
        id: 'prob-inter-info-theory',
        title: 'Introduction to Information Theory',
        href: '/topics/prob-inter-info-theory',
        icon: 'Binary',
        description: "Quantifying information with Entropy and KL Divergence.",
        category: 'sub-topic',
        parent: 'prob-quant-mod-4',
        duration: 30,
        subTopics: [
            { id: 'info-entropy', title: 'Entropy' },
            { id: 'info-kl-divergence', title: 'KL Divergence' },
        ]
    },

    // --- Module 5: Stochastic Processes ---
    {
        id: 'prob-stochastic-intro',
        title: 'Introduction to Stochastic Processes & Stationarity',
        href: '/topics/prob-stochastic-intro',
        icon: 'Clock',
        description: "Understanding random phenomena that evolve over time.",
        category: 'sub-topic',
        parent: 'prob-quant-mod-5',
        duration: 20,
        subTopics: [
            { id: 'stochastic-def', title: 'Defining a Stochastic Process' },
            { id: 'stochastic-stationarity', title: 'Stationarity' },
        ]
    },
    {
        id: 'prob-stochastic-markov',
        title: 'Discrete-Time Markov Chains',
        href: '/topics/prob-stochastic-markov',
        icon: 'Footprints',
        description: "Modeling memoryless state transitions.",
        category: 'sub-topic',
        parent: 'prob-quant-mod-5',
        duration: 40,
        subTopics: [
            { id: 'markov-property', title: 'The Markov Property' },
            { id: 'markov-transition-matrix', title: 'Transition Matrices' },
            { id: 'markov-steady-state', title: 'Steady-State Distributions' },
        ]
    },
    {
        id: 'prob-stochastic-poisson',
        title: 'The Poisson Process',
        href: '/topics/poisson-distribution', // CORRECTED
        icon: 'Zap',
        description: "Modeling the timing of random events.",
        category: 'sub-topic',
        parent: 'prob-quant-mod-5',
        duration: 30,
        subTopics: [
            { id: 'poisson-process-def', title: 'Definition' },
            { id: 'poisson-inter-arrival', title: 'Inter-arrival Times' },
        ]
    },
    {
        id: 'prob-stochastic-brownian',
        title: 'Random Walks & Brownian Motion',
        href: '/topics/prob-stochastic-brownian',
        icon: 'TrendingDown',
        description: "The mathematical foundation of stock price movements.",
        category: 'sub-topic',
        parent: 'prob-quant-mod-5',
        duration: 30,
        subTopics: [
            { id: 'brownian-random-walk', title: 'From Random Walks to Brownian Motion' },
            { id: 'brownian-properties', title: 'Properties of Brownian Motion' },
        ]
    },

    // --- Module 6: Advanced & Measure-Theoretic Probability ---
    {
        id: 'prob-advanced-sigma-algebras',
        title: 'Sigma-Algebras & Probability Measures',
        href: '/topics/prob-advanced-sigma-algebras',
        icon: 'Ruler',
        description: "The rigorous foundation of modern probability.",
        category: 'sub-topic',
        parent: 'prob-quant-mod-6',
        duration: 35,
        subTopics: [
            { id: 'sigma-algebra-def', title: 'Sigma-Algebras' },
            { id: 'prob-measure-def', title: 'Probability Measures' },
        ]
    },
    {
        id: 'prob-advanced-lebesgue',
        title: 'The Lebesgue Integral & Rigorous Expectation',
        href: '/topics/prob-advanced-lebesgue',
        icon: 'PenTool',
        description: "A more powerful theory of integration.",
        category: 'sub-topic',
        parent: 'prob-quant-mod-6',
        duration: 35,
        subTopics: [
            { id: 'lebesgue-intro', title: 'Motivation for Lebesgue' },
            { id: 'lebesgue-expectation', title: 'Expectation via Lebesgue' },
        ]
    },
    {
        id: 'prob-advanced-martingales',
        title: 'Martingales',
        href: '/topics/prob-advanced-martingales',
        icon: 'Scale',
        description: "The formal model of a fair game.",
        category: 'sub-topic',
        parent: 'prob-quant-mod-6',
        duration: 40,
        subTopics: [
            { id: 'martingale-def', title: 'Definition of a Martingale' },
            { id: 'martingale-stopping-times', title: 'Optional Stopping Theorem' },
        ]
    },
    {
        id: 'prob-advanced-ito',
        title: "Introduction to Itô Calculus",
        href: '/topics/stochastic-calculus-itos-lemma',
        icon: 'AreaChart',
        description: "The calculus of random walks, essential for derivatives pricing.",
        category: 'sub-topic',
        parent: 'prob-quant-mod-6',
        duration: 40,
        subTopics: [
            { id: 'ito-integral', title: 'The Itô Integral' },
            { id: 'ito-lemma', title: "Itô's Lemma" },
        ]
    },
];
