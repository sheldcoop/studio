
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

interface MachineLearningAnimationProps {
  className?: string;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export function MachineLearningAnimation({
  className,
  onPointerEnter,
  onPointerLeave,
}: MachineLearningAnimationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const isMouseOver = useRef(false);
  const pulse = useRef<{
    position: THREE.Vector3;
    startTime: number;
    fromNode: THREE.Vector3;
    toNode: THREE.Vector3;
    layer: number;
  } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;

    // --- Scene setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    const networkGroup = new THREE.Group();
    scene.add(networkGroup);

    // --- Neural Network objects ---
    const primaryColor = 0x58a6ff; 
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: primaryColor, transparent: true, opacity: 0.3 });
    const connectionMaterial = new THREE.LineBasicMaterial({ color: primaryColor, transparent: true, opacity: 0.1 });
    const pulseMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });


    const layers = [4, 5, 5, 3];
    const layerSpacing = 5;
    const nodePositions: THREE.Vector3[][] = [];

    layers.forEach((nodeCount, i) => {
        const layerPositions: THREE.Vector3[] = [];
        const x = (i - (layers.length - 1) / 2) * layerSpacing;
        for (let j = 0; j < nodeCount; j++) {
            const y = (j - (nodeCount - 1) / 2) * 2;
            const nodeGeometry = new THREE.SphereGeometry(0.3, 16, 16);
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            node.position.set(x, y, 0);
            networkGroup.add(node);
            layerPositions.push(node.position);
        }
        nodePositions.push(layerPositions);
    });

    for (let i = 0; i < nodePositions.length - 1; i++) {
        for (const fromNode of nodePositions[i]) {
            for (const toNode of nodePositions[i + 1]) {
                const geometry = new THREE.BufferGeometry().setFromPoints([fromNode, toNode]);
                const line = new THREE.Line(geometry, connectionMaterial);
                networkGroup.add(line);
            }
        }
    }
    
    const pulseMesh = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), pulseMaterial);
    pulseMesh.visible = false;
    scene.add(pulseMesh);

    // --- Animation & Interaction ---
    const clock = new THREE.Clock();

    const triggerPulse = () => {
        const fromLayer = 0;
        const inputNodeIndex = Math.floor(Math.abs(mouse.current.y * 2) % nodePositions[fromLayer].length);
        
        pulse.current = {
            position: nodePositions[fromLayer][inputNodeIndex].clone(),
            startTime: clock.getElapsedTime(),
            fromNode: nodePositions[fromLayer][inputNodeIndex],
            toNode: nodePositions[fromLayer+1][Math.floor(Math.random() * nodePositions[fromLayer+1].length)],
            layer: 0,
        };
        pulseMesh.position.copy(pulse.current.position);
        pulseMesh.visible = true;
    }

    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      networkGroup.rotation.y = elapsedTime * 0.05 + mouse.current.x * 0.1;
      networkGroup.rotation.x = elapsedTime * 0.03 + mouse.current.y * 0.1;
      
      if (pulse.current) {
          const pulseDuration = 0.5;
          const progress = (elapsedTime - pulse.current.startTime) / pulseDuration;

          if (progress < 1) {
              pulseMesh.position.lerpVectors(pulse.current.fromNode, pulse.current.toNode, progress);
          } else {
              const currentLayer = pulse.current.layer + 1;
              if (currentLayer < nodePositions.length - 1) {
                  const fromNode = pulse.current.toNode;
                  const toNode = nodePositions[currentLayer + 1][Math.floor(Math.random() * nodePositions[currentLayer + 1].length)];
                  pulse.current = {
                      position: fromNode.clone(),
                      startTime: clock.getElapsedTime(),
                      fromNode,
                      toNode,
                      layer: currentLayer
                  };
              } else {
                  pulse.current = null;
                  pulseMesh.visible = false;
              }
          }
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- Event Listeners ---
    const handleMouseMove = (event: MouseEvent) => {
        if (currentMount) {
            const rect = currentMount.getBoundingClientRect();
            mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.current.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
        }
    };
    
    const handleMouseEnter = () => { 
        isMouseOver.current = true;
        onPointerEnter();
        if (!pulse.current) {
           triggerPulse();
           setInterval(() => {
             if(isMouseOver.current && !pulse.current) triggerPulse();
           }, 1000);
        }
    }
    const handleMouseLeave = () => { isMouseOver.current = false; onPointerLeave(); }

    currentMount.addEventListener('mousemove', handleMouseMove);
    currentMount.addEventListener('mouseenter', handleMouseEnter);
    currentMount.addEventListener('mouseleave', handleMouseLeave);

    // --- Resize handler ---
    const handleResize = () => {
        if (currentMount) {
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
        }
    };
    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentMount) {
        currentMount.removeEventListener('mousemove', handleMouseMove);
        currentMount.removeEventListener('mouseenter', handleMouseEnter);
        currentMount.removeEventListener('mouseleave', handleMouseLeave);
        currentMount.removeChild(renderer.domElement);
      }
      scene.traverse(object => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
            object.geometry.dispose();
            if(Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
        }
      });
      renderer.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className={cn('h-full w-full', className)} />;
}

    