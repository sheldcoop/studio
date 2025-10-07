
'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Loader2 } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

declare global {
    interface Window {
        pyscript: any;
    }
}

interface PyScriptRunnerProps {
  code: string;
  outputId: string;
}

export function PyScriptRunner({ code, outputId }: PyScriptRunnerProps) {
  const codeRef = useRef<HTMLElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if PyScript is loaded and ready to run code
    const checkPyScriptReady = () => {
      if (window.pyscript && typeof window.pyscript.run === 'function') {
        setIsReady(true);
      } else {
        setTimeout(checkPyScriptReady, 100);
      }
    };
    checkPyScriptReady();
  }, []);

  const handleRunCode = async () => {
    if (!isReady || isRunning) return;
    
    setIsRunning(true);
    setError(null);
    
    const outputElement = outputRef.current;
    if (outputElement) {
      outputElement.innerHTML = '<div class="flex items-center text-sm text-muted-foreground"><span class="animate-spin mr-2 h-4 w-4"></span>Running Python code...</div>';
    }

    try {
      // The pyscript.write function will target the div with the matching ID
      await window.pyscript.run(code);
    } catch (e: any) {
      console.error("PyScript execution error:", e);
      const errorMessage = e.message || String(e);
      setError(errorMessage);
      if (outputElement) {
        outputElement.innerText = `Error: ${errorMessage}`;
      }
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (codeRef.current && (window as any).Prism) {
      (window as any).Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  return (
    <div>
      <div className="relative group">
        <pre className="language-python rounded-lg !mt-0 !mb-0 !rounded-b-none border-b-0">
          <code ref={codeRef} className="language-python">
            {code.trim()}
          </code>
        </pre>
      </div>
      <div className="flex items-center gap-4 rounded-b-lg border border-t-0 p-2">
        <Button onClick={handleRunCode} disabled={!isReady || isRunning} size="sm">
          {isRunning ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Play className="mr-2 h-4 w-4" />
          )}
          {isRunning ? 'Running...' : (isReady ? 'Run Code' : 'Loading Python...')}
        </Button>
      </div>
      <Card className="mt-4">
        <CardContent className="p-4">
            <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Output:</h4>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Execution Error</AlertTitle>
                <AlertDescription className="font-mono text-xs">{error}</AlertDescription>
              </Alert>
            )}
            <div 
              ref={outputRef} 
              id={outputId} 
              className={cn(
                  "min-h-[100px] whitespace-pre-wrap font-mono text-sm bg-muted/50 p-4 rounded-md",
                  error && 'text-destructive'
                )}
              >
              {!isReady ? (
                <div className="flex items-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Python environment is loading...</div>
              ) : 'Click "Run Code" to see the output.'}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
