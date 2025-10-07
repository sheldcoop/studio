
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

  const initializePyScript = useCallback(async () => {
    // Wait for the pyscript object to be available on the window
    if (!window.pyscript) {
      setTimeout(initializePyScript, 100); // Poll until the script is loaded
      return;
    }

    try {
      // Step 1: Programmatically configure Pyodide with the required packages
      // This bypasses the need for a <py-config> tag entirely.
      if (packages.length > 0) {
        setStatus('loading_packages');
        console.log(`PyScript: Loading packages: ${packages.join(', ')}`);
        await window.pyscript.pyodide.loadPackage(packages);
      }
      
      // Step 2: Once packages are loaded, the environment is ready
      setStatus('ready');
      console.log("PyScript: Environment is ready.");
    } catch (e: any) {
      console.error("PyScript Package Loading Error:", e);
      setError(e.message || "Failed to load Python packages.");
      setStatus('error');
    }
  }, [packages]);

  // Main effect to kick off the initialization process
  useEffect(() => {
    initializePyScript();
  }, [initializePyScript]);

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
      // Check if output was written to, if not, show a message
      // This part now runs correctly after the status is set back to ready.
      if (typeof outputContent === 'object' && 'props' in outputContent && outputContent.props.children[1] === 'Running...') {
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
            {outputContent || (
              <div className="text-sm text-muted-foreground">
                {(status === 'ready' || status === 'running') && 'Click "Run Code" to see the output.'}
                {status === 'error' && 'An error occurred. Check the error message above.'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
