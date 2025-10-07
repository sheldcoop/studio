// src/pyscript.d.ts

declare namespace JSX {
  interface IntrinsicElements {
    'py-config': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'py-script': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'mpy-script': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'py-repl': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    
    // Allow script tag with custom attributes like 'type="py"'
    script: React.DetailedHTMLProps<React.ScriptHTMLAttributes<HTMLScriptElement>, HTMLScriptElement> & {
      type?: 'py' | 'mpy' | 'module' | 'text/javascript';
      config?: string;
      output?: string;
      worker?: boolean;
      terminal?: boolean;
      'service-worker'?: string;
    };
  }
}
