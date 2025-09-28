
import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/app/page-header';
import { Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Linear Algebra for Quants: A Complete Roadmap',
  description: 'The definitive curriculum to master linear algebra for quantitative finance, from foundational theories to advanced applications in financial modeling and data analysis.',
};

const Unit = ({ title, description, children }: { title: string; description: string; children: React.ReactNode }) => (
    <section className="border-l-4 border-primary pl-6 mb-12">
        <h2 className="font-headline text-2xl font-bold text-primary mb-2">{title}</h2>
        <p className="text-muted-foreground mb-6">{description}</p>
        <div className="space-y-8">
            {children}
        </div>
    </section>
);

const Chapter = ({ title, href, children }: { title: string; href: string, children: React.ReactNode }) => (
    <article>
        <h3 className="mb-4">
            <Link href={href} className="text-xl font-semibold border-b border-border/50 pb-2 block hover:text-primary hover:border-primary transition-colors">
                {title}
            </Link>
        </h3>
        <ul className="list-none pl-4 mt-3 border-l border-dashed border-border/50 space-y-3">
            {children}
        </ul>
    </article>
);

const Subtopic = ({ children }: { children: React.ReactNode }) => (
    <li className="relative pl-6 text-foreground/90 text-sm">
        <span className="absolute left-0 text-primary">▸</span>
        {children}
    </li>
);

const QuantFocusItem = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start gap-3 p-3 rounded-md bg-primary/10 border border-primary/20">
        <Star className="h-4 w-4 text-amber-400 mt-1 shrink-0" />
        <span className="text-amber-200/90"><strong className="font-semibold text-amber-200">Application:</strong> {children}</span>
    </li>
);

