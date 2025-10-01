import { Waypoints } from 'lucide-react';
import { type Topic } from './types';

// Helper to create slugs from titles
const toSlug = (title: string) => title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const createTopic = (module: string, title: string, description: string): Topic => ({
    id: `la-${toSlug(title)}`,
    title,
    href: `/topics/linear-algebra/${toSlug(title)}`,
    icon: Waypoints, // Using a consistent icon for all sub-topics
    description,
    category: 'sub-topic',
    parent: module,
});

export const linearAlgebraTopics: Topic[] = [
    // --- Module 1 ---
    createTopic('la-module-1', 'Vectors & Vector Spaces', "Representing asset returns or portfolio weights. The entire state of a portfolio can be seen as a single point in a high-dimensional vector space."),
    createTopic('la-module-1', 'Matrix Operations', "Aggregating data across assets and time. Used to apply transformations to entire datasets at once, like calculating portfolio variance from a covariance matrix."),
    createTopic('la-module-1', 'Linear Independence', "Crucial for diversification and factor models. If asset returns are linearly dependent, they are redundant and offer no diversification benefit."),

    // --- Module 2 ---
    createTopic('la-module-2', 'Systems of Linear Equations', "The mathematical basis for linear regression. Find the relationship between a stock's return and the market's movement."),
    createTopic('la-module-2', 'Orthogonality & Projections', "The core of Ordinary Least Squares (OLS) regression. Find the 'best fit' line by projecting your data onto a subspace."),
    createTopic('la-module-2', 'The Four Fundamental Subspaces', "Understand the complete picture of a matrix—its column space (what you can create) and null space (what gets lost)."),

    // --- Module 3 ---
    createTopic('la-module-3', 'Eigenvalues & Eigenvectors', "Find the 'axes of greatest variance' in your data. The eigenvectors of a covariance matrix are the principal components in PCA."),
    createTopic('la-module-3', 'Diagonalization', "Simplify complex systems. This makes calculating high powers of matrices trivial, essential for modeling long-term system evolution (e.g., Markov chains)."),
    createTopic('la-module-3', 'Singular Value Decomposition (SVD)', "The master decomposition for any matrix. Used in everything from noise reduction in time series to building recommendation systems."),

    // --- Module 4 ---
    createTopic('la-module-4', 'Covariance & Correlation Matrices', "The cornerstone of portfolio theory. Understand how assets move together to quantify and manage risk."),
    createTopic('la-module-4', 'Positive Definite Matrices', "The mathematical property of covariance matrices that makes portfolio optimization possible."),
    createTopic('la-module-4', 'Cholesky Decomposition', "The key to generating correlated random asset paths for realistic Monte Carlo simulations of your portfolio's future performance."),

    // Main topic entry for the hub page itself
    {
        id: 'linear-algebra-for-quantitative-finance',
        title: 'Linear Algebra for Quants',
        href: '/topics/linear-algebra-for-quantitative-finance',
        icon: Waypoints,
        description:
        'The language of data and the backbone of modern quantitative finance.',
        category: 'main',
    },
];
