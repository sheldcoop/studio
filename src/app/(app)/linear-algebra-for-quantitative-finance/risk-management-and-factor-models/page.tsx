
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function FactorModelsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Risk Management & Factor Models"
        description="Decomposing portfolio risk into its fundamental drivers."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
            Imagine you are a portfolio manager responsible for hundreds of stocks. Yesterday, your portfolio lost 2%. Why? Was it because one of your stocks had a disastrous earnings report? Or was it because the entire market was spooked by an announcement from the Federal Reserve? Was it something specific to the tech sector?
        </p>
        <p>
            Answering this question—decomposing risk into its fundamental drivers—is one of the most important jobs in all of finance. We can't manage what we can't measure. <strong>Factor Models</strong> are the powerful lens of linear algebra we use to perform this decomposition.
        </p>
      </article>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Part 1: The Core Idea - Moving Beyond the Market</CardTitle>
          <CardDescription>
            A <strong>Factor Model</strong> is a generalization of the CAPM. It states that the return of any asset is a linear combination of its exposures to several of these underlying, common factors.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <BlockMath math="R_i = \alpha_i + \beta_{i1}F_1 + \beta_{i2}F_2 + \dots + \beta_{ik}F_k + \epsilon_i" />
             <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><InlineMath math="R_i" />: The return of our specific stock `i`.</li>
                <li><InlineMath math="\alpha_i" /> (Alpha): The portion of the stock's return that is not explained by any of the factors.</li>
                <li><InlineMath math="F_1, F_2, \dots" />: The returns of the `k` common factors (e.g., the market return, the return of "Value vs. Growth").</li>
                <li><InlineMath math="\beta_{i1}, \beta_{i2}, \dots" />: The stock's "factor loadings" or "betas."</li>
                <li><InlineMath math="\epsilon_i" /> (Epsilon): The idiosyncratic error.</li>
            </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Part 2: Finding the Betas - The Power of Least Squares</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <p>Finding the beta values for a specific stock is a **multiple linear regression** problem. We have a system of equations, which we can write in the form `b = Ax` and solve using the Normal Equations.</p>
            <BlockMath math="A^TA\hat{x} = A^Tb" />
            <p className="text-sm text-muted-foreground">The solution vector `x̂` gives us the stock's alpha and its factor loadings (betas).</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Part 3: The Payoff - Decomposing Risk</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <p>Once we have the betas, we can decompose the risk. The total variance (risk) of a stock `i` can be written as:</p>
            <BlockMath math="\sigma^2_i = (\text{Systematic Variance}) + (\text{Idiosyncratic Variance})" />
            <p>Assuming uncorrelated factors, this simplifies to:</p>
            <p className="font-semibold text-primary text-center mt-2">Total Risk ≈ (Exposure₁)²(Risk₁) + (Exposure₂)²(Risk₂) + ... + Company-Specific Risk</p>
            <p className="mt-4 text-muted-foreground">This is the holy grail of risk management. A portfolio manager can now understand where their risk is coming from and adjust their strategy accordingly.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Part 4: The Advanced Connection - Finding Factors with PCA</CardTitle>
          <CardDescription>
            What if we don't know what the factors are? Can we let the data itself tell us what the true, underlying "engines" of the market are? Yes. This is a perfect application of **Principal Component Analysis (PCA)**.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <ol className="list-decimal pl-5 space-y-2">
                <li><strong>Construct the Covariance Matrix `Σ`</strong> of all stock returns.</li>
                <li><strong>Find the Eigenvectors:</strong> Perform an eigendecomposition of `Σ`.</li>
                <li><strong>The Reveal:</strong> The **eigenvectors** of this matrix *are* the hidden statistical factors. The eigenvector with the largest eigenvalue is the "market factor." Subsequent eigenvectors represent other, orthogonal sources of risk like sector rotations.</li>
            </ol>
            <p className="mt-2 text-muted-foreground">You have used the pure structure of your data to discover the hidden forces that drive it.</p>
        </CardContent>
      </Card>

      <p className="text-center text-muted-foreground">
        **Up Next:** We'll conclude our finance module with another dynamic application: **Markov Chains for State Transitions**.
      </p>
    </div>
  );
}
