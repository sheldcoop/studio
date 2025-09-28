
import type { Metadata } from 'next';
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Diamond, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Linear Algebra for Quants: A Complete Roadmap',
  description: 'From matrices and systems to advanced decompositions like SVD and PCA, this is your complete roadmap to mastering linear algebra for quantitative finance.',
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

const Chapter = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <article>
        <h3 className="font-semibold text-xl border-b border-border/50 pb-2 mb-4">{title}</h3>
        <ul className="space-y-3">
            {children}
        </ul>
    </article>
);

const ChapterItem = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start gap-3">
        <Diamond className="h-4 w-4 text-primary mt-1 shrink-0" />
        <span className="text-foreground/90">{children}</span>
    </li>
);

const QuantFocusItem = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start gap-3 p-3 rounded-md bg-primary/10 border border-primary/20">
        <Star className="h-4 w-4 text-amber-400 mt-1 shrink-0" />
        <span className="text-primary-foreground/90"><strong className="font-semibold text-amber-300">Quant Focus:</strong> {children}</span>
    </li>
);

export default function LinearAlgebraRoadmapPage() {
  return (
    <>
      <PageHeader
        title="Linear Algebra for Quantitative Finance: From Zero to Mastery"
        variant="aligned-left"
      />
      <main className="max-w-5xl">
        <Unit title="Unit 1: The Language of Finance - Matrices and Systems" description="This unit establishes the fundamental tools for representing and solving financial problems.">
          <Chapter title="Chapter 1: Systems of Linear Equations & LU Factorization">
            <ChapterItem>Representing portfolios and arbitrage conditions as systems of equations.</ChapterItem>
            <ChapterItem>Solving systems with <strong>Gaussian elimination</strong> (row operations).</ChapterItem>
            <ChapterItem><strong>LU Factorization</strong>: The workhorse for repeatedly solving systems.</ChapterItem>
            <QuantFocusItem>Solving tridiagonal systems common in finite difference methods for pricing derivatives.</QuantFocusItem>
          </Chapter>
          <Chapter title="Chapter 2: Matrix Algebra">
            <ChapterItem>Matrix operations: Aggregating portfolio returns and characteristics.</ChapterItem>
            <ChapterItem>The inverse and transpose: Their roles in regression and optimization formulas.</ChapterItem>
            <ChapterItem><strong>Special Matrices in Finance</strong>: Diagonal, symmetric, and positive definite matrices.</ChapterItem>
          </Chapter>
        </Unit>

        <Unit title="Unit 2: The Structure of Financial Data" description="Understand the underlying structure of asset returns and risk factors using vector spaces.">
          <Chapter title="Chapter 3: Vector Spaces, Basis, and Dimension">
            <ChapterItem>Viewing asset returns as vectors in R<sup>n</sup>.</ChapterItem>
            <ChapterItem><strong>Linear Independence</strong>: Identifying redundant assets or factors.</ChapterItem>
            <ChapterItem><strong>Basis and Dimension</strong>: Finding the minimum set of factors to describe a market.</ChapterItem>
          </Chapter>
          <Chapter title="Chapter 4: The Four Fundamental Subspaces & Rank">
            <ChapterItem><strong>Column Space</strong>: The set of all possible portfolio outcomes from a set of assets.</ChapterItem>
            <ChapterItem><strong>Null Space</strong>: Finding arbitrage opportunities (portfolios with zero cost).</ChapterItem>
            <ChapterItem><strong>Rank</strong>: Determining the true number of independent risk factors.</ChapterItem>
          </Chapter>
        </Unit>

        <Unit title="Unit 3: Regression, Projections, and Risk" description="Master linear regression, the cornerstone of quantitative financial modeling.">
            <Chapter title="Chapter 5: Orthogonality & Projections">
                <ChapterItem>Inner product: Defining correlation and covariance from a geometric perspective.</ChapterItem>
                <ChapterItem><strong>Orthogonal Projections</strong>: The geometric foundation of regression.</ChapterItem>
            </Chapter>
             <Chapter title="Chapter 6: Least-Squares and Factor Models">
                <ChapterItem>The <strong>Normal Equations</strong>: Deriving the formula for linear regression.</ChapterItem>
                <ChapterItem><strong>QR Decomposition</strong>: A numerically stable method for solving least-squares problems.</ChapterItem>
                <QuantFocusItem>Building and solving factor models like the <strong>Capital Asset Pricing Model (CAPM)</strong> and Fama-French models.</QuantFocusItem>
            </Chapter>
        </Unit>

        <Unit title="Unit 4: Core Quantitative Decompositions and Models" description="Use advanced decompositions to build sophisticated models for risk, optimization, and analysis.">
            <Chapter title="Chapter 7: Eigenvalues, Eigenvectors, and Diagonalization">
                <ChapterItem>Eigenvectors as the principal axes of financial data.</ChapterItem>
                <ChapterItem>Diagonalization: Simplifying complex system dynamics.</ChapterItem>
                <QuantFocusItem>Modeling asset price dynamics and <strong>Markov chains</strong> for regime switching.</QuantFocusItem>
            </Chapter>
             <Chapter title="Chapter 8: Symmetric Matrices, Quadratic Forms, and Portfolio Optimization">
                <ChapterItem><strong>Positive Definite Matrices</strong>: The mathematical representation of a valid covariance matrix.</ChapterItem>
                <ChapterItem><strong>Quadratic Forms</strong>: Describing portfolio variance.</ChapterItem>
                <QuantFocusItem>The theory behind <strong>Markowitz Mean-Variance Optimization</strong> and finding the efficient frontier.</QuantFocusItem>
                <QuantFocusItem><strong>Cholesky Decomposition</strong>: The key tool for <strong>Monte Carlo simulation</strong> of correlated asset returns.</QuantFocusItem>
            </Chapter>
             <Chapter title="Chapter 9: SVD and Principal Component Analysis (PCA)">
                <ChapterItem><strong>Singular Value Decomposition (SVD)</strong>: A powerful tool for noise reduction and data compression.</ChapterItem>
                <ChapterItem><strong>Principal Component Analysis (PCA)</strong> using the eigendecomposition of the covariance matrix.</ChapterItem>
                <QuantFocusItem>Identifying hidden statistical risk factors in asset returns and building robust risk models.</QuantFocusItem>
            </Chapter>
        </Unit>
      </main>
    </>
  );
}
