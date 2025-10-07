// src/components/app/pyscript-runner.tsx (Final, Corrected Version)

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Loader2, Terminal, Copy } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Define a more specific type for the PyScript object for better type safety
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

// Define the possible states for our component
type Status = 'loading_script' | 'loading_packages' | 'ready' | 'running' | 'error';

export function PyScriptRunner({ code, outputId, packages = [] }: PyScriptRunnerProps) {
  const codeRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>('loading_script');
  const [error, setError] = useState<string | null>(null);
  const [outputContent, setOutputContent] = useState<React.ReactNode>(null);
  const { toast } = useToast();

  // This effect now uses the official and most reliable 'py:ready' event.
  useEffect(() => {
    const handleReady = async () => {
      console.log("PyScript Event 'py:ready' fired. Initializing packages...");
      setStatus('loading_packages');
      try {
        if (packages.length > 0) {
          await window.pyscript.pyodide.loadPackage(packages);
          console.log(`PyScript: Packages loaded: ${packages.join(', ')}`);
        }
        setStatus('ready');
        console.log("PyScript: Environment is ready.");
      } catch (e: any) {
        console.error("PyScript Package Loading Error:", e);
        setError(e.message || "Failed to load Python packages.");
        setStatus('error');
      }
    };
    
    // Check if the pyscript object and its interpreter are already available.
    // This handles navigation between pages where PyScript is already loaded.
    if (window.pyscript?.interpreter) {
      console.log("PyScript already initialized. Proceeding with packages.");
      handleReady();
    } else {
      console.log("PyScript not ready. Listening for 'py:ready' event.");
      // If not ready, we add the event listener.
      document.addEventListener('py:ready', handleReady);
    }

    // This is a crucial cleanup function. It removes the event listener
    // when the component is removed from the page to prevent memory leaks.
    return () => {
      document.removeEventListener('py:ready', handleReady);
    };
  }, [packages]); // Rerun effect if packages prop changes

  // Effect for syntax highlighting (no changes needed)
  useEffect(() => {
    if (codeRef.current && status !== 'loading_script' && window.Prism) {
      window.Prism.highlightElement(codeRef.current);
    }
  }, [code, status]);

  const handleRunCode = async () => {
    if (status !== 'ready') return;
    
    setStatus('running');
    setError(null);
    setOutputContent(
      <div className="flex items-center text-sm text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Running...
      </div>
    );

    try {
      // Define a custom pyscript.write in Python's global scope
      // to intercept output and send it to our React state.
      window.pyscript.interpreter.globals.set("pyscript", {
        write: (id: string, value: any) => {
          if (id === outputId) {
            setOutputContent(String(value));
          }
        },
      });

      await window.pyscript.run(code);
      // After running, if no output was written, clear the "Running..." message.
      // This handles scripts that do calculations but have no print statements.
      if (status === 'running') {
        setOutputContent(null);
      }
    } catch (e: any) {
      const errorMessage = e.message || String(e);
      setError(errorMessage);
      setOutputContent(null);
      setStatus('error');
    } finally {
      // Only set status back to ready if there wasn't an error
      if (!error) {
          setStatus('ready');
      }
    }
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code.trim());
    toast({ title: "Copied to Clipboard" });
  };

  const statusMessages: Record<Status, string> = {
    loading_script: 'Loading Environment...',
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
          {status === 'running' || status === 'loading_packages' || status === 'loading_script' ? (
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
            {outputContent ?? (
              <div className="text-sm text-muted-foreground">
                {status === 'ready' && 'Click "Run Code" to see the output.'}
                {(status === 'loading_script' || status === 'loading_packages') && 
                  <div className="flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Python environment is loading...</div>}
                {status === 'error' && 'An error occurred. Check the error message above.'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}