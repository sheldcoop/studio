

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
  matrix?: number[][];
  vector?: number[];
  operation: 'cholesky' | 'lu' | 'qr' | 'svd';
  outputId: string;
}

// Function to load a script and return a promise
const loadScript = (src: string, isModule: boolean): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    if (isModule) {
      script.type = 'module';
    }
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
};

// Function to load a stylesheet
const loadStylesheet = (href: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`link[href="${href}"]`)) {
            resolve();
            return;
        }
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = () => resolve();
        link.onerror = () => reject(new Error(`Failed to load stylesheet: ${href}`));
        document.head.appendChild(link);
    });
};

export function PyScriptRunner({ matrix, vector, operation, outputId }: PyScriptRunnerProps) {
  const [isReady, setIsReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("Initializing Python environment...");

  // Load PyScript assets and initialize the Python environment
  useEffect(() => {
    let isMounted = true;
    
    const setupPyScript = async () => {
      try {
        await loadStylesheet("https://pyscript.net/releases/2024.1.1/core.css");
        await loadScript("https://pyscript.net/releases/2024.1.1/core.js", true);
        
        // Now that scripts are loaded, we can add the py-config and py-script tags
        const pyConfig = document.createElement('py-config');
        pyConfig.innerHTML = `
          packages = ["numpy", "scipy"]
        `;
        document.head.appendChild(pyConfig);
        
        const pyScript = document.createElement('script');
        pyScript.type = 'py';
        pyScript.src = '/python/solver.py';
        document.head.appendChild(pyScript);

        // Poll for the interpreter to be ready
        const interval = setInterval(() => {
          if (window.pyscript?.interpreter) {
            if (isMounted) {
              setIsReady(true);
              setOutput("");
            }
            clearInterval(interval);
          }
        }, 100);

        return () => clearInterval(interval);

      } catch (error) {
        console.error("Failed to load PyScript:", error);
        if (isMounted) {
          setOutput("Failed to initialize Python environment.");
        }
      }
    };
    
    setupPyScript();

    return () => {
      isMounted = false;
    };
  }, []);

  const runCode = async () => {
    if (!isReady || isRunning) return;

    setIsRunning(true);
    setOutput("Running calculation...");

    try {
      const solve_decomposition = window.pyscript.interpreter.globals.get('solve_decomposition');
      const result = await solve_decomposition(matrix, vector, operation);
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
