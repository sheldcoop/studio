
'use client';

import { useReactFlow } from 'reactflow';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';

export function DownloadButton() {
  const { getNodes } = useReactFlow();
  const onClick = () => {
    const nodes = getNodes();
    if (nodes.length === 0) {
      return;
    }
    
    // We need to calculate the bounds of the rendered nodes.
    const nodesBounds = nodes.reduce(
      (bounds, node) => {
        return {
          x: Math.min(bounds.x, node.position.x),
          y: Math.min(bounds.y, node.position.y),
          width: Math.max(bounds.width, node.position.x + (node.width || 0)),
          height: Math.max(bounds.height, node.position.y + (node.height || 0)),
        };
      },
      { x: Infinity, y: Infinity, width: -Infinity, height: -Infinity }
    );
    
    const width = nodesBounds.width - nodesBounds.x + (nodes[0].width || 0);
    const height = nodesBounds.height - nodesBounds.y + (nodes[0].height || 0);

    import('html-to-image').then(({ toPng }) => {
      const viewport = document.querySelector('.react-flow__viewport') as HTMLElement;
      if (viewport) {
        toPng(viewport, {
          backgroundColor: 'hsl(222.2 84% 4.9%)', // Corresponds to Tailwind's `bg-background`
          width: width,
          height: height,
          style: {
            width: `${width}px`,
            height: `${height}px`,
            transform: `translate(${ -nodesBounds.x + (nodes[0].width || 0) / 2}px, ${-nodesBounds.y + 20}px)`,
          }
        })
          .then((dataUrl) => {
            const a = document.createElement("a");
            a.setAttribute("download", "statistical-test-map.png");
            a.setAttribute("href", dataUrl);
            a.click();
          });
      }
    });
  };

  return (
      <Button onClick={onClick}>
        <Download className="mr-2 h-4 w-4" />
        Download as PNG
      </Button>
  );
}
