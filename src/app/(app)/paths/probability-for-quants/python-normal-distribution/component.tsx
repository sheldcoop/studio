'use client';

import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Code } from "lucide-react";

export default function PythonNormalDistributionPage() {
  return (
    <>
      <PageHeader
        title="Probability Distribution with Python"
        description="Using Python to visualize the Normal Distribution."
        variant="aligned-left"
      />
      <div className="mx-auto max-w-5xl space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Code className="text-primary"/> Python Implementation</CardTitle>
                <CardDescription>
                    This script uses NumPy to generate the data points for a Normal Distribution's Probability Density Function (PDF) and Matplotlib to plot it.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 text-center">
                <p className="text-muted-foreground">Interactive Python runner coming soon.</p>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
