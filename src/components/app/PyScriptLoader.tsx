
'use client';

import { useEffect } from 'react';

interface PyScriptLoaderProps {
  pythonCode: string;
}

// This is a simple, dedicated component for running a piece of Python code.
// Its only job is to ensure PyScript is loaded and then execute the code.
export default function PyScriptLoader({ pythonCode }: PyScriptLoaderProps) {
  useEffect(() => {
    const isPyScriptLoaded = document.querySelector('script[src="https://pyscript.net/releases/2025.8.1/core.js"]');
    
    if (!isPyScriptLoaded) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://pyscript.net/releases/2025.8.1/core.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://pyscript.net/releases/2025.8.1/core.js';
      document.head.appendChild(script);
    }
  }, []);

  return (
    <>
      <py-config>
          packages = ["numpy", "matplotlib", "scipy"]
      </py-config>
      <py-script>
        {pythonCode}
      </py-script>
    </>
  );
}
