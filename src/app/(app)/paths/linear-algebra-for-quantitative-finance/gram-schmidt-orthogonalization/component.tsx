
'use client';

import dynamic from "next/dynamic";
import { PageHeader } from "@/components/app/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Scaling, Code, BrainCircuit, BarChart } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';

const GramSchmidtVisualizer = dynamic(
  () => import('@/components/app/gram-schmidt-visualizer'),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-[700px] md:h-[500px]" />,
  }
);

function GramSchmidtTheory() {
  return (
    <div className="prose prose-invert max-w-none p-6 text-foreground/90">
      <p>
        The <strong>Gram-Schmidt process</strong> is a straightforward algorithm used to "tidy up" a set of linearly independent vectors. It takes a "messy" basis (where vectors might be at odd angles to each other) and systematically converts it into a "clean" <strong>orthogonal basis</strong>, where every vector is at a 90-degree angle to every other vector.
      </p>
      <p>
        This is incredibly useful in quantitative finance and data science. Orthogonal bases simplify calculations immensely. For example, in regression analysis, if your predictor variables (features) are orthogonal, it makes it much easier to understand the individual impact of each feature on the outcome.
      </p>
      <hr/>
      <h4 className="font-bold text-lg not-prose">The Two-Vector Process</h4>
      <p>Let's say we have two linearly independent vectors, <b className="text-red-400">v₁</b> and <b className="text-blue-400">v₂</b>. Here's how we create an orthogonal basis (<b className="text-yellow-400">u₁</b>, <b className="text-green-400">u₂</b>):</p>
      <ol>
        <li><strong>Step 1: The Anchor.</strong> We start by simply accepting the first vector as is. The first vector of our new basis, <b className="text-yellow-400">u₁</b>, is just <b className="text-red-400">v₁</b>.</li>
        <div className="text-center"><BlockMath math="\mathbf{u}_1 = \mathbf{v}_1" /></div>
        <li><strong>Step 2: Find the Shadow.</strong> We take the second vector, <b className="text-blue-400">v₂</b>, and find its projection onto our first new basis vector, <b className="text-yellow-400">u₁</b>. This projection is the "shadow" that <b className="text-blue-400">v₂</b> casts on the line defined by <b className="text-yellow-400">u₁</b>.</li>
        <div className="text-center"><BlockMath math="\text{proj}_{\mathbf{u}_1}(\mathbf{v}_2) = \frac{\mathbf{v}_2 \cdot \mathbf{u}_1}{\mathbf{u}_1 \cdot \mathbf{u}_1} \mathbf{u}_1" /></div>
        <li><strong>Step 3: Find the Perpendicular Part.</strong> The original vector <b className="text-blue-400">v₂</b> can be seen as the sum of its part parallel to <b className="text-yellow-400">u₁</b> (the projection) and its part perpendicular to <b className="text-yellow-400">u₁</b>. To find this perpendicular part, we simply subtract the projection from the original vector. This gives us our second orthogonal basis vector, <b className="text-green-400">u₂</b>.</li>
        <div className="text-center"><BlockMath math="\mathbf{u}_2 = \mathbf{v}_2 - \text{proj}_{\mathbf{u}_1}(\mathbf{v}_2)" /></div>
      </ol>
      <p>
        The result is a new basis (<b className="text-yellow-400">u₁</b>, <b className="text-green-400">u₂</b>) that spans the exact same space as the original basis (<b className="text-red-400">v₁</b>, <b className="text-blue-400">v₂</b>), but with the convenient property that <InlineMath math="\mathbf{u}_1 \cdot \mathbf{u}_2 = 0" />.
      </p>
    </div>
  );
}

export default function GramSchmidtPage() {
  return (
    <>
      <PageHeader
        title="Gram-Schmidt: The Art of Tidying Up"
        description="An interactive visualizer for creating an orthogonal basis from any set of linearly independent vectors."
        variant="aligned-left"
      />
      <div className="space-y-8">
        <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><Scaling className="text-primary"/> Theory</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
              <GramSchmidtTheory />
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Code className="text-primary"/> Interactive Demo</CardTitle>
            </CardHeader>
            <CardContent>
                <GramSchmidtVisualizer />
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BrainCircuit className="text-primary"/> Practice Problems</CardTitle>
            </CardHeader>
            <CardContent className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 m-6 mt-0">
                <p className="text-sm text-muted-foreground">Practice problems coming soon.</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart className="text-primary"/> Quant Finance Application</CardTitle>
            </CardHeader>
            <CardContent className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 m-6 mt-0">
                <p className="text-sm text-muted-foreground">Gram-Schmidt is used in QR decomposition, a key step in solving linear systems and performing Ordinary Least Squares (OLS) regression efficiently.</p>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
