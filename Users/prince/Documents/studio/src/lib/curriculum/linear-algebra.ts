
import { type Topic } from './types';

// Helper to create slugs from titles
const toSlug = (title: string) => title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const createTopic = (module: string, title: string, description: string): Topic => {
    const slug = `la-${toSlug(title)}`;
    return {
        id: slug,
        title,
        href: `/linear-algebra-for-quantitative-finance/${slug}`, 
        icon: 'Waypoints',
        description,
        category: 'sub-topic',
        parent: module,
    };
};

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
    createTopic('la-module-1', 'Matrix Operations', "Aggregating data across assets and time."),
    createTopic('la-module-1', 'Linear Independence', "Crucial for diversification and factor models."),

    // --- Module 2 ---
    createTopic('la-module-2', 'Systems of Linear Equations', "The mathematical basis for linear regression."),
    createTopic('la-module-2', 'Orthogonality & Projections', "The core of Ordinary Least Squares (OLS) regression."),
    createTopic('la-module-2', 'The Four Fundamental Subspaces', "Understand the complete picture of a matrix."),

    // --- Module 3 ---
    createTopic('la-module-3', 'Eigenvalues & Eigenvectors', "Find the 'axes of greatest variance' in your data."),
    createTopic('la-module-3', 'Diagonalization', "Simplify complex systems for long-term modeling."),
    createTopic('la-module-3', 'Singular Value Decomposition (SVD)', "The master decomposition for any matrix."),

    // --- Module 4 ---
    createTopic('la-module-4', 'Covariance & Correlation Matrices', "The cornerstone of portfolio theory."),
    createTopic('la-module-4', 'Positive Definite Matrices', "The mathematical property that makes portfolio optimization possible."),
    createTopic('la-module-4', 'Cholesky Decomposition', "The key to generating correlated random asset paths for Monte Carlo simulations."),
];
