
'use client';

import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

interface ProbabilityAnimationProps {
  className?: string;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export function ProbabilityAnimation({
  className,
  onPointerEnter,
  onPointerLeave,
}: ProbabilityAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isMouseOver = useRef(false);

  // Memoize materials for performance
  const nodeMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: 0x22c55e, side: THREE.DoubleSide }), []);
  const edgeMaterial = useMemo(() => new THREE.LineBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.5 }), []);
  const highlightedEdgeMaterial = useMemo(() => new THREE.LineBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.9, linewidth: 2 }), []);
  const highlightedNodeMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: 0x818cf8, side: THREE.DoubleSide }), []);

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;
    let frameId: number;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // --- Graph Generation ---
    const levels = 4;
    const nodesPerLevel = [1, 2, 4, 8];
    const levelDistance = 5;
    const graph: { nodes: THREE.Mesh[], edges: THREE.Line[] } = { nodes: [], edges: [] };
    let nodeIndex = 0;
    
    let parentNodes: THREE.Mesh[] = [];

    for (let i = 0; i < levels; i++) {
        const currentLevelNodes: THREE.Mesh[] = [];
        const y = 6 - i * levelDistance;
        const count = nodesPerLevel[i];
        
        for (let j = 0; j < count; j++) {
            const x = (j - (count - 1) / 2) * (18 / count);
            const nodeGeometry = new THREE.CircleGeometry(0.5, 32);
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial.clone());
            node.position.set(x, y, 0);
            (node.material as THREE.Material).transparent = true;
            (node.material as THREE.Material).opacity = 0;
            group.add(node);
            graph.nodes.push(node);
            currentLevelNodes.push(node);

            // Create edges to parents
            if (i > 0) {
                const parent = parentNodes[Math.floor(j / 2)];
                const points = [parent.position, node.position];
                const edgeGeometry = new THREE.BufferGeometry().setFromPoints(points);
                const edge = new THREE.Line(edgeGeometry, edgeMaterial.clone());
                (edge.material as THREE.Material).opacity = 0;
                group.add(edge);
                graph.edges.push(edge);
            }
        }
        parentNodes = currentLevelNodes;
    }
    
    // --- Highlight Path ---
    let highlightedPath: (THREE.Mesh | THREE.Line)[] = [];
    const selectNewHighlightedPath = () => {
        // Clear previous path
        highlightedPath.forEach(obj => {
            obj.material = obj instanceof THREE.Mesh ? nodeMaterial : edgeMaterial;
        });
        highlightedPath = [];

        let pathIndex = 0;
        let parentNodeIndex = 0;
        
        const rootNode = graph.nodes[0];
        highlightedPath.push(rootNode);

        for (let level = 0; level < levels - 1; level++) {
            const choice = Math.random() < 0.5 ? 0 : 1;
            const childNodeIndex = parentNodeIndex * 2 + 1 + choice;
            
            // find edge connecting parentNodeIndex and childNodeIndex
            const edge = graph.edges.find(e => {
                const positions = e.geometry.attributes.position;
                const startNode = graph.nodes.find(n => n.position.equals(new THREE.Vector3(positions.getX(0), positions.getY(0), positions.getZ(0))));
                const endNode = graph.nodes.find(n => n.position.equals(new THREE.Vector3(positions.getX(1), positions.getY(1), positions.getZ(1))));
                return (graph.nodes.indexOf(startNode!) === parentNodeIndex && graph.nodes.indexOf(endNode!) === childNodeIndex);
            });
            
            if (edge) highlightedPath.push(edge);
            highlightedPath.push(graph.nodes[childNodeIndex]);

            parentNodeIndex = childNodeIndex;
        }
        
        highlightedPath.forEach(obj => {
            obj.material = obj instanceof THREE.Mesh ? highlightedNodeMaterial : highlightedEdgeMaterial;
        });
    }

    const clock = new THREE.Clock();
    let lastHighlightTime = 0;
    
    const animate = () => {
        frameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Animate opacity based on level
        graph.nodes.forEach(node => {
            const level = Math.floor((6.5 - node.position.y) / levelDistance);
            const revealTime = level * 0.5;
            const targetOpacity = elapsedTime > revealTime ? 1 : 0;
            node.material.opacity += (targetOpacity - node.material.opacity) * 0.1;
        });
         graph.edges.forEach(edge => {
            const endNodeY = edge.geometry.attributes.position.getY(1);
            const level = Math.floor((6.5 - endNodeY) / levelDistance);
            const revealTime = level * 0.5;
            const targetOpacity = elapsedTime > revealTime ? 0.5 : 0;
             // Don't fade out highlighted edges
            if (highlightedPath.includes(edge)) {
                edge.material.opacity = 0.9;
            } else {
                edge.material.opacity += (targetOpacity - edge.material.opacity) * 0.1;
            }
        });

        // Handle hover state
        if (isMouseOver.current) {
            if (elapsedTime - lastHighlightTime > 1.5) { // every 1.5 seconds
                selectNewHighlightedPath();
                lastHighlightTime = elapsedTime;
            }
        } else {
             // Fade out highlighted path when not hovering
            if (highlightedPath.length > 0) {
                 highlightedPath.forEach(obj => {
                    obj.material = obj instanceof THREE.Mesh ? nodeMaterial : edgeMaterial;
                });
                highlightedPath = [];
            }
        }
        
        group.rotation.y = elapsedTime * 0.05;
        renderer.render(scene, camera);
    };

    animate();

    const handleMouseEnter = () => { isMouseOver.current = true; onPointerEnter(); };
    const handleMouseLeave = () => { isMouseOver.current = false; onPointerLeave(); };
    currentMount.addEventListener('mouseenter', handleMouseEnter);
    currentMount.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      if (currentMount) {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (currentMount) {
        currentMount.removeEventListener('mouseenter', handleMouseEnter);
        currentMount.removeEventListener('mouseleave', handleMouseLeave);
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      graph.nodes.forEach(node => node.geometry.dispose());
      graph.edges.forEach(edge => edge.geometry.dispose());
      nodeMaterial.dispose();
      edgeMaterial.dispose();
      highlightedNodeMaterial.dispose();
      highlightedEdgeMaterial.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}
