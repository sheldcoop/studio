
'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  highlightLines?: number[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export default function CodeBlock({ 
  code, 
  language = 'python',
  title,
  highlightLines = [],
  collapsible = false,
  defaultCollapsed = false
}: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Highlight code when component mounts or code changes
  useEffect(() => {
    if (isMounted && codeRef.current && preRef.current) {
      Prism.highlightElement(codeRef.current);
      // PrismJS adds a tabindex="0" to the <pre> tag, which causes a hydration mismatch.
      // We remove it immediately after highlighting to solve the warning.
      if (preRef.current.hasAttribute('tabindex')) {
        preRef.current.removeAttribute('tabindex');
      }
    }
  }, [code, isCollapsed, isMounted, theme]); // Re-run on theme change to re-apply Prism styles if needed

  // Load theme-specific CSS
  useEffect(() => {
    if (!isMounted) return;
    const existingLinks = document.querySelectorAll('link[data-prism-theme]');
    existingLinks.forEach(link => link.remove());

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/prism-themes/prism-${theme || 'light'}.css`;
    link.setAttribute('data-prism-theme', 'true');
    document.head.appendChild(link);

    return () => {
      link.remove();
    };
  }, [theme, isMounted]);

  // Copy to clipboard function
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Add line numbers and highlighting
  const processedCode = code.split('\n').map((line, index) => {
    const lineNumber = index + 1;
    const isHighlighted = highlightLines.includes(lineNumber);
    return {
      content: line,
      lineNumber,
      isHighlighted
    };
  });

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        {title && <div className="code-block-title">{title}</div>}
        <div className="code-block-actions">
          {collapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="code-action-btn collapse-btn"
              aria-label={isCollapsed ? 'Expand code' : 'Collapse code'}
            >
              {isCollapsed ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 10L8 6L12 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          )}
          <button
            onClick={handleCopy}
            className="code-action-btn copy-btn"
            aria-label="Copy code"
          >
            {copied ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="5" y="5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M3 10V3C3 2.44772 3.44772 2 4 2H10" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            )}
            <span className="copy-btn-text">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>
      
      {!isCollapsed && (
        <div className="code-content">
          <pre ref={preRef} className={`language-${language}`}>
            <code ref={codeRef} className={`language-${language}`}>
              {isMounted && processedCode.map((line, idx) => (
                <div
                  key={idx}
                  className={`code-line ${line.isHighlighted ? 'highlighted-line' : ''}`}
                  data-line={line.lineNumber}
                >
                  <span className="line-number">{line.lineNumber}</span>
                  <span className="line-content">{line.content || ' '}</span>
                </div>
              ))}
            </code>
          </pre>
        </div>
      )}
      
      {isCollapsed && (
        <div className="code-collapsed-message">
          Code hidden - click to expand
        </div>
      )}
    </div>
  );
}
