
import { type Topic } from './types';

export const linearAlgebraTopics: Topic[] = [
    // --- Module 1 ---
    {
        id: 'la-vectors-vector-spaces',
        title: 'Vectors & Vector Spaces',
        href: '/linear-algebra-for-quantitative-finance/la-vectors-vector-spaces',
        icon: 'Waypoints',
        description: "Representing asset returns or portfolio weights.",
        category: 'sub-topic',
        parent: 'la-module-1',
        subTopics: [
            { id: 'vector-basics', title: 'Vector Basics' },
            { id: 'vector-operations', title: 'Vector Operations' },
            { id: 'linear-combinations', title: 'Linear Combinations & Span' },
            { id: 'vector-spaces', title: 'Defining a Vector Space' },
        ]
    },
    {
        id: 'la-matrix-operations',
        title: 'Matrix Operations',
        href: '/linear-algebra-for-quantitative-finance/la-matrix-operations',
        icon: 'Waypoints',
        description: "Aggregating data across assets and time.",
        category: 'sub-topic',
        parent: 'la-module-1',
    },
    {
        id: 'la-linear-independence',
        title: 'Linear Independence',
        href: '/linear-algebra-for-quantitative-finance/la-linear-independence',
        icon: 'Waypoints',
        description: "Crucial for diversification and factor models.",
        category: 'sub-topic',
        parent: 'la-module-1',
    },

    // --- Module 2 ---
     {
        id: 'la-systems-of-linear-equations',
        title: 'Systems of Linear Equations',
        href: '/linear-algebra-for-quantitative-finance/la-systems-of-linear-equations',
        icon: 'Waypoints',
        description: "The mathematical basis for linear regression.",
        category: 'sub-topic',
        parent: 'la-module-2',
    },
     {
        id: 'la-orthogonality-projections',
        title: 'Orthogonality & Projections',
        href: '/linear-algebra-for-quantitative-finance/la-orthogonality-projections',
        icon: 'Waypoints',
        description: "The core of Ordinary Least Squares (OLS) regression.",
        category: 'sub-topic',
        parent: 'la-module-2',
    },
     {
        id: 'la-the-four-fundamental-subspaces',
        title: 'The Four Fundamental Subspaces',
        href: '/linear-algebra-for-quantitative-finance/la-the-four-fundamental-subspaces',
        icon: 'Waypoints',
        description: "Understand the complete picture of a matrix.",
        category: 'sub-topic',
        parent: 'la-module-2',
    },

    // --- Module 3 ---
     {
        id: 'la-eigenvalues-eigenvectors',
        title: 'Eigenvalues & Eigenvectors',
        href: '/linear-algebra-for-quantitative-finance/la-eigenvalues-eigenvectors',
        icon: 'Waypoints',
        description: "Find the 'axes of greatest variance' in your data.",
        category: 'sub-topic',
        parent: 'la-module-3',
    },
     {
        id: 'la-diagonalization',
        title: 'Diagonalization',
        href: '/linear-algebra-for-quantitative-finance/la-diagonalization',
        icon: 'Waypoints',
        description: "Simplify complex systems for long-term modeling.",
        category: 'sub-topic',
        parent: 'la-module-3',
    },
     {
        id: 'la-singular-value-decomposition-svd',
        title: 'Singular Value Decomposition (SVD)',
        href: '/linear-algebra-for-quantitative-finance/la-singular-value-decomposition-svd',
        icon: 'Waypoints',
        description: "The master decomposition for any matrix.",
        category: 'sub-topic',
        parent: 'la-module-3',
    },

    // --- Module 4 ---
     {
        id: 'la-covariance-correlation-matrices',
        title: 'Covariance & Correlation Matrices',
        href: '/linear-algebra-for-quantitative-finance/la-covariance-correlation-matrices',
        icon: 'Waypoints',
        description: "The cornerstone of portfolio theory.",
        category: 'sub-topic',
        parent: 'la-module-4',
    },
     {
        id: 'la-positive-definite-matrices',
        title: 'Positive Definite Matrices',
        href: '/linear-algebra-for-quantitative-finance/la-positive-definite-matrices',
        icon: 'Waypoints',
        description: "The mathematical property that makes portfolio optimization possible.",
        category: 'sub-topic',
        parent: 'la-module-4',
    },
     {
        id: 'la-cholesky-decomposition',
        title: 'Cholesky Decomposition',
        href: '/linear-algebra-for-quantitative-finance/la-cholesky-decomposition',
        icon: 'Waypoints',
        description: "The key to generating correlated random asset paths for Monte Carlo simulations.",
        category: 'sub-topic',
        parent: 'la-module-4',
    },
];
