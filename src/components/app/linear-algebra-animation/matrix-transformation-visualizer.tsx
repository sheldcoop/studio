
'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { drawAxes, drawGrid } from '@/components/three/coordinate-system';
import { drawArrow, drawShading } from '@/components/three/primitives';
import { drawTransformedGrid } from '@/components/three/transformation';
import { makeObjectsDraggable, mouseToWorld } from '@/components/three/interactivity';
import { Card, CardContent } from '@/components/ui/card';
import { BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// Type definition for the 2D matrix
type Matrix2D = { a: number; b: number; c: number; d: number };

export function MatrixTransformationVisualizer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [matrix, setMatrix] = useState<Matrix2D>({ a: 1, b: 0, c: 0, d: 1 });
  const [determinant, setDeterminant] = useState(1);

  useEffect(() => {
    if (!mountRef.current) return;
    const currentMount = mountRef.current;

    // --- Basic Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableRotate = false; // We are in 2D
    controls.enablePan = true;
    controls.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
    controls.touches = { ONE: THREE.TOUCH.PAN, TWO: THREE.TOUCH.DOLLY_PAN };

    // --- Coordinate System ---
    drawAxes(scene, { size: 5 });
    const standardGrid = drawGrid(scene, { b1: new THREE.Vector3(1,0,0), b2: new THREE.Vector3(0,1,0), gridColor: 0x444444 });

    // --- Interactive and Visual Elements ---
    let transformedGridGroup = new THREE.Group();
    let shadingMesh: THREE.Mesh;
    
    // Draggable points for basis vectors
    const iHatTip = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshBasicMaterial({ color: 0xff4444 }));
    const jHatTip = new THREE.Mesh(new THREE.SphereGeometry(0.2), new THREE.MeshBasicMaterial({ color: 0x44ff44 }));
    iHatTip.position.set(1, 0, 0);
    jHatTip.position.set(0, 1, 0);
    scene.add(iHatTip);
    scene.add(jHatTip);

    let iHat_t = new THREE.Vector3(1, 0, 0); // Transformed i-hat
    let jHat_t = new THREE.Vector3(0, 1, 0); // Transformed j-hat
    
    let iHatArrow: THREE.Group, jHatArrow: THREE.Group;


    function updateVisualization() {
      // Remove old objects
      if (transformedGridGroup) scene.remove(transformedGridGroup);
      if (shadingMesh) scene.remove(shadingMesh);
      if (iHatArrow) scene.remove(iHatArrow);
      if (jHatArrow) scene.remove(jHatArrow);

      // Update matrix state
      const newMatrix = { a: iHat_t.x, b: jHat_t.x, c: iHat_t.y, d: jHat_t.y };
      setMatrix(newMatrix);
      setDeterminant(newMatrix.a * newMatrix.d - newMatrix.b * newMatrix.c);
      
      // Draw transformed grid
      transformedGridGroup = drawTransformedGrid(scene, { matrix: newMatrix, transformedColor: 0x4444ff, size: 5 });
      
      // Draw transformed basis vectors
      iHatArrow = drawArrow(scene, { origin: new THREE.Vector3(0,0,0), destination: iHat_t, color: 0xff4444, label: 'i-hat_t' });
      jHatArrow = drawArrow(scene, { origin: new THREE.Vector3(0,0,0), destination: jHat_t, color: 0x44ff44, label: 'j-hat_t' });

      // Draw determinant area
      const points = [
        new THREE.Vector2(0,0),
        new THREE.Vector2(iHat_t.x, iHat_t.y),
        new THREE.Vector2(iHat_t.x + jHat_t.x, iHat_t.y + jHat_t.y),
        new THREE.Vector2(jHat_t.x, jHat_t.y),
      ];
      shadingMesh = drawShading(scene, { points, color: 0x4444ff });
    }
    
    // Make tips draggable
    const interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const cleanupDraggable = makeObjectsDraggable([iHatTip, jHatTip], camera, renderer.domElement, {
        plane: interactionPlane,
        onDrag: (object, position) => {
            if (object === iHatTip) {
                iHat_t.copy(position);
                iHatTip.position.copy(position);
            } else if (object === jHatTip) {
                jHat_t.copy(position);
                jHatTip.position.copy(position);
            }
            updateVisualization();
        },
        onDragStart: () => controls.enabled = false,
        onDragEnd: () => controls.enabled = true,
    });
    
    // Initial draw
    drawArrow(scene, { origin: new THREE.Vector3(), destination: new THREE.Vector3(1,0,0), color: 0xdd2222, label: 'i-hat' });
    drawArrow(scene, { origin: new THREE.Vector3(), destination: new THREE.Vector3(0,1,0), color: 0x22dd22, label: 'j-hat' });
    updateVisualization();

    // --- Animation Loop ---
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // --- Cleanup ---
    return () => {
      cleanupDraggable();
      currentMount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
        <div ref={mountRef} className="w-full h-full" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <Card className="bg-background/80 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                    <BlockMath math={`M = \\begin{bmatrix} ${matrix.a.toFixed(2)} & ${matrix.b.toFixed(2)} \\\\ ${matrix.c.toFixed(2)} & ${matrix.d.toFixed(2)} \\end{bmatrix}`} />
                    <p className="text-sm mt-2 font-mono">det(M) = {determinant.toFixed(3)}</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

