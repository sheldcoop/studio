
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Loader2, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Dynamically import the core PyScript component to ensure it only runs on the client.
const PyScriptComponentWithNoSSR = dynamic(
  () => import('@/components/app/PyScriptComponent'),
  { 
    ssr: false,
    loading: () => <div className="flex justify-center items-center h-24"><Loader2 className="h-6 w-6 animate-spin"/></div>
  }
);

interface PyScriptRunnerProps {
  matrix: number[][];
  vector: number[];
  operation: 'lu' | 'qr' | 'cholesky';
  outputId: string;
}

export function PyScriptRunner({ matrix, vector, operation, outputId }: PyScriptRunnerProps) {
  const [isPyScriptReady, setIsPyScriptReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // A simple way to check if PyScript has loaded is to see if its global object exists.
    // We add a listener to an event that PyScript itself dispatches when ready.
    const onPyScriptReady = () => setIsPyScriptReady(true);
    window.addEventListener('py:ready', onPyScriptReady);
    
    // If PyScript is already on the page (from another component), set ready immediately.
    if ((window as any).pyscript) {
      setIsPyScriptReady(true);
    }
    
    return () => window.removeEventListener('py:ready', onPyScriptReady);
  }, []);

  // Generate the Python code dynamically based on the props
  const pythonCode = `
import numpy as np
from pyscript import document
from scipy.linalg import lu_factor, lu_solve, cholesky, cho_solve

def solve_decomposition(event):
    A = np.array(${JSON.stringify(matrix)})
    b = np.array(${JSON.stringify(vector)})
    output_element = document.querySelector("#${outputId}")
    operation = "${operation}"

    try:
        output = ""
        if operation == "lu":
            lu, piv = lu_factor(A)
            x = lu_solve((lu, piv), b)
            output += "Solving Ax = b using LU Decomposition\\n\\n"
            output += f"Matrix A:\\n{A}\\n\\n"
            output += f"Vector b:\\n{b}\\n\\n"
            output += "1. Decompose A into P, L, U (via lu_factor)\\n"
            output += "   (Note: SciPy combines P and L for efficiency)\\n\\n"
            output += f"2. Solve for x:\\n{np.round(x, 4)}"

        elif operation == "qr":
            Q, R = np.linalg.qr(A)
            # Solve Rx = Q.T @ b
            b_transformed = Q.T @ b
            x = np.linalg.solve(R, b_transformed)
            output += "Solving Ax = b for the least-squares solution using QR Decomposition\\n\\n"
            output += f"Matrix A:\\n{A}\\n\\n"
            output += f"Vector b:\\n{b}\\n\\n"
            output += "1. Decompose A into Q and R:\\n"
            output += f"   Q (Orthogonal Matrix):\\n{np.round(Q, 4)}\\n\\n"
            output += f"   R (Upper Triangular Matrix):\\n{np.round(R, 4)}\\n\\n"
            output += "2. Solve Rx = Q.T * b:\\n"
            output += f"   Q.T * b = {np.round(b_transformed, 4)}\\n\\n"
            output += f"3. Least Squares Solution x:\\n{np.round(x, 4)}"

        elif operation == "cholesky":
            L = cholesky(A, lower=True)
            x = cho_solve((L, True), b)
            output += "Solving Ax = b using Cholesky Decomposition\\n\\n"
            output += f"Matrix A (must be symmetric positive-definite):\\n{A}\\n\\n"
            output += f"Vector b:\\n{b}\\n\\n"
            output += "1. Decompose A into L and L.T:\\n"
            output += f"   L (Lower Triangular):\\n{np.round(L, 4)}\\n\\n"
            output += f"2. Solve for x:\\n{np.round(x, 4)}"

        else:
            output = "Error: Unknown operation specified."

        output_element.innerText = output

    except Exception as e:
        output_element.innerText = f"An error occurred: {e}"

# Attach the function to the global window object so our button can call it
from pyscript.ffi import create_proxy
document.body.addEventListener('run-${operation}', create_proxy(solve_decomposition))
  `;

  const runCode = () => {
    if (!isPyScriptReady) {
      toast({
        title: "PyScript Not Ready",
        description: "The Python environment is still loading. Please wait a moment.",
        variant: "destructive"
      });
      return;
    }
    setIsRunning(true);
    // Dispatch a custom event to trigger the Python function
    const event = new Event(`run-${operation}`);
    document.body.dispatchEvent(event);
    
    // Simulate runtime
    setTimeout(() => setIsRunning(false), 500);
  };

  return (
    <div>
        <py-config>
packages = ["numpy", "scipy"]
        </py-config>
        
        {/* The PyScriptComponent handles loading and running the Python code */}
        <PyScriptComponentWithNoSSR pythonCode={pythonCode} />
        
        <div className="flex items-center gap-4 my-4">
            <Button onClick={runCode} disabled={!isPyScriptReady || isRunning}>
                {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                Run Python Solver
            </Button>
            {!isPyScriptReady && (
                <div className="flex items-center text-xs text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                    Initializing Python environment...
                </div>
            )}
        </div>

        <pre id={outputId} className="mt-4 p-4 rounded-lg bg-muted/50 text-sm overflow-x-auto min-h-[200px] whitespace-pre-wrap">
            Click the "Run" button to see the output.
        </pre>
    </div>
  );
}
