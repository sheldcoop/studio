
import { type Topic } from './types';

export const linearAlgebraTopics: Topic[] = [
    // --- Module 1 ---
    {
        id: 'la-vectors-vector-spaces',
        title: 'Vectors & Vector Spaces',
        href: '/topics/la-vectors-vector-spaces', // CORRECTED
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
        href: '/topics/la-matrix-operations', // CORRECTED
        icon: 'Waypoints',
        description: "Aggregating data across assets and time.",
        category: 'sub-topic',
        parent: 'la-module-1',
        subTopics: [
            { id: 'matrix-add-subtract', title: 'Matrix Addition & Subtraction' },
            { id: 'scalar-multiplication', title: 'Scalar Multiplication' },
            { id: 'matrix-multiplication', title: 'Matrix Multiplication' },
            { id: 'matrix-transpose', title: 'The Matrix Transpose' },
        ]
    },
    {
        id: 'la-linear-independence',
        title: 'Linear Independence',
        href: '/topics/la-linear-independence', // CORRECTED
        icon: 'Waypoints',
        description: "Crucial for diversification and factor models.",
        category: 'sub-topic',
        parent: 'la-module-1',
        subTopics: [
            { id: 'lin-indep-definition', title: 'Defining Linear Independence' },
            { id: 'spanning-sets', title: 'Spanning Sets' },
            { id: 'basis-and-dimension', title: 'Basis and Dimension' },
        ]
    },

    // --- Module 2 ---
     {
        id: 'la-systems-of-linear-equations',
        title: 'Systems of Linear Equations',
        href: '/topics/la-systems-of-linear-equations', // CORRECTED
        icon: 'Waypoints',
        description: "The mathematical basis for linear regression.",
        category: 'sub-topic',
        parent: 'la-module-2',
        subTopics: [
            { id: 'sle-matrix-form', title: 'Representing Systems in Matrix Form' },
            { id: 'gaussian-elimination', title: 'Gaussian Elimination' },
            { id: 'solving-systems', title: 'Solving Systems of Equations' },
        ]
    },
     {
        id: 'la-orthogonality-projections',
        title: 'Orthogonality & Projections',
        href: '/topics/la-orthogonality-projections', // CORRECTED
        icon: 'Waypoints',
        description: "The core of Ordinary Least Squares (OLS) regression.",
        category: 'sub-topic',
        parent: 'la-module-2',
        subTopics: [
            { id: 'dot-product', title: 'The Dot Product & Orthogonality' },
            { id: 'orthogonal-projections', title: 'Orthogonal Projections' },
            { id: 'gram-schmidt', title: 'The Gram-Schmidt Process' },
        ]
    },
     {
        id: 'la-the-four-fundamental-subspaces',
        title: 'The Four Fundamental Subspaces',
        href: '/topics/la-the-four-fundamental-subspaces', // CORRECTED
        icon: 'Waypoints',
        description: "Understand the complete picture of a matrix.",
        category: 'sub-topic',
        parent: 'la-module-2',
        subTopics: [
            { id: 'column-space', title: 'Column Space (Image)' },
            { id: 'null-space', title: 'Null Space (Kernel)' },
            { id: 'row-space', title: 'Row Space' },
            { id: 'fundamental-theorem', title: 'The Fundamental Theorem' },
        ]
    },

    // --- Module 3 ---
     {
        id: 'la-eigenvalues-eigenvectors',
        title: 'Eigenvalues & Eigenvectors',
        href: '/topics/la-eigenvalues-eigenvectors', // CORRECTED
        icon: 'Waypoints',
        description: "Find the 'axes of greatest variance' in your data.",
        category: 'sub-topic',
        parent: 'la-module-3',
        subTopics: [
            { id: 'eigen-definition', title: 'Geometric & Algebraic Definition' },
            { id: 'characteristic-equation', title: 'The Characteristic Equation' },
            { id: 'finding-eigenvalues', title: 'Finding Eigenvalues' },
            { id: 'finding-eigenvectors', title: 'Finding Eigenvectors' },
        ]
    },
     {
        id: 'la-diagonalization',
        title: 'Diagonalization',
        href: '/topics/la-diagonalization', // CORRECTED
        icon: 'Waypoints',
        description: "Simplify complex systems for long-term modeling.",
        category: 'sub-topic',
        parent: 'la-module-3',
        subTopics: [
            { id: 'diagonalization-theorem', title: 'The Diagonalization Theorem' },
            { id: 'process-of-diagonalization', title: 'Process of Diagonalization' },
            { id: 'matrix-powers', title: 'Powers of a Matrix' },
        ]
    },
     {
        id: 'la-singular-value-decomposition-svd',
        title: 'Singular Value Decomposition (SVD)',
        href: '/topics/la-singular-value-decomposition-svd', // CORRECTED
        icon: 'Waypoints',
        description: "The master decomposition for any matrix.",
        category: 'sub-topic',
        parent: 'la-module-3',
        subTopics: [
            { id: 'svd-intro', title: 'Introduction to SVD' },
            { id: 'svd-calculation', title: 'Calculating SVD' },
            { id: 'svd-applications', title: 'Applications of SVD' },
        ]
    },

    // --- Module 4 ---
     {
        id: 'la-covariance-correlation-matrices',
        title: 'Covariance & Correlation Matrices',
        href: '/topics/la-covariance-correlation-matrices', // CORRECTED
        icon: 'Waypoints',
        description: "The cornerstone of portfolio theory.",
        category: 'sub-topic',
        parent: 'la-module-4',
        subTopics: [
            { id: 'cov-matrix-def', title: 'Defining Covariance Matrices' },
            { id: 'corr-matrix-def', title: 'Defining Correlation Matrices' },
            { id: 'portfolio-variance', title: 'Calculating Portfolio Variance' },
        ]
    },
     {
        id: 'la-positive-definite-matrices',
        title: 'Positive Definite Matrices',
        href: '/topics/la-positive-definite-matrices', // CORRECTED
        icon: 'Waypoints',
        description: "The mathematical property that makes portfolio optimization possible.",
        category: 'sub-topic',
        parent: 'la-module-4',
        subTopics: [
            { id: 'pdm-definition', title: 'Defining Positive Definite' },
            { id: 'pdm-properties', title: 'Properties and Importance' },
        ]
    },
     {
        id: 'la-cholesky-decomposition',
        title: 'Cholesky Decomposition',
        href: '/topics/la-cholesky-decomposition', // CORRECTED
        icon: 'Waypoints',
        description: "The key to generating correlated random asset paths for Monte Carlo simulations.",
        category: 'sub-topic',
        parent: 'la-module-4',
        subTopics: [
            { id: 'cholesky-intro', title: 'Introduction to Cholesky' },
            { id: 'cholesky-calculation', title: 'Calculating the Decomposition' },
            { id: 'cholesky-monte-carlo', title: 'Application in Monte Carlo' },
        ]
    },
];
