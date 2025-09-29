
'use client';

import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Script from 'next/script';

export default function LinearAlgebraPage() {
  return (
    <div>
      <PageHeader
        title="Linear Algebra for Quants"
        description="The language of data and the backbone of modern quantitative finance."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Script
          id="mathjax-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.MathJax = {
              tex: {
                inlineMath: [['$', '$'], ['\\(', '\\)']],
                displayMath: [['$$', '$$'], ['\\[', '\\]']],
              },
              svg: {
                fontCache: 'global'
              }
            };
          `,
          }}
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"
          strategy="afterInteractive"
          id="mathjax-script"
        />
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">
              Why is Linear Algebra Essential?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              In quantitative finance, we deal with massive amounts of
              data—stock prices, interest rates, portfolio returns, and more.
              Linear algebra provides the tools to organize, manipulate, and
              analyze this data efficiently. It allows us to represent complex
              systems of financial relationships in a compact and elegant way.
            </p>
            <p>
              From modeling portfolio risk with covariance matrices to building
              machine learning algorithms for trading signals using techniques
              like Principal Component Analysis (PCA), linear algebra is not
              just abstract theory; it's the practical engine driving many
              quantitative strategies. Mastering it is non-negotiable.
            </p>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
          <AccordionItem value="item-1" id="module-1">
            <AccordionTrigger className="px-6 text-lg hover:no-underline">
              Module 1: Foundations of Vectors and Matrices
            </AccordionTrigger>
            <AccordionContent className="px-6">
              <div className="space-y-6 text-base text-foreground/90">
                <div>
                  <h4 className="font-semibold">Vectors and Spaces</h4>
                  <ul className="mt-2 list-disc space-y-2 pl-6">
                    <li>
                      <strong>Vector Operations:</strong> Addition, scalar
                      multiplication, and the dot product ({`$u \\cdot v$`}).
                    </li>
                    <li>
                      <strong>Vector Norms:</strong> Understanding vector
                      length or magnitude, particularly the L1 and L2 norms ({`$||v||$`}).
                    </li>
                    <li>
                      <strong>Vector Spaces and Subspaces:</strong> Formal
                      definitions, linear combinations, span, and the concept of
                      a basis.
                    </li>
                    <li>
                      <strong>Linear Independence:</strong> Determining if
                      vectors are redundant or provide unique information.
                    </li>
                    <li>
                      <strong>Orthogonality and Projections:</strong>{' '}
                      Understanding perpendicular vectors and how to project one
                      vector onto another, a key concept for regression and
                      PCA.
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">Matrices and Operations</h4>
                  <ul className="mt-2 list-disc space-y-2 pl-6">
                    <li>
                      <strong>Matrix Operations:</strong> Addition, scalar
                      multiplication, and matrix multiplication.
                    </li>
                    <li>
                      <strong>Special Matrices:</strong> Identity, diagonal,
                      symmetric, and triangular matrices.
                    </li>
                    <li>
                      <strong>Matrix Properties:</strong> The transpose, trace,
                      determinant, and inverse of a matrix.
                    </li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" id="module-2">
            <AccordionTrigger className="px-6 text-lg hover:no-underline">
              Module 2: Core Concepts and Decompositions
            </AccordionTrigger>
            <AccordionContent className="px-6">
               <div className="space-y-6 text-base text-foreground/90">
                <div>
                  <h4 className="font-semibold">Matrix Transformations</h4>
                  <ul className="mt-2 list-disc space-y-2 pl-6">
                    <li>
                      Understanding a matrix as a function that transforms vectors (e.g., rotation, scaling, shearing).
                    </li>
                    <li>
                      The relationship between matrix properties (e.g., determinant) and the effect of the transformation (e.g., change in area/volume).
                    </li>
                  </ul>
                </div>
                 <div>
                  <h4 className="font-semibold">Solving Systems of Linear Equations</h4>
                  <ul className="mt-2 list-disc space-y-2 pl-6">
                    <li>Representing systems of equations in the form {`$Ax = b$`}.</li>
                    <li>Methods for solving, including Gaussian elimination and using the matrix inverse ({`$x = A^{-1}b$`}). This is the foundation for linear regression.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">Eigenvalues and Eigenvectors</h4>
                  <ul className="mt-2 list-disc space-y-2 pl-6">
                    <li>The fundamental concept of vectors that are only scaled by a transformation, defined by the equation {`$Ax = \\lambda x$`}.</li>
                    <li><strong>Eigen-decomposition:</strong> Breaking down a matrix into its constituent eigenvalues and eigenvectors ({`$A = PDP^{-1}$`}). This reveals the matrix's intrinsic properties.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">Key Matrix Decompositions</h4>
                  <ul className="mt-2 list-disc space-y-2 pl-6">
                    <li><strong>Singular Value Decomposition (SVD):</strong> A generalization of eigen-decomposition for any rectangular matrix. It's a cornerstone of many ML applications like recommendation systems and dimensionality reduction.</li>
                    <li><strong>Cholesky Decomposition:</strong> A specific decomposition for symmetric, positive-definite matrices (like covariance matrices), used heavily in financial modeling and Monte Carlo simulations.</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" id="module-3">
            <AccordionTrigger className="px-6 text-lg hover:no-underline">
              Module 3: Applications in Machine Learning & Statistics
            </AccordionTrigger>
            <AccordionContent className="px-6">
              <div className="space-y-6 text-base text-foreground/90">
                <div>
                  <h4 className="font-semibold">Covariance Matrices</h4>
                  <ul className="mt-2 list-disc space-y-2 pl-6">
                    <li>Constructing and interpreting matrices that describe the variance and relationships between multiple variables.</li>
                    <li>Understanding the properties of a covariance matrix (it is always symmetric and positive semi-definite).</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">Principal Component Analysis (PCA)</h4>
                  <ul className="mt-2 list-disc space-y-2 pl-6">
                    <li>A dimensionality reduction technique that uses the <strong>eigenvectors</strong> of the <strong>covariance matrix</strong> to find the directions of maximum variance in a dataset.</li>
                  </ul>
                </div>
                 <div>
                  <h4 className="font-semibold">Linear Regression</h4>
                  <ul className="mt-2 list-disc space-y-2 pl-6">
                    <li>Framing regression as a problem of <strong>solving a system of linear equations</strong> (the "Normal Equation," {`$\\hat{\\beta} = (X^T X)^{-1} X^T y$}) to find the best-fit line or plane.`}</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4" id="module-4">
            <AccordionTrigger className="px-6 text-lg hover:no-underline">
              Module 4: Applications in Quantitative Finance
            </AccordionTrigger>
            <AccordionContent className="px-6">
               <div className="space-y-6 text-base text-foreground/90">
                <div>
                  <h4 className="font-semibold">Portfolio Optimization</h4>
                  <ul className="mt-2 list-disc space-y-2 pl-6">
                    <li><strong>Mean-Variance Optimization:</strong> Using <strong>covariance matrices</strong> and solving systems of equations to find the optimal asset allocation that maximizes return for a given level of risk.</li>
                    <li>Calculating the "Efficient Frontier."</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">Factor Models</h4>
                  <ul className="mt-2 list-disc space-y-2 pl-6">
                    <li>Using linear algebra (often regression) to model asset returns based on underlying factors (e.g., market risk, size, value). Examples include the Capital Asset Pricing Model (CAPM).</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold">Risk Management</h4>
                  <ul className="mt-2 list-disc space-y-2 pl-6">
                    <li>Using <strong>covariance matrices</strong> to calculate portfolio variance and Value at Risk (VaR).</li>
                    <li>Employing <strong>Cholesky decomposition</strong> to generate correlated random variables for Monte Carlo simulations of portfolio performance.</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
