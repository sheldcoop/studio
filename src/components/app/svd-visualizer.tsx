
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PageHeader } from '@/components/app/page-header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Button } from '@/components/ui/button';
import { PyScriptRunner } from './pyscript-runner';


function PythonImplementation() {
    return (
        <PyScriptRunner
            operation="svd"
            outputId="output-svd-solver"
        />
    );
}

const SVDVisualizer = () => {
  return (
    <>
      <PageHeader
        title="The Ultimate Guide to Singular Value Decomposition (SVD)"
        description="The master decomposition that reveals the deep anatomy of any matrix transformation."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>1. The Intuition: The Anatomy of Any Transformation</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none text-foreground/90 space-y-4">
            <p>
              Imagine any linear transformation as a single, complex action. It
              might stretch, shrink, shear, and rotate space all at once. SVD
              is like a magical MRI that reveals the deep, simple anatomy
              hidden within that complex action.
            </p>
            <p>
              It tells us that{' '}
              <strong>
                every single linear transformation, no matter how complicated,
                can be broken down into three fundamental, pure actions:
              </strong>
            </p>
            <div className="text-center">
                <BlockMath math="A = U \Sigma V^T" />
            </div>
            <ol className="list-decimal pl-6">
              <li>
                <strong>A Rotation (or reflection):</strong> ($V^T$)
              </li>
              <li>
                <strong>A Scaling:</strong> ($\Sigma$)
              </li>
              <li>
                <strong>Another Rotation (or reflection):</strong> ($U$)
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>2. The Components: The Three Fundamental Actions</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none text-foreground/90 space-y-4">
                 <div>
                    <h4 className="font-semibold text-primary">Vᵀ: The "Input" Rotation Matrix</h4>
                    <p>This is an orthogonal matrix. Its rows (the columns of V) are called the <strong>right singular vectors</strong>. Its job is to find the perfect set of perpendicular axes in your input space that are the most "interesting" to the transformation.</p>
                </div>
                 <div>
                    <h4 className="font-semibold text-primary">Σ (Sigma): The "Stretching" Matrix</h4>
                    <p>This is a diagonal matrix. The values on its diagonal, $\sigma_1, \sigma_2, ...$, are the <strong>singular values</strong>. It represents a pure scaling. The singular values are always non-negative and sorted in descending order: $\sigma_1 \ge \sigma_2 \ge \sigma_3 \ge ... \ge 0$.</p>
                </div>
                <div>
                    <h4 className="font-semibold text-primary">U: The "Output" Rotation Matrix</h4>
                    <p>This is another orthogonal matrix. Its columns are the <strong>left singular vectors</strong>. It takes the stretched axes and rotates them into their final orientation in the output space.</p>
                </div>
            </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>3. The "Why": SVD as an Analytical Super-Tool</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none text-foreground/90 space-y-4">
            <p>While SVD can be used to solve systems of equations, its true power lies in **analyzing and approximating data.**</p>
            <h5 className="font-semibold not-prose">Dimensionality Reduction (PCA)</h5>
            <p>This is the #1 application. The sorted singular values in Σ tell you how important each dimension is. By keeping only the top singular values and their vectors, you get the best possible lower-dimensional approximation of your data. This is the core of Principal Component Analysis (PCA).</p>
            <h5 className="font-semibold not-prose">Image Compression</h5>
            <p>A beautiful example of low-rank approximation. By performing SVD on an image matrix and keeping only the top, say, 30 singular values, you can reconstruct a good version of the image with a fraction of the data.</p>
            <h5 className="font-semibold not-prose">Noise Reduction</h5>
            <p>In experimental data, small singular values often correspond to noise. Setting these to zero before reconstructing the matrix can effectively "denoise" your data.</p>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>4. The Showdown: The Supreme Court of Decompositions</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Feature</TableHead>
                            <TableHead>SVD</TableHead>
                            <TableHead>QR</TableHead>
                            <TableHead>LU / Cholesky</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow><TableCell className="font-semibold">Generality</TableCell><TableCell className="font-bold text-green-400">Works on ANY matrix.</TableCell><TableCell>Any m x n matrix.</TableCell><TableCell>Square (and specific types).</TableCell></TableRow>
                        <TableRow><TableCell className="font-semibold">Primary Use</TableCell><TableCell className="font-bold text-green-400">Analysis & Approximation.</TableCell><TableCell>Solving least-squares.</TableCell><TableCell>Solving square systems `Ax=b`.</TableCell></TableRow>
                        <TableRow><TableCell className="font-semibold">Output Insight</TableCell><TableCell className="font-bold text-green-400">The most insightful.</TableCell><TableCell>Good. Provides stable basis.</TableCell><TableCell>Limited. Purely computational.</TableCell></TableRow>
                        <TableRow><TableCell className="font-semibold">Speed</TableCell><TableCell className="font-bold text-red-400">Slowest.</TableCell><TableCell>Medium.</TableCell><TableCell>Fastest.</TableCell></TableRow>
                         <TableRow><TableCell className="font-semibold">Verdict</TableCell><TableCell className="font-bold text-green-400">The ultimate tool for understanding structure.</TableCell><TableCell>The workhorse for data fitting.</TableCell><TableCell>The high-speed engine for solving.</TableCell></TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Making It Real: Python for Image Compression</CardTitle>
            <CardDescription>This code will download a sample image, compress it using SVD with different numbers of singular values, and display the result. This visually demonstrates the power of low-rank approximation.</CardDescription>
          </CardHeader>
          <CardContent>
            <PythonImplementation />
          </CardContent>
        </Card>
      </div>
    </>
  );
};
export default SVDVisualizer;
