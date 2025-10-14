
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { PageSection } from '@/components/app/page-section';
import { LessonSummaryCard } from '@/components/app/lesson-summary-card';

export default function BondMathPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Fixed Income (Bond) Mathematics"
        description="A Masterclass Edition lesson on the calculus and linear algebra behind bond risk management."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
            Of all the financial instruments, bonds may seem the most straightforward. You lend money (buy the bond), and you receive a series of fixed payments (coupons) and a final principal payment at maturity.
        </p>
        <p>
            The complexity arises when interest rates in the market <strong>change</strong>. If rates go up, your existing bond with its lower fixed coupon becomes less attractive, so its price falls. If rates go down, your bond becomes more attractive, and its price rises.
        </p>
        <p>
            The core challenge for any fixed income portfolio manager is to answer two questions:
        </p>
        <ol className="list-decimal pl-5">
            <li><strong>How much</strong> will my bond's price change if interest rates move?</li>
            <li>How can I structure a portfolio of many bonds to have a precise, desired sensitivity to interest rate changes?</li>
        </ol>
        <p>
            The answers to these questions are not just "finance"; they are fundamentally about <strong>linear approximation</strong>, the very heart of calculus and linear algebra.
        </p>
      </article>

      <PageSection title="The Price of a Bond - A Vector Dot Product">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Present Value of Cash Flows</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>A standard bond is defined by its future <strong>cash flows</strong>. Let's consider a simple 3-year bond with a $1000 face value and a 5% annual coupon.</p>
                <p>We can represent this as a <strong>Cash Flow Vector (`C`)</strong>: `C = [50, 50, 1050]`</p>
                <p>The price of this bond today is the **dot product** of the Cash Flow vector and a **Discount Factor Vector (`D`)** derived from the current yield `y`.</p>
                <BlockMath math="\text{Price} = C \cdot D = \sum_{t=1}^{n} \frac{C_t}{(1+y)^t}" />
                <p className="text-sm text-muted-foreground">This vector formulation is clean, powerful, and the foundation for everything that follows.</p>
            </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Duration & Convexity - Risk as Derivatives">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Linear and Non-Linear Risk</CardTitle>
                <CardDescription>We want to find the sensitivity of the price-yield curve. In calculus, this means taking derivatives.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>The percentage price change for a small change in yield (<InlineMath math="\Delta y" />) is given by <strong>Modified Duration (<InlineMath math="D_{mod}" />)</strong>, which is the <strong>first derivative</strong>:</p>
                <BlockMath math="\% \Delta \text{Price} \approx -D_{mod} \cdot \Delta y" />
                <p>Convexity captures the curvature of the price-yield relationship and is the <strong>second derivative</strong>. A more accurate estimate using a Taylor expansion is:</p>
                <BlockMath math="\% \Delta \text{Price} \approx -D_{mod} \cdot \Delta y + \frac{1}{2} C_{vx} \cdot (\Delta y)^2" />
            </CardContent>
        </Card>
      </PageSection>

      <PageSection title="Portfolio Immunization - A System of Linear Equations">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Liability Matching</CardTitle>
                <CardDescription>Imagine you are a pension fund with a liability of **$100 million** due in **7.3 years**. You want to build a portfolio of bonds to fund this future payment and be immune to interest rate changes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>You must match the properties of your assets (the bond portfolio) to your liability. This creates a **system of linear equations**.</p>
                <p>Let's say you can buy Bond A and Bond B. You need to find the weights `w_A` and `w_B` to solve:</p>
                <ol className="list-decimal pl-5 space-y-2 text-sm">
                    <li><strong>Match Present Values:</strong> <InlineMath math="w_A + w_B = \text{PV(Liability)}" /></li>
                    <li><strong>Match Durations:</strong> <InlineMath math="(w_A/W) \cdot D_A + (w_B/W) \cdot D_B = D_{Liab}" /></li>
                    <li><strong>Match Convexities:</strong> <InlineMath math="(w_A/W) \cdot C_{vx,A} + (w_B/W) \cdot C_{vx,B} = C_{vx,Liab}" /></li>
                </ol>
                <p>This is an `Ax=b` problem! In a real-world scenario with more bonds than constraints, you would use **least-squares approximation** to find the weights that get you as close as possible to a perfect match.</p>
            </CardContent>
        </Card>
      </PageSection>

      <p className="text-center text-muted-foreground">
        This concludes our core applications in finance.
      </p>
    </div>
  );
}