export default function LinearAlgebraRoadmapPage() {
  return (
    <>
      <PageHeader
        title="The Definitive Curriculum: Linear Algebra for Quantitative Finance"
        variant="aligned-left"
      />
      <main className="max-w-5xl">
        <Unit title="Unit 1: Foundations - Matrices & Equations" description="We start with the basics: representing and solving the systems that form the bedrock of financial models.">
          <Chapter title="Chapter 1: Linear Equation Systems" href="/linear-algebra/linear-equation-systems">
            <Subtopic>What is a Linear System?</Subtopic>
            <Subtopic>Geometric Interpretation in 2D and 3D</Subtopic>
            <Subtopic>Solving Systems with Gaussian Elimination</Subtopic>
            <Subtopic>Row Echelon Form (REF) and Reduced Row Echelon Form (RREF)</Subtopic>
            <Subtopic>Existence and Uniqueness of Solutions</Subtopic>
          </Chapter>
          <Chapter title="Chapter 2: Basic Matrix Algebra" href="/linear-algebra/basic-matrix-algebra">
            <Subtopic>Matrix Notation and Terminology</Subtopic>
            <Subtopic>Matrix Addition, Subtraction, and Scalar Multiplication</Subtopic>
            <Subtopic>Matrix Multiplication and its Properties</Subtopic>
            <Subtopic>The Transpose and the Inverse of a Matrix</Subtopic>
            <Subtopic>Special Matrices: Identity, Zero, Diagonal, Symmetric</Subtopic>
          </Chapter>
          <Chapter title="Chapter 3: Determinants and LU Factorization" href="/linear-algebra/determinants-and-lu-factorization">
            <Subtopic>Calculating Determinants using Cofactor Expansion</Subtopic>
            <Subtopic>Properties of Determinants</Subtopic>
            <Subtopic>Relationship between Determinant and Invertibility</Subtopic>
            <Subtopic>Introduction to LU Factorization</Subtopic>
            <Subtopic>Solving Systems Efficiently with LU Factorization</Subtopic>
          </Chapter>
        </Unit>

        <Unit title="Unit 2: The Core Theory - Vector Spaces" description="This unit builds the essential theoretical framework, abstracting from numbers to structured spaces.">
          <Chapter title="Chapter 4: Vector Operations and Linear Combinations" href="/linear-algebra/vector-operations-and-linear-combinations">
            <Subtopic>Vectors in R<sup>n</sup> (Geometric and Algebraic Views)</Subtopic>
            <Subtopic>Vector Addition, Subtraction, and Scalar Multiplication</Subtopic>
            <Subtopic>Linear Combinations and Weights</Subtopic>
            <Subtopic>The concept of Span</Subtopic>
          </Chapter>
          <Chapter title="Chapter 5: Linear Independence, Vector Spaces, and Subspaces" href="/linear-algebra/linear-independence-vector-spaces-and-subspaces">
            <Subtopic>Definition of Linear Independence and Dependence</Subtopic>
            <Subtopic>The Formal Definition of a Vector Space and its Axioms</Subtopic>
            <Subtopic>What is a Subspace? The Subspace Test</Subtopic>
          </Chapter>
          <Chapter title="Chapter 6: Basis, Dimension, and the Four Fundamental Subspaces" href="/linear-algebra/basis-dimension-and-four-fundamental-subspaces">
            <Subtopic>The Definition of a Basis</Subtopic>
            <Subtopic>Coordinates of a Vector Relative to a Basis</Subtopic>
            <Subtopic>Dimension of a Vector Space</Subtopic>
            <Subtopic>The Four Fundamental Subspaces: Column, Row, Null, and Left Null Space</Subtopic>
            <Subtopic>Rank of a Matrix and the Rank-Nullity Theorem</Subtopic>
          </Chapter>
        </Unit>

        <Unit title="Unit 3: Geometry, Transformations, and Regression" description="We explore the dynamic side of linear algebra, leading to the foundation of all regression models.">
          <Chapter title="Chapter 7: Linear Transformations" href="/linear-algebra/linear-transformations">
            <Subtopic>Introduction to Linear Transformations</Subtopic>
            <Subtopic>The Matrix of a Linear Transformation</Subtopic>
            <Subtopic>Geometric Transformations: Rotations, Reflections, Projections</Subtopic>
            <Subtopic>Kernel (Null Space) and Range (Column Space) of a Transformation</Subtopic>
          </Chapter>
          <Chapter title="Chapter 8: Inner Products and Orthogonality" href="/linear-algebra/inner-products-and-orthogonality">
            <Subtopic>The Dot Product, Vector Length (Norm), and Distance</Subtopic>
            <Subtopic>Orthogonal Vectors and Orthogonal Complements</Subtopic>
            <Subtopic>Orthogonal and Orthonormal Sets</Subtopic>
            <Subtopic>Orthogonal Projections</Subtopic>
          </Chapter>
          <Chapter title="Chapter 9: The Gram-Schmidt Process and QR Decomposition" href="/linear-algebra/gram-schmidt-process-and-qr-decomposition">
            <Subtopic>The Gram-Schmidt Process for Creating an Orthonormal Basis</Subtopic>
            <Subtopic>QR Decomposition of a Matrix</Subtopic>
            <Subtopic>Application: Least-Squares Problems and Linear Regression</Subtopic>
          </Chapter>
        </Unit>

        <Unit title="Unit 4: Eigenvalues, Eigenvectors, and Dynamic Systems" description="Uncover the deep properties of matrices to understand system stability and behavior over time.">
          <Chapter title="Chapter 10: Eigenvalues and Eigenvectors" href="/linear-algebra/eigenvalues-and-eigenvectors">
            <Subtopic>Definition of Eigenvalues and Eigenvectors</Subtopic>
            <Subtopic>The Characteristic Equation</Subtopic>
            <Subtopic>Eigenspaces</Subtopic>
            <Subtopic>Eigenvalues of Special Matrices</Subtopic>
          </Chapter>
          <Chapter title="Chapter 11: Diagonalization and Applications to Dynamic Systems" href="/linear-algebra/diagonalization-and-applications-to-dynamic-systems">
            <Subtopic>The Diagonalization Theorem: A = PDP<sup>-1</sup></Subtopic>
            <Subtopic>Conditions for Diagonalizability</Subtopic>
            <Subtopic>Application: Computing High Powers of a Matrix</Subtopic>
            <Subtopic>Application: Modeling Dynamic Systems and Markov Chains</Subtopic>
          </Chapter>
        </Unit>

        <Unit title="Unit 5: Advanced Decompositions & Quant Applications" description="This capstone unit applies all the theory to solve real-world problems in quantitative finance.">
          <Chapter title="Chapter 12: Symmetric Matrices, Quadratic Forms, and Cholesky Decomposition" href="/linear-algebra/symmetric-matrices-quadratic-forms-cholesky-decomposition">
            <Subtopic>Properties and Diagonalization of Symmetric Matrices (The Spectral Theorem)</Subtopic>
            <Subtopic>Quadratic Forms and Positive Definite Matrices</Subtopic>
            <QuantFocusItem>Markowitz Portfolio Optimization and the Efficient Frontier</QuantFocusItem>
            <QuantFocusItem>Cholesky Decomposition for Monte Carlo Simulation</QuantFocusItem>
          </Chapter>
          <Chapter title="Chapter 13: The Singular Value Decomposition (SVD)" href="/linear-algebra/singular-value-decomposition-svd">
            <Subtopic>The Geometry of SVD</Subtopic>
            <Subtopic>Constructing the SVD</Subtopic>
            <QuantFocusItem>Noise Reduction in Financial Time Series</QuantFocusItem>
            <QuantFocusItem>Dimensionality Reduction</QuantFocusItem>
          </Chapter>
          <Chapter title="Chapter 14: Principal Component Analysis (PCA)" href="/linear-algebra/principal-component-analysis-pca">
            <Subtopic>The Covariance Matrix</Subtopic>
            <Subtopic>Finding Principal Components using Eigendecomposition</Subtopic>
            <Subtopic>Geometric Interpretation of PCA</Subtopic>
            <QuantFocusItem>Discovering Hidden Statistical Risk Factors in Asset Returns</QuantFocusItem>
          </Chapter>
          <Chapter title="Chapter 15: The Multivariate Normal Distribution" href="/linear-algebra/multivariate-normal-distribution">
            <Subtopic>The Mean Vector and Covariance Matrix</Subtopic>
            <Subtopic>The Probability Density Function (PDF)</Subtopic>
            <Subtopic>Geometric Interpretation: Ellipsoidal Contours</Subtopic>
            <QuantFocusItem>Modeling Joint Asset Returns and Portfolio Risk</QuantFocusItem>
          </Chapter>
        </Unit>
      </main>
    </>
  );
}

    