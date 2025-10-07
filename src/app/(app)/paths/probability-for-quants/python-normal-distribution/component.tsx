
'use client';

import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PyScriptRunner } from "@/components/app/pyscript-runner";
import { Code } from "lucide-react";

const pythonCode = `
import matplotlib.pyplot as plt
import numpy as np
from pyscript import display

# Define parameters for the normal distribution
mu = 0  # mean
sigma = 1  # standard deviation
x = np.linspace(mu - 3*sigma, mu + 3*sigma, 100)
pdf = (1/(sigma * np.sqrt(2 * np.pi))) * np.exp(-0.5 * ((x - mu)/sigma)**2)

# Create the plot
fig, ax = plt.subplots(figsize=(8, 4))
ax.plot(x, pdf, label=f"μ={mu}, σ={sigma}")
ax.set_title("Normal Distribution PDF")
ax.set_xlabel("Value")
ax.set_ylabel("Density")
ax.grid(True)
ax.legend()

# Display the plot in the specified HTML element
display(fig, target="normal-dist-output")
`;

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
                    This script uses NumPy to generate the data points for a Normal Distribution's Probability Density Function (PDF) and Matplotlib to plot it. Click "Run" to execute the code in your browser.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <PyScriptRunner 
                    code={pythonCode}
                    outputId="normal-dist-output"
                    title="Normal Distribution Plot"
                />
            </CardContent>
        </Card>
      </div>
    </>
  );
}
