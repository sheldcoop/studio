
'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Loader2, Terminal, Copy } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { useToast } from '@/hooks/use-toast';

interface PyScriptRunnerProps {
  code: string;
  outputId: string;
  packages?: string[];
}

export function PyScriptRunner({ code, outputId, packages = [] }: PyScriptRunnerProps) {
  const codeRef = useRef<HTMLElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (codeRef.current && window.Prism) {
      window.Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code.trim());
    toast({ title: "Copied to Clipboard" });
  };
  
  // Create a JSON configuration string for the packages
  const config = JSON.stringify({ packages });

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
         <script
            type="py"
            config={config}
            // The output attribute tells PyScript where to print()
            output={outputId} 
          >
          {code}
        </script>
        
        {/* We can simplify the UI. PyScript's tags now handle execution.
            The button can be used to re-run if necessary, though it's
            less common in this declarative model. For now, we can show a placeholder.
        */}
        <div className="text-sm text-muted-foreground">
            The Python code above runs automatically. The output will appear below.
        </div>
      </div>
     
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Output:</h4>
          <div id={outputId} className="min-h-[100px] whitespace-pre-wrap font-mono text-sm bg-muted/50 p-4 rounded-md">
            <div className="text-sm text-muted-foreground flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Initializing Python environment...
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
