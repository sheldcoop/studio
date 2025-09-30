import { Waypoints } from 'lucide-react';
import { type Topic } from './types';

export const linearAlgebraTopics: Topic[] = [
  {
    id: 'linear-equation-systems',
    title: 'Chapter 1: Linear Equation Systems',
    href: '/linear-algebra/linear-equation-systems',
    icon: Waypoints,
    description:
      'What is a Linear System?, Geometric Interpretation in 2D and 3D, Solving Systems with Gaussian Elimination, Row Echelon Form (REF) and Reduced Row Echelon Form (RREF), Existence and Uniqueness of Solutions',
    category: 'sub-topic',
    parent: 'la-main-chapters',
    subTopics: [
      { id: 'what-is-a-linear-system', title: 'What is a Linear System?' },
      {
        id: 'geometric-interpretation',
        title: 'Geometric Interpretation in 2D & 3D',
      },
      {
        id: 'gaussian-elimination',
        title: 'Solving with Gaussian Elimination',
      },
      { id: 'echelon-forms', title: 'Row Echelon Form (REF & RREF)' },
      {
        id: 'existence-uniqueness',
        title: 'Existence and Uniqueness of Solutions',
      },
    ],
  },
  {
    id: 'basic-matrix-algebra',
    title: 'Chapter 2: Basic Matrix Algebra',
    href: '/linear-algebra/basic-matrix-algebra',
    icon: Waypoints,
    description: '',
    category: 'sub-topic',
    parent: 'la-main-chapters',
    subTopics: [
      { id: 'matrix-notation', title: 'Matrix Notation and Terminology' },
      {
        id: 'matrix-operations',
        title: 'Matrix Addition, Subtraction, and Scalar Multiplication',
      },
      {
        id: 'matrix-multiplication',
        title: 'Matrix Multiplication and its Properties',
      },
      {
        id: 'transpose-and-inverse',
        title: 'The Transpose and the Inverse of a Matrix',
      },
      {
        id: 'special-matrices',
        title: 'Special Matrices: Identity, Zero, Diagonal, Symmetric',
      },
    ],
  },
  {
    id: 'determinants-and-lu-factorization',
    title: 'Chapter 3: Determinants and LU Factorization',
    href: '/linear-algebra/determinants-and-lu-factorization',
    icon: Waypoints,
    description: '',
    category: 'sub-topic',
    parent: 'la-main-chapters',
    subTopics: [
      {
        id: 'calculating-determinants',
        title: 'Calculating Determinants using Cofactor Expansion',
      },
      {
        id: 'properties-of-determinants',
        title: 'Properties of Determinants',
      },
      {
        id: 'determinant-and-invertibility',
        title: 'Relationship between Determinant and Invertibility',
      },
      {
        id: 'lu-factorization-intro',
        title: 'Introduction to LU Factorization',
      },
      {
        id: 'solving-systems-with-lu',
        title: 'Solving Systems Efficiently with LU Factorization',
      },
    ],
  },
  {
    id: 'vector-operations-and-linear-combinations',
    title: 'Chapter 4: Vector Operations and Linear Combinations',
    href: '/linear-algebra/vector-operations-and-linear-combinations',
    icon: Waypoints,
    description: '',
    category: 'sub-topic',
    parent: 'la-main-chapters',
    subTopics: [
      {
        id: 'vectors-in-rn',
        title: 'Vectors in Rn (Geometric and Algebraic Views)',
      },
      {
        id: 'vector-operations',
        title: 'Vector Addition, Subtraction, and Scalar Multiplication',
      },
      { id: 'linear-combinations', title: 'Linear Combinations and Weights' },
      { id: 'span', title: 'The concept of Span' },
    ],
  },
  {
    id: 'linear-independence-vector-spaces-and-subspaces',
    title: 'Chapter 5: Linear Independence, Vector Spaces, and Subspaces',
    href: '/linear-algebra/linear-independence-vector-spaces-and-subspaces',
    icon: Waypoints,
    description: '',
    category: 'sub-topic',
    parent: 'la-main-chapters',
    subTopics: [
      {
        id: 'linear-independence-definition',
        title: 'Definition of Linear Independence and Dependence',
      },
      {
        id: 'vector-space-definition',
        title: 'The Formal Definition of a Vector Space and its Axioms',
      },
      {
        id: 'subspace-test',
        title: 'What is a Subspace? The Subspace Test',
      },
    ],
  },
  {
    id: 'basis-dimension-and-four-fundamental-subspaces',
    title: 'Chapter 6: Basis, Dimension, and the Four Fundamental Subspaces',
    href: '/linear-algebra/basis-dimension-and-four-fundamental-subspaces',
    icon: Waypoints,
    description: '',
    category: 'sub-topic',
    parent: 'la-main-chapters',
    subTopics: [
      { id: 'basis-definition', title: 'The Definition of a Basis' },
      {
        id: 'coordinates-of-a-vector',
        title: 'Coordinates of a Vector Relative to a Basis',
      },
      {
        id: 'dimension-of-vector-space',
        title: 'Dimension of a Vector Space',
      },
      {
        id: 'four-fundamental-subspaces',
        title:
          'The Four Fundamental Subspaces: Column, Row, Null, and Left Null Space',
      },
      {
        id: 'rank-nullity-theorem',
        title: 'Rank of a Matrix and the Rank-Nullity Theorem',
      },
    ],
  },
  {
    id: 'linear-transformations',
    title: 'Chapter 7: Linear Transformations',
    href: '/linear-algebra/linear-transformations',
    icon: Waypoints,
    description: '',
    category: 'sub-topic',
    parent: 'la-main-chapters',
    subTopics: [
      {
        id: 'linear-transformations-intro',
        title: 'Introduction to Linear Transformations',
      },
      {
        id: 'matrix-of-a-linear-transformation',
        title: 'The Matrix of a Linear Transformation',
      },
      {
        id: 'geometric-transformations',
        title: 'Geometric Transformations: Rotations, Reflections, Projections',
      },
      {
        id: 'kernel-and-range',
        title:
          'Kernel (Null Space) and Range (Column Space) of a Transformation',
      },
    ],
  },
  {
    id: 'inner-products-and-orthogonality',
    title: 'Chapter 8: Inner Products and Orthogonality',
    href: '/linear-algebra/inner-products-and-orthogonality',
    icon: Waypoints,
    description: '',
    category: 'sub-topic',
    parent: 'la-main-chapters',
    subTopics: [
      {
        id: 'dot-product-norm-distance',
        title: 'The Dot Product, Vector Length (Norm), and Distance',
      },
      {
        id: 'orthogonal-vectors-complements',
        title: 'Orthogonal Vectors and Orthogonal Complements',
      },
      {
        id: 'orthogonal-sets',
        title: 'Orthogonal and Orthonormal Sets',
      },
      {
        id: 'orthogonal-projections',
        title: 'Orthogonal Projections',
      },
    ],
  },
  {
    id: 'gram-schmidt-process-and-qr-decomposition',
    title: 'Chapter 9: The Gram-Schmidt Process and QR Decomposition',
    href: '/linear-algebra/gram-schmidt-process-and-qr-decomposition',
    icon: Waypoints,
    description: '',
    category: 'sub-topic',
    parent: 'la-main-chapters',
    subTopics: [
      {
        id: 'gram-schmidt-process',
        title: 'The Gram-Schmidt Process for Creating an Orthonormal Basis',
      },
      {
        id: 'qr-decomposition',
        title: 'QR Decomposition of a Matrix',
      },
      {
        id: 'application-least-squares',
        title: 'Application: Least-Squares Problems and Linear Regression',
      },
    ],
  },
  {
    id: 'eigenvalues-and-eigenvectors',
    title: 'Chapter 10: Eigenvalues and Eigenvectors',
    href: '/linear-algebra/eigenvalues-and-eigenvectors',
    icon: Waypoints,
    description: '',
    category: 'sub-topic',
    parent: 'la-main-chapters',
    subTopics: [
      {
        id: 'eigenvalues-eigenvectors-definition',
        title: 'Definition of Eigenvalues and Eigenvectors',
      },
      {
        id: 'characteristic-equation',
        title: 'The Characteristic Equation',
      },
      { id: 'eigenspaces', title: 'Eigenspaces' },
      {
        id: 'eigenvalues-of-special-matrices',
        title: 'Eigenvalues of Special Matrices',
      },
    ],
  },
  {
    id: 'diagonalization-and-applications-to-dynamic-systems',
    title: 'Chapter 11: Diagonalization and Applications to Dynamic Systems',
    href: '/linear-algebra/diagonalization-and-applications-to-dynamic-systems',
    icon: Waypoints,
    description: '',
    category: 'sub-topic',
    parent: 'la-main-chapters',
    subTopics: [
      {
        id: 'diagonalization-theorem',
        title: 'The Diagonalization Theorem: A = PDP-1',
      },
      {
        id: 'conditions-for-diagonalizability',
        title: 'Conditions for Diagonalizability',
      },
      {
        id: 'application-computing-high-powers',
        title: 'Application: Computing High Powers of a Matrix',
      },
      {
        id: 'application-dynamic-systems-markov-chains',
        title: 'Application: Modeling Dynamic Systems and Markov Chains',
      },
    ],
  },
  {
    id: 'symmetric-matrices-quadratic-forms-cholesky-decomposition',
    title:
      'Chapter 12: Symmetric Matrices, Quadratic Forms, and Cholesky Decomposition',
    href:
      '/linear-algebra/symmetric-matrices-quadratic-forms-cholesky-decomposition',
    icon: Waypoints,
    description: '',
    category: 'sub-topic',
    parent: 'la-main-chapters',
    subTopics: [
      {
        id: 'diagonalization-of-symmetric-matrices',
        title:
          'Properties and Diagonalization of Symmetric Matrices (The Spectral Theorem)',
      },
      {
        id: 'quadratic-forms-positive-definite',
        title: 'Quadratic Forms and Positive Definite Matrices',
      },
      {
        id: 'application-portfolio-optimization',
        title:
          'Application: Markowitz Portfolio Optimization and the Efficient Frontier',
      },
      {
        id: 'application-cholesky-decomposition',
        title:
          'Application: Cholesky Decomposition for Monte Carlo Simulation',
      },
    ],
  },
  {
    id: 'singular-value-decomposition-svd',
    title: 'Chapter 13: The Singular Value Decomposition (SVD)',
    href: '/linear-algebra/singular-value-decomposition-svd',
    icon: Waypoints,
    description: '',
    category: 'sub-topic',
    parent: 'la-main-chapters',
    subTopics: [
      { id: 'geometry-of-svd', title: 'The Geometry of SVD' },
      { id: 'constructing-the-svd', title: 'Constructing the SVD' },
      {
        id: 'application-noise-reduction',
        title: 'Application: Noise Reduction in Financial Time Series',
      },
      {
        id: 'application-dimensionality-reduction',
        title: 'Application: Dimensionality Reduction',
      },
    ],
  },
  {
    id: 'principal-component-analysis-pca',
    title: 'Chapter 14: Principal Component Analysis (PCA)',
    href: '/linear-algebra/principal-component-analysis-pca',
    icon: Waypoints,
    description: '',
    category: 'sub-topic',
    parent: 'la-main-chapters',
    subTopics: [
      { id: 'covariance-matrix', title: 'The Covariance Matrix' },
      {
        id: 'finding-principal-components',
        title: 'Finding Principal Components using Eigendecomposition',
      },
      {
        id: 'geometric-interpretation-of-pca',
        title: 'Geometric Interpretation of PCA',
      },
      {
        id: 'application-discovering-risk-factors',
        title:
          'Application: Discovering Hidden Statistical Risk Factors in Asset Returns',
      },
    ],
  },
  {
    id: 'multivariate-normal-distribution',
    title: 'Chapter 15: The Multivariate Normal Distribution',
    href: '/linear-algebra/multivariate-normal-distribution',
    icon: Waypoints,
    description: '',
    category: 'sub-topic',
    parent: 'la-main-chapters',
    subTopics: [
      {
        id: 'mean-vector-and-covariance-matrix',
        title: 'The Mean Vector and Covariance Matrix',
      },
      {
        id: 'probability-density-function',
        title: 'The Probability Density Function (PDF)',
      },
      {
        id: 'geometric-interpretation-ellipsoidal-contours',
        title: 'Geometric Interpretation: Ellipsoidal Contours',
      },
      {
        id: 'application-modeling-joint-asset-returns',
        title: 'Application: Modeling Joint Asset Returns and Portfolio Risk',
      },
    ],
  },
    {
    id: 'linear-algebra-for-quantitative-finance',
    title: 'Linear Algebra for Quants',
    href: '/linear-algebra',
    icon: Waypoints,
    description:
      'The language of data and the backbone of modern quantitative finance.',
    category: 'main',
    subTopics: [
      { id: 'linear-equation-systems', title: 'Linear Equation Systems' },
      { id: 'basic-matrix-algebra', title: 'Basic Matrix Algebra' },
    ],
  },
];
