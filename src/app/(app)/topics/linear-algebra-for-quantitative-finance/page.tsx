
'use client';

import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { CheckCircle, Network, TrendingUp, Cpu } from 'lucide-react';

const applications = [
    {
        icon: TrendingUp,
        title: "Mean-Variance Portfolio Optimization",
        description: "Use covariance matrices and solve systems of linear equations to find the optimal asset allocation that maximizes return for a given level of risk (the Efficient Frontier).",
        concept: "Covariance & Systems of Equations"
    },
    {
        icon: Cpu,
        title: "Principal Component Analysis (PCA)",
        description: "Use eigendecomposition on a covariance matrix to reduce the dimensionality of your data, uncovering the hidden factors that drive asset returns.",
        concept: "Eigenvalues & Eigenvectors"
    },
    {
        icon: Network,
        title: "Factor Modeling (e.g., CAPM)",
        description: "Model asset returns as a linear combination of underlying market factors (e.g., market risk, size, value), a direct application of linear regression.",
        concept: "Linear Regression"
    },
    {
        icon: CheckCircle,
        title: "Risk Management & Monte Carlo",
        description: "Use Cholesky Decomposition of a covariance matrix to generate correlated random variables, allowing you to accurately simulate portfolio performance.",
        concept: "Matrix Decompositions"
    }
]

const module1Concepts = [
    {
        concept: "Vectors & Vector Spaces",
        application: "Representing asset returns or portfolio weights. The entire state of a portfolio can be seen as a single point in a high-dimensional vector space.",
        terms: "Vector, Scalar, Rn, Linear Combination, Span"
    },
    {
        concept: "Matrix Operations",
        application: "Aggregating data across assets and time. Used to apply transformations to entire datasets at once, like calculating portfolio variance from a covariance matrix.",
        terms: "Matrix Multiplication, Transpose, Inverse, Identity Matrix"
    },
    {
        concept: "Linear Independence",
        application: "Crucial for diversification and factor models. If asset returns are linearly dependent, they are redundant and offer no diversification benefit.",
        terms: "Linear Dependence, Basis, Dimension"
    }
]

export default function LinearAlgebraPage() {
  return (
    <>
      <PageHeader
        title="Linear Algebra for Quants"
        description="The language of data and the backbone of modern quantitative finance."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-7xl space-y-12">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">
              Why is Linear Algebra a Quant Superpower?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              In quantitative finance, data is the new currency. We work with vast, high-dimensional datasets representing everything from minute-by-minute stock prices to complex derivative portfolios. Linear algebra is the mathematical framework that allows us to organize, manipulate, and, most importantly, extract predictive signals from this ocean of data.
            </p>
            <p>
              It's not just abstract theory; it's the engine that powers the most sophisticated models in finance. Mastering it is the difference between being a data janitor and a true quantitative strategist.
            </p>
          </CardContent>
        </Card>

        <section>
            <div className="mb-8 text-center">
                <h2 className="font-headline text-3xl font-bold">From Concept to Capital</h2>
                <p className="mx-auto mt-2 max-w-3xl text-muted-foreground">See how core linear algebra concepts translate directly into powerful quantitative finance applications.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {applications.map(app => (
                    <Card key={app.title} className="flex flex-col">
                        <CardHeader>
                            <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mb-4">
                                <app.icon className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="font-headline text-lg">{app.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-sm text-muted-foreground">{app.description}</p>
                        </CardContent>
                        <CardFooter>
                            <p className="text-xs font-semibold text-primary/80 uppercase tracking-wider">{app.concept}</p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>


        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xl font-headline hover:no-underline">
              Module 1: The Building Blocks - Vectors & Matrices
            </AccordionTrigger>
            <AccordionContent className="p-0">
               <p className="px-6 py-4 text-muted-foreground">Mastering the fundamentals. Learn how to represent financial data as vectors and matrices and perform the essential operations that underpin all advanced models.</p>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-1/4">Concept</TableHead>
                            <TableHead className="w-1/2">Why it Matters (The Quant Application)</TableHead>
                            <TableHead className="w-1/4">Key Terms</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {module1Concepts.map((item) => (
                            <TableRow key={item.concept}>
                                <TableCell className="font-medium">{item.concept}</TableCell>
                                <TableCell className="text-muted-foreground">{item.application}</TableCell>
                                <TableCell className="font-mono text-xs text-primary/90">{item.terms}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-xl font-headline hover:no-underline">
              Module 2: The Engine Room - Solving Equations & Finding Structure
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4">
              <p className="mb-4 text-muted-foreground">Go beyond arithmetic. This module is about solving complex financial puzzles, from pricing derivatives to finding the hidden factors that drive market movements.</p>
              <ul className="list-disc space-y-2 pl-6 text-base text-foreground/90">
                 <li><strong>Systems of Linear Equations (<InlineMath math="Ax=b" />):</strong> The mathematical basis for linear regression. Find the relationship between a stock's return and the market's movement.</li>
                 <li><strong>Orthogonality & Projections:</strong> The core of Ordinary Least Squares (OLS) regression. Find the "best fit" line by projecting your data onto a subspace.</li>
                 <li><strong>The Four Fundamental Subspaces:</strong> Understand the complete picture of a matrix—its column space (what you can create) and null space (what gets lost).</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-xl font-headline hover:no-underline">
              Module 3: The DNA of a Matrix - Eigen-Decomposition & SVD
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4">
               <p className="mb-4 text-muted-foreground">This is where the magic happens. Decomposing matrices reveals their intrinsic properties, allowing for powerful applications in dimensionality reduction and risk analysis.</p>
              <ul className="list-disc space-y-2 pl-6 text-base text-foreground/90">
                <li><strong>Eigenvalues & Eigenvectors (<InlineMath math="Av = \lambda v" />):</strong> Find the "axes of greatest variance" in your data. The eigenvectors of a covariance matrix are the principal components in PCA.</li>
                <li><strong>Diagonalization:</strong> Simplify complex systems. This makes calculating high powers of matrices trivial, essential for modeling long-term system evolution (e.g., Markov chains).</li>
                <li><strong>Singular Value Decomposition (SVD):</strong> The master decomposition for any matrix. Used in everything from noise reduction in time series to building recommendation systems.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
           <AccordionItem value="item-4">
            <AccordionTrigger className="text-xl font-headline hover:no-underline">
              Module 4: The Quant's Toolkit - Financial Applications
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4">
              <p className="mb-4 text-muted-foreground">Connect theory to practice. This module focuses on the direct implementation of linear algebra in solving real-world quantitative finance problems.</p>
              <ul className="list-disc space-y-2 pl-6 text-base text-foreground/90">
                <li><strong>Covariance & Correlation Matrices:</strong> The cornerstone of portfolio theory. Understand how assets move together to quantify and manage risk.</li>
                <li><strong>Positive Definite Matrices & Quadratic Forms:</strong> The mathematical property of covariance matrices that makes portfolio optimization possible.</li>
                <li><strong>Cholesky Decomposition:</strong> The key to generating correlated random asset paths for realistic Monte Carlo simulations of your portfolio's future performance.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
