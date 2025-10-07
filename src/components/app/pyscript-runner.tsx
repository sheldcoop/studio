// src/components/app/pyscript-runner.tsx (Final, Correct Version)

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Loader2, Terminal, Copy } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useToast } from '@/hooks/use-toast';

// Define the global window types
declare global {
    interface Window {
        pyscript: {
            interpreter: any;
            run: (code: string) => Promise<void>;
            pyodide: any;
        };
        Prism: any;
    }
}

// Define the component's props
interface PyScriptRunnerProps {
  code: string;
  outputId: string;
  packages?: string[];
}

type Status = 'waiting_for_script' | 'loading_packages' | 'ready' | 'running' | 'error';

export function PyScriptRunner({ code, outputId, packages = [] }: PyScriptRunnerProps) {
  const codeRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>('waiting_for_script');
  const [error, setError] = useState<string | null>(null);
  const [outputContent, setOutputContent] = useState<React.ReactNode>(null);
  const { toast } = useToast();

  const initialize = useCallback(async () => {
    setStatus('loading_packages');
    try {
      if (!window.pyscript?.interpreter) {
        throw new Error("PyScript interpreter not found on window object.");
      }
      if (packages.length > 0) {
        await window.pyscript.pyodide.loadPackage(packages);
      }
      setStatus('ready');
    } catch (e: any) {
      setError(e.message);
      setStatus('error');
    }
  }, [packages]);
  
  // This useEffect hook implements the reliable polling strategy.
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.pyscript?.interpreter) {
        clearInterval(interval);
        initialize();
      }
    }, 100); // Check every 100ms

    // Cleanup function to clear the interval if the component unmounts
    return () => clearInterval(interval);
  }, [initialize]);


  useEffect(() => {
    if (codeRef.current && window.Prism) {
      window.Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  const handleRunCode = async () => {
    if (status !== 'ready') return;
    
    setStatus('running');
    setError(null);
    setOutputContent(null);
    let errorOccurred = false;

    try {
      // Redirect Python's print() function to update our React state
      window.pyscript.interpreter.globals.set("pyscript", {
        write: (id: string, value: any) => {
          if (id === outputId) {
            setOutputContent(prev => prev ? <>{prev}{String(value)}</> : String(value));
          }
        },
      });
      await window.pyscript.run(code);
    } catch (e: any) {
      setError(e.message || String(e));
      errorOccurred = true;
      setStatus('error');
    } finally {
      if (!errorOccurred) {
        setStatus('ready');
      }
    }
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code.trim());
    toast({ title: "Copied to Clipboard" });
  };

  const statusMessages: Record<Status, string> = {
    waiting_for_script: 'Loading Environment...',
    loading_packages: 'Loading Packages...',
    ready: 'Run Code',
    running: 'Running...',
    error: 'Error Occurred',
  };

  return (
    <div className="space-y-4">
      <div className="relative group">
        <pre className="language-python rounded-lg !m-0 border !py-4 !px-6">
          <code ref={codeRef} className="language-python">{code.trim()}</code>
        </pre>
        <Button variant="ghost" size="icon" className="absolute top-3 right-3 h-7 w-7 opacity-0 group-hover:opacity-100" onClick={handleCopyCode}>
          <Copy className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={handleRunCode} disabled={status !== 'ready'} size="sm">
          {status === 'running' || status === 'loading_packages' || status === 'waiting_for_script' ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Play className="mr-2 h-4 w-4" />
          )}
          {statusMessages[status]}
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
          <div id={outputId} className="min-h-[100px] whitespace-pre-wrap font-mono text-sm bg-muted/50 p-4 rounded-md">
            {outputContent || (
              <div className="text-sm text-muted-foreground">
                {status === 'ready' && 'Click "Run Code" to see the output.'}
                {(status === 'loading_packages' || status === 'waiting_for_script') && 'The Python environment is preparing...'}
                {status === 'error' && 'An error occurred. You can try running the code again.'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
