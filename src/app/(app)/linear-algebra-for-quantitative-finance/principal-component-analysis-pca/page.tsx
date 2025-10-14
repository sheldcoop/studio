
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { PageSection } from '@/components/app/page-section';
import { ExampleStep } from '@/components/app/example-step';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

export default function PCAPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Principal Component Analysis (PCA)"
        description="The premier algorithm for dimensionality reduction, powered by SVD."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          Imagine you are an astronomer who has just collected data on the positions of a million stars in a newly discovered galaxy. Your dataset is a massive table with three columns: `x`, `y`, and `z` coordinates. This is a 3-dimensional dataset. But as you plot the data, you notice something remarkable: the galaxy is almost completely flat, like our own Milky Way. It forms a thin, rotating disk.
        </p>
        <p>
          While your data lives in 3D, the "interesting" information—the structure of the galaxy—is almost entirely 2-dimensional. The third dimension, the "thickness" of the disk, is mostly just small, random noise. Wouldn't it be great if you could find the perfect 2D plane that best represents your galaxy? This is the exact problem that <strong>Principal Component Analysis (PCA)</strong> solves.
        </p>
      </article>

      <PageSection title="The Goal of PCA: Finding the Directions of Maximum Variance">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Core Idea</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            <p>
                PCA is a technique for finding a new, optimal coordinate system for your data. The axes of this new system are called <strong>Principal Components</strong>.
            </p>
            <ul className="list-disc pl-6 space-y-2">
                <li>The first principal component (PC1) is the direction in the data with the <strong>largest possible variance</strong>.</li>
                <li>The second principal component (PC2) is the direction with the next largest variance, with the crucial constraint that it must be <strong>orthogonal</strong> to PC1.</li>
                <li>PC3 is the next most important direction orthogonal to both PC1 and PC2, and so on.</li>
                <li>These new axes are <strong>uncorrelated</strong>.</li>
            </ul>
            </CardContent>
        </Card>
      </PageSection>
      
      <PageSection title="The Complete PCA Algorithm (The Recipe)">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Recipe</CardTitle>
            </CardHeader>
            <CardContent>
            <ol className="list-decimal pl-6 space-y-4 text-sm">
                <li>
                    <strong>Center the Data:</strong> For each feature (column) in your data matrix `X`, calculate its mean and subtract it from every entry in that column. This creates a new matrix `B` where every column has a mean of zero.
                </li>
                <li>
                    <strong>Compute the SVD:</strong> Compute the Singular Value Decomposition of the centered data matrix: `B = UΣVᵀ`.
                </li>
                 <li>
                    <strong>Identify Principal Components:</strong> The principal components (the new axes of your data) are the columns of the matrix `V`.
                </li>
                <li>
                    <strong>Measure Variance Explained:</strong> The variance explained by each principal component is proportional to the square of its corresponding singular value (`σᵢ²`). This tells you how important each new axis is.
                </li>
                <li>
                    <strong>Reduce Dimensionality:</strong> To reduce your data from `n` dimensions to `k` dimensions, select the first `k` columns of `V` to create a new matrix `V_k`.
                </li>
                <li>
                    <strong>Project the Data:</strong> Your new, lower-dimensional dataset is the result of projecting the centered data `B` onto these new axes: `Transformed_Data = B * V_k`.
                </li>
          </ol>
            </CardContent>
        </Card>
      </PageSection>
      
      <LessonSummaryCard title="Summary: PCA in a Nutshell">
        <li>PCA finds the directions of maximum variance in a dataset.</li>
        <li>This is achieved by performing an SVD on the <strong>mean-centered</strong> data matrix.</li>
        <li>The <strong>right singular vectors (`V`)</strong> are the principal components (the new, optimal axes).</li>
        <li>The <strong>singular values (`Σ`)</strong> tell you the importance of each component.</li>
      </LessonSummaryCard>
      
      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/the-covariance-matrix-and-the-geometry-of-portfolio-risk">
        Applications in Finance
      </NextUpNavigation>
    </div>
  );
}
