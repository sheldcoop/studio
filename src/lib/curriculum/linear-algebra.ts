
import { type Topic } from './types';
import { createTopic } from './utils';

const PATH_PREFIX = 'linear-algebra-for-quantitative-finance';

export const linearAlgebraTopics: Topic[] = [
    // --- Module 1 ---
    createTopic({
        parent: 'la-module-1',
        title: 'Vectors & Vector Spaces',
        icon: 'Waypoints',
        description: "Representing asset returns or portfolio weights.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
        subTopics: [
            { id: 'vector-basics', title: 'Vector Basics' },
            { id: 'vector-operations', title: 'Vector Operations' },
            { id: 'linear-combinations', title: 'Linear Combinations & Span' },
            { id: 'vector-spaces', title: 'Defining a Vector Space' },
        ]
    }),
    createTopic({
        parent: 'la-module-1',
        title: 'Matrix Operations',
        icon: 'Waypoints',
        description: "Aggregating data across assets and time.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
        subTopics: [
            { id: 'matrix-add-subtract', title: 'Matrix Addition & Subtraction' },
            { id: 'scalar-multiplication', title: 'Scalar Multiplication' },
            { id: 'matrix-multiplication', title: 'Matrix Multiplication' },
            { id: 'matrix-transpose', title: 'The Matrix Transpose' },
        ]
    }),
    createTopic({
        parent: 'la-module-1',
        title: 'Linear Independence',
        icon: 'Waypoints',
        description: "Crucial for diversification and factor models.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
        subTopics: [
            { id: 'lin-indep-definition', title: 'Defining Linear Independence' },
            { id: 'spanning-sets', title: 'Spanning Sets' },
            { id: 'basis-and-dimension', title: 'Basis and Dimension' },
        ]
    }),

    // --- Module 2 ---
     createTopic({
        parent: 'la-module-2',
        title: 'Systems of Linear Equations',
        icon: 'Waypoints',
        description: "The mathematical basis for linear regression.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
        subTopics: [
            { id: 'sle-matrix-form', title: 'Representing Systems in Matrix Form' },
            { id: 'gaussian-elimination', title: 'Gaussian Elimination' },
            { id: 'solving-systems', title: 'Solving Systems of Equations' },
        ]
    }),
     createTopic({
        parent: 'la-module-2',
        title: 'Orthogonality & Projections',
        icon: 'Waypoints',
        description: "The core of Ordinary Least Squares (OLS) regression.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
        subTopics: [
            { id: 'dot-product', title: 'The Dot Product & Orthogonality' },
            { id: 'orthogonal-projections', title: 'Orthogonal Projections' },
            { id: 'gram-schmidt', title: 'The Gram-Schmidt Process' },
        ]
    }),
     createTopic({
        parent: 'la-module-2',
        title: 'The Four Fundamental Subspaces',
        icon: 'Waypoints',
        description: "Understand the complete picture of a matrix.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
        subTopics: [
            { id: 'column-space', title: 'Column Space (Image)' },
            { id: 'null-space', title: 'Null Space (Kernel)' },
            { id: 'row-space', title: 'Row Space' },
            { id: 'fundamental-theorem', title: 'The Fundamental Theorem' },
        ]
    }),

    // --- Module 3 ---
     createTopic({
        parent: 'la-module-3',
        title: 'Eigenvalues & Eigenvectors',
        icon: 'Waypoints',
        description: "Find the 'axes of greatest variance' in your data.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
        subTopics: [
            { id: 'eigen-definition', title: 'Geometric & Algebraic Definition' },
            { id: 'characteristic-equation', title: 'The Characteristic Equation' },
            { id: 'finding-eigenvalues', title: 'Finding Eigenvalues' },
            { id: 'finding-eigenvectors', title: 'Finding Eigenvectors' },
        ]
    }),
     createTopic({
        parent: 'la-module-3',
        title: 'Diagonalization',
        icon: 'Waypoints',
        description: "Simplify complex systems for long-term modeling.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
        subTopics: [
            { id: 'diagonalization-theorem', title: 'The Diagonalization Theorem' },
            { id: 'process-of-diagonalization', title: 'Process of Diagonalization' },
            { id: 'matrix-powers', title: 'Powers of a Matrix' },
        ]
    }),
     createTopic({
        parent: 'la-module-3',
        title: 'Singular Value Decomposition (SVD)',
        icon: 'Waypoints',
        description: "The master decomposition for any matrix.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
        subTopics: [
            { id: 'svd-intro', title: 'Introduction to SVD' },
            { id: 'svd-calculation', title: 'Calculating SVD' },
            { id: 'svd-applications', title: 'Applications of SVD' },
        ]
    }),

    // --- Module 4 ---
     createTopic({
        parent: 'la-module-4',
        title: 'Covariance & Correlation Matrices',
        icon: 'Waypoints',
        description: "The cornerstone of portfolio theory.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
        subTopics: [
            { id: 'cov-matrix-def', title: 'Defining Covariance Matrices' },
            { id: 'corr-matrix-def', title: 'Defining Correlation Matrices' },
            { id: 'portfolio-variance', title: 'Calculating Portfolio Variance' },
        ]
    }),
     createTopic({
        parent: 'la-module-4',
        title: 'Positive Definite Matrices',
        icon: 'Waypoints',
        description: "The mathematical property that makes portfolio optimization possible.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
        subTopics: [
            { id: 'pdm-definition', title: 'Defining Positive Definite' },
            { id: 'pdm-properties', title: 'Properties and Importance' },
        ]
    }),
     createTopic({
        parent: 'la-module-4',
        title: 'Cholesky Decomposition',
        icon: 'Waypoints',
        description: "The key to generating correlated random asset paths for Monte Carlo simulations.",
        category: 'sub-topic',
        pathPrefix: PATH_PREFIX,
        subTopics: [
            { id: 'cholesky-intro', title: 'Introduction to Cholesky' },
            { id: 'cholesky-calculation', title: 'Calculating the Decomposition' },
            { id: 'cholesky-monte-carlo', title: 'Application in Monte Carlo' },
        ]
    }),
];
