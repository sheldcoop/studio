
// src/pyscript.d.ts

declare namespace JSX {
  interface IntrinsicElements {
    'py-config': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'py-script': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'py-repl': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}
