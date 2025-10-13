
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

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

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Part 1: The Price of a Bond - A Vector Dot Product</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <p>A standard bond is defined by its future <strong>cash flows</strong>. Let's consider a simple 3-year bond with a $1000 face value and a 5% annual coupon.</p>
            <p>We can represent this as a <strong>Cash Flow Vector (`C`)</strong>: `C = [50, 50, 1050]`</p>
            <p>The price of this bond today is the **dot product** of the Cash Flow vector and a **Discount Factor Vector (`D`)** derived from the current yield `y`.</p>
            <BlockMath math="\text{Price} = C \cdot D = \sum_{t=1}^{n} \frac{C_t}{(1+y)^t}" />
            <p className="text-sm text-muted-foreground">This vector formulation is clean, powerful, and the foundation for everything that follows.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Part 2: Duration - The First Derivative (Linear Risk)</CardTitle>
          <CardDescription>We want to find the <strong>slope</strong> of the price-yield curve. In calculus, the slope is the <strong>first derivative</strong>.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p>The percentage price change for a small change in yield (<InlineMath math="\Delta y" />) is given by <strong>Modified Duration (<InlineMath math="D_{mod}" />)</strong>:</p>
            <BlockMath math="\% \Delta \text{Price} \approx -D_{mod} \cdot \Delta y" />
            <p>Duration is the <strong>first-order linear approximation</strong> of a bond's risk. A bond with a Modified Duration of 7 years will lose approximately 7% of its value if interest rates rise by 1%.</p>
             <p className="text-sm"><strong>The Linear Algebra Connection:</strong> The formula for duration is derived by taking the derivative of our vector dot product formulation for price. It is the weighted-average time to maturity of a bond's cash flows.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Part 3: Convexity - The Second Derivative (Non-Linear Risk)</CardTitle>
          <CardDescription>Our linear approximation using duration is good, but not perfect. The true price-yield relationship is a <strong>curve</strong>.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <p>Convexity captures this curvature. To get a more accurate approximation, we need the **second derivative** of the price function. This is a **Taylor expansion**.</p>
            <BlockMath math="\% \Delta \text{Price} \approx -D_{mod} \cdot \Delta y + \frac{1}{2} C_{vx} \cdot (\Delta y)^2" />
            <p>This provides a much more accurate estimate of price changes for larger movements in interest rates.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Part 4: Portfolio Immunization - A System of Linear Equations</CardTitle>
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

    </div>
  );
}
