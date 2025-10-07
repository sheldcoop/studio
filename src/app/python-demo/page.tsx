'use client'; // This page contains interactive elements, so we mark it as a client component.

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { PageHeader } from '@/components/app/page-header';

// This is the magic!
// We are dynamically importing our PyScriptComponent and explicitly disabling Server-Side Rendering (SSR).
const PyScriptComponentWithNoSSR = dynamic(
  () => import('@/components/app/PyScriptComponent'),
  { ssr: false }
);

export default function PythonDemoPage() {
  const matplotlibCode = `
import numpy as np
import matplotlib.pyplot as plt

# Generate some random data
x = np.random.randn(100)
y = np.random.randn(100)

# Create a figure and axes for the plot
fig, ax = plt.subplots()
ax.scatter(x, y, alpha=0.7)
ax.set_title("Matplotlib Scatter Plot via PyScript")
ax.set_xlabel("X value")
ax.set_ylabel("Y value")
ax.grid(True)

# Display the plot. In PyScript, the last expression in a script is automatically displayed.
fig
  `;

  return (
    <>
      <PageHeader
        title="Next.js & PyScript Integration"
        description="This page demonstrates how to safely load and run Python in a Next.js app."
        variant="aligned-left"
      />
      
      {/* This <py-config> tag is essential. It must be placed on the page before any <py-script> tags.
        It tells PyScript which Python packages to download and install from PyPI.
      */}
      <py-config>
        packages = ["numpy", "matplotlib"]
      </py-config>

      <h2>Matplotlib Chart Example</h2>
      <p>This component loads numpy and matplotlib to render a plot directly in the browser.</p>
      
      {/* Now we can safely use our client-only component */}
      <PyScriptComponentWithNoSSR pythonCode={matplotlibCode} />
    </>
  );
}
