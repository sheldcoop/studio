
'use client';

import { useState, useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/themes/prism-tomorrow.css'; // A nice default dark theme
import { Button } from './ui/button';
import { Check, Clipboard, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
  highlightLines?: number[];
  isCollapsible?: boolean;
  defaultCollapsed?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  title,
  highlightLines = [],
  isCollapsible = false,
  defaultCollapsed = false,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isCollapsible && defaultCollapsed);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language, isCollapsed]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const highlightedCode = Prism.highlight(
    code,
    Prism.languages[language] || Prism.languages.markup,
    language
  );

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        {title && <div className="code-block-title">{title}</div>}
        <div className="code-block-actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="code-action-btn"
          >
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Clipboard className="h-4 w-4" />
            )}
            <span className="copy-btn-text">{isCopied ? 'Copied!' : 'Copy'}</span>
          </Button>
          {isCollapsible && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="collapse-btn"
            >
              {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>
      <div className={cn("code-content", isCollapsed && "hidden")}>
        <pre className={`language-${language}`}>
          <code ref={codeRef} className={`language-${language}`}>
            {code}
          </code>
        </pre>
      </div>
       {isCollapsible && isCollapsed && (
        <div className="code-collapsed-message">
            Code is collapsed. Click to expand.
        </div>
      )}
    </div>
  );
};

export default CodeBlock;
