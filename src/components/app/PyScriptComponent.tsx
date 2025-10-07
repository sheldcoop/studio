'use client'; // This directive is ESSENTIAL. It tells Next.js to only render this component in the browser.

import { useEffect } from 'react';

// This component handles the logic for loading PyScript and running Python code.
export default function PyScriptComponent({ pythonCode }: { pythonCode: string }) {

  // This is a React Hook that runs code after the component has been mounted to the browser's DOM.
  useEffect(() => {
    // 1. Check if the PyScript library is already loaded on the page to avoid duplication.
    const isPyScriptLoaded = document.querySelector('script[src="https://pyscript.net/latest/pyscript.js"]');

    if (!isPyScriptLoaded) {
      // 2. Load the PyScript CSS for styling PyScript elements
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://pyscript.net/latest/pyscript.css';
      document.head.appendChild(link);

      // 3. Load the PyScript JavaScript library
      const script = document.createElement('script');
      script.src = 'https://pyscript.net/latest/pyscript.js';
      script.async = true; // Load the script asynchronously to not block page rendering.
      document.head.appendChild(script);
    }
  }, []); // The empty dependency array [] ensures this effect runs only ONCE.

  return (
    <div className="pyscript-container" style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', marginBlock: '1rem' }}>
      <h4>Python Output:</h4>
      {/* The <py-script> tag is where your Python code is executed.
        We use the `key` prop with the pythonCode itself. This is a crucial React trick.
        When the `pythonCode` prop changes, the key changes, forcing React to destroy the old
        <py-script> element and create a new one. This is how we ensure PyScript re-runs
        the new code.
      */}
      <py-script key={pythonCode}>
        {pythonCode}
      </py-script>
    </div>
  );
}
