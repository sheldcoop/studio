
'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Loader2, Terminal } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { cn } from '@/lib/utils';

declare global {
    interface Window {
        pyscript: any;
        Prism: any;
    }
}

interface PyScriptRunnerProps {
  code: string;
  outputId: string;
}

export function PyScriptRunner({ code, outputId }: PyScriptRunnerProps) {
  const codeRef = useRef<HTMLElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState('Click "Run Code" to see the output.');
  
  useEffect(() => {
    // Check if PyScript is loaded and ready
    const checkReady = () => {
      if (window.pyscript && typeof window.pyscript.run === 'function') {
        setIsReady(true);
      } else {
        setTimeout(checkReady, 100);
      }
    };
    checkReady();
  }, []);

  useEffect(() => {
    // Highlight the code block when the component mounts or code changes
    if (codeRef.current && window.Prism) {
      window.Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  const handleRunCode = async () => {
    if (!isReady || isRunning) return;
    
    setIsRunning(true);
    setError(null);
    setOutput(''); // Clear previous output

    const outputElement = document.getElementById(outputId);
    if (outputElement) {
        outputElement.innerHTML = '';
    }

    try {
      await window.pyscript.run(code);
    } catch (e: any) {
      const errorMessage = e.message || String(e);
      setError(errorMessage);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* The pre tag MUST have the language-python class for the Prism toolbar to appear */}
      <pre className="language-python rounded-lg !m-0 border">
          <code ref={codeRef} className="language-python">
            {code.trim()}
          </code>
      </pre>

      <div className="flex items-center gap-4 rounded-b-lg border-t-0 p-2">
            <Button onClick={handleRunCode} disabled={!isReady || isRunning} size="sm">
              {isRunning ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              {isRunning ? 'Running...' : (isReady ? 'Run Code' : 'Loading Python...')}
            </Button>
      </div>
     
      <Card>
        <CardContent className="p-4">
            <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Output:</h4>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Execution Error</AlertTitle>
                <AlertDescription className="font-mono text-xs whitespace-pre-wrap">{error}</AlertDescription>
              </Alert>
            )}
            <div 
              id={outputId} 
              className={cn(
                  "min-h-[100px] whitespace-pre-wrap font-mono text-sm bg-muted/50 p-4 rounded-md",
                  error && 'text-destructive'
                )}
            >
              {!isReady && (
                <div className="flex items-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Python environment is loading...</div>
              )}
              {isReady && !isRunning && !error && (
                <div className="text-sm text-muted-foreground">Click "Run Code" to see the output.</div>
              )}
               {isRunning && (
                <div className="flex items-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Running...</div>
              )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
