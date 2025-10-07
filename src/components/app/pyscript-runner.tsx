
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

declare global {
  interface Window {
    pyscript: any;
  }
}

interface PyScriptRunnerProps {
  // We no longer pass code directly. Instead, we pass the data the python script will use.
  matrix?: number[][];
  vector?: number[];
  operation: 'cholesky' | 'lu' | 'qr';
  outputId: string;
}

export function PyScriptRunner({ matrix, vector, operation, outputId }: PyScriptRunnerProps) {
  const [isReady, setIsReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("Initializing Python environment...");

  // Poll for PyScript to be ready
  useEffect(() => {
    if (typeof window.pyscript?.interpreter !== 'undefined') {
      setIsReady(true);
      setOutput(""); // Clear the initializing message
      return;
    }

    const interval = setInterval(() => {
      if (typeof window.pyscript?.interpreter !== 'undefined') {
        setIsReady(true);
        setOutput("");
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const runCode = async () => {
    if (!isReady || isRunning) return;

    setIsRunning(true);
    setOutput("Running calculation...");

    try {
      // Get the Python function from the global scope
      const solve_decomposition = window.pyscript.interpreter.globals.get('solve_decomposition');
      
      // Call the Python function with data
      const result = await solve_decomposition(matrix, vector, operation);
      
      // Set the output
      setOutput(result);

    } catch (error) {
      console.error("PyScript execution error:", error);
      if (error instanceof Error) {
        setOutput(`Error: ${error.message}`);
      } else {
        setOutput("An unknown error occurred during Python execution.");
      }
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-4">
        {/* The script tag is now simplified and points to the external files */}
        <script type="py" src="/python/solver.py" config="/pyscript.json"></script>
        
      <Button onClick={runCode} disabled={!isReady || isRunning}>
        {isRunning ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Play className="mr-2 h-4 w-4" />
        )}
        Run Calculation
      </Button>

      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Output:</h4>
          <div id={outputId} className="min-h-[100px] whitespace-pre-wrap font-mono text-sm bg-muted/50 p-4 rounded-md">
            {output}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
