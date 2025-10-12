'use client';

import 'katex/dist/katex.min.css';
import { PageHeader } from '@/components/app/page-header';
import { BlockMath, InlineMath } from 'react-katex';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ModuleCard = ({
  title,
  time,
  children,
}: {
  title: string;
  time: string;
  children: React.ReactNode;
}) => (
  <Card>
    <CardHeader>
      <div className="flex justify-between items-baseline">
        <CardTitle className="font-headline text-2xl">{title}</CardTitle>
        <span className="text-sm text-muted-foreground">{time}</span>
      </div>
    </CardHeader>
    <CardContent>
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-4 text-base text-foreground/90">
        {children}
      </div>
    </CardContent>
  </Card>
);

export default function VectorsAndVectorSpacesComponent() {
  return (
    <div className="mx-auto max-w-5xl space-y-12">
      <PageHeader
        title="Vectors & Vector Spaces"
        description="The fundamental building blocks of linear algebra."
        variant="aligned-left"
      />

      <ModuleCard title="Module 1: Vector Basics" time="~15 min">
        <h4 className="font-semibold text-primary">
          Introduction: More Than Just a Number
        </h4>
        <p>
          Welcome to the world of linear algebra! Before we can understand
          complex topics like subspaces, we need to start with the single most
          important building block: the <strong>vector</strong>.
        </p>
        <p>
          In everyday life, we use single numbers, called <strong>scalars</strong>, to
          describe many things: your age, your height, the temperature outside.
          But what if you need to describe something that has both a{' '}
          <em>size</em> and a <em>direction</em>? For that, we need vectors.
        </p>
        <h4 className="font-semibold text-primary">What is a Vector?</h4>
        <p>
          A vector is an object that has two key properties:
        </p>
        <ol className="list-decimal pl-6">
          <li>
            <strong>Magnitude:</strong> Its size, length, or strength.
          </li>
          <li>
            <strong>Direction:</strong> The way it points in space.
          </li>
        </ol>
        <p>Think of a vector as an <strong>arrow</strong>. The arrow's length represents its magnitude, and the way it points is its direction.</p>
        <ul className="list-disc pl-6">
          <li>
            <strong>Example 1: Giving Directions.</strong> If you tell a friend
            to "walk for 1 mile," they'll ask, "In which direction?" But if you
            say, "Walk 1 mile Northeast," you've given them a vector.
          </li>
          <li>
            <strong>Example 2: Physics.</strong> The force of gravity isn't
            just "strong"; it's a strong force pulling <em>downwards</em>. That's a
            vector.
          </li>
        </ul>
        <h4 className="font-semibold text-primary">
          Representing Vectors with Numbers
        </h4>
        <p>
          To do math with vectors, we place them on a coordinate system. We
          describe a vector by how far it travels along each axis (x, y, z,
          etc.). We write these numbers in a column.
        </p>
        <h5>In 2D Space (<InlineMath math="\mathbb{R}^2" />):</h5>
        <p>
          Let's look at the vector{' '}
          <InlineMath math="\vec{v} = \begin{pmatrix} 4 \\ 2 \end{pmatrix}" />.
        </p>
        <ul className="list-disc pl-6">
          <li>The top number is the <strong>x-component</strong>. It tells us to move 4 units to the right.</li>
          <li>The bottom number is the <strong>y-component</strong>. It tells us to move 2 units up.</li>
        </ul>
        <div className="my-4 flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 text-muted-foreground">
          [Image/Animation Placeholder: A 2D coordinate plane. An arrow starts at the origin (0,0) and its tip points to the coordinate (4,2). The horizontal and vertical components (4 and 2) are highlighted.]
        </div>
        <p>
          <strong>Important Note:</strong> A vector's identity is its magnitude
          and direction only. It doesn't matter where it starts. The arrow from
          (0,0) to (4,2) is the <em>exact same vector</em> as an arrow from
          (5,5) to (9,7). For simplicity, we almost always draw them starting
          from the origin.
        </p>
        <h5>In 3D Space (<InlineMath math="\mathbb{R}^3" />):</h5>
        <p>
          We just add a third component for the z-axis. The vector{' '}
          <InlineMath math="\vec{w} = \begin{pmatrix} 3 \\ 4 \\ 5 \end{pmatrix}" />{' '}
          means:
        </p>
        <ul className="list-disc pl-6">
            <li>Move 3 units along the x-axis.</li>
            <li>Move 4 units along the y-axis.</li>
            <li>Move 5 units up the z-axis.</li>
        </ul>
        <h4 className="font-semibold text-primary">Key Takeaway</h4>
        <p>
          A vector is an arrow in space. We represent it numerically as a column
          of numbers, where each number tells us how far to move along an axis.
        </p>
      </ModuleCard>

      <ModuleCard title="Module 2: Vector Operations" time="~15 min">
        <h4 className="font-semibold text-primary">
          Introduction: Making Vectors Work
        </h4>
        <p>
          In the last module, we learned that vectors are arrows with magnitude
          and direction. Now, let's explore the "verbs" of linear algebra—the
          actions we can perform with vectors. There are only two fundamental
          operations, and they are incredibly intuitive.
        </p>
        <h4 className="font-semibold text-primary">
          1. Vector Addition (Combining Journeys)
        </h4>
        <p>
          Imagine you walk along one vector, then another. Vector addition finds
          the single vector that represents the total journey—the shortcut from
          start to finish.
        </p>
        <h5>The Geometry (The "Head-to-Tail" Rule):</h5>
        <ol className="list-decimal pl-6">
            <li>Draw the first vector.</li>
            <li>Place the <strong>tail</strong> (start) of the second vector at the <strong>head</strong> (tip) of the first one.</li>
            <li>The result is the new arrow from the tail of the first vector to the head of the second.</li>
        </ol>
        <p>
          Example: Let's add{' '}
          <InlineMath math="\vec{u} = \begin{pmatrix} 4 \\ 1 \end{pmatrix}" />{' '}
          and <InlineMath math="\vec{v} = \begin{pmatrix} 1 \\ 3 \end{pmatrix}" />.
        </p>
        <div className="my-4 flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 text-muted-foreground">
          [Image/Animation Placeholder: An animation showing vector u drawn from (0,0) to (4,1). Then, vector v is drawn starting from (4,1) and ending at (5,4). Finally, the resultant vector u+v appears, drawn directly from (0,0) to (5,4).]
        </div>
        <h5>The Calculation (Component-Wise Addition):</h5>
        <p>To add vectors, simply add their corresponding components.</p>
        <div className="text-center"><BlockMath math="\vec{u} + \vec{v} = \begin{pmatrix} 4 \\ 1 \end{pmatrix} + \begin{pmatrix} 1 \\ 3 \end{pmatrix} = \begin{pmatrix} 4+1 \\ 1+3 \end{pmatrix} = \begin{pmatrix} 5 \\ 4 \end{pmatrix}" /></div>
        <p>The calculation perfectly confirms our geometric shortcut!</p>
        
        <h4 className="font-semibold text-primary">
          2. Scalar Multiplication (Resizing and Flipping)
        </h4>
        <p>A <strong>scalar</strong> is just a regular number. Multiplying a vector by a scalar resizes its magnitude.</p>
        <h5>The Geometry (Stretching and Shrinking):</h5>
        <p>Let's take a vector <InlineMath math="\vec{w} = \begin{pmatrix} 2 \\ 3 \end{pmatrix}" />.</p>
        <ul className="list-disc pl-6">
            <li>Multiplying by a number &gt; 1 <strong>stretches</strong> it. (<InlineMath math="2\vec{w}" /> is twice as long).</li>
            <li>Multiplying by a number between 0 and 1 <strong>shrinks</strong> it. (<InlineMath math="0.5\vec{w}" /> is half as long).</li>
            <li>Multiplying by a negative number <strong>flips its direction</strong>. (<InlineMath math="-1\vec{w}" /> points the opposite way).</li>
        </ul>
        <div className="my-4 flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 text-muted-foreground">
          [Image/Animation Placeholder: Show the vector w from (0,0) to (2,3). Then, show vectors 2w, 0.5w, and -w on the same graph to compare their lengths and directions.]
        </div>
        <h5>The Calculation (Distribute and Multiply):</h5>
        <p>Multiply every component inside the vector by the scalar.</p>
        <ul className="list-disc pl-6">
            <li><InlineMath math="2\vec{w} = 2 \begin{pmatrix} 2 \\ 3 \end{pmatrix} = \begin{pmatrix} 2 \times 2 \\ 2 \times 3 \end{pmatrix} = \begin{pmatrix} 4 \\ 6 \end{pmatrix}" /></li>
            <li><InlineMath math="-1\vec{w} = -1 \begin{pmatrix} 2 \\ 3 \end{pmatrix} = \begin{pmatrix} -1 \times 2 \\ -1 \times 3 \end{pmatrix} = \begin{pmatrix} -2 \\ -3 \end{pmatrix}" /></li>
        </ul>

        <h4 className="font-semibold text-primary">Key Takeaway</h4>
        <p>We can combine vectors through addition (head-to-tail) and resize them with scalar multiplication.</p>
      </ModuleCard>

      <ModuleCard title="Module 3: Linear Combinations & Span" time="~15 min">
        <h4 className="font-semibold text-primary">
          Introduction: The Power of Combination
        </h4>
        <p>
            We've learned vector addition and scalar multiplication. Now, we combine them. This combination is the engine that drives all of linear algebra.
        </p>
        <h4 className="font-semibold text-primary">What is a Linear Combination?</h4>
        <p>
            A linear combination is what you get when you scale up a few vectors and add them all together.
        </p>
        <p>
            That's it! If you have vectors <InlineMath math="\vec{v_1}, \vec{v_2}, ..., \vec{v_n}" /> and scalars <InlineMath math="c_1, c_2, ..., c_n" />, then a linear combination looks like this:
        </p>
        <div className="text-center"><BlockMath math="c_1\vec{v_1} + c_2\vec{v_2} + ... + c_n\vec{v_n}" /></div>
        <h5>Example:</h5>
        <p>
            Let <InlineMath math="\vec{v_1} = \begin{pmatrix} 1 \\ 1 \end{pmatrix}" /> and <InlineMath math="\vec{v_2} = \begin{pmatrix} -1 \\ 2 \end{pmatrix}" />. Let's calculate the linear combination where <InlineMath math="c_1=3" /> and <InlineMath math="c_2=2" />.
        </p>
        <div className="text-center"><BlockMath math="3\vec{v_1} + 2\vec{v_2} = 3\begin{pmatrix} 1 \\ 1 \end{pmatrix} + 2\begin{pmatrix} -1 \\ 2 \end{pmatrix} = \begin{pmatrix} 3 \\ 3 \end{pmatrix} + \begin{pmatrix} -2 \\ 4 \end{pmatrix} = \begin{pmatrix} 1 \\ 7 \end{pmatrix}" /></div>
        <p>The vector <InlineMath math="\begin{pmatrix} 1 \\ 7 \end{pmatrix}" /> is a linear combination of <InlineMath math="\vec{v_1}" /> and <InlineMath math="\vec{v_2}" />.</p>
        
        <h4 className="font-semibold text-primary">The Big Question: What Can We Create?</h4>
        <p>
            This leads to the most important concept in this module: <strong>Span</strong>.
        </p>
        <p>
            The <strong>span</strong> of a set of vectors is the set of <strong>ALL</strong> possible linear combinations you can create from them. It's the answer to the question: "If these are my only building blocks, where can I get to?"
        </p>
        <h5>Geometric Intuition of Span:</h5>
        <ol className="list-decimal pl-6">
            <li>
                <strong>The Span of ONE Vector:</strong>
                <p>Let's say you only have one vector, <InlineMath math="\vec{v} = \begin{pmatrix} 2 \\ 1 \end{pmatrix}" />. What is its span?
                You can multiply it by any scalar c. You can make <InlineMath math="2\vec{v}" />, <InlineMath math="-1.5\vec{v}" />, <InlineMath math="100\vec{v}" />, etc. All of these resulting vectors lie on the <strong>same infinite line</strong> that passes through the origin and the point (2,1).</p>
                <ul className="list-disc pl-6"><li><strong>Conclusion:</strong> The span of a single non-zero vector is a <strong>line</strong>.</li></ul>
                <div className="my-4 flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 text-muted-foreground">
                  [Image/Animation Placeholder: Show vector v. Then, animate different scalar multiples of v appearing, all on the same line, demonstrating that the line is the span.]
                </div>
            </li>
            <li>
                <strong>The Span of TWO Vectors:</strong>
                <p>Now let's use two vectors, <InlineMath math="\vec{v_1} = \begin{pmatrix} 1 \\ 0 \end{pmatrix}" /> and <InlineMath math="\vec{v_2} = \begin{pmatrix} 0 \\ 1 \end{pmatrix}" />.
                By scaling <InlineMath math="\vec{v_1}" />, we can move anywhere along the x-axis. By scaling <InlineMath math="\vec{v_2}" />, we can move anywhere along the y-axis. By adding them together, we can reach <strong>any point in the entire 2D plane</strong>. For example, to get to <InlineMath math="\begin{pmatrix} 7 \\ -3 \end{pmatrix}" />, you just take <InlineMath math="7\vec{v_1} - 3\vec{v_2}" />.</p>
                <ul className="list-disc pl-6"><li><strong>Conclusion:</strong> The span of two linearly independent vectors (vectors that don't lie on the same line) in <InlineMath math="\mathbb{R}^2" /> is the <strong>entire 2D plane</strong>.</li></ul>
                 <div className="my-4 flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 text-muted-foreground">
                  [Image/Animation Placeholder: Show v1 and v2. Animate a point moving around the 2D plane, with lines showing how it's a combination of some multiple of v1 plus some multiple of v2.]
                </div>
            </li>
        </ol>
        <h5>A Special Case: Redundant Vectors</h5>
        <p>
            What if we try to span <InlineMath math="\mathbb{R}^2" /> with <InlineMath math="\vec{v_1} = \begin{pmatrix} 2 \\ 1 \end{pmatrix}" /> and <InlineMath math="\vec{v_2} = \begin{pmatrix} 4 \\ 2 \end{pmatrix}" />?
            Notice that <InlineMath math="\vec{v_2}" /> is just <InlineMath math="2\vec{v_1}" />. It points in the same direction. The second vector adds no new direction. All of their linear combinations will still be stuck on the same line. The second vector was redundant. We call such vectors <strong>linearly dependent</strong>.
        </p>
        <h4 className="font-semibold text-primary">Key Takeaway</h4>
        <p>Span is the set of all reachable points. A few good vectors can "span" an entire space, like a line or a plane.</p>
      </ModuleCard>

       <ModuleCard title="Module 4: Defining a Vector Space" time="~15 min">
        <h4 className="font-semibold text-primary">
          Introduction: The Rules of the Playground
        </h4>
        <p>
            We've been using terms like "2D space" and "3D space" intuitively. But what makes a set of vectors a true <strong>vector space</strong>? It's not just any random collection of vectors. A vector space is a "playground" with two unbreakable rules that ensure it is self-contained.
        </p>
        <h4 className="font-semibold text-primary">The Two Golden Rules: Closure</h4>
        <p>
            For a set of vectors to be a vector space, it must be <strong>closed</strong> under both vector addition and scalar multiplication. "Closed" means that when you perform an operation, the result is guaranteed to land back <em>inside</em> the original set. You can't escape.
        </p>
        <ol className="list-decimal pl-6">
            <li>
                <strong>Rule #1: Closure Under Addition.</strong>
                <p>If you take <em>any</em> two vectors <InlineMath math="\vec{u}" /> and <InlineMath math="\vec{v}" /> that are in the set and add them, their sum <InlineMath math="\vec{u}+\vec{v}" /> must also be in the set.</p>
            </li>
            <li>
                <strong>Rule #2: Closure Under Scalar Multiplication.</strong>
                <p>If you take <em>any</em> vector <InlineMath math="\vec{u}" /> from the set and multiply it by <em>any</em> scalar <InlineMath math="c" />, the resulting vector <InlineMath math="c\vec{u}" /> must also be in the set.</p>
            </li>
        </ol>
        <h5>Example 1: The Ultimate Vector Space, <InlineMath math="\mathbb{R}^2" /></h5>
        <ul className="list-disc pl-6">
            <li><strong>Addition Check:</strong> If you add any two vectors in the 2D plane, is the result still in the 2D plane? Yes.</li>
            <li><strong>Scalar Multiplication Check:</strong> If you take any vector in the 2D plane and stretch, shrink, or flip it, is it still in the 2D plane? Yes.</li>
            <li><strong>Conclusion:</strong> <InlineMath math="\mathbb{R}^2" /> is a vector space. (The same is true for <InlineMath math="\mathbb{R}^3" />, <InlineMath math="\mathbb{R}^4" />, etc.)</li>
        </ul>
        <h5>Example 2 (A Counter-Example): The First Quadrant</h5>
        <p>
            Let's define a set S as all vectors <InlineMath math="\begin{pmatrix} x \\ y \end{pmatrix}" /> where <InlineMath math="x \ge 0" /> and <InlineMath math="y \ge 0" />. Is S a vector space?
        </p>
        <ul className="list-disc pl-6">
            <li><strong>Addition Check:</strong> If we add two vectors with positive components, the result will have positive components. So, <InlineMath math="\begin{pmatrix} 1 \\ 2 \end{pmatrix} + \begin{pmatrix} 3 \\ 1 \end{pmatrix} = \begin{pmatrix} 4 \\ 3 \end{pmatrix}" />. This rule holds. The set is closed under addition.</li>
            <li><strong>Scalar Multiplication Check:</strong> Let's take a vector from the set, <InlineMath math="\vec{u} = \begin{pmatrix} 1 \\ 2 \end{pmatrix}" />, and multiply it by a negative scalar, like <InlineMath math="c = -3" />.
            <br/><InlineMath math="-3\vec{u} = -3\begin{pmatrix} 1 \\ 2 \end{pmatrix} = \begin{pmatrix} -3 \\ -6 \end{pmatrix}" />.
            <br/>The result has negative components, so it is <strong>not</strong> in our set S.</li>
            <li><strong>Conclusion:</strong> The set S is <strong>NOT</strong> a vector space because it failed the closure test for scalar multiplication.</li>
        </ul>
        <h4 className="font-semibold text-primary">What is a Subspace?</h4>
        <p>This is the key connection to our main goal. A <strong>subspace</strong> is simply a vector space that lives <em>inside</em> a larger vector space.</p>
        <p>Think about <InlineMath math="\mathbb{R}^3" /> (all of 3D space).</p>
        <ul className="list-disc pl-6">
            <li>Is a <strong>plane through the origin</strong> a subspace? Yes! (Passes both closure rules).</li>
            <li>Is a <strong>line through the origin</strong> a subspace? Yes! (Passes both closure rules).</li>
        </ul>
        <p><strong>Crucial Note:</strong> A subspace <strong>MUST</strong> contain the zero vector <InlineMath math="\vec{0}" />. Why? Because of rule #2. If you take any vector <InlineMath math="\vec{v}" /> in the space, you must be able to multiply it by the scalar 0. And <InlineMath math="0\vec{v} = \vec{0}" />. So the zero vector must be in the set. This is a great quick check: if a set doesn't contain the origin, it's not a subspace.</p>
        
        <h4 className="font-semibold text-primary">Final Summary</h4>
        <p>You have successfully built the foundation of linear algebra! You now know that:</p>
        <ul className="list-disc pl-6">
            <li><strong>Vectors</strong> are arrows with magnitude and direction.</li>
            <li><strong>Operations</strong> let us add and scale vectors.</li>
            <li><strong>Span</strong> is the set of everything we can build with our vectors.</li>
            <li><strong>Vector Spaces</strong> (and <strong>Subspaces</strong>) are the self-contained "playgrounds" where these rules apply, like lines and planes through the origin.</li>
        </ul>
      </ModuleCard>
    </div>
  );
}
