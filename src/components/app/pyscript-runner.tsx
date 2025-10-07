
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const PyScriptComponentWithNoSSR = dynamic(
  () => import('@/components/app/PyScriptComponent'),
  { 
    ssr: false,
    loading: () => <Skeleton className="h-12 w-full" />
  }
);

interface PyScriptRunnerProps {
  code: string;
  outputId: string;
  title: string;
}

export function PyScriptRunner({ code, outputId, title }: PyScriptRunnerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [showPyScript, setShowPyScript] = useState(false);

  const runCode = () => {
    setIsRunning(true);
    setShowPyScript(true);
    
    // The PyScriptComponent will autorun the code when it's rendered.
    // We can add a delay to allow the output to be captured.
    setTimeout(() => {
        setIsRunning(false);
    }, 2000)
  };

  return (
    <div>
        <div className="relative p-4 rounded-lg bg-muted/50 text-sm overflow-x-auto mb-4">
            <div className="absolute top-2 right-2 flex items-center gap-2">
                <Button onClick={runCode} size="sm" variant="secondary" disabled={isRunning}>
                    <Play className="h-4 w-4 mr-2" />
                    {isRunning ? 'Running...' : 'Run'}
                </Button>
            </div>
            <h4 className="font-semibold text-foreground mb-2">{title}</h4>
            <pre><code className="language-python whitespace-pre-wrap">{code.trim()}</code></pre>
        </div>
        
        {showPyScript && (
          <div id="pyscript-container" className="hidden">
              <py-config>
                  packages = ["numpy", "scipy"]
              </py-config>
              <PyScriptComponentWithNoSSR pythonCode={code} outputId={outputId} />
          </div>
        )}
        
        <pre id={outputId} className="mt-4 p-4 rounded-lg bg-muted/50 text-sm overflow-x-auto min-h-[100px] whitespace-pre-wrap">
          Click "Run" to see the Python output...
        </pre>
    </div>
  );
}
