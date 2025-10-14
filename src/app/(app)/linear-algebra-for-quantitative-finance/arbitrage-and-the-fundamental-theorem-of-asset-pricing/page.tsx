
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { PageSection } from '@/components/app/page-section';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';
import { NextUpNavigation } from '@/components/app/next-up-navigation';

export default function ArbitragePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Arbitrage & The Fundamental Theorem of Asset Pricing"
        description="A Masterclass Edition lesson connecting the 'no free lunch' principle to the geometry of vector spaces."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
            This is it. This is the theoretical heart of all modern financial engineering. The "no-arbitrage" principle is the single most important assumption in asset pricing. Today, we will prove that this financial principle is, in fact, a deep statement about the geometry of vector spaces.
        </p>
        <p>
            We will do this in three parts:
        </p>
        <ol className="list-decimal pl-5">
            <li>**Part 1: Setting the Stage:** We will model a financial market perfectly using the tools of linear algebra: matrices and vectors.</li>
            <li>**Part 2: The Free Lunch:** We will define arbitrage with mathematical precision and find one with a concrete example.</li>
            <li>**Part 3: The Law of the Universe:** We will introduce the Fundamental Theorem and show how it connects "no arbitrage" to the subspaces we have studied.</li>
        </ol>
      </article>

      <PageSection title="Part 1: The Financial Marketplace as a Vector Space">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Building the World</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>First, we must build our world. Let's consider a simple, one-period market. There is "today" (time `t=0`) and "tomorrow" (time `t=1`).</p>
                <div>
                    <h4 className="font-semibold">1. States of the World</h4>
                    <p>Tomorrow is uncertain. Let's assume there are `m` possible, distinct outcomes for the world. We'll call these **states**.</p>
                    <p className="text-sm text-muted-foreground">Example: For a farm, the states could be `s₁ = "Drought"`, `s₂ = "Normal Rain"`, `s₃ = "Flood"`.</p>
                </div>
                <div>
                    <h4 className="font-semibold">2. Assets and Payoffs</h4>
                    <p>In this world, there are `n` tradable assets. The value of each asset tomorrow depends on which state of the world occurs. The amount an asset pays in a given state is its **payoff**. We can represent each asset as a **payoff vector** in ℝᵐ.</p>
                    <p className="text-sm text-muted-foreground">Example: `p_umbrella = [15, 10, 5]` (Pays most in a flood, least in a drought).</p>
                </div>
                <div>
                    <h4 className="font-semibold">3. The Payoff Matrix (`P`)</h4>
                    <p>We combine all asset payoff vectors into a single `m x n` **Payoff Matrix, `P`**. Each column is an asset, and each row is a state.</p>
                    <BlockMath math="P = \begin{bmatrix} 15 & 5 \\ 10 & 12 \\ 5 & 2 \end{bmatrix}" />
                </div>
                <div>
                    <h4 className="font-semibold">4. The Portfolio Vector (`h`)</h4>
                    <p>An investor's portfolio is a vector `h` in ℝⁿ, where each component `hⱼ` is the number of shares held of asset `j`.</p>
                </div>
                <div>
                    <h4 className="font-semibold">5. The Portfolio's Payoff</h4>
                    <p>The total payoff of this portfolio in each state is a **linear combination** of the asset payoff vectors: `Portfolio Payoff = P * h`.</p>
                </div>
                <div>
                    <h4 className="font-semibold">6. The Price Vector (`s`)</h4>
                    <p>Each asset has a price today at `t=0`, represented in a price vector `s` in ℝⁿ. The initial cost of portfolio `h` is the dot product: `Cost = s · h = sᵀh`.</p>
                </div>
            </CardContent>
        </Card>
      </PageSection>
      
      <PageSection title="Part 2: The Free Lunch - Defining Arbitrage">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Mathematical Definition</CardTitle>
            </CardHeader>
            <CardContent>
                <p>An **arbitrage** is a "free lunch." It's a portfolio that costs nothing (or even pays you) today, but guarantees you can't lose money tomorrow, and you might even make some.</p>
                <p className="font-semibold mt-2">An arbitrage opportunity exists if you can find a portfolio vector `h` such that:</p>
                <ol className="list-decimal pl-5 space-y-1 mt-2 text-sm">
                    <li>**Zero or Negative Cost:** `s · h ≤ 0`</li>
                    <li>**Non-Negative Payoff:** Every component of the payoff vector `Ph` is greater than or equal to zero (`Ph ≥ 0`).</li>
                    <li>**Strictly Positive Payoff:** At least one component of `Ph` is strictly greater than zero (`Ph ≠ 0`).</li>
                </ol>
            </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Part 3: The Fundamental Theorem of Asset Pricing (FTAP)">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Law of the Universe</CardTitle>
                <CardDescription>The FTAP gives us a perfect mathematical test to see if a market, defined by `P` and `s`, has an arbitrage opportunity. It connects the financial concept to the geometry of our vector spaces.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-semibold">The State Price Vector (`ψ`)</h4>
                    <p>The theorem introduces a crucial vector called the **State Price Vector (`ψ`)**. Each component `ψᵢ` is the "price today" of receiving one single dollar if and only if state `i` occurs tomorrow. For this to make economic sense, all state prices must be strictly positive (`ψ &gt 0`).</p>
                </div>
                <div>
                    <h4 className="font-semibold">The Law of One Price</h4>
                    <p>In a no-arbitrage market, the price of any asset *must* equal the sum of its state-contingent payoffs, each weighted by its state price. `sⱼ = ψ · pⱼ`. For all assets, this gives the matrix equation:</p>
                    <BlockMath math="s^T = \psi^T P \quad \text{or} \quad s = P^T \psi" />
                    <p>This means the price vector `s` must lie in the **Row Space of `P`**.</p>
                </div>
                <div className="border-t pt-4">
                    <h4 className="font-semibold">The Theorem</h4>
                    <p className="font-medium text-primary">A market (`P`, `s`) has **no arbitrage** if and only if there exists a **strictly positive state price vector `ψ`** such that `s = Pᵀψ`.</p>
                </div>
                <div>
                    <h4 className="font-semibold">The Linear Algebra Connection</h4>
                    <p>An arbitrage portfolio `h` requires `sᵀh = 0` (for zero cost) and `Ph ≥ 0` (with `Ph ≠ 0`). If the no-arbitrage condition holds (`s = Pᵀψ`), then the cost is:</p>
                    <BlockMath math="\text{Cost} = s^T h = (P^T \psi)^T h = \psi^T P h = 0" />
                    <p>This is the dot product of the strictly positive vector `ψ` and the non-negative vector `Ph`. The only way this sum can be zero is if `Ph` is the zero vector, which violates the definition of arbitrage.</p>
                    <p className="text-sm mt-2 text-muted-foreground">The theorem ensures that any portfolio `h` that is "free" (orthogonal to the pricing vector `s` in the Row Space) cannot simultaneously generate a risk-free profit.</p>
                </div>
            </CardContent>
        </Card>
      </PageSection>
      
      <NextUpNavigation href="/linear-algebra-for-quantitative-finance/markov-chains-for-state-transitions">
        Markov Chains for State Transitions
      </NextUpNavigation>
    </div>
  );
}
