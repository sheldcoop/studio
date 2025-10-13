
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function VectorOperationsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Vector Operations"
        description="The Rules of Moving in Space"
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          In the last lesson, we established our "Grand Unified Theory" of vectors: a list of numbers is an arrow in space. This insight is powerful, but it’s just the beginning.
        </p>
        <p>
          Now, we need to define the rules for how these vectors interact. How do they move? How can we combine them? These rules are called operations, and the two most fundamental are <strong>addition</strong> and <strong>scalar multiplication</strong>.
        </p>
        <p>
          They might sound fancy, but as you'll see, they have simple, beautiful geometric interpretations.
        </p>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Vector Addition: Combining Journeys</CardTitle>
                <CardDescription>Let’s start with a simple question: What does it mean to add two vectors together?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="font-semibold text-lg">The Data Scientist's View (The Easy Part)</h3>
                    <p>Let's say we have two vectors, <InlineMath math="v" /> and <InlineMath math="w" />.</p>
                    <p><InlineMath math="v = [2, 1]" /></p>
                    <p><InlineMath math="w = [1, 3]" /></p>
                    <p>From the "list of numbers" perspective, the answer is incredibly simple. To add two vectors, you just add their corresponding components.</p>
                    <p className="font-mono bg-muted p-2 rounded-md"><InlineMath math="v + w = [2+1, 1+3] = [3, 4]" /></p>
                    <p>This is called element-wise addition. It's easy to compute, but it doesn't give us much intuition. Why does this rule make sense? For that, we turn to the Physicist.</p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg">The Physicist's View (The "Aha!" Moment)</h3>
                    <p>Geometrically, adding vectors is like combining a series of movements. Imagine a vector as a journey: "walk 2 steps east, then 1 step north."</p>
                    <p>To add vector <InlineMath math="w" /> to <InlineMath math="v" />, we simply start the journey of <InlineMath math="w" /> where the journey of <InlineMath math="v" /> ended.</p>
                    <ol className="list-decimal pl-6">
                        <li><strong>Draw v:</strong> Start at the origin and draw the arrow for <InlineMath math="[2, 1]" />.</li>
                        <li><strong>Draw w:</strong> Start at the tip of <InlineMath math="v" /> and draw the arrow for <InlineMath math="[1, 3]" /> (1 step east, 3 steps north).</li>
                        <li><strong>The Result:</strong> The sum, <InlineMath math="v + w" />, is the new vector that starts at the origin and ends at the tip of the final vector, <InlineMath math="w" />.</li>
                    </ol>
                    <p>This is the "tip-to-tail" rule, and it perfectly matches our numerical result! The final destination is indeed <InlineMath math="[3, 4]" />. This visual confirmation shows us that our element-wise addition rule isn't arbitrary; it has a deep geometric meaning.</p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg">Application: Combining Portfolio Returns</h3>
                    <p>Imagine <InlineMath math="v" /> represents the change in value of your stock portfolio today (<InlineMath math="[+\$200 \text{ stock gain}, -\$50 \text{ bond loss}]" />).</p>
                    <p><InlineMath math="w" /> represents the change in value tomorrow (<InlineMath math="[+\$100 \text{ stock gain}, +\$150 \text{ bond gain}]" />).</p>
                    <p>Your total change over the two days is simply <InlineMath math="v + w" />.</p>
                    <p><InlineMath math="v + w = [200+100, -50+150] = [+\$300 \text{ stock gain}, +\$100 \text{ bond gain}]" /></p>
                    <p>Vector addition provides a natural way to aggregate changes across multiple time periods or multiple assets.</p>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Scalar Multiplication: Scaling Vectors</CardTitle>
                 <CardDescription>Our second fundamental operation is scalar multiplication. A "scalar" is just a fancy word for a regular, single number (like 3, -1, or 0.5), not a vector.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div>
                    <h3 className="font-semibold text-lg">The Data Scientist's View (Again, The Easy Part)</h3>
                    <p>Let's take our vector <InlineMath math="v = [2, 1]" /> and multiply it by the scalar 3.</p>
                    <p>Just like with addition, the rule is simple: you multiply every component of the vector by the scalar.</p>
                    <p className="font-mono bg-muted p-2 rounded-md"><InlineMath math="3 * v = [3 * 2, 3 * 1] = [6, 3]" /></p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg">The Physicist's View (The Intuition)</h3>
                    <p>Geometrically, multiplying a vector by a scalar scales its length.</p>
                     <ul className="list-disc pl-6">
                        <li>Multiplying by a scalar &gt; 1 stretches the vector.</li>
                        <li>Multiplying by a scalar between 0 and 1 shrinks it.</li>
                        <li>Multiplying by a negative scalar flips its direction and then scales it.</li>
                    </ul>
                    <p>The new vector <InlineMath math="[6, 3]" /> points in the exact same direction as <InlineMath math="[2, 1]" />, but it's exactly three times as long. Once again, the numeric rule and the geometric intuition align perfectly.</p>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg">Application: Adjusting a Trading Strategy</h3>
                    <p>Imagine your vector <InlineMath math="s" /> represents a trading signal: <InlineMath math="[\text{Buy 200 shares of AAPL}, \text{Sell 50 shares of GOOG}]" />.</p>
                     <ul className="list-disc pl-6">
                        <li>If you want to double down on your strategy, you simply compute <InlineMath math="2 * s" />.</li>
                        <li>If you want to reverse your position, you compute <InlineMath math="-1 * s" />.</li>
                        <li>If you want to reduce your risk by half, you compute <InlineMath math="0.5 * s" />.</li>
                    </ul>
                    <p>Scalar multiplication is the language of scaling risk, size, and direction in quantitative models.</p>
                </div>
            </CardContent>
        </Card>
        
        <div>
            <h3 className="font-headline text-2xl font-bold">Putting It All Together</h3>
            <p className="mt-4">By combining these two simple operations, we can now move anywhere in our vector space. Any vector can be described as a combination of a few fundamental "basis" vectors, which is a powerful idea we'll explore in a later lesson.</p>
            <p className="mt-2">For example, the vector <InlineMath math="[5, 4]" /> can be seen as <InlineMath math="5 * [1, 0] + 4 * [0, 1]" />. We are scaling and adding fundamental vectors to create new ones.</p>
        </div>

        <Card>
            <CardHeader><CardTitle>Summary: The Two Fundamental Rules</CardTitle></CardHeader>
            <CardContent>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="rounded-lg border p-4">
                        <h4 className="font-semibold">Vector Addition (<InlineMath math="v + w" />)</h4>
                        <p className="text-sm text-muted-foreground">Combine vectors by adding their components. Geometrically, this is the "tip-to-tail" rule for combining journeys.</p>
                    </div>
                    <div className="rounded-lg border p-4">
                         <h4 className="font-semibold">Scalar Multiplication (<InlineMath math="c * v" />)</h4>
                        <p className="text-sm text-muted-foreground">Scale a vector by multiplying every component by a scalar. Geometrically, this stretches, shrinks, or flips the vector without changing its fundamental direction.</p>
                    </div>
                 </div>
                 <p className="mt-4">These two operations are the simple, elegant building blocks upon which all of linear algebra is constructed.</p>
            </CardContent>
        </Card>

      </article>
    </div>
  );
}
