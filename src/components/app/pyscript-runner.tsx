
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface PyScriptRunnerProps {
  code: string;
  outputId: string;
  title: string;
}

export function PyScriptRunner({ code, outputId, title }: PyScriptRunnerProps) {
  const [isPyScriptReady, setIsPyScriptReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [codeToRun, setCodeToRun] = useState('');

  useEffect(() => {
    // Check if PyScript is already loaded to avoid duplicates
    if (document.querySelector('script[src="https://pyscript.net/latest/pyscript.js"]')) {
      setIsPyScriptReady(true);
      return;
    }

    // Load PyScript CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://pyscript.net/latest/pyscript.css';
    document.head.appendChild(link);

    // Load PyScript JS
    const script = document.createElement('script');
    script.src = 'https://pyscript.net/latest/pyscript.js';
    script.async = true;
    script.onload = () => setIsPyScriptReady(true);
    document.head.appendChild(script);

    return () => {
      // Clean up on unmount if needed, though usually not necessary for scripts/links
      document.head.removeChild(link);
      document.head.removeChild(script);
    };
  }, []);

  const handleRunCode = () => {
    setIsRunning(true);
    // Clear previous output before running new code
    const outputElement = document.getElementById(outputId);
    if (outputElement) {
      outputElement.innerHTML = '';
    }
    // Setting the code to run triggers the py-script tag to execute
    setCodeToRun(code);
    // We add a small timeout to allow PyScript to start processing.
    // A more robust solution might involve callbacks from the Python code itself.
    setTimeout(() => setIsRunning(false), 2000);
  };

  return (
    <Card className="bg-background/50 overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-900/50 rounded-md p-4 text-sm font-mono text-white overflow-x-auto border border-border">
          <pre><code>{code.trim()}</code></pre>
        </div>
        <div className="mt-4">
          <Button onClick={handleRunCode} disabled={!isPyScriptReady || isRunning}>
            {isRunning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPyScriptReady ? (isRunning ? 'Running...' : '► Run') : 'Loading PyScript...'}
          </Button>
        </div>
        <div className="mt-4 p-4 border rounded-md bg-muted/30 min-h-[100px]">
          <h4 className="font-semibold mb-2 text-muted-foreground">Output:</h4>
          {codeToRun && isPyScriptReady && (
            <>
              <py-config>
                  packages = ["numpy", "matplotlib"]
              </py-config>
              <py-script key={codeToRun}>
                {codeToRun}
              </py-script>
            </>
          )}
          <div id={outputId}></div>
        </div>
      </CardContent>
    </Card>
  );
}
