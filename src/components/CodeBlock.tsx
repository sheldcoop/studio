'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export default function CodeBlock({ 
  code, 
  language = 'python',
  title 
}: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);
  const { theme } = useTheme();

  // Highlight code when component mounts or code changes
  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  // Load theme-specific CSS
  useEffect(() => {
    // Remove any existing Prism theme stylesheets
    const existingLinks = document.querySelectorAll('link[data-prism-theme]');
    existingLinks.forEach(link => link.remove());

    // Add new theme stylesheet
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/prism-themes/prism-${theme || 'light'}.css`;
    link.setAttribute('data-prism-theme', 'true');
    document.head.appendChild(link);

    return () => {
      link.remove();
    };
  }, [theme]);

  return (
    <div className="code-block-wrapper">
      {title && (
        <div className="code-block-title">
          {title}
        </div>
      )}
      <pre className={`language-${language}`}>
        <code ref={codeRef} className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  );
}
