
import { type Topic } from './types';
import { createTopic } from './utils';

export const linearAlgebraPart2: Topic[] = [
    // --- Module 3: Determinants ---
    createTopic({
        parent: 'la-module-3',
        title: 'The Geometric Meaning of the Determinant',
        icon: 'Waypoints',
        description: "The determinant as the scaling factor of area/volume.",
        category: 'sub-topic',
        duration: 20,
    }),
    createTopic({
        parent: 'la-module-3',
        title: 'Calculation and Properties',
        icon: 'Waypoints',
        description: "Cofactor expansion and the properties of determinants. A determinant of zero means the matrix squishes space into a lower dimension (i.e., it's not invertible).",
        category: 'sub-topic',
        duration: 30,
    }),

    // --- Module 4: Eigenvalues & Decompositions ---
     createTopic({
        parent: 'la-module-4',
        title: 'Eigenvalues & Eigenvectors',
        icon: 'Waypoints',
        description: "Finding the 'special' vectors that are only scaled by a transformation, not rotated off their span (Ax = λx).",
        category: 'sub-topic',
        duration: 30,
    }),
     createTopic({
        parent: 'la-module-4',
        title: 'The Characteristic Equation',
        icon: 'Waypoints',
        description: "The calculation behind eigenvalues: solving det(A - λI) = 0.",
        category: 'sub-topic',
        duration: 25,
    }),
     createTopic({
        parent: 'la-module-4',
        title: 'Diagonalization (PDP⁻¹)',
        icon: 'Waypoints',
        description: "Decomposing a matrix into its core components: 'changing to the eigenbasis, scaling, and changing back.'",
        category: 'sub-topic',
        duration: 35,
    }),
    createTopic({
        parent: 'la-module-4',
        title: 'Applications of Eigen-analysis',
        icon: 'Waypoints',
        description: 'Using eigenvalues for tasks like calculating matrix powers (e.g., for Markov chains).',
        category: 'sub-topic',
        duration: 25,
    }),
     createTopic({
        parent: 'la-module-4',
        title: 'The Spectral Theorem',
        icon: 'Waypoints',
        description: "For symmetric matrices (like covariance matrices), the eigendecomposition is especially beautiful and stable (A = QDQᵀ). This is the theoretical foundation of PCA.",
        category: 'sub-topic',
        duration: 35,
    }),
    createTopic({
        parent: 'la-module-4',
        title: 'The Cholesky Decomposition (LLᵀ)',
        icon: 'Waypoints',
        description: "A highly efficient specialization for symmetric, positive-definite matrices, often used in optimization and financial modeling.",
        category: 'sub-topic',
        duration: 25,
    }),


    // --- Module 5: Orthogonality & Projections ---
    createTopic({
        parent: 'la-module-5',
        title: 'The Inexact Problem (Ax=b)',
        icon: 'Waypoints',
        description: 'What to do when Ax=b has no solution.',
        category: 'sub-topic',
        duration: 15,
    }),
    createTopic({
        parent: 'la-module-5',
        title: 'Projections onto Subspaces',
        icon: 'Waypoints',
        description: 'The geometric solution: find the closest point in the column space.',
        category: 'sub-topic',
        duration: 30,
    }),

    // --- Module 6: Least Squares & The QR Decomposition ---
    createTopic({
        parent: 'la-module-6',
        title: 'The Normal Equations (AᵀAx̂ = Aᵀb)',
        icon: 'Waypoints',
        description: 'The algebraic solution to the least squares problem and its link to linear regression.',
        category: 'sub-topic',
        duration: 30,
    }),
    createTopic({
        parent: 'la-module-6',
        title: 'The Problem with Normal Equations',
        icon: 'Waypoints',
        description: 'AᵀA can be ill-conditioned and numerically unstable.',
        category: 'sub-topic',
        duration: 15,
    }),
    createTopic({
        parent: 'la-module-6',
        title: 'Gram-Schmidt & QR Decomposition',
        icon: 'Waypoints',
        description: 'A numerically superior method (A=QR) for solving least squares problems by creating an orthonormal basis.',
        category: 'sub-topic',
        duration: 35,
    }),
    
    // --- Module 7: The Singular Value Decomposition (SVD) ---
    createTopic({
        parent: 'la-module-7',
        title: 'The Singular Value Decomposition (SVD)',
        icon: 'Waypoints',
        description: 'The ultimate decomposition (A = UΣVᵀ) that works for any matrix and finds orthonormal bases for all four fundamental subspaces simultaneously.',
        category: 'sub-topic',
        duration: 40,
    }),
    createTopic({
        parent: 'la-module-7',
        title: 'Principal Component Analysis (PCA)',
        icon: 'Waypoints',
        description: 'A direct, powerful application of SVD on the data matrix for dimensionality reduction.',
        category: 'sub-topic',
        duration: 30,
    }),
    createTopic({
        parent: 'la-module-7',
        title: 'Advanced SVD Applications',
        icon: 'Waypoints',
        description: 'Low-rank approximation for noise reduction, and the core ideas behind recommendation systems.',
        category: 'sub-topic',
        duration: 25,
    }),
];
