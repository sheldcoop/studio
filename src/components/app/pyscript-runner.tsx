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
  const [outputContent, setOutputContent] = useState<React.ReactNode>(null);
  const { toast } = useToast();
  
  // This is the corrected effect that uses the official 'py:ready' event.
  useEffect(() => {
    const handleReady = () => {
      // This function will be called ONLY when PyScript is fully loaded.
      console.log("PyScript environment is ready.");
      setIsReady(true);
    };

    // First, check if PyScript is already ready (e.g., on page navigation)
    if (window.pyscript && window.pyscript.interpreter) {
      handleReady();
    } else {
      // If not, add an event listener to wait for it.
      document.addEventListener('py:ready', handleReady);
    }

    // This is a crucial cleanup function. It removes the event listener 
    // when the component is removed from the page to prevent memory leaks.
    return () => {
      document.removeEventListener('py:ready', handleReady);
    };
  }, []); // The empty dependency array means this effect runs only once.

  // This effect for Prism.js syntax highlighting is perfect as-is.
  useEffect(() => {
    if (codeRef.current && window.Prism) {
      window.Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  const handleRunCode = async () => {
    if (!isReady || isRunning) return;
    
    setIsRunning(true);
    setError(null);
    // Set the output to a "Running..." message immediately
    setOutputContent(
      <div className="flex items-center text-sm text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Running code...
      </div>
    );

    try {
      // This is a more robust way to capture output.
      // We temporarily redefine pyscript.write to update our React state.
      window.pyscript.interpreter.globals.set("pyscript", {
        write: (id: string, value: any) => {
          if (id === outputId) {
            setOutputContent(String(value));
          }
        },
      });

      // Execute the Python code
      await window.pyscript.run(code);

    } catch (e: any) {
      const errorMessage = e.message || String(e);
      setError(errorMessage);
      setOutputContent(null); // Clear the output area if there's an error
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

      <div className="flex items-center gap-4">
            <Button onClick={handleRunCode} disabled={!isReady || isRunning} size="sm">
              {isRunning ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              {isRunning ? 'Running...' : (isReady ? 'Run Code' : 'Loading Environment...')}
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
              className="min-h-[100px] whitespace-pre-wrap font-mono text-sm bg-muted/50 p-4 rounded-md overflow-x-auto"
            >
              {outputContent ? outputContent : (
                isReady ? 
                <div className="text-sm text-muted-foreground">Click "Run Code" to see the output.</div> :
                <div className="flex items-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Python environment is loading...</div>
              )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}