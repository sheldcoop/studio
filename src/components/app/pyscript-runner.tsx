
'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

declare global {
    interface Window {
        pyscript: any;
    }
}

interface PyScriptRunnerProps {
  code: string;
  outputId: string;
  packages?: string[];
}

export function PyScriptRunner({ code, outputId, packages = [] }: PyScriptRunnerProps) {
  const codeRef = useRef<HTMLElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Check if PyScript is loaded
    const checkPyScript = () => {
      if (window.pyscript && window.pyscript.interpreter) {
        setIsReady(true);
      } else {
        setTimeout(checkPyScript, 100);
      }
    };
    checkPyScript();
  }, []);

  const runCode = () => {
    if (!isReady || !window.pyscript) return;
    setIsRunning(true);
    try {
        window.pyscript.run(code);
    } catch (e) {
        console.error("PyScript execution error:", e);
        const outputDiv = document.getElementById(outputId);
        if (outputDiv) {
            outputDiv.innerText = `Error: ${e instanceof Error ? e.message : String(e)}`;
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
      <div className="relative">
        <pre className="language-python rounded-lg !mt-0">
          <code ref={codeRef} className="language-python">
            {code.trim()}
          </code>
        </pre>
      </div>
      <div className="my-4 flex items-center gap-4">
        <Button onClick={runCode} disabled={!isReady || isRunning}>
          <Play className="mr-2 h-4 w-4" />
          {isRunning ? 'Running...' : (isReady ? 'Run Code' : 'Loading Python...')}
        </Button>
      </div>
      <Card>
        <CardContent className="p-4">
            <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Output:</h4>
            <div id={outputId} className="min-h-[100px] whitespace-pre-wrap font-mono text-sm bg-muted/50 p-4 rounded-md">
                {!isReady ? 'Python environment is loading...' : 'Click "Run Code" to see the output.'}
            </div>
        </CardContent>
      </Card>
      {packages.length > 0 && (
          // This tag is what configures PyScript. It must be present in the DOM.
          // @ts-ignore
          <py-config>
              packages = ["{packages.join('", "')}"]
          </py-config>
      )}
    </div>
  );
}

