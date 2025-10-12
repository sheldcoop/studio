
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/curriculum';
import type { Metadata } from 'next';
import 'katex/dist/katex.min.css';
import { PageHeader } from '@/components/app/page-header';
import { BlockMath, InlineMath } from 'react-katex';

export async function generateMetadata(): Promise<Metadata> {
    const topicInfo = allTopics.find(t => t.id === 'covariance-correlation-matrices');
    if (!topicInfo) {
        return { title: 'Topic Not Found' };
    }
    return {
        title: topicInfo.title,
        description: topicInfo.description,
    };
}

export default function CovarianceMatricesPage() {
    const topicInfo = allTopics.find(t => t.id === 'covariance-correlation-matrices');
    if (!topicInfo) {
        notFound();
    }
    return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Covariance & Correlation Matrices"
        description="The cornerstone of modern portfolio theory and risk management."
        variant="aligned-left"
      />

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-base text-foreground/90">
        
        <h3 className="font-headline text-2xl font-bold">Part 1: Covariance - Measuring Joint Movement</h3>
        <p>While variance tells us how a single asset's returns fluctuate around its mean, **covariance** tells us how two assets' returns move in relation to each other.</p>
        
        <ul>
            <li>A **positive covariance** means that when Asset A's return is above its average, Asset B's return also tends to be above its average. They move together.</li>
            <li>A **negative covariance** means that when Asset A's return is above its average, Asset B's return tends to be below its average. They move in opposite directions.</li>
            <li>A covariance **near zero** means there is no linear relationship between their movements.</li>
        </ul>
        
        <p>The formula for the covariance between two random variables (asset returns) X and Y is:</p>
        <BlockMath math="\text{Cov}(X, Y) = E[(X - E[X])(Y - E[Y])]" />

        <h4 className="font-headline text-xl font-bold">The Covariance Matrix</h4>
        <p>When dealing with a portfolio of multiple assets, we organize the covariances between every pair of assets into a **covariance matrix**, often denoted by <InlineMath math="\Sigma" />.</p>
        <p>For a portfolio with 3 assets (X, Y, Z), the covariance matrix is:</p>
        <BlockMath math="\Sigma = \begin{pmatrix} \text{Var}(X) & \text{Cov}(X,Y) & \text{Cov}(X,Z) \\ \text{Cov}(Y,X) & \text{Var}(Y) & \text{Cov}(Y,Z) \\ \text{Cov}(Z,X) & \text{Cov}(Z,Y) & \text{Var}(Z) \end{pmatrix}" />
        <p>Notice two key properties:</p>
        <ol>
            <li>The diagonal elements are the **variances** of each individual asset (since <InlineMath math="\text{Cov}(X,X) = \text{Var}(X)" />).</li>
            <li>The matrix is **symmetric**, because <InlineMath math="\text{Cov}(X,Y) = \text{Cov}(Y,X)" />.</li>
        </ol>

        <hr />

        <h3 className="font-headline text-2xl font-bold">Part 2: Correlation - The Standardized Measure</h3>
        <p>Covariance is useful, but its magnitude depends on the units of the variables, making it hard to interpret. For example, a covariance of 100 might be small for high-volatility assets but large for low-volatility assets.</p>
        <p>To solve this, we standardize the covariance to get the **correlation coefficient** (denoted by <InlineMath math="\rho" /> or `r`), which is always between -1 and +1.</p>
        <BlockMath math="\rho(X, Y) = \frac{\text{Cov}(X, Y)}{\sigma_X \sigma_Y}" />
        <p>Where <InlineMath math="\sigma_X" /> and <InlineMath math="\sigma_Y" /> are the standard deviations of X and Y.</p>
        
        <ul>
            <li><InlineMath math="\rho = +1" />: Perfect positive linear relationship.</li>
            <li><InlineMath math="\rho = -1" />: Perfect negative linear relationship.</li>
            <li><InlineMath math="\rho = 0" />: No linear relationship.</li>
        </ul>

        <h4 className="font-headline text-xl font-bold">The Correlation Matrix</h4>
        <p>Similarly, we can construct a **correlation matrix**. For our 3-asset portfolio:</p>
        <BlockMath math="R = \begin{pmatrix} 1 & \rho(X,Y) & \rho(X,Z) \\ \rho(Y,X) & 1 & \rho(Y,Z) \\ \rho(Z,X) & \rho(Z,Y) & 1 \end{pmatrix}" />
        <p>The diagonal elements are always 1, because an asset is perfectly correlated with itself.</p>

        <hr />

        <h3 className="font-headline text-2xl font-bold">Part 3: Application in Portfolio Theory</h3>
        <p>The covariance matrix is the engine of Modern Portfolio Theory. It allows us to calculate the total variance (risk) of a portfolio of multiple assets.</p>
        <p>For a portfolio with weights <InlineMath math="\mathbf{w} = \begin{pmatrix} w_1 \\ w_2 \\ \vdots \\ w_n \end{pmatrix}" /> and a covariance matrix <InlineMath math="\Sigma" />, the portfolio variance is calculated using matrix multiplication:</p>
        <BlockMath math="\sigma_p^2 = \mathbf{w}^T \Sigma \mathbf{w}" />
        
        <h4 className="font-headline text-xl font-bold">Example: 2-Asset Portfolio</h4>
        <p>Let's say we have two assets with weights <InlineMath math="w_1, w_2" />, variances <InlineMath math="\sigma_1^2, \sigma_2^2" />, and covariance <InlineMath math="\text{Cov}(1,2)" />.</p>
        <BlockMath math="\sigma_p^2 = \begin{pmatrix} w_1 & w_2 \end{pmatrix} \begin{pmatrix} \sigma_1^2 & \text{Cov}(1,2) \\ \text{Cov}(2,1) & \sigma_2^2 \end{pmatrix} \begin{pmatrix} w_1 \\ w_2 \end{pmatrix}" />
        <p>Multiplying this out gives the famous formula:</p>
        <BlockMath math="\sigma_p^2 = w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2w_1w_2\text{Cov}(1,2)" />
        <p>Since <InlineMath math="\text{Cov}(1,2) = \rho_{12}\sigma_1\sigma_2" />, we can also write it as:</p>
        <BlockMath math="\sigma_p^2 = w_1^2\sigma_1^2 + w_2^2\sigma_2^2 + 2w_1w_2\rho_{12}\sigma_1\sigma_2" />
        <p>This formula demonstrates the power of diversification. If the correlation <InlineMath math="\rho_{12}" /> is low or negative, the total portfolio variance will be less than the weighted sum of the individual variances, effectively giving you a "free lunch" in risk reduction.</p>
      </div>
    </div>
  );
}

