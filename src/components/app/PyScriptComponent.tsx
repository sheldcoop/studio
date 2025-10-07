
'use client'; 

import { useEffect } from 'react';

// This component handles the logic for loading PyScript and running Python code.
export default function PyScriptComponent({ pythonCode, outputId }: { pythonCode: string, outputId: string }) {

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
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div>
      <py-script key={pythonCode} output={outputId}>
        {pythonCode}
      </py-script>
    </div>
  );
}
