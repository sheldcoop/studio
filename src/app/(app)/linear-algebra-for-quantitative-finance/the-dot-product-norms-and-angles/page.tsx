
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function DotProductPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="The Dot Product, Norms, and Angles"
        description="The tools for measuring length, distance, and relationships between vectors."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          So far, we've treated vectors as directions and data points. We know how to add and scale them. But this leaves us with some fundamental unanswered questions:
        </p>
        <ul className="list-disc pl-6">
            <li>How <strong>long</strong> is a vector?</li>
            <li>What's the <strong>distance</strong> between two vectors?</li>
            <li>How can we measure the <strong>relationship</strong> or "agreement" between two vectors?</li>
        </ul>
        <p>
          To answer these, we need to introduce a new set of tools for measurement. We'll start with the concept of "length," formally known as the <strong>norm</strong>.
        </p>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">How Long is a Vector? The Norm</CardTitle>
                <CardDescription>In linear algebra, the "length" or "magnitude" of a vector is called its norm. While there are many ways to define a norm, two are overwhelmingly common in data science and finance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="font-semibold text-lg">The L2 Norm (The One You Know)</h3>
                    <p>Let's take our vector <InlineMath math="v = [3, 4]" />. When we draw it, what's its length? You probably see the answer instantly. The vector forms the hypotenuse of a right-angled triangle with sides of length 3 and 4. We can use the Pythagorean theorem!</p>
                    <p className="font-mono bg-muted p-2 rounded-md">Length² = 3² + 4² = 9 + 16 = 25<br/>Length = √25 = 5</p>
                    <p>This is the <strong>L2 Norm</strong>. It's the standard, "as the crow flies" Euclidean distance.</p>
                     <div className="rounded-lg border bg-muted/50 p-4 text-center mt-2">
                        <h4 className="font-semibold mb-2">The Formula: L2 Norm</h4>
                        <p className="text-sm text-muted-foreground mb-2">For a vector <InlineMath math="v = [v₁, v₂, ..., vₙ]" />, its L2 norm, written as <InlineMath math="\|v\|_2" />, is:</p>
                        <BlockMath math="\|v\|_2 = \sqrt{v_1^2 + v_2^2 + \dots + v_n^2}" />
                    </div>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg mt-4">The L1 Norm (The "Manhattan" Distance)</h3>
                    <p>What if you're not a crow? What if you're a taxi driver in Manhattan, forced to travel along a grid? The distance you'd travel for the vector <InlineMath math="[3, 4]" /> is simply <InlineMath math="3 + 4 = 7" />. This is the <strong>L1 Norm</strong>. You just sum the absolute values of the components.</p>
                     <div className="rounded-lg border bg-muted/50 p-4 text-center mt-2">
                        <h4 className="font-semibold mb-2">The Formula: L1 Norm</h4>
                        <p className="text-sm text-muted-foreground mb-2">For a vector <InlineMath math="v" />, its L1 norm, written as <InlineMath math="\|v\|_1" />, is:</p>
                        <BlockMath math="\|v\|_1 = |v_1| + |v_2| + \dots + |v_n|" />
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Dot Product: The Engine of Measurement</CardTitle>
                <CardDescription>Now we come to the most important operation in this lesson: the dot product. On the surface, it looks like a simple calculation, but it is the key that unlocks the relationship between vectors.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="font-semibold text-lg">The Data Scientist's View (The Calculation)</h3>
                    <p>The dot product of two vectors, <InlineMath math="v" /> and <InlineMath math="w" />, is found by multiplying their corresponding components and then summing the results. Let <InlineMath math="v = [2, 1]" /> and <InlineMath math="w = [1, 3]" />. The dot product, written <InlineMath math="v \cdot w" />, is:</p>
                    <p className="font-mono bg-muted p-2 rounded-md"><InlineMath math="v \cdot w = (2 \times 1) + (1 \times 3) = 2 + 3 = 5" /></p>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg">The Physicist's View (The "Projection" Intuition)</h3>
                    <p>The dot product tells us about the <strong>agreement</strong> between two vectors. It answers the question: "How much is vector <InlineMath math="v" /> pointing in the same direction as vector <InlineMath math="w" />?"</p>
                    <p>This relationship between the dot product and the angle between vectors is formalized by this crucial equation:</p>
                     <div className="rounded-lg border bg-muted/50 p-4 text-center mt-2">
                        <h4 className="font-semibold mb-2">The Geometric Definition of the Dot Product</h4>
                        <BlockMath math="v \cdot w = \|v\| \|w\| \cos(\theta)" />
                         <p className="text-sm text-muted-foreground mt-2">Where <InlineMath math="\|v\|" /> and <InlineMath math="\|w\|" /> are the L2 norms (lengths) of the vectors, and <InlineMath math="\theta" /> (theta) is the angle between them.</p>
                    </div>
                </div>
            </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle className="font-headline">Application: Cosine Similarity</CardTitle>
                <CardDescription>We can rearrange that magic formula to solve for what we're often most interested in: the angle. This value is called the Cosine Similarity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="rounded-lg border bg-muted/50 p-4 text-center">
                    <BlockMath math="\cos(\theta) = \frac{v \cdot w}{\|v\| \|w\|}" />
                </div>
                <p>It will always be between -1 and 1, and it's one of the most important metrics in all of data science.</p>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                    <li><strong>Value of 1:</strong> The vectors point in the exact same direction (angle is 0°).</li>
                    <li><strong>Value of 0:</strong> The vectors are orthogonal (angle is 90°).</li>
                    <li><strong>Value of -1:</strong> The vectors point in opposite directions (angle is 180°).</li>
                </ul>
                <div className="border p-4 rounded-lg">
                    <h4 className="font-semibold">Real-World Example: Recommending Movies</h4>
                    <p className="text-sm mt-2">Imagine a streaming service. Your taste is a vector, where each component is your rating for a movie:</p>
                    <ul className="list-disc pl-5 mt-2 text-sm space-y-1 font-mono">
                        <li>You = [5, 4, 1, ..., 5]</li>
                        <li>Alice = [5, 5, 2, ..., 4]</li>
                        <li>Bob = [2, 1, 5, ..., 1]</li>
                    </ul>
                    <p className="text-sm mt-2">To find who is most similar to you, the service computes the cosine similarity between your vector and everyone else's. It then recommends movies that Alice loves but you haven't seen yet. This is the core principle behind many recommendation engines.</p>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Summary: Your Measurement Toolkit</CardTitle></CardHeader>
            <CardContent>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="rounded-lg border p-4 space-y-2">
                        <h4 className="font-semibold">1. Norm (Length)</h4>
                        <p className="text-sm text-muted-foreground"><strong>L2 Norm (<InlineMath math="\|v\|_2" />):</strong> The standard "Euclidean" length. (Pythagorean theorem).</p>
                        <p className="text-sm text-muted-foreground"><strong>L1 Norm (<InlineMath math="\|v\|_1" />):</strong> The "Manhattan" length. (Sum of absolute values).</p>
                    </div>
                    <div className="rounded-lg border p-4 space-y-2">
                         <h4 className="font-semibold">2. The Dot Product (<InlineMath math="v \cdot w" />)</h4>
                        <p className="text-sm text-muted-foreground">A simple calculation that reveals the geometric relationship between two vectors.</p>
                    </div>
                 </div>
                 <div className="rounded-lg border p-4 mt-4">
                    <h4 className="font-semibold">3. Cosine Similarity</h4>
                    <p className="text-sm text-muted-foreground">A value from -1 to 1 that normalizes the dot product to give a pure measure of directional "agreement." The workhorse of similarity tasks.</p>
                 </div>
            </CardContent>
        </Card>

      </article>
    </div>
  );
}
