
import type { Metadata } from 'next';
import { PageHeader } from '@/components/app/page-header';
import { Diamond, Star } from 'lucide-react';

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

const Chapter = ({ title, children }: { title: string; children?: React.ReactNode }) => (
    <article>
        <h3 className="font-semibold text-xl border-b border-border/50 pb-2 mb-4">{title}</h3>
        {children && <ul className="space-y-3">{children}</ul>}
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
        <span className="text-amber-300/90"><strong className="font-semibold text-amber-300">Application:</strong> {children}</span>
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
          <Chapter title="Chapter 1: Linear Equation Systems" />
          <Chapter title="Chapter 2: Basic Matrix Algebra" />
          <Chapter title="Chapter 3: Determinants and LU Factorization" />
        </Unit>

        <Unit title="Unit 2: The Core Theory - Vector Spaces" description="This unit builds the essential theoretical framework, abstracting from numbers to structured spaces.">
          <Chapter title="Chapter 4: Vector Operations and Linear Combinations" />
          <Chapter title="Chapter 5: Linear Independence, Vector Spaces, and Subspaces" />
          <Chapter title="Chapter 6: Basis, Dimension, and the Four Fundamental Subspaces" />
        </Unit>

        <Unit title="Unit 3: Geometry, Transformations, and Regression" description="We explore the dynamic and geometric side of linear algebra, leading to the foundation of all regression models.">
            <Chapter title="Chapter 7: Linear Transformations" />
            <Chapter title="Chapter 8: Inner Products and Orthogonality" />
            <Chapter title="Chapter 9: The Gram-Schmidt Process and QR Decomposition" />
        </Unit>

        <Unit title="Unit 4: Eigenvalues, Eigenvectors, and Dynamic Systems" description="Uncover the deep, intrinsic properties of matrices to understand system stability and behavior over time.">
            <Chapter title="Chapter 10: Eigenvalues and Eigenvectors" />
            <Chapter title="Chapter 11: Diagonalization and Applications to Dynamic Systems" />
        </Unit>

        <Unit title="Unit 5: Advanced Decompositions & Quant Applications" description="This is the capstone unit where all the theory is applied to solve real-world problems in quantitative finance.">
            <Chapter title="Chapter 12: Symmetric Matrices, Quadratic Forms, and Cholesky Decomposition">
                <QuantFocusItem>Markowitz Portfolio Optimization and Monte Carlo simulations.</QuantFocusItem>
            </Chapter>
            <Chapter title="Chapter 13: The Singular Value Decomposition (SVD)">
                <QuantFocusItem>Noise reduction in financial data and building robust models.</QuantFocusItem>
            </Chapter>
            <Chapter title="Chapter 14: Principal Component Analysis (PCA)">
                <QuantFocusItem>Discovering hidden statistical risk factors in asset returns.</QuantFocusItem>
            </Chapter>
            <Chapter title="Chapter 15: The Multivariate Normal Distribution">
                <QuantFocusItem>Modeling asset returns and understanding portfolio risk.</QuantFocusItem>
            </Chapter>
        </Unit>
      </main>
    </>
  );
}
