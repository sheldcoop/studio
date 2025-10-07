
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

  // --- THIS IS THE FIX (PART 2) ---
  // This effect now listens for the custom event fired by the layout.
  useEffect(() => {
    const initialize = async () => {
      console.log("PyScriptRunner: Initializing...");
      setStatus('loading_packages');
      try {
        if (!window.pyscript) {
          throw new Error("PyScript object not found on window.");
        }
        if (packages && packages.length > 0) {
          console.log(`PyScriptRunner: Loading packages: ${packages.join(', ')}`);
          await window.pyscript.pyodide.loadPackage(packages);
        }
        console.log("PyScriptRunner: Environment is ready.");
        setStatus('ready');
      } catch (e: any) {
        console.error("PyScriptRunner: Initialization failed.", e);
        setError(e.message);
        setStatus('error');
      }
    };

    // Check if the script has already loaded and fired the event before this component mounted.
    if (window.pyscript?.interpreter) {
      console.log("PyScriptRunner: PyScript already initialized. Running setup.");
      initialize();
    } else {
      console.log("PyScriptRunner: Waiting for 'pyscript-loaded' event from layout.");
      // If not, add an event listener for our custom event.
      document.addEventListener('pyscript-loaded', initialize);
    }

    // Crucial cleanup function to remove the listener when the component unmounts.
    return () => {
      document.removeEventListener('pyscript-loaded', initialize);
    };
  }, [packages]);

  // Effect for syntax highlighting
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
      // Define a custom pyscript.write function in Python's global scope
      // This intercepts output and sends it to our React state.
      window.pyscript.interpreter.globals.set("pyscript", {
        write: (id: string, value: any) => {
          if (id === outputId) {
            setOutputContent(String(value));
          }
        },
      });

      await window.pyscript.run(code);
      
      setStatus('ready');
      // If the Python code ran but didn't call pyscript.write, clear the "Running..." message.
      if (outputContent && typeof outputContent === 'object' && 'props' in outputContent && outputContent.props.children[1] === 'Running...') {
          setOutputContent(null);
      }
    } catch (e: any) {
      const errorMessage = e.message || String(e);
      setError(errorMessage);
      setOutputContent(null);
      setStatus('error');
    }
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code.trim());
    toast({ title: "Copied to Clipboard" });
  };

  const statusMessages: Record<Status, string> = {
    loading_script: 'Loading Env...',
    loading_packages: 'Loading Pkgs...',
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
            {outputContent || (
              <div className="text-sm text-muted-foreground">
                {(status === 'ready' || status === 'running') && 'Click "Run Code" to see the output.'}
                {status === 'error' && 'An error occurred. Check the error message above.'}
                 {status === 'loading_script' && 'Initializing Python environment...'}
                 {status === 'loading_packages' && 'Downloading required packages...'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
