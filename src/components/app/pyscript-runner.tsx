'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const PyScriptLoader = dynamic(() => import('./PyScriptLoader'), { ssr: false });

interface PyScriptRunnerProps {
  code: string;
  outputId: string;
  title: string;
}

export function PyScriptRunner({ code, outputId, title }: PyScriptRunnerProps) {
  const [isPyScriptReady, setIsPyScriptReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  // We use a key to force re-mounting of the PyScript component on each run
  const [runKey, setRunKey] = useState<number | null>(null);

  useEffect(() => {
    // We can assume PyScript is "ready" after a short delay, 
    // as the dynamic import and useEffect in PyScriptLoader will handle the actual loading.
    const timer = setTimeout(() => setIsPyScriptReady(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRunCode = () => {
    setIsRunning(true);
    // Increment the key to force React to unmount the old and mount a new PyScriptLoader instance
    setRunKey(prevKey => (prevKey ?? 0) + 1);
    
    // Simulate run time and reset button
    setTimeout(() => {
      setIsRunning(false);
    }, 2000); // Adjust as needed
  };

  return (
    <Card className="bg-background/50 overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-900/50 rounded-md p-4 text-sm font-mono text-white overflow-x-auto border border-border">
          <pre><code>{code.trim()}</code></pre>
        </div>
        <div className="mt-4">
          <Button onClick={handleRunCode} disabled={!isPyScriptReady || isRunning}>
            {isRunning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPyScriptReady ? (isRunning ? 'Running...' : '► Run') : 'Loading PyScript...'}
          </Button>
        </div>
        <div className="mt-4 p-4 border rounded-md bg-muted/30 min-h-[100px]">
          <h4 className="font-semibold mb-2 text-muted-foreground">Output:</h4>
          {/* This div is the target for the Matplotlib plot */}
          <div id={outputId}></div>
          {/* 
            The PyScriptLoader is only mounted when we want to run the code.
            Changing the `key` prop makes React treat it as a new component,
            ensuring the script runs again.
          */}
          {runKey !== null && <PyScriptLoader key={runKey} pythonCode={code} />}
        </div>
      </CardContent>
    </Card>
  );
}
