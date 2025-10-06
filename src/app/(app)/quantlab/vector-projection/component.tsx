
'use client';

import dynamic from "next/dynamic";
import { PageHeader } from "@/components/app/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Scaling, Code, BrainCircuit, BarChart } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';

// This component is ALREADY dynamically imported by the [slug] page.
// The dynamic import for the visualizer itself should be here.
const VectorProjectionVisualizer = dynamic(
  () => import('@/components/app/vector-projection-visualizer'),
  {
    ssr: false,
    loading: () => <Skeleton className="w-full h-[700px] md:h-[500px]" />,
  }
);

function VectorProjectionTheory() {
  return (
    <div className="prose prose-invert max-w-none p-6 text-foreground/90">
      <p>
        Imagine you have two vectors, <b className="text-green-300">a</b> and <b className="text-blue-300">b</b>. The <strong>vector projection</strong> of <b className="text-green-300">a</b> onto <b className="text-blue-300">b</b> is like finding the "shadow" that vector <b className="text-green-300">a</b> would cast on the line defined by vector <b className="text-blue-300">b</b> if there were a light source shining from directly above.
      </p>
      <p>
        This "shadow" vector, denoted as <b className="text-red-300">proj</b><sub><b className="text-blue-300">b</b></sub>(<b className="text-green-300">a</b>), has two key properties:
      </p>
      <ol>
        <li>It points in the exact same (or opposite) direction as vector <b className="text-blue-300">b</b>.</li>
        <li>The line connecting the tip of vector <b className="text-green-300">a</b> to the tip of the projection vector is perpendicular (orthogonal) to vector <b className="text-blue-300">b</b>.</li>
      </ol>
      <p>
        To calculate it, we first find a scalar value that tells us how long the shadow is relative to <b className="text-blue-300">b</b>. This scalar is found by calculating the dot product of <b className="text-green-300">a</b> and <b className="text-blue-300">b</b>, and then dividing by the squared length of <b className="text-blue-300">b</b>.
      </p>
       <div className="text-center"><BlockMath math="\text{scalar} = \frac{\mathbf{a} \cdot \mathbf{b}}{\mathbf{b} \cdot \mathbf{b}} = \frac{\mathbf{a} \cdot \mathbf{b}}{\|\mathbf{b}\|^2}" /></div>
       <p>
        Once we have this scalar, we simply multiply it by vector <b className="text-blue-300">b</b> to get the final projection vector.
       </p>
        <div className="text-center"><BlockMath math="\text{proj}_{\mathbf{b}}(\mathbf{a}) = \left( \frac{\mathbf{a} \cdot \mathbf{b}}{\mathbf{b} \cdot \mathbf{b}} \right) \mathbf{b}" /></div>
    </div>
  );
}

export default function VectorProjectionComponent() {
  return (
    <>
      <PageHeader
        title="Vector Projection: The Story of a Shadow"
        description="Understand how to decompose vectors into orthogonal components by visualizing them as shadows."
        variant="aligned-left"
      />
      <div className="space-y-8">
        <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2"><Scaling className="text-primary"/> Theory</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
              <VectorProjectionTheory />
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Code className="text-primary"/> Interactive Demo</CardTitle>
            </CardHeader>
            <CardContent>
                <VectorProjectionVisualizer />
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
                <p className="text-sm text-muted-foreground">In finance, projecting a stock's returns onto the market's returns is a key part of calculating its <b>beta</b> in the Capital Asset Pricing Model (CAPM).</p>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
