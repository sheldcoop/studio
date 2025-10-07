
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const PyScriptComponentWithNoSSR = dynamic(
  () => import('@/components/app/PyScriptComponent'),
  { ssr: false }
);

interface PyScriptRunnerProps {
  matrix: number[][];
  vector: number[];
  operation: 'lu' | 'cholesky' | 'qr';
  outputId: string;
}

export function PyScriptRunner({ matrix, vector, operation, outputId }: PyScriptRunnerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [isPyScriptReady, setIsPyScriptReady] = useState(false);

  const matrixStr = JSON.stringify(matrix);
  const vectorStr = JSON.stringify(vector);

  let pythonCode = '';
  switch (operation) {
    case 'qr':
      pythonCode = `
import numpy as np
from pyscript import display

# --- QR Decomposition for Least Squares ---
# Overdetermined system Ax = b
A = np.array(${matrixStr})
b = np.array(${vectorStr})

output = "<h3>Solving Ax = b for the least-squares solution using QR Decomposition</h3>"
output += f"<p><b>Matrix A:</b><br>{A}</p>"
output += f"<p><b>Vector b:</b><br>{b}</p>"

# 1. Decompose A into Q and R
Q, R = np.linalg.qr(A)
output += "<h4>1. Decompose A into Q and R:</h4>"
output += f"<p><b>Q (Orthogonal Matrix):</b><br>{np.round(Q, 4)}</p>"
output += f"<p><b>R (Upper Triangular Matrix):</b><br>{np.round(R, 4)}</p>"

# 2. Transform b into Q.T * b
b_transformed = Q.T @ b
output += f"<h4>2. Solve Rx = Q<sup>T</sup>b:</h4>"
output += f"<p><b>Q<sup>T</sup>b =</b> {np.round(b_transformed, 4)}</p>"

# 3. Solve the simple upper triangular system Rx = (Q.T*b) for x
try:
    x = np.linalg.solve(R, b_transformed)
    output += f"<h4>3. Least Squares Solution x̂:</h4><p><b>x̂ =</b> {np.round(x, 4)}</p>"
except np.linalg.LinAlgError:
    output += "<h4>3. Could not solve system. Matrix R is singular.</h4>"


display(output, target="${outputId}", append=False)
`;
      break;
    // Other cases for lu, cholesky would go here
  }

  return (
    <div>
        <pre className="p-4 rounded-lg bg-muted/50 text-sm overflow-x-auto mb-4">
            <code className="language-python whitespace-pre-wrap">{pythonCode.trim()}</code>
        </pre>
        <div id="pyscript-container" className="hidden">
            <PyScriptComponentWithNoSSR pythonCode={pythonCode} />
        </div>
        <pre id={outputId} className="mt-4 p-4 rounded-lg bg-muted/50 text-sm overflow-x-auto min-h-[100px] whitespace-pre-wrap">
          Python Output...
        </pre>
    </div>
  );
}

