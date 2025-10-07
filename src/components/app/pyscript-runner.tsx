
'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Loader2, Terminal, Copy } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  
  // This effect checks for the global pyscript object to determine readiness.
  useEffect(() => {
    const checkReady = () => {
      if (window.pyscript && typeof window.pyscript.run === 'function') {
        setIsReady(true);
      } else {
        setTimeout(checkReady, 150); // Check again shortly
      }
    };
    checkReady();
  }, []);

  // This effect is for syntax highlighting via Prism.js
  useEffect(() => {
    if (codeRef.current && window.Prism) {
      window.Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  const handleRunCode = async () => {
    if (!isReady || isRunning) return;
    
    setIsRunning(true);
    setError(null);

    const outputElement = document.getElementById(outputId);
    if (outputElement) {
        outputElement.innerHTML = '<div class="flex items-center text-sm text-muted-foreground"><span class="loader-spin mr-2 h-4 w-4"></span>Running...</div>';
        const loaderSpan = outputElement.querySelector('.loader-spin');
        if (loaderSpan) {
            const loader = new Loader2({className: 'animate-spin'});
            loader.render(loaderSpan as any);
        }
    }

    try {
      // Use the pyscript.run API to execute the code
      await window.pyscript.run(code);
    } catch (e: any) {
      const errorMessage = e.message || String(e);
      setError(errorMessage);
       if (outputElement) {
          // Clear "Running..." message and show error
          outputElement.innerHTML = '';
      }
    } finally {
      setIsRunning(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code.trim());
    toast({
      title: "Copied to Clipboard",
      description: "The Python code has been copied.",
    })
  }

  return (
    <div className="space-y-4">
      {/* The pre tag MUST have the language-python class for the Prism toolbar to appear */}
      <div className="relative group">
          <pre className="language-python rounded-lg !m-0 border !py-4 !px-6">
              <code ref={codeRef} className="language-python">
                {code.trim()}
              </code>
          </pre>
           <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-3 right-3 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleCopyCode}
            >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy Code</span>
            </Button>
      </div>


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
                  "min-h-[100px] whitespace-pre-wrap font-mono text-sm bg-muted/50 p-4 rounded-md overflow-x-auto",
                  error && 'text-destructive'
                )}
            >
              {!isReady && (
                <div className="flex items-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Python environment is loading...</div>
              )}
              {isReady && !isRunning && !error && (
                <div className="text-sm text-muted-foreground">Click "Run Code" to see the output.</div>
              )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

    