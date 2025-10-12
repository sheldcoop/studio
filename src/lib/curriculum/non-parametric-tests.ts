
import type { Topic } from './types';
import { createTopic } from './utils';

export const nonParametricTests: Topic[] = [
    createTopic({
        id: 'chi-squared-test',
        parent: 'quantlab',
        title: 'Chi-Squared Test',
        icon: 'FunctionSquare',
        description:
        'Analyzes categorical data to find significant relationships.',
        category: 'non-parametric',
    }),
    createTopic({
        id: 'mann-whitney-u-test',
        parent: 'quantlab',
        title: 'Mann-Whitney U Test',
        icon: 'FunctionSquare',
        description:
        'Alternative to the T-Test when data is not normally distributed.',
        category: 'non-parametric',
    }),
    createTopic({
        id: 'kruskal-wallis-test',
        parent: 'quantlab',
        title: 'Kruskal-Wallis Test',
        icon: 'FunctionSquare',
        description: 'Alternative to ANOVA for comparing three or more groups.',
        category: 'non-parametric',
    }),
    createTopic({
        id: 'wilcoxon-signed-rank-test',
        parent: 'quantlab',
        title: 'Wilcoxon Signed-Rank Test',
        icon: 'FunctionSquare',
        description:
        'Alternative to the paired T-Test for repeated measurements.',
        category: 'non-parametric',
    }),
    createTopic({
        id: 'spearmans-rank-correlation',
        parent: 'quantlab',
        title: "Spearman's Rank Correlation",
        icon: 'FunctionSquare',
        description:
        'Measures the monotonic relationship between two ranked variables.',
        category: 'non-parametric',
    }),
    createTopic({
        id: 'friedman-test',
        parent: 'quantlab',
        title: 'Friedman Test',
        icon: 'FunctionSquare',
        description:
        'The non-parametric alternative to a repeated-measures ANOVA.',
        category: 'non-parametric',
    }),
    createTopic({
        id: 'kolmogorov-smirnov-k-s-test',
        parent: 'quantlab',
        title: 'Kolmogorov-Smirnov (K-S) Test',
        icon: 'FunctionSquare',
        description: 'Tests if a sample is drawn from a specific distribution.',
        category: 'non-parametric',
    }),
];
