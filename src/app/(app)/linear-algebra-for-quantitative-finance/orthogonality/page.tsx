
import { PageHeader } from '@/components/app/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function OrthogonalityPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Orthogonality"
        description="The profound implications of being at right angles."
        variant="aligned-left"
      />

      <article className="prose prose-invert max-w-none space-y-6">
        <p>
          In the last lesson, we discovered the dot product and its connection to the angle between two vectors. We saw that a large positive dot product means two vectors are "aligned," while a large negative one means they are "opposed."
        </p>
        <p>
            But what about the most interesting case? What happens when the dot product is exactly zero?
        </p>
        <p>
            From our geometric formula, <InlineMath math="v \cdot w = \|v\| \|w\| \cos(\theta)" />, the only way for the dot product to be zero (assuming non-zero vectors) is if <InlineMath math="\cos(\theta) = 0" />. This happens when the angle <InlineMath math="\theta" /> is exactly 90 degrees.
        </p>
        <p>
            Vectors that are at a 90-degree angle to each other are called <strong>orthogonal</strong>. This is the precise mathematical term for "perpendicular."
        </p>
        <p>
            This simple geometric idea—being at right angles—has profound implications in the world of data. In linear algebra, orthogonality is the mathematical embodiment of <strong>independence</strong> and <strong>non-redundancy</strong>.
        </p>
        
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Power of Zero: Why Orthogonality Matters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>When two vectors are orthogonal, moving along one of them has absolutely no effect on your position relative to the other.</p>
                <p>Think of the cardinal directions: North, South, East, and West.</p>
                <ul className="list-disc pl-6">
                    <li>The direction "East" is orthogonal to the direction "North."</li>
                    <li>If you walk 10 miles East, how much progress have you made in the Northerly direction? Zero.</li>
                </ul>
                <p>The two directions are completely independent. Your movement in one has no component, no "shadow," in the other.</p>
                <p>This is what a zero dot product signifies. The projection of one vector onto the other is zero. They don't overlap in any meaningful way.</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">The Orthogonality Test</CardTitle>
                <CardDescription>To check if two vectors <InlineMath math="v" /> and <InlineMath math="w" /> are orthogonal, simply compute their dot product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="rounded-lg border bg-muted/50 p-4 text-center">
                    <p>If <InlineMath math="v \cdot w = 0" />, they are orthogonal.</p>
                </div>
                <p>Let's test <InlineMath math="v = [2, 3]" /> and <InlineMath math="w = [-3, 2]" />.</p>
                <p className="font-mono bg-muted p-2 rounded-md"><InlineMath math="v \cdot w = (2 \times -3) + (3 \times 2) = -6 + 6 = 0" /></p>
                <p>Yes, they are orthogonal! Even though it's not obvious from the numbers, these two vectors form a perfect right angle.</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Orthogonality in Data: Non-Redundant Features</CardTitle>
                <CardDescription>Now, let's translate this geometric idea into the language of data science.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>Imagine you're building a machine learning model to predict house prices. You have two features:</p>
                <ul className="list-disc pl-6">
                    <li><InlineMath math="f_1" />: Size of the house in square feet.</li>
                    <li><InlineMath math="f_2" />: Size of the house in square meters.</li>
                </ul>
                <p>These two features are almost perfectly correlated. They are redundant. If you know one, you practically know the other. As vectors in "feature space," they would point in almost the exact same direction. Their dot product would be very high.</p>
                <p>Now consider two different features:</p>
                 <ul className="list-disc pl-6">
                    <li><InlineMath math="f_1" />: Size of the house (sq. feet).</li>
                    <li><InlineMath math="f_3" />: Number of parks within a 1-mile radius.</li>
                </ul>
                <p>These two features are likely to be far more independent. Knowing the size of a house tells you very little about the number of nearby parks. They provide unique, non-overlapping information. As vectors, they would be close to orthogonal.</p>
                <div>
                    <h4 className="font-semibold text-lg">Why is this important for Quants and ML?</h4>
                    <p>Models, especially regression models, can become unstable and unreliable when their input features are highly correlated (redundant). This problem is called <strong>multicollinearity</strong>.</p>
                    <p>By transforming our data into a set of orthogonal basis vectors, we can create a set of perfectly non-redundant, independent features. This is the entire goal of powerful techniques like <strong>Principal Component Analysis (PCA)</strong>. PCA finds a new coordinate system for your data where the axes (the new features) are all orthogonal to each other.</p>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Orthonormal Bases: The Ideal Coordinate System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>We can take the idea of orthogonality one step further. What if we have a set of vectors that are all orthogonal to each other, and they all have a length (L2 norm) of exactly 1?</p>
                <p>Such a set of vectors is called an <strong>orthonormal set</strong>.</p>
                <p>The standard basis vectors in 2D, <InlineMath math="i = [1, 0]" /> and <InlineMath math="j = [0, 1]" />, are the perfect example.</p>
                <ul className="list-disc pl-6">
                    <li>They are orthogonal: <InlineMath math="[1, 0] \cdot [0, 1] = (1 \times 0) + (0 \times 1) = 0" />.</li>
                    <li>They have a length of 1: <InlineMath math="\|[1, 0]\| = 1" /> and <InlineMath math="\|[0, 1]\| = 1" />.</li>
                </ul>
                <p>Working with an orthonormal basis is the ideal scenario in linear algebra. Calculations become incredibly simple and stable. The process of taking a regular basis and turning it into an orthonormal one is called the <strong>Gram-Schmidt process</strong>, a key algorithm we will visit later.</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Summary: The Power of Perpendicular</CardTitle></CardHeader>
            <CardContent>
                 <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Orthogonal Vectors:</strong> Two vectors are orthogonal if they are at a 90° angle to each other.</li>
                    <li><strong>The Test:</strong> Their dot product is exactly zero (<InlineMath math="v \cdot w = 0" />).</li>
                    <li><strong>The Meaning:</strong> Orthogonality represents independence and non-redundancy. The vectors provide unique information and do not overlap.</li>
                    <li><strong>The Goal:</strong> Many advanced algorithms (like PCA and QR Decomposition) are fundamentally about transforming a problem into an orthonormal basis, because it makes the math simpler and the solutions more stable.</li>
                </ul>
                <p className="mt-4">Understanding orthogonality is not just about geometry; it's about understanding the structure of your data and the relationships between your features.</p>
            </CardContent>
        </Card>
      </article>
    </div>
  );
}
