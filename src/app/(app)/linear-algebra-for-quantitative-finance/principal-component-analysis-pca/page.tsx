
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

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
          While your data lives in 3D, the "interesting" information—the structure of the galaxy—is almost entirely 2-dimensional. The third dimension, the "thickness" of the disk, is mostly just small, random noise. Wouldn't it be great if you could find the perfect 2D plane that best represents your galaxy? This is the exact problem that **Principal Component Analysis (PCA)** solves.
        </p>
      </article>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The Goal of PCA: Finding the Directions of Maximum Variance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            PCA is a technique for finding a new, optimal coordinate system for your data. The axes of this new system are called **Principal Components**.
          </p>
           <ul className="list-disc pl-6 space-y-2">
            <li>The first principal component (PC1) is the direction in the data with the **largest possible variance**.</li>
            <li>The second principal component (PC2) is the direction with the next largest variance, with the crucial constraint that it must be **orthogonal** to PC1.</li>
            <li>PC3 is the next most important direction orthogonal to both PC1 and PC2, and so on.</li>
            <li>These new axes are **uncorrelated**.</li>
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">The Crucial First Step: Centering the Data</CardTitle>
        </CardHeader>
        <CardContent>
           <ol className="list-decimal pl-6 space-y-2">
                <li>Take your original data matrix `X` (where each row is a sample, each column is a feature).</li>
                <li>For each column (feature), calculate its mean (average).</li>
                <li>Subtract the corresponding mean from every entry in that column.</li>
            </ol>
            <p className="mt-4">The resulting matrix, let's call it `B`, is your **centered data matrix**. Every column now has a mean of zero.</p>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle className="font-headline">Path 1: Eigendecomposition of the Covariance Matrix</CardTitle>
          <CardDescription>The traditional statistical approach.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p>The covariance matrix `S` is computed from the centered data `B`:</p>
             <BlockMath math="S = \frac{1}{m-1} B^T B" />
            <p>PCA's goal is equivalent to finding an orthogonal matrix `P` that **diagonalizes the covariance matrix `S`**:</p>
            <BlockMath math="S = PDP^T" />
            <p className="font-semibold text-primary">The connection is: the **eigenvectors** of the covariance matrix `S` are the **Principal Components**.</p>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle className="font-headline">Path 2: The SVD of the Data Matrix</CardTitle>
          <CardDescription>The modern, more direct and stable approach.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p>We compute the SVD of our centered data matrix `B`: <InlineMath math="B = U\Sigma V^T" />. Let's substitute this into the covariance formula:</p>
            <BlockMath math="S = \frac{1}{m-1} (U\Sigma V^T)^T (U\Sigma V^T) = \frac{1}{m-1} V(\Sigma^T\Sigma)V^T" />
            <p>This is the eigendecomposition of `S`! We found it without ever computing `S` directly.</p>
             <p className="font-semibold text-primary">The direct connection: the **right singular vectors of the data matrix `B` (the columns of `V`)** are the **Principal Components**.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>The Complete PCA Algorithm (The Recipe)</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal pl-6 space-y-2">
            <li><strong>Center the Data:</strong> Compute the mean of each feature and subtract it to get matrix `B`.</li>
            <li><strong>Compute the SVD:</strong> Compute the SVD of `B`: `B = UΣVᵀ`.</li>
            <li><strong>Identify Principal Components:</strong> The principal components are the columns of `V`.</li>
            <li><strong>Measure Variance:</strong> The variance explained by each component is proportional to the square of its singular value (`σᵢ²`).</li>
            <li><strong>Reduce Dimensionality:</strong> Select the first `k` columns of `V` to create `V_k`.</li>
            <li><strong>Project the Data:</strong> The new, lower-dimensional dataset is `Transformed_Data = B * V_k`.</li>
          </ol>
        </CardContent>
      </Card>
      
      <p className="text-center text-muted-foreground">
        **Up Next:** We will explore other powerful applications of the SVD, including **low-rank approximation**.
      </p>
    </div>
  );
}
