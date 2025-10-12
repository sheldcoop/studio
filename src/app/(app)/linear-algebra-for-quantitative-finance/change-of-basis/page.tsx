
import { notFound } from 'next/navigation';
import { allTopics } from '@/lib/curriculum';
import type { Metadata } from 'next';
import 'katex/dist/katex.min.css';
import { PageHeader } from '@/components/app/page-header';
import { BlockMath, InlineMath } from 'react-katex';

export async function generateMetadata(): Promise<Metadata> {
    const topicInfo = allTopics.find(t => t.id === 'change-of-basis');
    if (!topicInfo) {
        return { title: 'Topic Not Found' };
    }
    return {
        title: topicInfo.title,
        description: topicInfo.description,
    };
}

export default function ChangeOfBasisPage() {
    const topicInfo = allTopics.find(t => t.id === 'change-of-basis');
    if (!topicInfo) {
        notFound();
    }
    return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Change of Basis"
        description="Understand how to describe the same vector and transformation from different points of view."
        variant="aligned-left"
      />

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-base text-foreground/90">
        
        <h3 className="font-headline text-2xl font-bold">Part 1: The Core Idea (The "Why")</h3>
        <p>Before we learn *how* to change a basis, we need to understand *why* we'd ever want to. The reason is simple: some problems are messy from one perspective but incredibly simple from another.</p>

        <h4 className="font-headline text-xl font-bold">Topic 1: What are Coordinates? (A Set of Instructions)</h4>
        <p>You've been using coordinates your whole life. When you see the point `(3, 2)`, you know it means "start at the origin, go 3 units right, then 2 units up."</p>
        <p>But you are actually following a hidden set of instructions based on two special vectors:</p>
        <ul>
          <li><InlineMath math="\hat{i} = \begin{pmatrix} 1 \\ 0 \end{pmatrix}" /> (go 1 unit right)</li>
          <li><InlineMath math="\hat{j} = \begin{pmatrix} 0 \\ 1 \end{pmatrix}" /> (go 1 unit up)</li>
        </ul>
        <p>These two vectors form the **standard basis**. They are the default "rulers" we use to measure and describe everything in 2D space.</p>
        <p>The coordinates <InlineMath math="\begin{pmatrix} 3 \\ 2 \end{pmatrix}" /> are not the vector itself. They are instructions that say: "Take **3** of the first basis vector and add **2** of the second basis vector."</p>
        <BlockMath math="\vec{v} = 3\hat{i} + 2\hat{j} = 3\begin{pmatrix} 1 \\ 0 \end{pmatrix} + 2\begin{pmatrix} 0 \\ 1 \end{pmatrix} = \begin{pmatrix} 3 \\ 0 \end{pmatrix} + \begin{pmatrix} 0 \\ 2 \end{pmatrix} = \begin{pmatrix} 3 \\ 2 \end{pmatrix}" />
        <p><strong>Key Idea:</strong> A vector is a point in space. Its coordinates are a recipe for how to get there using a specific set of basis vectors.</p>

        <h4 className="font-headline text-xl font-bold">Topic 2: Motivation (A "Better" Perspective)</h4>
        <p>The standard basis is easy, but it's not always the best. Imagine you're programming a video game character who lives on a tilted floor.</p>
        <div className="my-4 flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 text-muted-foreground">A standard x-y grid. Overlaid on it is a new grid, tilted 45 degrees, with its own grid lines.</div>
        <p>Describing the character's movement as "right" and "up" (using <InlineMath math="\hat{i}" /> and <InlineMath math="\hat{j}" />) would be complicated. It would be much easier to describe their movement along the directions of their tilted world.</p>
        <p>To do this, we can define a **new basis** that is aligned with this tilted world. Let's call our new basis vectors <InlineMath math="\vec{b_1}" /> and <InlineMath math="\vec{b_2}" />:</p>
        <ul>
          <li><InlineMath math="\vec{b_1} = \begin{pmatrix} 1 \\ 1 \end{pmatrix}" /> (This is our "new right")</li>
          <li><InlineMath math="\vec{b_2} = \begin{pmatrix} -1 \\ 1 \end{pmatrix}" /> (This is our "new up")</li>
        </ul>
        <p>Now we have two "languages" to describe any point in space:</p>
        <ol>
          <li>**The Standard Language:** Using combinations of <InlineMath math="\hat{i}" /> and <InlineMath math="\hat{j}" />.</li>
          <li>**The "Tilted" Language:** Using combinations of <InlineMath math="\vec{b_1}" /> and <InlineMath math="\vec{b_2}" />.</li>
        </ol>
        <p><strong>The Central Question:</strong> If we have a vector in the standard language, like <InlineMath math="\vec{v} = \begin{pmatrix} 2 \\ 4 \end{pmatrix}" />, how can we translate its coordinates into the "tilted" language? This translation is the **change of basis**.</p>
        
        <hr />

        <h3 className="font-headline text-2xl font-bold">Part 2: The Mechanics (The "How")</h3>
        <p>Now let's build the mathematical tools to perform this translation.</p>

        <h4 className="font-headline text-xl font-bold">Topic 3: The Change of Basis Matrix (P) - The Translator</h4>
        <p>To translate between languages, you need a dictionary. In linear algebra, this dictionary is a matrix.</p>
        <p>The **change of basis matrix**, which we'll call `P`, is the matrix whose columns are your new basis vectors.</p>
        <p>For our tilted basis, the matrix `P` is:</p>
        <BlockMath math="P = \begin{pmatrix} \vec{b_1} & \vec{b_2} \end{pmatrix} = \begin{pmatrix} 1 & -1 \\ 1 & 1 \end{pmatrix}" />
        <p>This matrix knows everything about the tilted world's relationship to the standard world.</p>
        <p><strong>"Easy" Direction: Translating from the New Basis TO the Standard Basis</strong></p>
        <p>Let's say a character in our game has coordinates <InlineMath math="\begin{pmatrix} 3 \\ 1 \end{pmatrix}_{new}" /> in the tilted world. The subscript "new" reminds us which language we're using.</p>
        <p>What does this mean? It's a recipe: "Take **3** of the first tilted basis vector and add **1** of the second."</p>
        <BlockMath math="3\vec{b_1} + 1\vec{b_2} = 3\begin{pmatrix} 1 \\ 1 \end{pmatrix} + 1\begin{pmatrix} -1 \\ 1 \end{pmatrix} = \begin{pmatrix} 3 \\ 3 \end{pmatrix} + \begin{pmatrix} -1 \\ 1 \end{pmatrix} = \begin{pmatrix} 2 \\ 4 \end{pmatrix}_{std}" />
        <p>The matrix `P` does this for us automatically! This is the formula:</p>
        <BlockMath math="[v]_{std} = P \cdot [v]_{new}" />
        <p>Let's check:</p>
        <BlockMath math="[v]_{std} = \begin{pmatrix} 1 & -1 \\ 1 & 1 \end{pmatrix} \begin{pmatrix} 3 \\ 1 \end{pmatrix} = \begin{pmatrix} (1)(3) + (-1)(1) \\ (1)(3) + (1)(1) \end{pmatrix} = \begin{pmatrix} 2 \\ 4 \end{pmatrix}_{std}" />
        <p>It works perfectly!</p>

        <h4 className="font-headline text-xl font-bold">Topic 4: The Inverse Change of Basis Matrix (P⁻¹) - The Reverse Translator</h4>
        <p>This is the more common and powerful task: translating from the Standard Basis TO the New Basis.</p>
        <p>We have the equation: <InlineMath math="[v]_{std} = P \cdot [v]_{new}" />. To find the new coordinates, <InlineMath math="[v]_{new}" />, we need to "undo" `P`. We do this by multiplying by the inverse matrix, `P⁻¹`.</p>
        <BlockMath math="[v]_{new} = P^{-1} \cdot [v]_{std}" />
        <p>Let's find the inverse of our matrix <InlineMath math="P = \begin{pmatrix} 1 & -1 \\ 1 & 1 \end{pmatrix}" />.</p>
        <p>For a 2x2 matrix, the inverse is <InlineMath math="\frac{1}{ad-bc}\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}" />.</p>
        <BlockMath math="P^{-1} = \frac{1}{(1)(1) - (-1)(1)} \begin{pmatrix} 1 & 1 \\ -1 & 1 \end{pmatrix} = \frac{1}{2} \begin{pmatrix} 1 & 1 \\ -1 & 1 \end{pmatrix}" />
        <p>Now we can answer our original question: What are the coordinates of the standard vector <InlineMath math="\vec{v} = \begin{pmatrix} 2 \\ 4 \end{pmatrix}_{std}" /> in our tilted basis?</p>
        <BlockMath math="[v]_{new} = \frac{1}{2} \begin{pmatrix} 1 & 1 \\ -1 & 1 \end{pmatrix} \begin{pmatrix} 2 \\ 4 \end{pmatrix} = \frac{1}{2} \begin{pmatrix} (1)(2) + (1)(4) \\ (-1)(2) + (1)(4) \end{pmatrix} = \frac{1}{2} \begin{pmatrix} 6 \\ 2 \end{pmatrix} = \begin{pmatrix} 3 \\ 1 \end{pmatrix}_{new}" />
        <p>This tells us that the standard point (2, 4) is described by the coordinates (3, 1) in our tilted language. It means "to get there, take 3 steps in the <InlineMath math="\vec{b_1}" /> direction and 1 step in the <InlineMath math="\vec{b_2}" /> direction."</p>

        <hr />

        <h3 className="font-headline text-2xl font-bold">Part 3: The Application (The Connection to Matrices)</h3>
        <p>The true power of changing basis comes when we apply it to transformations (matrices).</p>
        
        <h4 className="font-headline text-xl font-bold">Topic 5: Changing the Basis of a Transformation</h4>
        <p>A matrix, let's call it `A`, represents an *action* in the standard basis (e.g., a rotation, a shear, a projection).</p>
        <p>Let's say we have a simple "shear" transformation in the standard basis: <InlineMath math="A = \begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix}" />. This matrix pushes the top of things to the right.</p>
        <p>The action itself—the shear—is a pure geometric concept. The matrix `A` is just its *description in the standard language*. What would the matrix for this *exact same shear* look like if we were to describe it in our tilted basis language?</p>
        <p>We'll call this new description `D`. The formula to find it is called a **similarity transformation**.</p>
        <BlockMath math="D = P^{-1}AP" />
        <p>Let's break down the intuition for this formula by reading it from right to left (the order of operations):</p>
        <ol>
          <li>**`P`:** First, translate the vector into the standard language. (<InlineMath math="P[v]_{new}" />)</li>
          <li>**`A`:** Second, apply the standard shear transformation. (<InlineMath math="A(P[v]_{new})" />)</li>
          <li>**`P⁻¹`:** Finally, translate the result back into the tilted language. (<InlineMath math="P^{-1}(AP[v]_{new})" />)</li>
        </ol>
        <p>The resulting matrix `D` performs this entire sequence of actions in one step. It's the matrix for the shear *from the point of view of the tilted basis*.</p>
        <p>Let's calculate it for our example:</p>
        <BlockMath math="D = \underbrace{\left( \frac{1}{2} \begin{pmatrix} 1 & 1 \\ -1 & 1 \end{pmatrix} \right)}_{P^{-1}} \underbrace{\left( \begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix} \right)}_{A} \underbrace{\left( \begin{pmatrix} 1 & -1 \\ 1 & 1 \end{pmatrix} \right)}_{P}" />
        <p>First, multiply <InlineMath math="AP" />:</p>
        <BlockMath math="AP = \begin{pmatrix} 1 & 1 \\ 0 & 1 \end{pmatrix} \begin{pmatrix} 1 & -1 \\ 1 & 1 \end{pmatrix} = \begin{pmatrix} 2 & 0 \\ 1 & 1 \end{pmatrix}" />
        <p>Now, multiply by <InlineMath math="P^{-1}" />:</p>
        <BlockMath math="D = \frac{1}{2} \begin{pmatrix} 1 & 1 \\ -1 & 1 \end{pmatrix} \begin{pmatrix} 2 & 0 \\ 1 & 1 \end{pmatrix} = \frac{1}{2} \begin{pmatrix} 3 & 1 \\ -1 & 1 \end{pmatrix} = \begin{pmatrix} 1.5 & 0.5 \\ -0.5 & 0.5 \end{pmatrix}" />
        <p><strong>Conclusion:</strong> The matrix <InlineMath math="D = \begin{pmatrix} 1.5 & 0.5 \\ -0.5 & 0.5 \end{pmatrix}" /> looks complicated, but it performs the **exact same shear** as our simple matrix `A`. It is simply the description of that action from the perspective of someone living in the tilted world.</p>
        <p>This idea is the key to matrix decomposition (like diagonalization), where the goal is to find a special basis (the eigenvectors) where the transformation `D` becomes incredibly simple—a diagonal matrix.</p>

      </div>
    </div>
  );
}
